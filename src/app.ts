import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import descuentosRoutes from './routes/descuentoRoutes'
import detalleProductoRoutes from './routes/detalleProductoRoutes'
import imagenRoutes from './routes/imagenRoutes'

dotenv.config()

const app = express()

app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/usuarios', userRoutes)
app.use('/descuentos', descuentosRoutes)
app.use('/imagenes', imagenRoutes)
app.use('/detalleProducto', detalleProductoRoutes)

export default app;