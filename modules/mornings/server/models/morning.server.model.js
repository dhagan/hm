'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Morning Schema
 */
var MorningSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Morning name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Morning', MorningSchema);
