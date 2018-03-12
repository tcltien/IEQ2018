'use strict'

class User {

    constructor(_id, name, phone, imageSource, dateTime) {
        this._id = _id;
        this.name = name;
        this.phone = phone;
        this.imageSource = imageSource;
        this.dateTime = dateTime;
    }

}
module.exports = User;