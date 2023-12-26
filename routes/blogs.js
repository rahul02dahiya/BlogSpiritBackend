const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Blogs = require("../models/Blogs")
const { body, validationResult } = require('express-validator');

// Route-1 // Get all user's blogs using GET "api/blogs/fetchallblogs" Login required
router.get('/fetchallblogs', fetchuser, async (req, res) => {

    try {
        const blogs = await Blogs.find({  })
        res.json(blogs)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("SOme error occured")
    }

})

router.get('/fetchmyblogs', fetchuser, async (req, res) => {

    try {
        const blogs = await Blogs.find({ user: req.user.id })
        res.json(blogs)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("SOme error occured")
    }

})


// Route-2 // adding blogs using POST "api/blogs/addblogs" Login required
router.post('/addblogs', fetchuser, [
    body("title", "enter a valid title").isLength({ min: 2 }),
    body("description", "Description must be atleast 5 characters long").isLength({ min: 5 })
], async (req, res) => {

    try {
        // If there are errors return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const blog = new Blogs({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user.id
        })
        const savedBlog = await blog.save()

        res.json(savedBlog)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("SOme error occured")
    }

})

// Route-3 // Updating existing blog using POST "api/blogs/updateblogs" Login required
router.put('/updateblogs/:id', fetchuser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        const newBlog = {}
        if (title) { newBlog.title = title }
        if (description) { newBlog.description = description }
        if (tag) { newBlog.tag = tag }


        let blog = await Blogs.findById(req.params.id)

        if (!blog) {
            return res.status(404).send("Access not allowed");
        }

        if (blog.user.toString() != req.user.id) {
            return res.status(404).send("Access not allowed");
        }
        // Find the blog and update
        blog = await Blogs.findByIdAndUpdate(req.params.id, { $set: newBlog }, { new: true })
        res.json({ blog })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("SOme error occured")
    }

})

// Route-4 // Deleting existing blog using DELETE "api/blogs/deleteblogs" Login required
router.delete('/deleteblogs/:id', fetchuser, async (req, res) => {

    try {

        // Find the blog
        let blog = await Blogs.findById(req.params.id)
        // chech weaher blog exist or not
        if (!blog) {
            return res.status(404).send("Access not allowed");
        }
        // Check if user owns this blog
        if (blog.user.toString() != req.user.id) {
            return res.status(404).send("Access not allowed");
        }

        blog = await Blogs.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Blog deleted" })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("SOme error occured")
    }

})



module.exports = router;