import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['flood','earthquake','fire','storm','other'], default: 'other' },
  severity: { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] } // [lng, lat]
  },
  // Optional task details assigned by admin for volunteers
  task: {
    title: { type: String },
    description: { type: String }
  },
  // Track which volunteers accepted the task for this alert
  volunteersAccepted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

alertSchema.index({ location: '2dsphere' });

export default mongoose.model('Alert', alertSchema);
