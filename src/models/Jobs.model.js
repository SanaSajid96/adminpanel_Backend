const mongoose=require('mongoose');
const JobScheme=mongoose.Schema(
    {
        name:{
            type:String,
            required:true,

        },
        email:{
            type:String,
            required:true,
        },
        phone:{
            type:String,
            required:true,
        },
        Position:{
            type:String,
            required:true,
        },
        experience:{
            type:String,
            required:true,
        },
        file:{
            type:String,
            required:true,
           
        },
        details:{
            type:String,
            required:true,
        },
       
    }
)
const Application=mongoose.model("ApplicationForm",JobScheme)
module.exports=
    Application