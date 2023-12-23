import express from 'express';
import mongoose from 'mongoose';
import uploadRoutes from './routes/uploadRoutes';
import cors from 'cors'
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors())

app.use('/api',uploadRoutes);

app.listen(PORT,()=>{
    console.log('server running');
    mongoose.connect('mongodb://127.0.0.1:27017/CSV-Organization').then(()=>{
    console.log('db connected')
    })
})