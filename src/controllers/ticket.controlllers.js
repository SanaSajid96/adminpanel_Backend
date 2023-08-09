const Ticket= require('../models/Ticket.model');
const express=require('express');

const router=express.Router();

// Create a new ticket
router.post('/ticket', async (req, res) => {
  try {
    const { ticketId,reason, employeeId } = req.body;

    const ticket = new Ticket({
      ticketId,
      reason,
      employeeId,
      status: 'pending',
      response: '',
      closed: false,
    });

    const savedTicket = await ticket.save();

    res.json(savedTicket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get a specific ticket
router.put('/response/:ticketId', async (req, res) => {
    try {
      const { response, status } = req.body;
  
      const ticket = await Ticket.findOneAndUpdate(
        { ticketId: req.params.ticketId },
        { response, status },
        { new: true }
      );
  
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
  
      res.json(ticket);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Failed to update ticket' });
    }
  });
  
// Close a ticket
router.put('/:ticketId/close', async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndUpdate(
        { ticketId: req.params.ticketId },
      { closed: true },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close ticket' });
  }
});


module.exports=
router





