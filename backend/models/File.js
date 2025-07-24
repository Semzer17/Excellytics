const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  chartType: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter', '3d-column', 'area'],
    required: true
  },
  xAxis: String,
  yAxis: String,
  title: String,
  config: mongoose.Schema.Types.Mixed,
  chartData: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  headers: [String],
  rowCount: {
    type: Number,
    default: 0
  },
  data: mongoose.Schema.Types.Mixed,
  analyses: [analysisSchema],
  metadata: {
    sheets: [String],
    activeSheet: String,
    columns: Number,
    dataTypes: mongoose.Schema.Types.Mixed
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  tags: [String],
  description: String
}, {
  timestamps: true
});

// Index for better performance
fileSchema.index({ userId: 1, createdAt: -1 });
fileSchema.index({ filename: 1 });

module.exports = mongoose.model('File', fileSchema);