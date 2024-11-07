import {
  IndentationText,
  NewLineKind,
  Project,
  QuoteKind,
  ManipulationSettings,
} from 'ts-morph';

// Define default formatting settings
const defaultSettings: ManipulationSettings = {
  quoteKind: QuoteKind.Single,
  indentationText: IndentationText.TwoSpaces,
  newLineKind: NewLineKind.LineFeed,
  useTrailingCommas: true,
  usePrefixAndSuffixTextForRename: false,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
};

// Create a single project instance to be reused
const project = new Project({
  useInMemoryFileSystem: true,
  skipFileDependencyResolution: true,
  manipulationSettings: defaultSettings,
  compilerOptions: {
    declaration: true,
    module: 99, // ESNext
    target: 99, // ESNext
    moduleResolution: 99, // Node16,
  },
});

// Helper to create source files with consistent settings
export function createSourceFile(filePath: string) {
  const sourceFile = project.createSourceFile(filePath, '', {
    overwrite: true,
  });

  // Ensure the source file uses the project's formatting settings
  sourceFile.formatText({
    indentSize: 2,
    ensureNewLineAtEndOfFile: true,
    convertTabsToSpaces: true,
  });

  return sourceFile;
}

// Export quote configuration for use in templates
export const quotes = {
  wrap: (str: string) => `'${str}'`,
};

// Helper to update formatting settings
export function updateFormattingSettings(
  settings: Partial<ManipulationSettings>
) {
  project.manipulationSettings.set({
    ...defaultSettings,
    ...settings,
  });
}
