import Alert from '../models/alertModel.js';

// POST /api/alerts  (admin)
export const createAlert = async (req, res) => {
  try {
    const { title, message, type, severity, location, task } = req.body;
    // Location is optional now
    const alert = new Alert({
      title, message, type, severity, location, task, createdBy: req.user.id
    });
    await alert.save();
    res.status(201).json({ message: 'Alert created', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/alerts  (public)
export const getAlerts = async (req, res) => {
  try {
    // Optionally allow query params: ?active=true or ?type=flood
    const filter = {};
    if (req.query.active) filter.active = req.query.active === 'true';
    if (req.query.type) filter.type = req.query.type;
    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('volunteersAccepted', 'name email');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/alerts/:id/deactivate  (admin)
export const deactivateAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    alert.active = false;
    await alert.save();
    res.json({ message: 'Alert deactivated', alert });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/alerts/:id  (admin) - edit alert
export const updateAlert = async (req, res) => {
  try {
    const { title, message } = req.body;
    let { type, severity, location, task, active } = req.body;

    if (typeof type === 'string') type = type.toLowerCase();
    if (typeof severity === 'string') severity = severity.toLowerCase();

    const update = {};
    if (title !== undefined) update.title = title;
    if (message !== undefined) update.message = message;
    if (type !== undefined) update.type = type;
    if (severity !== undefined) update.severity = severity;
    if (location !== undefined) update.location = location;
    if (task !== undefined) update.task = task;
    if (active !== undefined) update.active = active;

    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!updated) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert updated', alert: updated });
  } catch (err) {
    console.error('Update alert error:', err);
    const msg = err?.message || 'Server error';
    res.status(400).json({ message: msg });
  }
};

// POST /api/alerts/:id/accept  (volunteer) - accept task
export const acceptTask = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    if (!alert.task || (!alert.task.title && !alert.task.description)) {
      return res.status(400).json({ message: 'No task available to accept for this alert' });
    }
    const userId = req.user.id;
    const already = alert.volunteersAccepted.some(v => v.toString() === userId);
    if (!already) {
      alert.volunteersAccepted.push(userId);
      await alert.save();
    }
    res.json({ message: 'Task accepted', count: alert.volunteersAccepted.length, alertId: alert._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
