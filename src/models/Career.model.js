const mongoose=require('mongoose');
const CareerScheme=mongoose.Schema(
    {
        RoleName:{
            type:String,
            required:true
        },
        experience:{
            type:String,
            required:true,
        },
        No_of_opening:{
            type:Number,
            required:true
        },
        Requirement:{
            type:String,
            required:true,
        },
        applications: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'ApplicationForm',
            },
          ],
    }
)
const Career=mongoose.model("CareerForm",CareerScheme)
module.exports=
    Career