require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { GridFSBucket } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Article = require('./src/models/Article');
const Media = require('./src/models/Media');
const Section = require('./src/models/Section');

const MONGO_URI = process.env.MONGO_URI;

const PROTEST_IMAGE_PATH = "C:\\Users\\HP\\.gemini\\antigravity\\brain\\d7a78c54-0ed0-42ed-a782-307b9acef05b\\jantar_mantar_protest_1784626153814.png";
const MEMO_IMAGE_PATH = "C:\\Users\\HP\\.gemini\\antigravity\\brain\\d7a78c54-0ed0-42ed-a782-307b9acef05b\\jantar_mantar_memo_1784626168673.png";
const VS_REALITY_IMAGE_PATH = "C:\\Users\\HP\\.gemini\\antigravity\\brain\\d7a78c54-0ed0-42ed-a782-307b9acef05b\\media_vs_reality_1784626181991.png";

async function uploadFileToGridFS(bucket, filePath, originalName, mimetype) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const uniqueName = `${uuidv4()}-${originalName}`;
    const uploadStream = bucket.openUploadStream(uniqueName, {
      contentType: mimetype,
      metadata: { originalName },
    });
    
    uploadStream.on('finish', () => resolve({ id: uploadStream.id, size: fileBuffer.length }));
    uploadStream.on('error', reject);
    
    uploadStream.end(fileBuffer);
  });
}

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'mediafiles' });

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('Admin user not found. Run seed script first.');
    }

    console.log('Uploading Jantar Mantar Protest Image...');
    const protestUpload = await uploadFileToGridFS(bucket, PROTEST_IMAGE_PATH, 'jantar_mantar_protest.png', 'image/png');
    const protestUrl = `http://localhost:5000/api/media/file/${protestUpload.id}`;
    const mediaProtest = await Media.create({
      name: 'Jantar Mantar Protest Cover',
      originalName: 'jantar_mantar_protest.png',
      gridfsId: protestUpload.id,
      url: protestUrl,
      resourceType: 'image',
      mimetype: 'image/png',
      format: 'png',
      size: protestUpload.size,
      folder: 'general',
      alt: 'Protest at Jantar Mantar',
      uploadedBy: admin._id
    });
    console.log('Protest image uploaded! URL:', protestUrl);

    console.log('Uploading Memo Image...');
    const memoUpload = await uploadFileToGridFS(bucket, MEMO_IMAGE_PATH, 'jantar_mantar_memo.png', 'image/png');
    const memoUrl = `http://localhost:5000/api/media/file/${memoUpload.id}`;
    await Media.create({
      name: 'Leaked Police Memo Jantar Mantar',
      originalName: 'jantar_mantar_memo.png',
      gridfsId: memoUpload.id,
      url: memoUrl,
      resourceType: 'image',
      mimetype: 'image/png',
      format: 'png',
      size: memoUpload.size,
      folder: 'general',
      alt: 'Classified Delhi Police Memo',
      uploadedBy: admin._id
    });
    console.log('Memo image uploaded! URL:', memoUrl);

    console.log('Uploading Media vs Reality Image...');
    const vsRealityUpload = await uploadFileToGridFS(bucket, VS_REALITY_IMAGE_PATH, 'media_vs_reality.png', 'image/png');
    const vsRealityUrl = `http://localhost:5000/api/media/file/${vsRealityUpload.id}`;
    await Media.create({
      name: 'Media anchors vs Jantar Mantar Reality',
      originalName: 'media_vs_reality.png',
      gridfsId: vsRealityUpload.id,
      url: vsRealityUrl,
      resourceType: 'image',
      mimetype: 'image/png',
      format: 'png',
      size: vsRealityUpload.size,
      folder: 'general',
      alt: 'Media Anchors vs Ground Truth',
      uploadedBy: admin._id
    });
    console.log('Media vs Reality image uploaded! URL:', vsRealityUrl);

    // Find or create 'Expose' Category
    let category = await Category.findOne({ slug: 'expose' });
    if (!category) {
      category = await Category.findOne({});
    }

    // 1. Create Jantar Mantar article
    console.log('Creating Article...');
    const article = await Article.create({
      title: 'Jantar Mantar Protest: Peaceful Protesters Par Police Action Aur Media Censorship Ka Poora Sach',
      slug: 'jantar-mantar-protest-police-action-censorship-truth',
      excerpt: '20 July 2026 ko Jantar Mantar par berozgari ke khilaf peaceful student protest par police ne excessive water cannons aur force use kiya. Mainstream media ne ise violent dikhaya, par sachai kuch aur hai.',
      author: admin._id,
      category: category._id,
      status: 'published',
      featured: true,
      trending: true,
      views: 2450,
      publishedAt: new Date('2026-07-21'),
      coverImage: {
        url: protestUrl,
        publicId: protestUpload.id.toString(),
        alt: 'Jantar Mantar Protest cover'
      },
      seo: {
        metaTitle: 'Jantar Mantar Protest Police Action Real Truth | SatyaDarpan',
        metaDescription: 'Peaceful student protest par police action aur water cannons ka real Sach. Mobile blackout database leaked.',
        keywords: ['jantar mantar', 'protest', 'unemployment', 'police action', 'media censorship']
      },
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📌 20 July 2026: Jantar Mantar Par Kya Hua Tha?' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: '20 July 2026 ko New Delhi ke Jantar Mantar par country ke different parts se aaye thousands of youth aur student protesters ne rising unemployment aur administrative exam leaks ke khilaf protest kiya. Assembly bilkul peaceful thi, lekin afternoon mein police ne unexpected charge kiya.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🚨 Media Narrative Vs Ground Reality' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Mainstream news channels ne report kiya ki protestors violent ho gaye the aur unhone police barricades ko toda. Lekin, mobile reports aur eye-witness videos confirm karte hain ki water cannons aur force tab chalaye gaye jab student delegates peace talks ki demand kar rahe the.' }
            ]
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '"Hum sirf employment demands ka memorandum sarkari representatives ko dena chahte the. Par police ne bina warning water cannons chalaye." — Vishal Kumar, Student Representative' }]
              }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📡 Leaked Documents: Signal Jammers & Mobile Network Blackout' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Satyadarpan ke paas internal documents hain jo dikhate hain ki Delhi Police Special Branch ne Jantar Mantar par protest ke raw transmissions ko stop karne ke liye mobile jammer units deployment order 12 hours pehle hi de diya tha.' }
            ]
          }
        ]
      },
      references: [
        { title: 'Delhi Police Internal Order - SPB-2026-902', url: memoUrl, type: 'government' },
        { title: 'Network Blockout Reports - Uptime Delhi', url: 'https://uptimereport.in', type: 'research' }
      ]
    });
    console.log('Article created successfully! Slug:', article.slug);

    // 2. Prepend to vault_documents section
    console.log('Updating Vault Documents section...');
    let vaultSection = await Section.findOne({ key: 'vault_documents' });
    if (!vaultSection) {
      vaultSection = await Section.create({
        key: 'vault_documents',
        title: 'Leaked Evidence Vault Files',
        data: []
      });
    }

    const newVaultDoc = {
      id: 'DOC-2026-001',
      title: 'Jantar Mantar Mobile Jammer & Crowd Suppression Internal Police Directives',
      category: 'नागरिक अधिकार हनन',
      date: 'July 20, 2026',
      size: '2.4 MB',
      status: 'TOP SECRET',
      content: `[DELHI POLICE SPECIAL BRANCH - INTERNAL DISPATCH]
DATE: 20 JULY 2026
SUBJECT: MOBILIZATION AND AREA BLOCKOUT AT JANTAR MANTAR

ORDER DETAILS:
1. Deploy 3 units of Vehicle-Mounted Mobile Signal Jammers (Range: 500m) around Jantar Mantar protest site starting 12:00 Hrs.
2. Cut off raw digital broadcasts and cellular uplinks to restrict real-time video uploads by protestors to social media.
3. Pre-deploy water cannon units at barricade line C. Force deployment authorized immediately upon assembly exceeding 500 pax, without waiting for SDM verbal instruction in case of "security escalation."
4. Identify and execute preemptive detention of key coordinates from student unions at transit points.`
    };

    vaultSection.data = [newVaultDoc, ...vaultSection.data];
    vaultSection.markModified('data');
    await vaultSection.save();
    console.log('Vault Documents section updated!');

    // 3. Prepend to homepage_comparisons section
    console.log('Updating Homepage Comparisons section...');
    let compSection = await Section.findOne({ key: 'homepage_comparisons' });
    if (!compSection) {
      compSection = await Section.create({
        key: 'homepage_comparisons',
        title: 'Mainstream Narrative vs. Ground Reality',
        data: []
      });
    }

    const newComparison = {
      topic: 'Jantar Mantar Protest (July 20)',
      officialNarrative: 'Illegal assembly by unguided student unions attempting to march towards Parliament. Mild force and water cannons used strictly to maintain public security and prevent traffic congestion.',
      investigativeFinding: 'Peaceful student and youth protest on unemployment. Leaked police memos reveal signal jammers were pre-planned 12 hours prior to cut communications, and water cannons were fired without warning or provocation.',
      evidence: 'Delhi Police Internal Order No. SPB-2026-902, local cellular traffic log dropouts, raw stream recordings.'
    };

    compSection.data = [newComparison, ...compSection.data];
    compSection.markModified('data');
    await compSection.save();
    console.log('Homepage Comparisons section updated!');

    console.log('Database successfully populated with Jantar Mantar protest documentary everywhere!');
    process.exit(0);
  } catch (error) {
    console.error('Error running update script:', error);
    process.exit(1);
  }
}

run();
