class BlogDetailsDTO {
    constructor(blog) {
        this._id = blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.photo = blog.photopath;
        this.createdAt = blog.createdAt;
        this.authorName = blog.author.name;
        this.authorUserName = blog.author.username
    }
}

module.exports = BlogDetailsDTO;