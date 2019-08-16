const express = require('express');

const cors = require('cors');

const PostsRouter = require('./posts-router.js');

const server = express();

server.use(express.json());
server.use(cors({}));
server.use('/api/posts', PostsRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Web Api II Challenge</h2>`)
})

module.exports = server;