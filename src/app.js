// const express = require("express"); // Importamos Express
// const animesRoutes = require("./routes/animes"); // Importamos las rutas de la API
// const errorHandler = require("./middlewares/errorHandler"); // Importamos el middleware para manejo de errores

// const app = express(); // Creamos una instancia de Express
// const PORT = 3000 || 3010; // Puerto del servidor en donde se ejecutará la API

// app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes en formato JSON. Tambien conocido como middleware de aplicación.
// app.use("/animes", animesRoutes); // Middleware para manejar las rutas de la API. Tambien conocido como middleware de montaje o de enrutamiento.
// app.use(errorHandler); // Middleware para manejar errores.


import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js";
import routerAnime from "./routes/animes.js";
import routerStudios from "./routes/studios.js";
import routerDirectors from "./routes/directors.js";
import routerCharacters from "./routes/characters.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3010

app.use(express.json()); // Middleware para convertir el cuerpo de las solicitudes a json

app.use("/animes", routerAnime);
app.use("/studios", routerStudios);
app.use("/directors", routerDirectors);
app.use("/characters", routerCharacters);

app.use(errorHandler); // Middleware para errores
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`); // Logueamos el mensaje en consola cuando el servidor se inicie.
}); // Aqui tenemos el escuchador del puerto para comprobar que esté corriendo
    