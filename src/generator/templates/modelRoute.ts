import { SourceFile, StructureKind, VariableDeclarationKind } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';

export function generateModelRoute(sourceFile: SourceFile, model: DMMF.Model) {
  const modelName = model.name.toLowerCase();

  // Add imports
  sourceFile.addImportDeclarations([
    {
      namedImports: ['Hono'],
      moduleSpecifier: 'hono',
    },
    {
      namedImports: ['PrismaClient'],
      moduleSpecifier: '@prisma/client',
    },
    {
      namedImports: ['errorHandler'],
      moduleSpecifier: '../middleware/error-handler.js',
    },
  ]);

  // Add PrismaClient initialization
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        kind: StructureKind.VariableDeclaration,
        name: 'prisma',
        initializer: 'new PrismaClient()',
      },
    ],
  });

  // Add router initialization
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        kind: StructureKind.VariableDeclaration,
        name: `${modelName}Router`,
        initializer: 'new Hono()',
      },
    ],
  });

  // Add middleware
  sourceFile.addStatements(writer => {
    writer.writeLine(`${modelName}Router.use('*', errorHandler);`);
  });

  // GET all route
  sourceFile.addStatements(writer => {
    writer

      .writeLine(`${modelName}Router.get('/', async (c) => {`)
      .indent(() => {
        writer
          .writeLine(`const items = await prisma.${modelName}.findMany();`)
          .writeLine('return c.json(items);');
      })
      .writeLine('});');
  });

  // GET by id route
  sourceFile.addStatements(writer => {
    writer
      .writeLine(`${modelName}Router.get('/:id', async (c) => {`)
      .indent(() => {
        writer
          .writeLine(`const id = c.req.param('id');`)
          .writeLine(
            `const item = await prisma.${modelName}.findUniqueOrThrow({`
          )
          .indent(() => {
            writer.writeLine('where: { id: Number(id) }');
          })
          .writeLine('});')
          .writeLine('return c.json(item);');
      })
      .writeLine('});')
      .writeLine('');
  });

  // POST route
  sourceFile.addStatements(writer => {
    writer

      .writeLine(`${modelName}Router.post('/', async (c) => {`)
      .indent(() => {
        writer
          .writeLine('const body = await c.req.json();')
          .writeLine(`const item = await prisma.${modelName}.create({`)
          .indent(() => {
            writer.writeLine('data: body');
          })
          .writeLine('});')
          .writeLine('return c.json(item, 201);');
      })
      .writeLine('});');
  });

  // PUT route
  sourceFile.addStatements(writer => {
    writer

      .writeLine(`${modelName}Router.put('/:id', async (c) => {`)
      .indent(() => {
        writer
          .writeLine(`const id = c.req.param('id');`)
          .writeLine('const body = await c.req.json();')
          .writeLine(`const item = await prisma.${modelName}.update({`)
          .indent(() => {
            writer
              .writeLine('where: { id: Number(id) },')
              .writeLine('data: body');
          })
          .writeLine('});')
          .writeLine('return c.json(item);');
      })
      .writeLine('});');
  });

  // DELETE route
  sourceFile.addStatements(writer => {
    writer

      .writeLine(`${modelName}Router.delete('/:id', async (c) => {`)
      .indent(() => {
        writer
          .writeLine(`const id = c.req.param('id');`)
          .writeLine(`await prisma.${modelName}.delete({`)
          .indent(() => {
            writer.writeLine('where: { id: Number(id) }');
          })
          .writeLine('});')
          .writeLine('return c.json({ success: true });');
      })
      .writeLine('});');
  });

  // Export router
  sourceFile.addExportAssignment({
    expression: `${modelName}Router`,
    isExportEquals: false,
  });
}
