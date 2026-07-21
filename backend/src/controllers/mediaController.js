const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const { GridFSBucket } = require('mongodb');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Media = require('../models/Media');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Use memory storage — we stream to GridFS manually
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
      'application/pdf',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type ${file.mimetype} is not allowed`, 400), false);
    }
  },
});

// Helper: Get GridFS bucket from mongoose connection
const getBucket = () => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName: 'mediafiles' });
};

// Helper: Determine resource type from mimetype
const getResourceType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw';
};

// Helper: Upload buffer to GridFS and return the file ID
const uploadToGridFS = (buffer, filename, mimetype) => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const uniqueName = `${uuidv4()}-${filename}`;
    const uploadStream = bucket.openUploadStream(uniqueName, {
      contentType: mimetype,
      metadata: { originalName: filename },
    });

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);

    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
};

// POST /api/media/upload — Single file
exports.uploadMedia = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file provided', 400));

  const gridfsId = await uploadToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
  const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/media/file/${gridfsId}`;

  const media = await Media.create({
    name: req.body.name || req.file.originalname,
    originalName: req.file.originalname,
    gridfsId,
    url: fileUrl,
    resourceType: getResourceType(req.file.mimetype),
    mimetype: req.file.mimetype,
    format: path.extname(req.file.originalname).replace('.', ''),
    size: req.file.size,
    folder: req.body.folder || 'general',
    alt: req.body.alt || '',
    caption: req.body.caption || '',
    uploadedBy: req.user?._id,
  });

  res.status(201).json({ success: true, data: media });
});

// POST /api/media/bulk-upload — Multiple files
exports.bulkUpload = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next(new AppError('No files provided', 400));

  const folder = req.body.folder || 'general';
  const results = [];

  for (const file of req.files) {
    const gridfsId = await uploadToGridFS(file.buffer, file.originalname, file.mimetype);
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/media/file/${gridfsId}`;

    const media = await Media.create({
      name: file.originalname,
      originalName: file.originalname,
      gridfsId,
      url: fileUrl,
      resourceType: getResourceType(file.mimetype),
      mimetype: file.mimetype,
      format: path.extname(file.originalname).replace('.', ''),
      size: file.size,
      folder,
      uploadedBy: req.user?._id,
    });
    results.push(media);
  }

  res.status(201).json({ success: true, data: results, count: results.length });
});

// GET /api/media/file/:id — Stream file from GridFS
exports.serveFile = asyncHandler(async (req, res, next) => {
  const fileId = new mongoose.Types.ObjectId(req.params.id);
  const bucket = getBucket();

  // Find file metadata
  const files = await bucket.find({ _id: fileId }).toArray();
  if (!files || files.length === 0) return next(new AppError('File not found', 404));

  const file = files[0];

  // Set content headers
  res.set('Content-Type', file.contentType || 'application/octet-stream');
  res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  res.set('Content-Length', file.length);

  // Stream file to response
  const downloadStream = bucket.openDownloadStream(fileId);
  downloadStream.on('error', () => next(new AppError('Error streaming file', 500)));
  downloadStream.pipe(res);
});

// GET /api/media — List all media
exports.getAllMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 24, folder, resourceType, search, sort = '-createdAt' } = req.query;
  const filter = {};
  if (folder) filter.folder = folder;
  if (resourceType) filter.resourceType = resourceType;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [media, total] = await Promise.all([
    Media.find(filter).populate('uploadedBy', 'name').sort(sort).skip(skip).limit(Number(limit)).lean(),
    Media.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: media,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  });
});

// GET /api/media/folders — List distinct folders
exports.getFolders = asyncHandler(async (req, res) => {
  const folders = await Media.distinct('folder');
  res.status(200).json({ success: true, data: folders });
});

// DELETE /api/media/:id — Delete from GridFS + Media collection
exports.deleteMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id);
  if (!media) return next(new AppError('Media not found', 404));

  try {
    const bucket = getBucket();
    await bucket.delete(new mongoose.Types.ObjectId(media.gridfsId));
  } catch (err) {
    console.warn('GridFS delete warning:', err.message);
  }

  await media.deleteOne();
  res.status(204).json({ success: true, data: null });
});

// POST /api/media/bulk-delete
exports.bulkDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const items = await Media.find({ _id: { $in: ids } });
  const bucket = getBucket();

  await Promise.all(
    items.map(async (item) => {
      try {
        await bucket.delete(new mongoose.Types.ObjectId(item.gridfsId));
      } catch (err) {
        console.warn('GridFS bulk delete warning:', err.message);
      }
    })
  );
  await Media.deleteMany({ _id: { $in: ids } });

  res.status(200).json({ success: true, message: `${items.length} items deleted` });
});

// PATCH /api/media/:id — Update metadata
exports.updateMediaMeta = asyncHandler(async (req, res, next) => {
  const allowed = ['name', 'alt', 'caption', 'tags', 'folder'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const media = await Media.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!media) return next(new AppError('Media not found', 404));
  res.status(200).json({ success: true, data: media });
});

// Multer middleware exports
exports.uploadMiddleware = upload.single('file');
exports.bulkUploadMiddleware = upload.array('files', 20);
