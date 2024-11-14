dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

const PORT = process.env.PORT||3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://admin:1249712561@cluster0.upixr.mongodb.net/cruddb', {
    
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Connection error", err);
});



app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, room, rent,tel } = req.body;
  const user = new User({ name, room, rent,tel });
  await user.save();
  res.status(201).json(user);
});

app.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});