import { SourceFile } from 'ts-morph';

export function generateRoute(sourceFile: SourceFile) {
  sourceFile.addImportDeclarations([
    // import the app and the handle
    {
      namedImports: ['handle'],
      moduleSpecifier: 'hono/vercel',
    },
    {
      defaultImport: 'app',
      moduleSpecifier: './api-entry-point.js',
    },
  ]);

  sourceFile.addStatements(writer => {
    writer.blankLine();
    writer.writeLine(`export const OPTIONS = handle(app);`);
    writer.writeLine(`export const GET = handle(app);`);
    writer.writeLine(`export const POST = handle(app);`);
    writer.writeLine(`export const PUT = handle(app);`);
    writer.writeLine(`export const PATCH = handle(app);`);
    writer.writeLine(`export const DELETE = handle(app);`);
  });
}
