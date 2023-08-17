const mongoose = require('mongoose');
const connectDB = require('../db/connect');

const EntranceShema = new mongoose.Schema({
  id: { type: Number },
  event: { type: String },
  entrance_num: { type: Number },
  name: { type: String },
  password: { type: String },
  organizer_id: { type: String },
  collection_name: { type: String },
});

module.exports = connectDB(process.env.DATABASE_URL).model(
  'Entrance',
  EntranceShema,
  'entrance_controllers'
);
