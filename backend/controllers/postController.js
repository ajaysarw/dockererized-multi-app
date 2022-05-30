const { PostModel } = require("../models/posts");

const mongoose = require('mongoose');

exports.getAllPosts = async (req, res, next) => {

    try {
        const posts = await PostModel.find();
        res.status(200).send({
            status: 'success',
            results: posts.length,
            data: {
                posts
            }
        })
    } catch (error) {
        res.status(400).send({
            status: 'fail',
            data: error
        });
    }
}

exports.getPost = async (req, res, next) => {
    const resonse = await processRequestedId(req, res, next);

    if (!resonse) {
        // validate request data
        return res.status(400).send({
            status: 'Not found!',
            results: 0,
            data: {}
        })

    } else {

        try {
            const post = await PostModel.findById(req.params.id);
            res.status(200).send({
                status: 'success',
                results: post.length,
                data: { post }
            })
        } catch (error) {
            console.log(error);
            res.status(400).send({
                status: 'fail',
                data: error
            });
        }
    }
}

exports.createPost = async (req, res, next) => {
    // validate request data
    const post = await PostModel.create(req.body);
    try {
        res.status(200).send({
            status: 'success',
            results: post.length,
            data: { post }
        })
    } catch (error) {
        res.status(400).send({
            status: 'fail',
            data: error
        });
    }
}

exports.updatePost = async (req, res, next) => {
    const resonse = await processRequestedId(req, res, next);

    if (!resonse) {
        // validate request data
        return res.status(400).send({
            status: 'Not found!',
            results: 0,
            data: {}
        })
    } else {
       // validate request body

        const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        });

        try {
            res.status(200).send({
                status: 'success',
                results: post.length,
                data: { post }
            })
        } catch (error) {
            res.status(400).send({
                status: 'fail',
                data: error
            });
        }
    }
}

exports.deletePost = async (req, res, next) => {

    const response = await processRequestedId(req, res, next);
    
    if (!response) {
        return res.status(400).send({
            status: 'Not found!',
            results: 0,
            data: {}
        })
    } else {
        // validate request data
        const post = await PostModel.findOneAndDelete(req.params.id);

        try {
            res.status(200).send({
                status: 'success',
                results: post.length,
                data: { post }
            })
        } catch (error) {
            res.status(400).send({
                status: 'fail',
                data: error
            });
        }
    }

}

const processRequestedId = async (req, res, next) => {
    const validID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (validID) {
        const post = await PostModel.findById(req.params.id);
        if (post && validID) {
            return true;
        }
    } else {
        return false;
    }

}
