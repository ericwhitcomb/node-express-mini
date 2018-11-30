const express = require('express');

const db = require('./data/db');

const server = express();
const PORT = 4000;

server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.status(500).json({message: "Failed to get users"});
        });
});

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
        .then((user) => {
            if (user) res.json(user);
            else res.status(404).json({message: "User does not exist"});
        })
        .catch((err) => {
            res.status(500).json({message: "Failed to get user"});
        });
});

server.post('/api/users', (req, res) => {
    const user = req.body;
    if (user.name && user.bio) {
        db.insert(user)
            .then(idObject => {
                db.findById(idObject.id)
                    .then(user => {
                        res.status(201).json(user);
                    });
            })
            .catch(err => {
                res.status(500).json({message: "Failed to create user"});
            })
    } else {
        res.status(400).json({message: "Missing name or bio"});
    }
});

server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});