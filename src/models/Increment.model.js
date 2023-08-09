const mongoose = require('mongoose');

const IncrementSchema = mongoose.Schema({
    IncrementType:{
        type:String,
        required:true,
          },

  designationName: {
    type: String,
    
  },
  incrementAmount: {
    type: Number,
    
  },
  affectFrom: {
    type: Date,
    required: true,
  },
  adminpassword:{
         type:String,
         required:true,
  }
});

module.exports = mongoose.model('Increment', IncrementSchema);
