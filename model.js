const mongoose = require("mongoose");

const tilderSchema = mongoose.Schema({
    name: String,
    description: String,
    done: Boolean,
    deadline: Date

});

const Tilder = mongoose.model("Tilder", tilderSchema)

let store = {};

module.exports = {
    Tilder,
    store,
};

