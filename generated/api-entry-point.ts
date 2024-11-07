import { Hono } from 'hono';
import userRouter from './routes/user.js';

const app = new Hono();
// Mount User routes
app.route('/user', userRouter);

export = app;
