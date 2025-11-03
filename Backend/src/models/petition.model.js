import { Schema, model } from 'mongoose';

// create the model with its respective attributes and data types
const petitionSchema = new Schema({
    date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: Boolean,
        required: true
    },
    students:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        }
    ],
    projects:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    administrators:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Administrator'
        }
    ]
})

// constructor using the model previously created
const Petition = model('Petition', petitionSchema);

export { Petition };

