import { SourceFile, VariableDeclarationKind } from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';

export function generateApiEntryPoint(
  sourceFile: SourceFile,
  models: ReadonlyArray<DMMF.Model>
) {
  // Add imports
  sourceFile.addImportDeclarations([
    {
      namedImports: ['Hono'],
      moduleSpecifier: 'hono',
    },
    ...Array.from(models).map(model => ({
      defaultImport: `${model.name.toLowerCase()}Router`,
      moduleSpecifier: `./routes/${model.name.toLowerCase()}.js`,
    })),
  ]);

  // Create root app
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'app',
        initializer: 'new Hono()',
      },
    ],
  });

  // Add routes for each model
  sourceFile.addStatements(writer => {
    Array.from(models).forEach(model => {
      const modelName = model.name.toLowerCase();
      writer
        .writeLine(`// Mount ${model.name} routes`)
        .writeLine(`app.route('/${modelName}', ${modelName}Router);`)
        .blankLine();
    });
  });

  sourceFile.addExportAssignment({
    expression: 'app',
  });
}
