
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import direccionRoutes from "./routes/direccionRoutes";

import precioRoutes from "./routes/precioRoutes";
import ordenCompraRoutes from "./routes/ordenCompraRoutes";
import ordenCompraDetalleRoutes from "./routes/ordenCompraDetalleRoutes";

import productoRoutes from "./routes/productoRoutes";
import talleRoutes from "./routes/talleRoutes";
import catalogoRoutes from "./routes/catalogoRoutes";

import descuentoRoutes from "./routes/descuentoRoutes";
import imagenRoutes from "./routes/imagenRoutes";
import detalleProductoRoutes from "./routes/detalleProductoRoutes";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/direcciones", direccionRoutes);
app.use("/precios", precioRoutes);
app.use("/ordenesDeCompra", ordenCompraRoutes);
app.use("/ordenComprasDetalles", ordenCompraDetalleRoutes);
app.use("/productos", productoRoutes);
app.use("/talles", talleRoutes);
app.use('/detalleProducto', detalleProductoRoutes)
app.use("/catalogos", catalogoRoutes);
app.use("/descuentos", descuentoRoutes);
app.use("/imagenes", imagenRoutes);
app.use("/detallesProducto", detalleProductoRoutes);

export default app;