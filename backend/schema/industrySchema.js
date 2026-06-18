// schema/Industry.js
const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['technical', 'non-technical', 'other'],
    default: 'other'
  },
  skills: [{
    type: String
  }],
  degrees: [{
    type: String
  }],
  streams: [{
    type: String
  }],
  subCategories: [{
    type: String
  }]
}, { timestamps: true });

const Industry = mongoose.model('Industry', industrySchema);
module.exports = Industry;