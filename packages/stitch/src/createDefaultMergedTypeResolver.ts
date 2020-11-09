import { getNamedType, GraphQLOutputType, GraphQLList } from 'graphql';
import { delegateToSchema, MergedTypeResolver, MergedTypeConfig } from '@graphql-tools/delegate';
import { batchDelegateToSchema } from '@graphql-tools/batch-delegate';

export function createDefaultMergedTypeResolver(mergedTypeConfig: MergedTypeConfig): MergedTypeResolver {
  let resolver: MergedTypeResolver;

  if (mergedTypeConfig.fieldName != null) {
    if (mergedTypeConfig.key != null) {
      resolver = (originalResult, context, info, subschema, selectionSet, key?) =>
        batchDelegateToSchema({
          schema: subschema,
          operation: 'query',
          fieldName: mergedTypeConfig.fieldName,
          returnType: new GraphQLList(
            getNamedType(info.schema.getType(originalResult.__typename) ?? info.returnType) as GraphQLOutputType
          ),
          key: key ?? mergedTypeConfig.key(originalResult),
          argsFromKeys: mergedTypeConfig.argsFromKeys,
          valuesFromResults: mergedTypeConfig.valuesFromResults,
          selectionSet,
          context,
          info,
          skipTypeMerging: true,
        });
    } else {
      resolver = (originalResult, context, info, subschema, selectionSet) =>
        delegateToSchema({
          schema: subschema,
          operation: 'query',
          fieldName: mergedTypeConfig.fieldName,
          returnType: getNamedType(
            info.schema.getType(originalResult.__typename) ?? info.returnType
          ) as GraphQLOutputType,
          args: mergedTypeConfig.args(originalResult),
          selectionSet,
          context,
          info,
          skipTypeMerging: true,
        });
    }

    if (mergedTypeConfig.beforeResolve != null) {
      return (originalResult, context, info, subschema, selectionSet, key) => {
        const eagerResult: any = mergedTypeConfig.beforeResolve(
          originalResult,
          context,
          info,
          subschema,
          selectionSet,
          key
        );
        return eagerResult !== undefined
          ? eagerResult
          : resolver(originalResult, context, info, subschema, selectionSet, key);
      };
    }
  }

  return resolver;
}
