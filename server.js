const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

// Get an array of all posts // db.find()
server.get('/api/posts', async (req, res) => {
    try {
        const posts = await db.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            error: "The posts information could not be retrieved."
        });
    }
});

// Get post by id // db.findById(id)
server.get('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await db.findById(id);
        if ( posts && posts.length > 0 ) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "The post information could not be retrieved."
        });
    }
});

module.exports = server;