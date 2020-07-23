const express = require('express');
const app = express();
const pgp = require("pg-promise")();
const port = 5005;
const connect = require('./config')
const path = require('path')
const db = pgp(connect);
app.use(express.urlencoded({extended: true}));
// app.get("/tasks", (req,res)=>{
//     db.any("SELECT * from TASKS").then((tasks) => res.send(tasks));
// })
//these two are the same
app.get("/tasks", async (req,res)=>{
    const data = await db.any('SELECT * FROM tasks')
    res.json(data)
})
///
app.get("/new-task", (req,res)=>{
    res.sendFile(__dirname + path.join("/newTask.html"))
})
app.post("/new-task", async (req,res)=>{
    // console.log(req.body);
    if(!req.body.title) return res.send('You must supply a title.');
    let result = await db.one(`INSERT INTO tasks (title) VALUES ('${req.body.title}') RETURNING *`);
    // console.log(result);
    res.send(result)
});

app.patch('/edit-task/:id/complete_task', async (req,res)=>{
    let result = await db.one(`
        UPDATE tasks 
        SET is_completed = 'true' 
        WHERE id='${req.params.id}' RETURNING *
    `)
})
app.patch('edit-task/:id/title',)


app.listen(port, () => {
    console.log(`This app is running on http://localhost:${port}`);
  });