const Contactform= require('../models/Contact.model');
const express=require('express');

const router=express.Router();
router.post('/contact',async (req, res) => {
    try{
    const { name, email,message } = req.body;
    console.log(name)
    const ContactForm=await Contactform.create({name,email,message})
    // Process the form data here
    
    res.json({ message: 'Form submitted successfully!' });
    
    }
    catch(err){ 
      console.error({error:err.message});
      res.json({ message: 'An error occured while saving data in database!' });
       
    }
  });
  module.exports=
    router