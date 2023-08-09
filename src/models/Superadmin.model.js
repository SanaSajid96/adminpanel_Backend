const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const AdminScheme=mongoose.Schema(
    {
      
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true,
          
        },
       
       
    }
)

const Superadmin=mongoose.model("superadmins",AdminScheme)
module.exports=
Superadmin
