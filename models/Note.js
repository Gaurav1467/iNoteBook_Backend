const mongoose = require('mongoose');

const { Schema } = mongoose;


const NotesSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        require: true
    },

    description: {
        type: String,
        requrie: true
    },

    tag: {
        type: String,
        default : "General"
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('notes', NotesSchema);