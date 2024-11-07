import { describe, it, expect } from 'vitest';
import { generateRoutes } from '../src/generator/index.js';

describe('Generator', () => {
  it('should be properly configured', () => {
    expect(true).toBe(true);
  });

  it('should handle basic schema input', () => {
    const mockInput = {
      schema: `
                model User {
                    id    Int     @id @default(autoincrement())
                    email String  @unique
                    name  String?
                }
            `,
    };
    const result = generateRoutes(mockInput.schema);
    expect(result.success).toBe(true);
    expect(result.schema).toContain('model User');
  });
});
