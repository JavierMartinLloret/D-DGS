const express = require("express");
const DiagramModel = require("../models/diagram");
const Diagram = require("../models/diagram");

const DiagramRouter = new express.Router();

// Get All
DiagramRouter.get('/diagrams', async (req, res) => {
    try {
        const diagrams = await DiagramModel.find({});
        res.status(200).send(diagrams);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Get by Domain
DiagramRouter.get('/diagrams/domain/:key', async (req, res) => {
    try {
        const domainKey = req.params.key;
        const query = {"domain_key": domainKey};
        const diagrams = await DiagramModel.find(query);

        res.status(200).send(diagrams);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get One
DiagramRouter.get('/diagrams/:id', async (req, res) => {
    try {
        const DiagramID = req.params.id;
        const query = {"_id": DiagramID};
        const diagramSought = await DiagramModel.findOne(query);

        res.status(200).send(diagramSought);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Post One
DiagramRouter.post('/diagrams', async (req, res) =>{
    const diagramToPost = new DiagramModel(req.body);
    try {
        await diagramToPost.save();
        res.status(201).send(diagramToPost._id);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Update One
DiagramRouter.put('/diagrams/:id', async (req, res) => {
    try {
        const updatedDiagram = new DiagramModel(req.body);

        const query = {"_id": req.params.id};
        const update = {$set:{
            "lines": updatedDiagram.lines
        }};

        await DiagramModel.updateOne(query, update);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Delete One
DiagramRouter.delete('/diagrams/:id', async (req, res) => {
    try {
        const diagramID = req.params.id;
        const query = {"_id": diagramID};

        await DiagramModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// DOWNLOAD ENDPOINTS
DiagramRouter.get('/diagrams/download/:name', async (req,res) => {
    try {
        const fileName = req.params.name;
        const serverLocation = "/home/javier/TFG/D-DGS/D-DGS-Node"
        const directoryPath = serverLocation + "/src/diagrams/";
        console.log(JSON.parse(
            '{"URL":'+"www.penis.com/holiwi"+'}'
        ));
        res.status(200).send(directoryPath)
        //res.status(200).download(directoryPath + fileName, "yourDiagram");
        /*const a = 
        {
            directoryPath,
            style: "display:none",
            download: "YourDiagram",
        }
        res.download(a);*/
        
        //URL.revokeObjectURL(blob);

        /*
        const diagramID = req.params.id;
        const query = {"_id": diagramID};

        let diagramSought = await DiagramModel.findOne(query);

        res.status(200).send(diagramSought);*/

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = DiagramRouter;