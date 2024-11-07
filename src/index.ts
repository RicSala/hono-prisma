import pkg from '@prisma/generator-helper';
import { generate } from './generator/index.js';
const { generatorHandler } = pkg;

const generator = {
  onManifest() {
    return {
      defaultOutput: './generated',
      prettyName: 'Prisma Hono Generator',
    };
  },
  async onGenerate(options: pkg.GeneratorOptions) {
    await generate(options);
  },
};

generatorHandler(generator);
