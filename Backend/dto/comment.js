class CommentDto {
    constructor (comment) {
        this._id = comment._id;
        this.content = comment.content;
        this.authorUsername = comment.author ? comment.author.username : "Unknown";
        this.createdAt = comment.createdAt;
    }
}


module.exports = CommentDto;