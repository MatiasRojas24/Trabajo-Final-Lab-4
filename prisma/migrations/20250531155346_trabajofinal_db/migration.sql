-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CLIENTE');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('ZAPATILLA', 'REMERA', 'PANTALON', 'CAMPERA');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('HOMBRE', 'MUJER', 'OTRO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "email" TEXT NOT NULL,
    "dni" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Catalogo" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descuento" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "fechaInicio" TEXT NOT NULL,
    "fechaCierre" TEXT NOT NULL,
    "descuento" INTEGER NOT NULL,

    CONSTRAINT "Descuento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleProducto" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "talleId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "DetalleProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "localidad" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "detalleProductoId" TEXT NOT NULL,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "total" DOUBLE PRECISION NOT NULL,
    "descuento" INTEGER NOT NULL,
    "fechaCompra" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "direccionId" TEXT NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompraDetalle" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "ordenCompraId" TEXT NOT NULL,
    "detalleProductoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrdenCompraDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Precio" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "precioCompra" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "detalleProductoId" TEXT NOT NULL,
    "descuentoId" TEXT NOT NULL,

    CONSTRAINT "Precio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "nombre" TEXT NOT NULL,
    "tipoProducto" "TipoProducto" NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "catalogoId" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Talle" (
    "id" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "talle" INTEGER NOT NULL,

    CONSTRAINT "Talle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsuariosDirecciones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UsuariosDirecciones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "_UsuariosDirecciones_B_index" ON "_UsuariosDirecciones"("B");

-- AddForeignKey
ALTER TABLE "DetalleProducto" ADD CONSTRAINT "DetalleProducto_talleId_fkey" FOREIGN KEY ("talleId") REFERENCES "Talle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleProducto" ADD CONSTRAINT "DetalleProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_detalleProductoId_fkey" FOREIGN KEY ("detalleProductoId") REFERENCES "DetalleProducto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompraDetalle" ADD CONSTRAINT "OrdenCompraDetalle_ordenCompraId_fkey" FOREIGN KEY ("ordenCompraId") REFERENCES "OrdenCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompraDetalle" ADD CONSTRAINT "OrdenCompraDetalle_detalleProductoId_fkey" FOREIGN KEY ("detalleProductoId") REFERENCES "DetalleProducto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precio" ADD CONSTRAINT "Precio_detalleProductoId_fkey" FOREIGN KEY ("detalleProductoId") REFERENCES "DetalleProducto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precio" ADD CONSTRAINT "Precio_descuentoId_fkey" FOREIGN KEY ("descuentoId") REFERENCES "Descuento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_catalogoId_fkey" FOREIGN KEY ("catalogoId") REFERENCES "Catalogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuariosDirecciones" ADD CONSTRAINT "_UsuariosDirecciones_A_fkey" FOREIGN KEY ("A") REFERENCES "Direccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuariosDirecciones" ADD CONSTRAINT "_UsuariosDirecciones_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
