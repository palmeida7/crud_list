const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const connect = require('./config');
const path = require("path");
const db = pgp(connect);

const port = 5005;

//app.use(express.urlencoded({extended:true}))
//app.use(express.json);
app.use(express.json())

app.get("/", (req,res)=>res.sendFile(__dirname + path.join("/site/index.html")))

app.get("/tasks", async (req, res)=>{
    const data = await db.any('SELECT * FROM tasks');
    res.json(data)
})

app.get("/new-task", (req,res)=>res.sendFile(__dirname + path.join("/site/newTask.html")))

app.post("/new-task", async (req, res)=>{
    if(!req.body.title) return res.send('You must supply a title.');
    let result = await db.one(`INSERT INTO tasks (title) VALUES ('${req.body.title}') RETURNING *`)
    res.send(result)
})

app.patch('/edit-task/:id/complete_task', async (req,res)=>{
    let result = await db.one(`
        UPDATE tasks 
        SET is_completed = 'true' 
        WHERE id='${req.params.id}' RETURNING *
    `);
    res.send(result);
})

app.patch('/edit-task/:id/title', )

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
})