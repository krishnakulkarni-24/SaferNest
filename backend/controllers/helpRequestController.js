import HelpRequest from '../models/helpRequestModel.js';
import Alert from '../models/alertModel.js';

// POST /api/help-requests (resident) - create a help request under an alert
export const createHelpRequest = async (req, res) => {
  try {
    const { alertId, address, location, notes } = req.body;
    console.log('[HelpRequest] create', { hasAlertId: !!alertId, address: !!address, hasLocation: !!(location && location.coordinates), notes: !!notes });

    const helpData = {
      resident: req.user.id,
      address,
      notes
    };

    // If an alertId is provided, prefer to link to an active alert; otherwise gracefully proceed without linking
    if (alertId) {
      try {
        const alert = await Alert.findById(alertId);
        if (alert && alert.active) {
          helpData.alert = alertId;
        } else {
          console.warn('[HelpRequest] alertId provided but invalid or inactive — proceeding without linking');
        }
      } catch (e) {
        console.warn('[HelpRequest] alert lookup error — proceeding without linking');
      }
    }

    // Only include location if it's provided with valid coordinates
    if (location && location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      helpData.location = location;
    }

    const help = new HelpRequest(helpData);
    await help.save();
    res.status(201).json({ message: 'Help request submitted', help });
  } catch (err) {
    console.error('Error creating help request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/help-requests (volunteer/admin) - list requests, optionally filter by alert
export const listHelpRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.alertId) filter.alert = req.query.alertId;
    if (req.user.role === 'resident') filter.resident = req.user.id;
    const requests = await HelpRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('resident', 'name email')
      .populate('acceptedBy', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/help-requests/:id/accept (volunteer) - accept a help request
export const acceptHelpRequest = async (req, res) => {
  try {
    const help = await HelpRequest.findById(req.params.id);
    if (!help) return res.status(404).json({ message: 'Help request not found' });
    if (help.status !== 'pending') return res.status(400).json({ message: 'Request not pending' });
    help.status = 'accepted';
    help.acceptedBy = req.user.id;
    await help.save();
    
    // Populate the acceptedBy field before returning
    await help.populate('acceptedBy', 'name email');
    await help.populate('resident', 'name email');
    
    res.json({ message: 'Help request accepted', help });
  } catch (err) {
    console.error('Error accepting help request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/help-requests/:id/status (volunteer/admin) - update status
export const updateHelpRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','accepted','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const help = await HelpRequest.findById(req.params.id);
    if (!help) return res.status(404).json({ message: 'Help request not found' });
    // Volunteers can update only own accepted requests unless admin
    if (req.user.role === 'volunteer' && help.acceptedBy && help.acceptedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    help.status = status;
    await help.save();
    res.json({ message: 'Status updated', help });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
