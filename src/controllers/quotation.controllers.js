const Quotation= require('../models/Quotation.model');
const express=require('express');


const router=express.Router();

router.post('/quotation', async(req,res)=>{
    try{
    const{name,phone,email,budget,message}=req.body;

  
 const Quotations=await Quotation.create({name,phone,email,budget,message})
 
 res.json({ message: 'Quotation submitted successfully!' });
  console.log(Quotations)
 }
 catch(err){ 
   console.error({error:err.message});
   res.json({ err});
    
 }
});

module.exports=
    router
