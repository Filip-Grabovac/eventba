const mongoose = require('mongoose');
const connectDB = require('../db/connect');

const HelperSchema = new mongoose.Schema(
  {
    sponsors: { type: Array, default: undefined },
    hot_events: { type: Array, default: undefined },
    newsletter: { type: Array, default: undefined },
  },
  { versionKey: false }
);

module.exports = connectDB(process.env.DATABASE_URL).model(
  'Helper',
  HelperSchema,
  'helper'
);
