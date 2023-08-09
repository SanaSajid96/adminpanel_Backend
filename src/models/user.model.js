const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

// Function to generate a custom _id
function generateCustomId(numIdLength, minLength) {
    const maxLength = 6;
  
    // Generate a random numeric ID
    const numId = Math.floor(Math.random() * (10 ** numIdLength)).toString().padStart(numIdLength, '0');
  
    // Generate a random alphabetic string
    const alphaStr = [...Array(maxLength - numId.length )].map(() => String.fromCharCode(65 + Math.random() * 26)).join('');
    
    // Concatenate the numeric ID, alphabetic string, and "EMP"
    let customId = `MACNET${numId}${alphaStr}EMP`;
  
    // Pad the string if it's shorter than the minimum length
    if (customId.length < minLength) {
      const paddingLength = minLength - customId.length;
      const padding = "0".repeat(paddingLength); // You can use any other character for padding
  
      customId = `MACNET(${padding}${numId}${alphaStr})EMP`;
    }
  
    return customId;
  }
  
  // Generate a new custom _id
  const newCustomId = generateCustomId(3, 5);
  console.log(newCustomId);
  

// Connect to MongoDB and insert a document with the custom _id


const UserScheme=mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            default: function() {
                return generateCustomId(3, 5);
              }
          },

       
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
        Number:{
            type:Number,
            required:true,
          
        },
        Permission: {
            type: [String]
            
          },
       
        islogged:{
            type:Boolean,
            required:true,
            default:false
        },
        attendanceRecords: [
            {
              date: {
                type: Date,
               
              },
              loginTime: {
                type: String,
                default: null,
              },
              logoutTime: {
                type: String,
                default: null,
              },
              timing: {
                type: String,
                default: null,
              },
            },
          ],
          incrementDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Increment',
          },
          FiredEmpDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FireEmp',
          },
          SuspensionDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Suspended",
          },
        }
)
UserScheme.pre("save",function(next){
   

    const hash =bcrypt.hashSync(this.password,11)
    this.password=hash;
    next();
})
const User=mongoose.model("Userrole",UserScheme)
module.exports=
User
