// const express = require('express'); //importamos el framework express
// const fs = require('fs');

import {Router} from 'express';
import {promises as fs}  from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const animesPath = path.join(_dirname, '../../data/animes.json');
const routerAnime =Router();


const readAnimesFs= async()=>{
    try{
        const animes = await fs.readFile(animesPath)
        return JSON.parse(animes);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
}

const writeAnimesFs = async (animes) => {
    await fs.writeFile(animesPath, JSON.stringify(animes, null, 2));
};

routerAnime.get('/', async (req, res) => {
    const animes = await readAnimesFs();
    res.json(animes);
})

routerAnime.get("/:animeid", async (req, res) => {
    const animes = await readAnimesFs(); //Esperamos a que lea la base de datos de anime
    const anime = animes.find(anime => anime.id === parseInt(req.params.animeid)); // La variable anime tendrá el valor de parametro de animeId
    if(!anime) return res.status(404).send("Anime no encontrado"); // si no se encuentra entonces dirá que el Anime no se encontró
    res.json(anime)
});

routerAnime.post('/postAnimes', async(req, res)=>{
    const studioUrl = await fetch(`http://localhost:3000/studios/${req.body.studioId}`);
    const animes =await readAnimesFs();
    const newAnimes = {
        id: animes.length + 1,
        title: req.body.title,
        genre:req.body.genre,
        studioId: await studioUrl.json()
    };

    animes.push(newAnimes);
    await writeAnimesFs(animes);
    res.status(201).json({message: "Anime creado exitosamente", Anime: newAnimes});
}) ; 



routerAnime.put("/:id", async (req, res) => {
    const studioUrl = await fetch(`http://localhost:3000/studios/${req.body.studioId}`);
    const animes = await readAnimesFs();
    const indexAnime = animes.findIndex(anime => anime.id === parseInt(req.params.id));
    if(indexAnime === -1) return res.status(404).send("Anime no encontrado");
    const updateAnime = {
        ...animes[indexAnime],
        title: req.body.title,
        genre: req.body.genre,
        studioId: await studioUrl.json()
    }

    animes[indexAnime] = updateAnime;
    await writeAnimesFs(animes);
    res.json({message:`Anime actualizado satisfactoriamente`, anime: updateAnime})
});

routerAnime.delete("/:id", async (req, res) => {
    const animes = await readAnimesFs(); 
    const newAnimes = animes.filter((anime) => anime.id !== parseInt(req.params.id)); 
    if (animes.length === newAnimes.length) {
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    await writeAnimesFs(newAnimes); 
    res.json({ message: "Anime eliminado satisfactoriamente" });
});
export default routerAnime;
