import express from "express";

const app = express;

app.get ("/api/ares", (req,res) =>{
    res.send("Api funcionando");
});

app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});