const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js")
const methodOverride = require("method-override");

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
    .then((res) =>{
        console.log("connection sucessful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// INDEX ROUTE:
app.get("/chats", async(req,res)=>{
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs",{chats});
})

// NEW ROUTE:
app.get("/chats/new",(req,res) =>{
    // console.log("You are on the new chats page");
    res.render("new.ejs");
});

// CREATE ROUTE:
app.post("/chats",(req,res) =>{
    let {from, to, msg} = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });

    newChat
        .save()
        .then(res => {
            console.log("Chats was saved");
        })
        .catch(err =>{
            console.log(err);
        });

    res.redirect("/chats");
});

// EDIT ROUTE:
app.get("/chats/:id/edit",async (req,res) =>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{ chat });
});

// UPDATE ROUTE:
app.put("/chats/:id", async (req, res)=>{
    let { id } = req.params;
    let {msg: newMsg } = req.body;
    newMsg = newMsg.replace(/\s+/g, ' ').trim();
    let updatedChat = await Chat.findByIdAndUpdate( id, 
        {msg: newMsg},
        {runValidator: true, new: true} );
    
    console.log(updatedChat);
    res.redirect("/chats");
});

// DESTROY ROUTE:
app.delete("/chats/:id",async (req,res) =>{
    let { id } = req.params;
    let delChat = await Chat.findByIdAndDelete(id);
    console.log(delChat);
    res.redirect("/chats")
});

// HOME ROUTE:
app.get("/",(req,res) =>{
    res.render("home.ejs");
});

// APP CONNECTION/ BACKEND CONNECTION:
app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
});



