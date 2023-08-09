const mongoose=require('mongoose');
const FireEmpScheme=mongoose.Schema(
  {
        reason: { type: String, required: true },
        letter: { type: String, required: true },
        noticePeriod: { type: String, required: true },
        affectedFrom: { type: Date},
        endDate: { type: Date, default:Date.now },
        adminPassword: { type: String, required: true }
      });

const FireEmp=mongoose.model("FireEmp",FireEmpScheme)
module.exports=FireEmp
    