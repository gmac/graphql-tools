import { computedDirectiveTransformer } from './computedDirectiveTransformer';

export { computedDirectiveTransformer } from './computedDirectiveTransformer';
export { computedFieldIsolationTransformer } from './computedFieldIsolationTransformer';
export { multiAccessMergedTypeTransformer } from './multiAccessMergedTypeTransformer';

export const defaultSubschemaConfigTransforms = [computedDirectiveTransformer('computed')];
