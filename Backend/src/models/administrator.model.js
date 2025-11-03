import { Schema, model } from 'mongoose';

// create the model with its respective attributes and data types
const administratorSchema = new Schema({
    carnet:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

// constructor using the model previously created
const Administrator = model('Administrator', administratorSchema);

export { Administrator };