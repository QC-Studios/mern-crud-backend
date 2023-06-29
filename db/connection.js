import mongoose from "mongoose";
const DB = process.env.DATABASE

mongoose.connect(DB, {useUnifiedTopology:true, useNewUrlParser:true }).then(()=>console.log("Database Connected")).catch((error)=>console.log(error, 'Error While connecting with database'))