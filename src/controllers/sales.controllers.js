
const express=require('express');

const router=express.Router();

router.get('/sales',async (req, res) => {
    try{


      function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    // July
    const { montlysales,month,year } = req.body;
    const dailysale=  montlysales/(daysInMonth(month,year))

    const saleavg= Math.round(dailysale)
    console.log(saleavg);
     res.json({ message: 'Success',saleavg });
    }
    catch(err){
        res.send({error:err.message})
    }
  });
  module.exports=
    router
