import { cloneSubschemaConfig, SubschemaConfig } from '@graphql-tools/delegate';

export function mergedTypeMultiAccessTransformer(
  subschemaConfig: SubschemaConfig
): SubschemaConfig | Array<SubschemaConfig> {
  if (!subschemaConfig.merge) return subschemaConfig;

  const multipleKeys: Record<string, Array<MergedTypeConfig>> = Object.create(null);
  const baseSubschemaConfig: SubschemaConfig = subschemaConfig;

  Object.keys(subschemaConfig.merge).forEach(typeName => {
    if (Array.isArray(mergedTypeConfigOrConfigs)) {
      subschemaConfig = cloneSubschemaConfig(subschemaConfig);
      subschemaConfig.merge[typeName] = mergedTypeConfigOrConfigs[0];
      multipleKeys[typeName] = mergedTypeConfigOrConfigs.slice(1);
    }
  });

  if (Object.keys(multipleKeys).length) {
    const subschemaConfigs: Array<SubschemaConfig> = [subschemaConfig];
    Object.entries(multipleKeys).forEach(([typeName, mergedTypeConfigs]) => {
      mergedTypeConfigs.forEach(mergedTypeConfig => {
        altSubschemaConfig = cloneSubschemaConfig(subschemaConfig);
        altSubschemaConfig.merge = { [typeName]: mergedTypeConfig };
        subschemaConfigs.push(altSubschemaConfig);
      });
    });
    return subschemaConfigs;
  }

  return subschemaConfig;
}
