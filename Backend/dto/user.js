class UserDTO {
    constructor(user) {
        this._id = user.id;
        this.name = user.name;
    }
}

module.exports = UserDTO;