import { computedDirectiveTransformer } from './computedDirectiveTransformer';
import { multipleKeysTransformer } from './multipleKeysTransformer';

export { computedDirectiveTransformer } from './computedDirectiveTransformer';
export { multipleKeysTransformer } from './multipleKeysTransformer';

export const defaultSubschemaConfigTransforms = [computedDirectiveTransformer('computed')];
