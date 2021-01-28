import { computedDirectiveTransformer } from './computedDirectiveTransformer';
import { mergedTypeAccessorsTransformer } from './mergedTypeAccessorsTransformer';
import { mergedTypeMultiAccessTransformer } from './mergedTypeMultiAccessTransformer';

export { computedDirectiveTransformer } from './computedDirectiveTransformer';
export { mergedTypeAccessorsTransformer } from './mergedTypeAccessorsTransformer';
export { mergedTypeMultiAccessTransformer } from './mergedTypeMultiAccessTransformer';

export const defaultSubschemaConfigTransforms = [computedDirectiveTransformer('computed')];
