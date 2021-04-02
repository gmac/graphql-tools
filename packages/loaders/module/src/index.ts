import { parse, isSchema } from 'graphql';
import {
  UniversalLoader,
  fixSchemaAst,
  getDocumentNodeFromSchema,
  SingleFileOptions,
  Source,
} from '@graphql-tools/utils';

const InvalidError = new Error(`Imported object was not a string, DocumentNode or GraphQLSchema`);
const createLoadError = (error: any) =>
  new Error('Unable to load schema from module: ' + `${error.message || /* istanbul ignore next */ error}`);

// module:node/module#export
function extractData(
  pointer: string
): {
  modulePath: string;
  exportName?: string;
} {
  const parts = pointer.replace(/^module\:/i, '').split('#');

  if (!parts || parts.length > 2) {
    throw new Error('Schema pointer should match "module:path/to/module#export"');
  }

  return {
    modulePath: parts[0],
    exportName: parts[1],
  };
}

/**
 * * This loader loads documents and type definitions from a Node module
 *
 * ```js
 * const schema = await loadSchema('module:someModuleName#someNamedExport', {
 *   loaders: [new ModuleLoader()],
 * })
 * ```
 */
export class ModuleLoader implements UniversalLoader {
  loaderId() {
    return 'module-loader';
  }

  async canLoad(pointer: string) {
    return this.canLoadSync(pointer);
  }

  canLoadSync(pointer: string) {
    return typeof pointer === 'string' && pointer.toLowerCase().startsWith('module:');
  }

  async load(pointer: string, options: SingleFileOptions) {
    try {
      const result = this.parse(pointer, options, await this.importModule(pointer));

      if (result) {
        return result;
      }

      throw InvalidError;
    } catch (error) {
      throw createLoadError(error);
    }
  }

  loadSync(pointer: string, options: SingleFileOptions) {
    try {
      const result = this.parse(pointer, options, this.importModuleSync(pointer));

      if (result) {
        return result;
      }

      throw InvalidError;
    } catch (error) {
      throw createLoadError(error);
    }
  }

  private parse(pointer: string, options: SingleFileOptions, importedModule: any): Source | void {
    if (isSchema(importedModule)) {
      const schema = fixSchemaAst(importedModule, options);
      return {
        schema,
        get document() {
          return getDocumentNodeFromSchema(schema);
        },
        location: pointer,
      };
    } else if (typeof importedModule === 'string') {
      return {
        location: pointer,
        document: parse(importedModule),
      };
    } else if (typeof importedModule === 'object' && importedModule.kind === 'Document') {
      return {
        location: pointer,
        document: importedModule,
      };
    }
  }

  private extractFromModule(mod: any, modulePath: string, identifier?: string) {
    const thing = identifier ? mod[identifier] : mod;

    if (!thing) {
      throw new Error('Unable to import an object from module: ' + modulePath);
    }

    return thing;
  }

  // Sync and Async

  private async importModule(pointer: string) {
    const { modulePath, exportName } = extractData(pointer);

    const imported = await import(modulePath);

    return this.extractFromModule(imported, modulePath, exportName || 'default');
  }

  private importModuleSync(pointer: string) {
    const { modulePath, exportName } = extractData(pointer);

    const imported = require(modulePath);

    return this.extractFromModule(imported, modulePath, exportName);
  }
}
