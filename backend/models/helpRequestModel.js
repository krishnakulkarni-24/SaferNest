import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  alert: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert', required: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } // [lng, lat]
  },
  notes: { type: String },
  status: { type: String, enum: ['pending','accepted','completed','cancelled'], default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

helpRequestSchema.index({ location: '2dsphere' }, { sparse: true });

export default mongoose.model('HelpRequest', helpRequestSchema);
