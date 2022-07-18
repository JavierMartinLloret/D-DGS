const express = require("express");
const DiagramModel = require("../models/diagram");
const FileSystem = require('fs');
const xml2js = require('xml2js');

const diagramFilesPath = './src/downloadble_files/';

const DownloadsRouter = new express.Router();

// TODO: Borrar el fichero local una vez se ha completado la descarga.
DownloadsRouter.get('/downloads/diagrams/json/:id', async (req, res) => {
    var diagramID, diagram;
    try {
        diagramID = req.params.id;
        diagram = await DiagramModel.findOne({"_id": diagramID});
    } catch (error) {
        res.status(500).send(error);
    }

    var fileName = diagram.name +".json";

    try {
        FileSystem.writeFileSync(diagramFilesPath+fileName, JSON.stringify(diagram), (err) => {
            if(err) throw err;
        });
        res.status(200).download(diagramFilesPath+fileName, fileName);
    } catch (error) {
        console.log("Error al escribir el fichero" + error);
    }
});

DownloadsRouter.get('/downloads/diagrams/xml/:id', async (req, res) => {
    var diagramID, diagram;
    try {
        diagramID = req.params.id;
        diagram = await DiagramModel.findOne({"_id": diagramID});
    } catch (error) {
        res.status(500).send(error);
    }

    var fileName = diagram.name +".xml";
    let xmlBuilder = new xml2js.Builder();

    try {
        FileSystem.writeFileSync(diagramFilesPath+fileName, xmlBuilder.buildObject(JSON.stringify(diagram)), (err) => {
            if(err) throw err;
        });
        res.status(200).download(diagramFilesPath+fileName, fileName);
    } catch (error) {
        console.log("Error al escribir el fichero" + error);
    }
})


DownloadsRouter.get('/downloads/diagrams/sidhi/:id', async (req, res) => {
    console.log("TEST");
})

module.exports = DownloadsRouter;