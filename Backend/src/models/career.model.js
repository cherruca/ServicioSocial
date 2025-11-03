import { Schema, model } from 'mongoose';

// create the model with its respective attributes and data types
const careerSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    faculty:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Faculty'
        }
    ]
})

// constructor using the model previously created
const Career = model('Career', careerSchema);

export { Career };
