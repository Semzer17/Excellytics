const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload and parse Excel file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read and parse the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    const firstSheet = workbook.Sheets[sheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });

    // Extract headers and data
    const headers = jsonData[0] || [];
    const dataRows = jsonData.slice(1);
    
    // Process data for storage
    const processedData = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });

    // Create file record in database
    const fileRecord = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      userId: req.user._id,
      headers,
      rowCount: dataRows.length,
      data: processedData,
      metadata: {
        sheets: sheetNames,
        activeSheet: sheetNames[0],
        columns: headers.length,
        dataTypes: analyzeDataTypes(processedData, headers)
      },
      isProcessed: true
    });

    await fileRecord.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        uploadCount: 1,
        storageUsed: req.file.size
      }
    });

    res.status(201).json({
      message: 'File uploaded and processed successfully',
      file: {
        id: fileRecord._id,
        filename: fileRecord.originalName,
        headers: fileRecord.headers,
        rowCount: fileRecord.rowCount,
        metadata: fileRecord.metadata,
        createdAt: fileRecord.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if processing failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Error processing file' });
  }
});

// Get all files for user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const files = await File.find({ userId: req.user._id })
      .select('-data') // Exclude large data field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await File.countDocuments({ userId: req.user._id });

    res.json({
      files,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

// Get specific file data
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// Create analysis/chart
router.post('/:id/analysis', auth, async (req, res) => {
  try {
    const { chartType, xAxis, yAxis, title, config } = req.body;
    
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Generate chart data based on selected axes
    const chartData = generateChartData(file.data, xAxis, yAxis, chartType);

    const analysis = {
      chartType,
      xAxis,
      yAxis,
      title: title || `${chartType} chart`,
      config: config || {},
      chartData
    };

    file.analyses.push(analysis);
    await file.save();

    res.status(201).json({
      message: 'Analysis created successfully',
      analysis: file.analyses[file.analyses.length - 1]
    });

  } catch (error) {
    console.error('Create analysis error:', error);
    res.status(500).json({ message: 'Error creating analysis' });
  }
});

// Get analyses for a file
router.get('/:id/analyses', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('analyses');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ analyses: file.analyses });
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ message: 'Error retrieving analyses' });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Update user storage stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        storageUsed: -file.size,
        uploadCount: -1
      }
    });

    // Delete database record
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Helper function to analyze data types
function analyzeDataTypes(data, headers) {
  const types = {};
  
  headers.forEach(header => {
    const values = data.map(row => row[header]).filter(val => val !== null && val !== undefined);
    
    if (values.length === 0) {
      types[header] = 'string';
      return;
    }

    // Check if all values are numbers
    const numericValues = values.filter(val => !isNaN(val) && val !== '');
    if (numericValues.length === values.length) {
      types[header] = 'number';
    } else {
      types[header] = 'string';
    }
  });

  return types;
}

// Helper function to generate chart data
function generateChartData(data, xAxis, yAxis, chartType) {
  if (!data || !xAxis || !yAxis) return [];

  const chartData = data.map(row => ({
    x: row[xAxis],
    y: parseFloat(row[yAxis]) || 0,
    label: row[xAxis]
  })).filter(point => point.x !== null && point.x !== undefined);

  // Group data if needed for certain chart types
  if (chartType === 'pie') {
    const grouped = {};
    chartData.forEach(point => {
      const key = point.x.toString();
      grouped[key] = (grouped[key] || 0) + point.y;
    });

    return Object.entries(grouped).map(([label, value]) => ({
      label,
      value,
      x: label,
      y: value
    }));
  }

  return chartData;
}

module.exports = router;