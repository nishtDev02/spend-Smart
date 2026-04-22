import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

import authRoutes from "./routes/authRoutes.js"
import incomeRoutes from "./routes/incomeRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"

dotenv.config();
console.log('API KEY:', process.env.GROQ_API_KEY)

const app = express();


// Middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/income', incomeRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/ai', aiRoutes)

// Test routes
app.get('/', (req, res) => {
    res.json({ message: 'SpendSmart API is running!!!'})
})

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running or port http://localhost:${PORT}`)
})