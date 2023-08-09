const mongoose=require('mongoose');
const QuotationScheme=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true,
        },
        email:{
            type:String,
            required:true
        },
        
        budget:{
          type:String,
          required:true
        },
        
        message:{
            type:String,
            required:true,
        },
    }
)
const Quotations=mongoose.model("Quotation",QuotationScheme)
module.exports=
    Quotations
