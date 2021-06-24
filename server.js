/* This file is in charge of database connection*/
const propertyList = ['name','description', 'done' ,'deadline']

// import express so you can use it
const express = require('express');
const {store, Tilder} = require('./model')
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json({}));

// Get - get all
app.use((req, res, next)=>{
    console.log(
    "Time", 
    Date.now(), 
    " - Method: ", 
    req.method, 
    " - Path: ",
    req.originalUrl, 
    " - Body: ", 
    req.body);
    next();
})
app.get('/tilder', (req, res)=>{
    res.setHeader("Content-Type", "application/json");
    console.log(`Getting all tilders`);
    let findQuery = {};

    for (const property in propertyList){   
        if (req.query[propertyList[property]]){
            findQuery[propertyList[property]] = req.query[propertyList[property]];
        }
    }
    console.log(findQuery)
    Tilder.find(findQuery, (err, tilder)=>{
        if (err){
            console.log(`there was an error finding all the tilders`)
            res.status(500).send(
                JSON.stringify({message:`unable to find the tilders`,
                error:err})
            );
            return;
        }
        res.status(200).json(tilder);
    });
    //return all of the tilders in the store
});
// Get - get one
app.get('/tilder/:id', (req, res)=>{
    res.setHeader("Content-Type", "application/json");
    console.log(`Getting a tilder with id: ${req.params}`)
    Tilder.findById(req.params.id, (err, tilder)=>{
    if (err){
        console.log(`there was an error`)
        res.status(500).send(
            JSON.stringify({
                message: `unable to find tilder with id ${req.params.id}`,
                error:err,
            })
        );
        return;
    }else if (!tilder) {
        console.log(`there was an error`)
        res.status(500).send(
            JSON.stringify({
                message: `unable to find tilder with id ${req.params.id}`,
                error:"This tilder doesn't exist!",
            })
        );
        return;
    }
        res.status(200).json(tilder);
    });
})
// Post - post one
app.post('/tilder/', (req, res)=>{
    res.setHeader("Content-Type", "application/json");
    console.log(`creating a tilder with a body`, req.body)
    if (!(req.body.name && req.body.description)){
        res.status(500).send(JSON.stringify({
            message: "Unable to create tilder",
            error: "Description or name empty when creating tilder"
        })
        );
        return;
    }
    let creatingTilder = {
        name: req.body.name || "",
        description: req.body.description || "",
        done: req.body.done || false,
        deadline: req.body.deadline || new Date()
    }
    Tilder.create(creatingTilder,(err,tilder)=>{
        if (err) {
            console.log(`unable to create tilder`);
            res.status(500).json({
                message: "unable to create tilder",
                error: err,
            });
            return;
        }
        res.status(201).json(tilder)
    });
});
// Delete - delete one
app.delete('/tilder/:id', (req, res)=>{
    res.setHeader("Content-Type", "application/json");
    Tilder.findByIdAndDelete(req.params.id, (err, tilder)=>{
        if (err){
            console.log(`there was an error`)
            res.status(500).send(
                JSON.stringify({
                    message: `unable to find tilder with id ${req.params.id}`,
                    error:err,
                })
            );
            return;
        } else if (!tilder) {
            res.status(500).send(
                JSON.stringify({
                    message: `unable to find tilder with id ${req.params.id}`,
                    error: "this tilder doesn't exist!"
                })
            );
            return
        }
        res.status(200).json(tilder);
    });
})
// Patch - update
app.patch('/tilder/:id', (req, res)=>{
    res.setHeader("Content-Type", "application/json");
    let updateTilder = {}
    for (const property in propertyList){   
        if (req.body[propertyList[property]] || req.body[propertyList[property]] === false){
            updateTilder[propertyList[property]] = req.body[propertyList[property]];
        }
    }
    console.log("THIS IS AN UPDATE TILDER", updateTilder)
    Tilder.updateOne({_id: req.params.id}, updateTilder, function(err, updateOneResponse){
        if (err){
            console.log(`there was an error`)
            res.status(500).send(
                JSON.stringify({
                    message: `unable to find tilder with id ${req.params.id}`,
                    error:err,
                })
            );
            return;
        } else if (updateOneResponse === 0) {
            res.status(404).send(
                JSON.stringify({
                    message: `unable to find tilder with id ${req.params.id}`,
                    error: "this tilder doesn't exist!"
                })
            );
            return
        }
        res.status(200).send("Success updating!")
    })
})
// Put - replace
app.put('/tilder/:id', (req, res)=>{
    res.setHeader("Content-Type", "application/json");
    if (!(req.body.name && req.body.description)){
        res.status(500).send(JSON.stringify({
            message: "Unable to put tilder",
            error: "Description or name empty when putting tilder"
        })
        );
        return;
    }
    let updateTilder = {
        name: req.body.name || "",
        description: req.body.description || "",
        done: req.body.done || false,
        deadline: req.body.deadline || new Date()
    }
    Tilder.updateOne({_id: req.params.id}, updateTilder, function(err, updateOneResponse){
        if (err){
            console.log(`there was an error`)
            res.status(500).send(
                JSON.stringify({
                    message: `unable to find tilder with id ${req.params.id}`,
                    error:err,
                })
            );
            return;
        } else if (updateOneResponse === 0) {
            res.status(404).send(
                JSON.stringify({
                    message: `unable to find tilder with id ${req.params.id}`,
                    error: "this tilder doesn't exist!"
                })
            );
            return
        }
        res.status(200).json(updateTilder)
    })
})
module.exports = app;
//---------------------------------
