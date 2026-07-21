require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/database');
const routes = require('./routes');
const { globalErrorHandler, AppError } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Security headers but allow cross-origin images
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' })); // Body parser
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logging
}

// Health Check Endpoints for Deployments
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Apply rate limiting to all /api routes
app.use('/api', generalLimiter);

// Mount Routes
app.use('/api', routes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Trigger nodemon reload
