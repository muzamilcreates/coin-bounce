const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog.model");
const { BACKEND_SERVER_PATH } = require("../config/index");
const BlogDTO = require("../dto/blog");
const BlogDetailDTO = require("../dto/blog-detail");
const Coment = require('../models/comment.model');


const mongodbExpresssion = /^[0-9a-fA-F]{24}$/; 

const blogController = {
    // Create a new blog
    // handle photo storage , naming
    // cleint-side -> base64 encoded string -> decoded -> store -> save photo's path in db 
    // return response 
    
    async create (req, res, next) {
        const createBlogSchema = Joi.object({
            title : Joi.string().required(),
            author : Joi.string().regex(mongodbExpresssion).required(),
            content : Joi.string().required(),
            photo : Joi.string().required()
        });

        const {error} = createBlogSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        const {title, author, content, photo} = req.body;
        
        // read as buffer
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

        //allot a random name 
        const imagePath = `${Date.now()}-${author}.png`;

        //save locally 
        try{
            await fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch(error){
            return next(error);
        }

        let newBlog;
        // save blog in db
        try {
            newBlog = new Blog({
                title,
                author,
                content,
                photopath : `${BACKEND_SERVER_PATH}/storage/${imagePath}`
            });
            await newBlog.save();
        } catch (error){
            return next(error);
        }

        const blogDto = new BlogDTO(newBlog);
        res.status(201).json({blog: blogDto});

    },

    // Get all blogs
    async getAll (req, res, next) {
        try {
            const blogs = await Blog.find({});

            const blogDto = [];
            for (let i = 0; i < blogs.length; i++) {
                const dto = new BlogDTO(blogs[i]);
                blogDto.push(dto);
            }

            return res.status(200).json({blog: blogDto});

        } catch (error) {
            return next(error);
        }
    },

    // Get a blog by id
    async getById (req, res, next) {

        /// validate id 
        // response

        const getByIdSchema =  Joi.object({
            id : Joi.string().regex(mongodbExpresssion).required()
        });

        const {error} = getByIdSchema.validate(req.params);
        if(error) {
            return next(error);
        }

        let blog;
        const { id } = req.params;
        try {
            blog = await Blog.findOne({_id: id}).populate("author"); // we can also be use select query at here instead of dto
        } catch (error) {
            return next(error);
        }

        const blogDetailDto = new BlogDetailDTO(blog);
        res.status(200).json({blog: blogDetailDto});
    },

    // Update a blog
    async update (req, res, next) {
        // validate

        const updateBlogSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbExpresssion).required(),
            blogId: Joi.string().regex(mongodbExpresssion).required(),
            photo: Joi.string()
        });

        const { error } = updateBlogSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        const { title, content, author, blogId, photo } = req.body;

        let blog;
        try {
            blog = await Blog.findOne({_id: blogId});
        } catch (error) {
            return next(error);
        }

        if (photo) {
            let prevPhoto = blog.photopath;
            prevPhoto = prevPhoto.split('/').at(-1);

            // delete the photo
            fs.unlinkSync(`storage/${prevPhoto}`);
            // read as buffer
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

            //allot a random name 
            const imagePath = `${Date.now()}-${author}.png`;

                //save locally 
            try{
                 fs.writeFileSync(`storage/${imagePath}`, buffer);
            } catch(error){
                return next(error);
            }

            await Blog.updateOne({_id:blogId},
                {title, content, photopath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`}
            );
        }
        else {
            await Blog.updateOne({_id: blogId},
                {title, content}
            );
        }
        res.status(200).json({message: 'Blog updated successfully'});
    },

    // Delete a blog
    async delete (req, res, next) {
        // validate id
        // delete blog
        // delete coment on this blog

        const deleteBlogSchema = Joi.object({   
            id : Joi.string().regex(mongodbExpresssion).required(),
        });
        const { error } = deleteBlogSchema.validate(req.params);

        if(error) {
            return next(error);
        }

        const { id } = req.params;

        try {
            // delete blog
            await Blog.deleteOne({_id: id});

            // delete coment on this blog
            await Coment.deleteMany({blog: id});

        } catch (error) {
            return next(error);
        }

        return res.status(200).json({message: "Blog deleted successfully"})

    }
}

module.exports = blogController;