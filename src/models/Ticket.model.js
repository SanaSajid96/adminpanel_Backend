

const mongoose=require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
      },
    reason: String,
    employeeId: String,
    status: String,
    response: String,
    closed: Boolean,

  });
  
  const Ticket = mongoose.model('Ticket', ticketSchema);
  
module.exports=
    Ticket