import { SourceFile } from 'ts-morph';

export function generateErrorHandler(sourceFile: SourceFile) {
  sourceFile.addImportDeclarations([
    {
      namedImports: ['MiddlewareHandler', 'Next', 'Context'],
      moduleSpecifier: 'hono',
    },
    {
      namedImports: ['PrismaClientKnownRequestError'],
      moduleSpecifier: '@prisma/client/runtime/library',
    },
  ]);

  sourceFile.addFunction({
    name: 'errorHandler',
    isExported: true,
    isAsync: true,
    parameters: [
      { name: 'c', type: 'Context' },
      { name: 'next', type: 'Next' },
    ],
    statements: writer => {
      writer
        .writeLine(`try {`)
        .indent(() => {
          writer.writeLine(`await next();`);
        })
        .writeLine(`} catch (error) {`)
        .indent(() => {
          writer
            .writeLine(`if (error instanceof PrismaClientKnownRequestError) {`)
            .indent(() => {
              writer
                .writeLine(`switch (error.code) {`)
                .indent(() => {
                  writer
                    .writeLine(`case 'P2002': // Unique constraint violation`)
                    .indent(() =>
                      writer.writeLine(
                        `return c.json({ error: 'Resource already exists' }, 409);`
                      )
                    )
                    .writeLine(`case 'P2025': // Record not found`)
                    .indent(() =>
                      writer.writeLine(
                        `return c.json({ error: 'Resource not found' }, 404);`
                      )
                    )
                    .writeLine(
                      `case 'P2003': // Foreign key constraint violation`
                    )
                    .indent(() =>
                      writer.writeLine(
                        `return c.json({ error: 'Invalid relation' }, 400);`
                      )
                    )
                    .writeLine(`default:`)
                    .indent(() => {
                      writer
                        .writeLine(`console.error('Database error:', error);`)
                        .writeLine(
                          `return c.json({ error: 'Database error' }, 500);`
                        );
                    });
                })
                .writeLine(`}`);
            })
            .writeLine(`}`)
            .writeLine(`console.error('Unexpected error:', error);`)
            .writeLine(
              `return c.json({ error: 'Internal server error' }, 500);`
            );
        })
        .writeLine(`}`);
    },
  });
}
