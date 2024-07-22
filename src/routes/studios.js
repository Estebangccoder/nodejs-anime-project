import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import {fileURLToPath} from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const studiosPath= path.join(_dirname, "../../data/studios.json");
const routerStudios = Router();

const readStudio = async()=>{
    try{
        const studios = await fs.readFile(studiosPath);
        return JSON.parse(studios);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
}
};

const writeStudio= async(studios)=>{
    await fs.writeFile(studiosPath, JSON.stringify(studios,null,2));
};

routerStudios.get("/", async function(req, res){
    const studios = await readStudio();
    res.json(studios);
});

routerStudios.get("/:studiosid", async (req, res)=>{
    const studios = await readStudio();
    const studio = studios.find((studio) => studio.id === parseInt(req.params.studiosid));
    if(!studio) return res.status(404).send("Studio de ánime no encontrado");
    res.json(studio);
}); 


routerStudios.post("/", async (req, res)=>{
    const studios = await readStudio();
    const newStudio = {
        id: studios.length + 1,
        name: req.body.name,
    };

    studios.push(newStudio);
    await writeStudio(studios);
    res.status(201).json({message:"El studio ha sido creado exitosamente", studio: newStudio});
});

routerStudios.put("/:studiosid", async (req, res)=>{
    const studios = await readStudio();
    const indexStudio = studios.findIndex(studio => studio.id === parseInt(req.params.studiosid));
    if(indexStudio === -1) return res.status(404).send("Studio no encontrado");
    const updateStudio = {
        ...studios[indexStudio],
        name: req.body.name, 
    }

    studios[indexStudio] = updateStudio;
    await writeStudio(studios);
    res.json({message:`Studio actualizado satisfactoriamente`, studio: updateStudio})

});

routerStudios.delete("/:studiosid", async (req, res)=>{
    const studios = await readStudio();
    const newStudio = studios.filter(studio => studio.id !== parseInt(req.params.studiosid));
    if(studios.length === newStudio.length) {
        return res.status(404).send("Studio no encontrado");
    }
    await writeStudio(newStudio);
    res.json({message:`Studio eliminado satisfactoriamente`});
})



export default routerStudios