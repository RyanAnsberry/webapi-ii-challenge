const express = require('express');

const db = require('./data/db.js');

const router = express.Router();


// Get an array of all posts // db.find()
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

// Create a new post // db.insert({ post.title = "", post.contents = "" })
router.post('/', async (req, res) => {
    try {
        const postInfo = req.body;
        if ( !postInfo.title || !postInfo.contents ) {
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
            })
        } else {
            const newPost = await db.insert(postInfo)
            res.status(201).json(newPost);
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        });
    }
})

// Update post // db.update( id, { changes.title = "", changes.contents = "" })
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingPost = await db.findById(id);
    if ( !existingPost.length > 0 ) {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    }
    const changes = req.body;
    console.log(changes)
    if ( !changes.title || !changes.contents ) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        const updatedPost = await db.update( id, changes)
        res.status(201).json(updatedPost);
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
  } catch (error) {
    res.status(500).json({
        error: "The post information could not be modified."
    });
  }
})

// Delete post via id // db.remove( id )
router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const existingPost = await db.findById(id);
        if ( !existingPost.length > 0 ) {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        } else {
           const deletedPost = await db.remove(id);
           res.status(204).json(deletedPost)
        }
    } catch (error) {
        res.status(500).json({
            error: "The post could not be removed"
        });
    }
})

// Get comments by post id // db.findPostComments( post_id )
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const existingPost = await db.findById(id);
        if ( !existingPost.length > 0 ) {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        const comments = await db.findPostComments(id);
        console.log(comments)
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({
            error: "The comments information could not be retrieved."
        });
    }
})

// Create a new comment // db.insertComment({ comment.text, comment.post_id})
router.post('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = req.body;
        console.log('comment', comment)
        const existingPost = await db.findById(id);
        if ( !existingPost.length > 0 ) {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        if(!comment.text) {
            res.status(400).json({
                errorMessage: "Please provide text for the comment."
            })
        }
        const commentWithId = {...comment, post_id: id};
        const newComment = await db.insertComment(commentWithId);
        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        });
    }
})

module.exports = router;