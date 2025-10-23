import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  // Alert is optional to allow residents to request help even without an active alert
  alert: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'] }
  },
  notes: { type: String },
  status: { type: String, enum: ['pending','accepted','completed','cancelled'], default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

helpRequestSchema.index({ location: '2dsphere' }, { sparse: true });

export default mongoose.model('HelpRequest', helpRequestSchema);
