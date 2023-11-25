import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { DATABASE } from './config.js';
import authRoutes from './routes/auth.js';
import adRoutes from './routes/ad.js'

const app = express();
//db

async function connectToDatabase() {
  try {
    await mongoose.connect(DATABASE);
    console.log("db_connected");
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();


//middlewares

app.use (express.json({limit:"5mb"}));
app.use (morgan("dev"));
app.use (cors());

//routes middleware
app.use('/api', authRoutes) 
app.use('/api', adRoutes) 


app.listen(8000, () => console.log("server_is_running_on_port_8000"));