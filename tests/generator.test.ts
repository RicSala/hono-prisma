import { describe, it, expect } from 'vitest';
import { generate } from '../src/generator/index.js';
import { mockGeneratorOptions } from './mockData.js';

describe('Generator Tests', () => {
  it('should generate routes without errors', async () => {
    await expect(generate(mockGeneratorOptions)).resolves.not.toThrow();
  });
});
