import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from '../middleware/error-handler.js';

const prisma = new PrismaClient();
const userRouter = new Hono();
userRouter.use('*', errorHandler);
userRouter.get('/', async (c) => {
  const items = await prisma.user.findMany();
  return c.json(items);
});
userRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const item = await prisma.user.findUniqueOrThrow({
    where: { id: Number(id) }
  });
  return c.json(item);
});
userRouter.post('/', async (c) => {
  const body = await c.req.json();
  const item = await prisma.user.create({
    data: body
  });
  return c.json(item, 201);
});
userRouter.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const item = await prisma.user.update({
    where: { id: Number(id) },
    data: body
  });
  return c.json(item);
});
userRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await prisma.user.delete({
    where: { id: Number(id) }
  });
  return c.json({ success: true });
});

export default userRouter;
