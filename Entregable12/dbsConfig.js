import mongoose from "mongoose";


export const db = mongoose.connect("mongodb+srv://Marco:250236@cluster0.50sez.mongodb.net/?retryWrites=true&w=majority", 
{ useNewUrlParser: true })

const chatSchema = new mongoose.Schema({
    author: {type: Object, required: true },
    text: {type: String, required: true},
    time: {type: String, required: true}
}, {
    versionKey: false 
})

export const msgsModel = mongoose.model("Msgs", chatSchema);

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, max: 30},
    password: {type: String, required: true, max: 20},
    email: {type: String, required: true}
})

export const User = mongoose.model('Users', userSchema);
