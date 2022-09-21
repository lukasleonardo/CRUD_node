const mongoose = require("mongoose")

const Schema = mongoose.Schema


const Posts = new Schema({
        titulo:{
            type:String,
            required:true
        },
        slug:{
            type: String,
            required:true
        },
        description:{
            type: String,
            required:true
        },
        conteudo:{
            type:String,
            required:true
        },
        categoria:{
            type: Schema.Types.ObjectId,
            ref:"categories",
            required:true
        },
        date:{
            type:Date,
            default: Date.now()
        }

})

mongoose.model('posts',Posts)