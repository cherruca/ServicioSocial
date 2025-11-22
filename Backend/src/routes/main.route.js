/*
	handle request routes according the entity
*/

import {administratorRouter} from './administrator.route.js';
import { projectRouter}  from './project.route.js';
import {studentRouter} from './student.route.js';
import { facultyRouter }  from './faculty.route.js';
import { careerRouter }  from './career.route.js';
import { petitionRouter }  from './petition.route.js';
import { userRouter }  from './user.route.js';
import { Router } from 'express';

const mainRouter = Router();

/*
	base routes to entities
*/
mainRouter.use('/administrator', administratorRouter);
mainRouter.use('/project', projectRouter);
mainRouter.use('/student', studentRouter);
mainRouter.use('/faculty', facultyRouter);
mainRouter.use('/career', careerRouter);
mainRouter.use('/petition', petitionRouter);
mainRouter.use('/user', userRouter);

export { mainRouter };

