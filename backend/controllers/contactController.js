import Contact from '../models/contactModel.js';

// POST /api/contact/submit - Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    const contact = new Contact({
      name,
      email,
      message
    });
    
    await contact.save();
    
    res.status(201).json({ 
      message: 'Contact submission received successfully',
      id: contact._id 
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/contact/submissions - Get all contact submissions (admin only)
export const getContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(contacts);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/contact/submissions/:id - Update contact status (admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    
    res.json({ message: 'Status updated successfully', contact });
  } catch (err) {
    console.error('Update contact status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/contact/submissions/:id - Delete contact submission (admin only)
export const deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    
    res.json({ message: 'Contact submission deleted successfully' });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
