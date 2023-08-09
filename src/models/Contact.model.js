const mongoose=require('mongoose');
const ContactScheme=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
      
        email:{
            type:String,
            required:true
        },
       
        message:{
            type:String,
            required:true
    },
    }
)
const Contact=mongoose.model("ContactForm",ContactScheme)
module.exports=
    Contact