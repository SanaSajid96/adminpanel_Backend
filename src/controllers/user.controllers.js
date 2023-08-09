const cron = require('node-cron');
const User= require('../models/user.model');
const moment = require('moment');
const SuperAdmin = require('../models/Superadmin.model')
const Increment=require('../models/Increment.model')
const FireEmp= require('../models/FireEmployee.model');
const SuspendedEmp=require('../models/Suspension.model')
const express=require('express');
const bcrypt=require('bcrypt')
const router=express.Router();
const jwt=require("jsonwebtoken")
require('dotenv').config();
const attendanceRecords = [];
const nodemailer = require('nodemailer');
const Pass = process.env.Pass
// transporter for sending email 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'macnetsoftware@gmail.com', // Your Gmail email address
    pass: Pass // Your Gmail password or an application-specific password
  }
});


// for creating  employee  by super admi we use this api
router.post('/register',async(req,res)=>{
    try{
    const{name,email,password,role,Number,Permission}=req.body;

    const ispresent=await User.findOne({email})
    if(!ispresent){
 const usercreate=await User.create({name,email,password,role,Number,Permission})

 //email sending
 const emailContent = {
  from: 'asana7205@gmail.com',
  to: usercreate.email,
  subject: 'Welcome to our Team',
  text: 'congratulations you have to our team!'
};
transporter.sendMail(emailContent, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    res.status(200).json({ _id: usercreate._id, message: 'User created successfully and email is send successfully!' });
 
    console.log('Email sent sucessfully', info.response);
  }
});


 
 console.log(usercreate)
    }
    else{
    res.status(200).json({  message: 'User already exisit!' ,_id:ispresent._id});
    }
}

catch(err){ 
  
  console.error({error:err.message});
  res.status(500).json({ message: 'An error occurred while saving data in the database!' });
   
}
});

// Filter search API for registered users
router.get('/filter', async (req, res) => {
  try {
    const searchTerm = req.query.search;
     
    // Build the search query based on the provided search term
    const searchQuery = {};

    if (searchTerm) {
      const regexSearchTerm = new RegExp(searchTerm, 'i');
      searchQuery.$or = [
        { name: { $regex: regexSearchTerm } }, // Case-insensitive regex search for name
        { email: { $regex: regexSearchTerm } }, // Case-insensitive regex search for email
        { role: { $regex: regexSearchTerm } }, // Case-insensitive regex search for role
        { _id: { $regex: regexSearchTerm } },   // Case-insensitive regex search for _id
      ];
    }

    // Perform the search using Mongoose
    const searchResults = await User.find(searchQuery);

    res.status(200).json(searchResults);
  } catch (err) {
    console.error({ error: err.message });
    res.status(500).json({ message: 'An error occurred while searching for data in the database!' });
  }
});


router.post('/login', async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    const currentDate = moment(); // Get the current date using moment
    // gt notice period end day
  
    const noticePeriodEndDate = user.FiredEmpDetails.endDate;

    // check if their is a suspension
    const suspension = await SuspendedEmp.findById(user.SuspensionDetails);
    if (suspension) {
      const today = new Date();
      const suspensionEndDate = new Date(suspension.affectedFrom);
      suspensionEndDate.setDate(suspensionEndDate.getDate() + suspension.Days);

      if (today <= suspensionEndDate) {
        // User is still under suspension, block login
        const users = await User.findOneAndUpdate(
          { _id: user._id }, // Query to find the user by their ID
          { _islogged:false }, // The update operation
          { new: true } // To return the updated user document
        );
        
        return res.status(401).json({ error: "User is suspended and suspended till ",suspensionEndDate });
      
        
      }
    }
    if (!user) {
      // User not found
      return res.status(401).json({ error: "Invalid user" });
    }
       console.log(user.islogged)
    if (user.islogged) {
      return res.status(401).json({ error: "User is already logged in" });
    }
    if (moment(currentDate).isSameOrAfter(noticePeriodEndDate, 'day')) {
      // Notice period date is reached
      
    // Check if the notice period date is reached
     // Get the current date using moment
     const users = await User.findOneAndUpdate(
      { _id: user._id }, // Query to find the user by their ID
      { _islogged:false }, // The update operation
      { new: true } // To return the updated user document
    );
      return res.status(401).json({ error: 'Notice period date is reached. Login not allowed.' });
     
    }

    

    // Check if the notice period date is reached
     // Get the current date using moment


    // Compare passwords
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      // Password does not match
      return res.status(401).json({ error: 'Invalid password' });
    }

    const timestamp = new Date().toISOString();
    const loginTime = new Date(timestamp).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
    });

    // Check if there is already an attendance record for this date
    const attendanceRecord = user.attendanceRecords.find(
      (record) => new Date(record.date).toDateString() === new Date(timestamp).toDateString()
    );

    if (!attendanceRecord) {
      // If there is no attendance record for this date, create a new record
      user.attendanceRecords.push({
        date: timestamp,
        loginTime: loginTime,
        logoutTime: null,
        timing: null,
      });
    }

    user.islogged = true;

    // Save the updated user document using findOneAndUpdate
    await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          islogged: user.islogged,
          attendanceRecords: user.attendanceRecords,
        },
      }
    );

    const payload = { userid: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.SECRETKEY, {});

   
    const responseMessage = `login successfully and this is token ${token}`;

    res.json({ message: responseMessage });
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({ error: error.message });
  }
});



router.post('/logout', async (req, res) => {
  try {
    // Find the user by their email
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    const logouttime = new Date().toISOString();
    const logoutTime = new Date(logouttime).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
    });

    if (!user) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }
       
    // Check if the user is already logged out
    if (!user.islogged) {
      return res.status(401).json({ error: 'User is already logged out' });
    }

    // Find the attendance record for the current date
    const attendanceRecord = user.attendanceRecords.find(
      (record) => record.date.toDateString() === new Date(logouttime).toDateString()
    );

    if (!attendanceRecord) {
      // If there is no attendance record for this date, it means the user didn't log in today.
      return res.status(400).json({ error: 'User did not log in today' });
    }

    // Update the logout time and timing only if they are currently null
    if (attendanceRecord.logoutTime === null) {
      attendanceRecord.logoutTime = logoutTime;

      // Calculate the timing based on login and logout times
      const loginHour = parseInt(attendanceRecord.loginTime.substr(0, 2));
      const loginMinute = parseInt(attendanceRecord.loginTime.substr(3, 2));
      const logoutHour = parseInt(logoutTime.substr(0, 2));
      const logoutMinute = parseInt(logoutTime.substr(3, 2));

      const loginTimeInMinutes = loginHour * 60 + loginMinute;
      const logoutTimeInMinutes = logoutHour * 60 + logoutMinute;
      const totalWorkMinutes = logoutTimeInMinutes - loginTimeInMinutes;

      if (totalWorkMinutes >= 510) {
        // 510 minutes = 8.5 hours (Full day)
        attendanceRecord.timing = 'Full day';
      } else {
        // Less than 510 minutes = Less than 8.5 hours (Half day)
        attendanceRecord.timing = 'Half day';
      }
    }
      // Update the user's login status to false
      user.islogged = false;

      // Save the updated user document using findOneAndUpdate
      await User.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: {
            islogged: user.islogged,
            attendanceRecords: user.attendanceRecords,
          },
        },
        { new: true } // Add the option { new: true } to get the updated document as the result
      );

      return res.status(200).json({ message: `Logged out successfully ` });
    
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({ error: error.message });
  }
});


// Define a new route to get attendance records for a specific user by ID
router.get('/attendance/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the attendance records for the user
    const attendanceRecords = user.attendanceRecords;

    res.status(200).json({ attendanceRecords });
  } catch (error) {
    // Handle any potential errors
    res.status(500).json({ error: error.message });
  }
});



// Saving increment details to the user
router.post('/add_increment/:userid', async (req, res) => {

  const userid=req.params.userid
  try {
    const { IncrementType, designationName, incrementAmount, affectFrom,adminpassword } = req.body;
    const admins = await SuperAdmin.find({ role: 'superadmin' });
        console.log(admins)

    //compare if adminpassword matches any of the sueradmin saved
    let isAdminPasswordValid = false;
    for (const admin of admins) {
      if (adminpassword === admin.password) {
        isAdminPasswordValid = true;
        break;
      }
    }

    if (!isAdminPasswordValid) {
      return res.status(401).json({ error: 'Invalid  Super admin password.' });
    }

    // Create a new Increment document
    const newIncrement = new Increment({
      IncrementType,
      designationName,
      incrementAmount,
      affectFrom,
      adminpassword,
    });

    // Save the newIncrement to the database and get its ID
    const savedIncrement = await newIncrement.save();

    // Now you can add the savedIncrement ID to the User's incrementDetails field
    const user = await User.findOneAndUpdate(
      { _id: userid }, // Query to find the user by their ID
      { $set: { incrementDetails: savedIncrement._id } }, // The update operation
      { new: true } // To return the updated user document
    );

    // pushing userid to error for cron automatic update

    res.status(200).json({ message: 'Increment details added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// // Function to automatically achange the role with designation when the "apply at" date is reached
async function applyIncrementAutomatically() {
  try {
    const currentDate = new Date();

    // Fetch all users who have an incrementDetails and their "apply at" date is less than or equal to the current date
    const usersToUpdate = await User.find({
      incrementDetails: { $exists: true },
      'incrementDetails.affectFrom': { $lte: currentDate },
    });

    // Update the roles for users whose "apply at" date is reached and have a designation name
    for (const user of usersToUpdate) {
      if (user.incrementDetails.designationName && user.incrementDetails.designationName.trim() !== '') {
        user.role = user.incrementDetails.designationName;
        const user = await User.findOneAndUpdate(
          { _id: userid }, // Query to find the user by their ID
          { $set: { role : user.incrementDetails.designationName} }, // The update operation
          { new: true } // To return the updated user document
          
        );
        console.log("this works")
      }
    }
  } catch (error) {
    console.error('An error occurred while applying increment automatically:', error);
  }
}

//cron schedule works after 24hrs
cron.schedule('0 0 * * *', () => {
  applyIncrementAutomatically();
});
// for fire employee user Api
router.post('/fireEmp/:userid', async (req, res) => {

  const userid=req.params.userid
  try {
    
      const {
        reason,
        letter,
        noticePeriod,
        affectedFrom,
        endDate,
        adminPassword
      } = req.body;
  
    const admins = await SuperAdmin.find({ role: 'superadmin' });
        console.log(admins)

    //compare if adminpassword matches any of the sueradmin saved
    let isAdminPasswordValid = false;
    for (const admin of admins) {
      if (adminPassword === admin.password) {
        isAdminPasswordValid = true;
        break;
      }
    }

    if (!isAdminPasswordValid) {
      return res.status(401).json({ error: 'Invalid  Super admin password.' });
    }

    // Create a new Increment document
    const fireEmployee = new FireEmp({
      reason,
      letter,
      noticePeriod,
      affectedFrom,
      endDate,
      adminPassword
    });
    console.log(fireEmployee)
    // Save the newIncrement to the database and get its ID
    const firedEmp = await fireEmployee.save();
      
    // Now you can add the savedIncrement ID to the User's incrementDetails field
    const user = await User.findOneAndUpdate(
      { _id: userid }, // Query to find the user by their ID
      { $set: {   FiredEmpDetails:firedEmp._id } }, // The update operation
      { new: true } // To return the updated user document
    );

    // pushing userid to error for cron automatic update

    res.status(200).json({ message: 'Fire Employee details added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// for suspension work api
router.post('/Suspended/:userid', async (req, res) => {

  const userid=req.params.userid
  try{

   const  {
    reason,
    letter,
    Days,
    
    adminPassword } =req.body
  console.log(reason,letter,Days,adminPassword)
    const admins = await SuperAdmin.find({ role: 'superadmin' });
      

    //compare if adminpassword matches any of the sueradmin saved
    let isAdminPasswordValid = false;
    for (const admin of admins) {
      if (adminPassword === admin.password) {
        isAdminPasswordValid = true;
        break;
      }
    }

    if (!isAdminPasswordValid) {
      return res.status(401).json({ error: 'Invalid  Super admin password.' });
    }

    // Create a new Increment document
    const Suspended= new SuspendedEmp({
    reason,
    letter,
    Days,
    adminPassword
    });

    // Save the newIncrement to the database and get its ID
    const savedSuspension= await Suspended.save();

    // Now you can add the savedIncrement ID to the User's incrementDetails field
    const user = await User.findOneAndUpdate(
      { _id: userid }, // Query to find the user by their ID
      { $set: { SuspensionDetails: savedSuspension._id } }, // The update operation
      { new: true } // To return the updated user document
    );

    // pushing userid to error for cron automatic update

    res.status(200).json({ message: 'Suspension details added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

 module.exports=
  router
