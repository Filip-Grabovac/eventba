const mongoose = require('mongoose');
const connectDB = require('../db/connect');

const HelperSchema = new mongoose.Schema({
  sponsors: { type: Array, default: [] },
  hot_events: { type: Array, default: [] },
});

module.exports = connectDB(process.env.DATABASE_URL).model(
  'Helper',
  HelperSchema,
  'helper'
);
