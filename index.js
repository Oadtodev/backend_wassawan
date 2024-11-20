import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './models/User.js';
import UtilitiesUsage from './models/utilities_usage.js';
import unilities_usage_remember from './models/unilities_usage_remember.js';
import user_remember from './models/user_remember.js';
import Bills from './models/bill.js';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://admin:1249712561@cluster0.upixr.mongodb.net/cruddb', {
    
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Connection error", err);
});

const formatDateTime = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Bangkok' };
  return new Intl.DateTimeFormat('th-TH', options).format(date);
};

// ออกบิล
app.get('/api/summary', async (req, res) => {
  try {
    const users = await User.find();
    const utilitiesUsages = await UtilitiesUsage.find();

    const summary = users.map(user => {
      const usage = utilitiesUsages.find(usage => usage.room === user.room) || {};
   
      
      return {
        
        room: user.room,
        name: user.name,
        rent: user.rent,
        electricity: (usage.newElectricMeter || 0),
        water: (usage.newWaterMeter || 0),
        sumelectric:usage.newElectricMeter*8,
        sumwater:usage.newWaterMeter*30,
        totalAmount: user.rent + (usage.newElectricMeter || 0)*8 + (usage.newWaterMeter || 0)*30,
        createdAt: formatDateTime(user.createdAt)
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map(user => ({ ...user.toObject(), createdAt: formatDateTime(user.createdAt) })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, room, rent, tel } = req.body;
  const user = new User({ name, room, rent, tel });
  const userRemember = new user_remember({ name, room, rent, tel });
  await user.save();
  await userRemember.save();
  res.status(201).json({ ...user.toObject(), createdAt: formatDateTime(user.createdAt) });
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, room, rent, tel } = req.body;

  try {

  const updatedUser = await User.findByIdAndUpdate(id, { name, room, rent, tel }, { new: true });
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ ...updatedUser.toObject()});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/utilities_usage', async (req, res) => {
  try {
    const utilitiesUsages = await UtilitiesUsage.find();
    res.json(utilitiesUsages.map(usage => ({ ...usage.toObject(), createdAt: formatDateTime(usage.createdAt) })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/utilities_usage/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const utilitiesUsage = await UtilitiesUsage.find({ room });
    res.json(utilitiesUsage.map(usage => ({ ...usage.toObject(), createdAt: formatDateTime(usage.createdAt) })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/utilities_usage', async (req, res) => {
  const { room, newWaterMeter, newElectricMeter } = req.body;
  
  const utilitiesUsage = new UtilitiesUsage({ room, newElectricMeter, newWaterMeter });
  const usages_old = new unilities_usage_remember({ room, newElectricMeter, newWaterMeter });
  
  try {
    await utilitiesUsage.save();
    await usages_old.save();
    res.status(201).json({ ...utilitiesUsage.toObject(), createdAt: formatDateTime(utilitiesUsage.createdAt) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/utilities_usage/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUsage = await UtilitiesUsage.findByIdAndDelete(id);
    if (!deletedUsage) {
      return res.status(404).json({ message: 'Usage not found' });
    }
    res.status(200).json({ message: 'Usage deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/api/bills', async (req, res) => {
  const { room, name, rent, usage,totalAmount } = req.body;

  const billing = new Bills({ room, name, rent, usage ,totalAmount});
  
  try {
    await billing.save();
    res.status(201).json({ ...bill.toObject(), createdAt: formatDateTime(bill.createdAt) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
