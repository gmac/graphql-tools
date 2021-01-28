import { cloneSubschemaConfig, SubschemaConfig } from '@graphql-tools/delegate';

export function mergedTypeAccessorsTransformer(subschemaConfig: SubschemaConfig): SubschemaConfig {
  if (!subschemaConfig.merge) return subschemaConfig;
  const newSubschemaConfig = cloneSubschemaConfig(subschemaConfig);

  Object.keys(newSubschemaConfig.merge).forEach(typeName => {
    const mergedTypeConfig = newSubschemaConfig.merge[typeName];
    const defaultAccessor = {
      selectionSet: mergedTypeConfig.selectionSet,
      fieldName: mergedTypeConfig.fieldName,
      key: mergedTypeConfig.key,
      args: mergedTypeConfig.args,
      argsFromKeys: mergedTypeConfig.argsFromKeys,
      valuesFromResults: mergedTypeConfig.valuesFromResults,
      resolve: mergedTypeConfig.resolve,
    };

    if (defaultAccessor.fieldName) {
      mergedTypeConfig.accessors = [defaultAccessor].concat(mergedTypeConfig.accessors ?? []);
    }
  });

  return newSubschemaConfig;
}
