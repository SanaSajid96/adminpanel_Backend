const auth = require("../middleware/auth.middleware");
const Careers= require('../models/Career.model');
const express=require('express');
const Application=require("../models/Jobs.model");
const multer=require('multer');
const path = require('path');
const router=express.Router();

// for file saving size and type middleware
const fileFilter = (req, file, cb) => {
  // Accept specific file types
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPEG, PDF, DOC, and DOCX files are allowed."));
  }
};


const maxSize = 1024 * 1024 * 5; // 5MB

const uploadFile = multer({
  dest: "uploads/",
  fileFilter,
  limits: { fileSize: maxSize },
}).single("file");


router.post('/career',auth, async(req,res)=>{
    try{
    const{RoleName, experience,  No_of_opening,  Requirement}=req.body;

    const jobs=await Careers.create({RoleName, experience,  No_of_opening,  Requirement})
 return res.send(jobs)
 

    
    
}
catch(err){
    res.send({error:err.message})
}
})


router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 5;

  try {
   

    const jobListings = await Careers.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
       console.log(jobListings)

       const totalJobs = await Careers.countDocuments();
       const totalPages = Math.ceil(totalJobs / itemsPerPage);
    res.json({
      jobListings,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//appply now  form aoi
router.post("/Apply/:id",uploadFile,async(req,res)=>{
  
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a CV file." });
  }


      try{
      
    const{name,email,phone,Position,experience,details}=req.body;
    const file = req.file.path;
    const jobApplication =await Application.create({
      name,email,phone,Position,experience,details,file
     
    })
    const careerId = req.params.id; // Assuming you get the careerId from the URL or request body
    const career = await Careers.findByIdAndUpdate(
      careerId,
      { $push: { applications: jobApplication._id } },
      { new: true }
    );
    res.send(jobApplication);

  
  }

  catch(error){
    res.status(500).json({error:error.message});
  }
})


module.exports=
    router


