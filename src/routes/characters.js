import {Router} from 'express';
import {promises as fs}  from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const charactersPath=path.join(_dirname, "../../data/characters.json");

const routerCharacters=Router();

const readCharacters=async()=>{
    try{
        const characters = await fs.readFile(charactersPath)
        return JSON.parse(characters);
    }catch(err){
        throw new Error(`Error en la promesa ${err}`);
    }
};

const writeCharacters=async(characters)=>{
    await fs.writeFile(charactersPath, JSON.stringify(characters, null, 2));
};

routerCharacters.get("/", async (req, res)=>{
    const characters = await readCharacters();
    res.json(characters);
});

routerCharacters.get("/:characterid", async (req, res)=>{
    const characters = await readCharacters(req, res);
    const character = characters.find(character=>character.id === parseInt(req.params.characterid));
    if(!character) return res.status(404).send ("Personaje no encontrado");
    res.json(character)
   
});


routerCharacters.post("/", async (req, res)=>{
    const characters =await readCharacters();
    const newCharacter = {
        id: characters.length +1,
        name: req.body.name,
        animeid: req.body.anime
    }
    characters.push(newCharacter);
    await writeCharacters(characters);
    res.status(201).json({message: "Personaje creado satisfactoriamente", character: newCharacter});
});

routerCharacters.put("/:id", async (req, res)=>{
    const characters= await readCharacters();
    const indexCharacter = characters.findIndex(character=>character.id === parseInt(req.params.id));
    if(indexCharacter===-1) return res.status(404).send("Personaje no encontrado");
    const updateCharacter={
        id: parseInt(req.params.id),
        name: req.body.name,
        animeid: req.body.anime
    }
    characters[indexCharacter] = updateCharacter;
    await writeCharacters(characters);
    res.json({message: "Personaje actualizado satisfactoriamente", character: updateCharacter});

});

routerCharacters.delete("/:id", async (req, res)=>{
    const characters = await readCharacters();
    const newCharacters = characters.filter(character => character.id !== parseInt(req.params.id));
    if (newCharacters.length === characters.length){ 
        return res.status(404).send("Personaje no encontrado")
    }
    await writeCharacters(newCharacters);
    res.json({message: "Personaje eliminado satisfactoriamente"});
});


export default routerCharacters;