/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         capacity:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date-time
 *         finalDate:
 *           type: string
 *           format: date-time
 *         institution:
 *           type: string
 *         description:
 *           type: string
 *         administrators:
 *           type: array
 *           items:
 *             type: string
 */
import { Schema, model } from 'mongoose';

// create the model with its respective attributes and data types
const projectSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    capacity:{
        type: Number,
        required: true
    },
    startDate:{
        type: Date,
        default: Date.now()
    },
    finalDate:{
        type: Date,
        default: Date.now()
    },
    institution:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    administrators:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Administrator'
        }
    ]
})

// constructor using the model previously created
const Project = model('Project', projectSchema);

export { Project };

