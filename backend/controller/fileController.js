const xlsx = require('xlsx');
const File = require('../models/File');
const User = require('../models/User');
const crypto = require('crypto');

const uploadFile = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'Please upload a file' });
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });
    if (data.length === 0) return res.status(400).json({ message: 'The uploaded Excel file is empty or in an invalid format.' });
    const newFile = new File({
      filename: `${crypto.randomBytes(16).toString('hex')}-${req.file.originalname}`,
      originalName: req.file.originalname,
      path: 'in-memory-storage',
      size: req.file.size,
      mimeType: req.file.mimetype,
      userId: req.user._id,
      headers: Object.keys(data[0]),
      rowCount: data.length,
      data: data,
      metadata: { sheets: workbook.SheetNames, activeSheet: sheetName, columns: Object.keys(data[0]).length },
      isProcessed: true,
    });
    const createdFile = await newFile.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { uploadCount: 1, storageUsed: req.file.size } });
    res.status(201).json(createdFile);
  } catch (error) {
    console.error("File upload error:", error);
    next({ message: 'Error processing file', statusCode: 500 });
  }
};

const getFileHistory = async (req, res, next) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({ createdAt: -1 }).select('-data -analyses');
    res.json(files);
  } catch (error) {
    next(error);
  }
};

const getFileDetails = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
        res.json(file);
    } catch (error) {
        next(error);
    }
};

const updateFileDetails = async (req, res, next) => {
    try {
        const { description, tags } = req.body;
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
        file.description = description || file.description;
        file.tags = tags || file.tags;
        const updatedFile = await file.save();
        res.json(updatedFile);
    } catch (error) {
        next(error);
    }
};

const deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
        const fileSize = file.size;
        await file.deleteOne();
        await User.findByIdAndUpdate(req.user._id, { $inc: { uploadCount: -1, storageUsed: -fileSize } });
        res.json({ message: 'File removed successfully' });
    } catch (error) {
        next(error);
    }
};

const addAnalysis = async (req, res, next) => {
    try {
        const { chartType, xAxis, yAxis, title, config, chartData } = req.body;
        const file = await File.findById(req.params.fileId);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
        const newAnalysis = { chartType, xAxis, yAxis, title, config, chartData };
        file.analyses.push(newAnalysis);
        await file.save();
        res.status(201).json(file.analyses[file.analyses.length - 1]);
    } catch (error) {
        next(error);
    }
};

const deleteAnalysis = async (req, res, next) => {
    try {
        const { fileId, analysisId } = req.params;
        const file = await File.findById(fileId);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (file.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
        file.analyses.id(analysisId).deleteOne();
        await file.save();
        res.json({ message: 'Analysis removed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadFile, getFileHistory, getFileDetails, deleteFile, addAnalysis, deleteAnalysis, updateFileDetails };