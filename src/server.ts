import app from "./app"

const PORT = process.env.PORT || 3000


try {
    app.listen(PORT, () => {
        console.log("Servidor corriendo en el puerto: ", PORT)
    })
} catch (error) {
    console.error("Error al inicar el servidor: ", error)
}