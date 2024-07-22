import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import {fileURLToPath} from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const directorsPath= path.join(_dirname, "../../data/directors.json");
const routerDirectors = Router();

const readDirector = async()=>{
    try{
        const directors = await fs.readFile(directorsPath);
        return JSON.parse(directors);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
}
};

const writeDirector= async(directors)=>{
    await fs.writeFile(directorsPath, JSON.stringify(directors, null, 2));
};

routerDirectors.get("/", async function(req, res){
    const directors = await readDirector();
    res.json(directors);
});

routerDirectors.get("/:directorsid", async (req, res)=>{
    const directors = await readDirector();
    const director = directors.find(director=>director.id === parseInt(req.params.directorsid));
    if(!director){
        return res.status(404).json({error: "Director no encontrado"});
    }
    res.json(director);
})

routerDirectors.post("/", async (req, res)=>{
    const directors = await readDirector();
    const newdirector={
        id: directors.length +1,
        name: req.body.name
    };

    directors.push(newdirector);
    await writeDirector(directors);
    res.status(201).json({message: "Director creado satisfactoricamente", director: newdirector});
   
});


routerDirectors.put("/:directorsid", async (req, res)=>{
    const directors = await readDirector();
    const indexDirectors = directors.findIndex(director=>director.id === parseInt(req.params.directorsid));
    if(indexDirectors === -1){
        return res.status(404).json({error: "Director no encontrado"});
    }
    const updateDirector={
        id: parseInt(req.params.directorsid),
        name: req.body.name
    }
    directors[indexDirectors]=updateDirector;
    await writeDirector(directors);
    res.json({message: "Director actualizado satisfactoriamente", director: updateDirector});
});


routerDirectors.delete("/:directorsid", async (req, res)=>{
    const directors = await readDirector();
    const newDirectors = directors.filter(director=>director.id !== parseInt(req.params.directorsid));
    if(newDirectors.length === directors.length){
        return res.status(404).json({error: "Director no encontrado"});
    }

    await writeDirector(newDirectors);
    res.json({message: "Director eliminado satisfactoriamente"});
 });

export default routerDirectors