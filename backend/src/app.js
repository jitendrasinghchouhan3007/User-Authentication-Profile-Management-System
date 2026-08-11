import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { errorHandler, notFound } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: clientOrigins,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'User Authentication & Profile Management API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

export default app