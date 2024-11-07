import { GeneratorOptions } from '@prisma/generator-helper';

export // Mock data for testing
const mockGeneratorOptions: GeneratorOptions = {
  datasources: [],
  version: '5.0.0',
  generator: {
    sourceFilePath: './prisma/schema.prisma',
    name: 'hono',
    provider: { value: 'hono', fromEnvVar: null },
    output: { value: './generated', fromEnvVar: null },
    config: {},
    binaryTargets: [],
    previewFeatures: [],
  },
  otherGenerators: [],
  schemaPath: './prisma/schema.prisma',
  dmmf: {
    mappings: {
      modelOperations: [],
      otherOperations: {
        read: [],
        write: [],
      },
    },
    schema: {
      inputObjectTypes: {
        model: [],
        prisma: [],
      },
      outputObjectTypes: {
        model: [],
        prisma: [],
      },
      enumTypes: {
        model: [],
        prisma: [],
      },
      fieldRefTypes: {
        prisma: [],
      },
    },
    datamodel: {
      enums: [],
      types: [],
      indexes: [],
      models: [
        {
          name: 'User',
          dbName: null,
          fields: [
            {
              kind: 'scalar',
              name: 'id',
              isRequired: true,
              isList: false,
              isUnique: true,
              isId: true,
              isReadOnly: false,
              type: 'Int',
              hasDefaultValue: true,
              default: { name: 'autoincrement', args: [] },
              isGenerated: false,
              isUpdatedAt: false,
            },
            // Add other fields as needed
          ],
          primaryKey: { name: 'id', fields: ['id'] },
          uniqueFields: [],
          uniqueIndexes: [],
          documentation: '',
        },
        // Add other models as needed
      ],
    },
  },
  datamodel: `
    model User {
      id        Int      @id @default(autoincrement())
      email     String   @unique
      name      String?
      posts     Post[]
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    
    model Post {
      id        Int      @id @default(autoincrement())
      title     String
      content   String?
      published Boolean  @default(false)
      author    User     @relation(fields: [authorId], references: [id])
      authorId  Int
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
  `,
};
