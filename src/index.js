const express = require('express');
const app = express();
app.use(express.json());
const connect = require('../src/config/db');
const multer = require('multer');
require('dotenv').config();
const client = process.env.CLIENT;
const cors = require('cors');

// Enable CORS for both 3000 and 8080 origins
const allowedOrigins = ['http://localhost:3000', client];

app.use(cors({
  origin: allowedOrigins,
  // Add more options if needed
}));

const userController = require('../src/controllers/user.controllers');
const QuotationController = require('../src/controllers/quotation.controllers');
const Contactcontroller = require('../src/controllers/contact.controllers');
const Careercontroller = require('../src/controllers/Career.controllers');
const salescontroller = require('../src/controllers/sales.controllers');
const ticketcontroller = require('../src/controllers/ticket.controlllers');
const superadmincontroller = require('../src/controllers/superadmin.controllers');
const port = process.env.PORT || 8000;


app.use("/user", userController);
app.use("/jobs", Careercontroller);
app.use("/contactUs", Contactcontroller);
app.use("/quotations", QuotationController);
app.use("/monthlysales", salescontroller);
app.use("/tickets", ticketcontroller);
app.use("/admin", superadmincontroller);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
