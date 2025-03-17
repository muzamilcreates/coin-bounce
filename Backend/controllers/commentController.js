const Joi = require('joi');
const Comments = require('../models/comment.model');
const CommentDto = require("../dto/comment");

const mongodbExpresssion = /^[0-9a-fA-F]{24}$/; 



const commentController = {

    async create (req, res, next) {
        const createCommentSchema = Joi.object({
            content : Joi.string().required(),
            author : Joi.string().regex(mongodbExpresssion).required(),
            blog : Joi.string().regex(mongodbExpresssion).required()
        });

        const {error} = createCommentSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        const { content, author, blog } = req.body;

        try {
            const newComment = new Comments({
                content, author, blog
            });
            await newComment.save();
            
        } catch (error) {
            return next(error);
        }
        res.status(201).json({message: 'Comment created successfully'});
    },


    async getById (req, res, next) {
        const getByIdSchema = Joi.object({
            id : Joi.string().regex(mongodbExpresssion).required()
        });

        const {error} = getByIdSchema.validate(req.params);
        if(error) {
            return next(error);
        }

        const { id } = req.params;

        let comments;
        try {
            comments = await Comments.find({ blog: id }).populate("author");
        } catch (error) {
            return next(error);
        }

        let commentsDto = [];
        
        for (i = 0; i < comments.length; i++) {
            const obj = new CommentDto(comments[i]);
            commentsDto.push(obj);
        }

        return res.status(200).json({data: commentsDto});
    }
}


module.exports = commentController;