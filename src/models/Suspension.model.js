const mongoose=require('mongoose');
const SuspendedEmpScheme=mongoose.Schema(
  {
        reason: { type: String, required: true },
        letter: { type: String, required: true },
        Days: { type: Number, required: true },
        affectedFrom: { type: Date ,default:Date.now},
       
        adminPassword: { type: String, required: true }
      });

const SuspendedEmp=mongoose.model("Suspended",SuspendedEmpScheme)
module.exports=SuspendedEmp