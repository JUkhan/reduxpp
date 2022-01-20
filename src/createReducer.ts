import { createAction } from './createAction';
import {
  CreateReducer,
  ReducerMetods,
  ReducerOptions,
  EffectHandlers,
} from './typeHelper';

export function createReducer<
  State,
  CR extends ReducerMetods<State>,
  M extends EffectHandlers,
  Name extends string = string
>(
  options: ReducerOptions<State, CR, M, Name>
): CreateReducer<State, CR, M, Name> {
  if (!options.name) {
    throw new Error('`name` is a required option for reducer');
  }

  const reducers: any = options.reducers || {};
  const actions: any = {};
  const effects: any = options.effects || {};

  Object.keys(reducers).map((key) => {
    actions[key] = createAction(key);
  });

  Object.keys(effects).map((key) => {
    actions[key] = createAction(key);
  });

  return {
    name: options.name,
    initialState: options.initialState,
    actions: actions as any,
    reducers,
    effects,
  };
}
