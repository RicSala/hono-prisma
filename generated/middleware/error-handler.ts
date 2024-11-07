import { MiddlewareHandler, Next, Context } from 'hono';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // Unique constraint violation
          return c.json({ error: 'Resource already exists' }, 409);
        case 'P2025': // Record not found
          return c.json({ error: 'Resource not found' }, 404);
        case 'P2003': // Foreign key constraint violation
          return c.json({ error: 'Invalid relation' }, 400);
        default:
          console.error('Database error:', error);
          return c.json({ error: 'Database error' }, 500);
      }
    }
    console.error('Unexpected error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
