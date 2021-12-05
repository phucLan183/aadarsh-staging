const mongoose = require('mongoose');
const Schema = mongoose.Schema

const SettingSchema = new Schema({
  website: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    match: /.+\@.+\..+/,
    lowercase: true
  },
  hotline: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  favicon: {
    type: String,
    trim: true
  },
  facebook: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
  versionKey: false
})

const Setting = mongoose.model('Setting', SettingSchema)
module.exports = Setting