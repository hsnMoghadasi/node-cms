const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();
const server = http.createServer(app);
const session = require("express-session");
const path = require("path");
const { Schema } = require("mongoose");
const { mongoose } = require("./db/mongoose");
const { AdminUser } = require("./model/adminUser");
const { Posts } = require("./model/posts");

app.use(express.static(path.join(__dirname, "public")));

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({ secret: "user login", resave: false, saveUninitialized: false })
);

app.post("/api/newUser", (req, res) => {
    let newAdminUser = new AdminUser({
        firsName: req.body.firsName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        registerDate: new Date()
    });

    newAdminUser.save().then(
        document => {
            // when user currently added
            req.session.userId = document._id;
            res.json({
                status: "ok",
                userId: document._id
            });
        },
        error => {
            // when user didn't add
            if (error.name === "ValidationError") {
                res.json({
                    status: "ValidationError"
                });
            } else if (error.name === "MongoError") {
                res.json({
                    status: "duplicate"
                });
            }
        }
    );
});

app.post("/api/loginUser", (req, res) => {
    AdminUser.find({
        userName: req.body.userName,
        password: req.body.password
    }).then(document => {
        if (document.length > 0) {
            req.session.userId = "" + document[0]._id;
            res.json({
                status: "ok",
                userId: document[0]._id
            });
        } else {
            res.json({
                status: "authenticationFailed"
            });
        }
    });
});

app.post("/api/userInfo", (req, res) => {
    let session = req.session;

    AdminUser.find({
        _id: session.userId
    }).then(document => {
        res.json({
            status: "ok",
            firsName: document[0].firsName,
            lastName: document[0].lastName,
            userName: document[0].userName,
            email: document[0].email
        });
    });
});

app.post("/api/newPost", (req, res) => {
    let session = req.session;

    let newPost = new Posts({
        userId: session.userId,
        title: req.body.title,
        context: req.body.context,
        image: req.body.image,
        dataPost: new Date()
    });

    newPost.save().then(document => {
        res.json({
            status: "ok"
        });
    });
});

app.post("/api/getAllPost", (req, res) => {
    Posts.find({}).then(document => {
        res.json(document);
    });
});

app.post('/api/logOut',(req,res)=>{
    req.session.destroy();
    res.json({
        status:'ok'
    })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/login", (req, res) => {
    let sess = req.session;
    if (typeof sess.userId === "undefined") {
        res.sendFile(path.join(__dirname, "public/login.html"));
    } else {
        res.redirect("/context");
    }
});

app.get("/context", (req, res) => {
    let sess = req.session;
    let userId = sess.userId;

    if (typeof userId === "undefined") {
        res.redirect("/login");
    } else {
        res.sendFile(path.join(__dirname, "public/context.html"));
    }
});

server.listen(3000, function() {
    console.log("listening on *:3000");
});
