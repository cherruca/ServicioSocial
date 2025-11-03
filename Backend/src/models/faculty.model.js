import { Schema, model } from 'mongoose';

// create the model with its respective attributes and data types
const facultySchema = new Schema({
    name:{
        type: String,
        required: true
    }
})

// constructor using the model previously created
const Faculty = model('Faculty', facultySchema);

export { Faculty };
