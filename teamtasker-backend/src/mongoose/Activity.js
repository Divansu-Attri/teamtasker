const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  event: { type: String, required: true },
  actor: { type: Object, required: true },
  target: { type: Object },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', ActivitySchema);
