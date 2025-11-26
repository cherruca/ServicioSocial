/**
 * @openapi
 * components:
 *   schemas:
 *     Petition:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         students:
 *           type: array
 *           items:
 *             type: string
 *         projects:
 *           type: array
 *           items:
 *             type: string
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         rejectionReason:
 *           type: string
 *
 */
import { Schema, model } from 'mongoose';

// create the model with its respective attributes and data types
const petitionSchema = new Schema({
    date:{
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['pending','approved','rejected'],
        default: 'pending',
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
    
    approvedAt: {
        type: Date,
        required: false
    },
    rejectionReason: {
        type: String,
        required: false
    }
})

// constructor using the model previously created
const Petition = model('Petition', petitionSchema);

export { Petition };

