const mongoose = require('mongoose');

const {Schema} = mongoose;

const blogSchema = new Schema({
    title : {type : 'string', required : true},
    content : {type: 'string', required : true},
    photopath : {type: 'string', required : true},
    author : {type: mongoose.SchemaTypes.ObjectId,ref: 'User'}
},{ timestamps: true });

module.exports = mongoose.model('Blog', blogSchema, 'blogs')