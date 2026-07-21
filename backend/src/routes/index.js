const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const articleRoutes = require('./articleRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const mediaRoutes = require('./mediaRoutes');
const commentRoutes = require('./commentRoutes');
const userRoutes = require('./userRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const searchRoutes = require('./searchRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const seoRoutes = require('./seoRoutes');

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/media', mediaRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/search', searchRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/seo', seoRoutes);
router.use('/sections', require('./sectionRoutes'));

module.exports = router;
