import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { GeneratorOptions } from '@prisma/generator-helper';
import { createSourceFile } from './helpers/ts-morph.js';
import { generateErrorHandler } from './templates/middleware.js';
import { generateModelRoute } from './templates/modelRoute.js';
import { generateApiEntryPoint } from './templates/appRouter.js';
import { generateRoute } from './templates/route.js';

export async function generate(options: GeneratorOptions) {
  const outputDir = options.generator?.output?.value || './generated';
  const models = options.dmmf.datamodel.models;

  try {
    // Create output directories
    await mkdir(join(outputDir, 'routes'), { recursive: true });
    await mkdir(join(outputDir, 'middleware'), { recursive: true });

    try {
      // 1. createSourceFile creates an in-memory source file
      const middlewareFile = createSourceFile('error-handler.ts');
      const apiEntryPointFile = createSourceFile('appRouter.ts');
      const routeFile = createSourceFile('route.ts');
      // 2.a generateErrorHandler uses the writer to add code to the source file
      generateErrorHandler(middlewareFile);

      // 2.b generateApiEntryPoint uses the writer to add code to the source file
      generateApiEntryPoint(apiEntryPointFile, models);

      // 2.c generateRoute uses the writer to add code to the source file
      generateRoute(routeFile);

      // 3. writeFile writes the formatted content to disk
      await writeFile(
        join(outputDir, 'middleware', 'error-handler.ts'),
        middlewareFile.getFullText()
      );

      await writeFile(
        join(outputDir, 'api-entry-point.ts'),
        apiEntryPointFile.getFullText()
      );

      await writeFile(join(outputDir, 'route.ts'), routeFile.getFullText());

      // Generate routes for each model
      for (const model of models) {
        console.log(`Generating routes for model: ${model.name}`);

        const routeFile = createSourceFile(`${model.name.toLowerCase()}.ts`);
        generateModelRoute(routeFile, model);

        await writeFile(
          join(outputDir, 'routes', `${model.name.toLowerCase()}.ts`),
          routeFile.getFullText()
        );
      }
    } catch (tsError) {
      console.warn(
        'ts-morph failed, falling back to string templates:',
        tsError
      );
      // Here you could add fallback string template generation
      throw tsError; // For now, still throw the error
    }
  } catch (error) {
    console.error('Error generating files:', error);
    throw error;
  }
}
