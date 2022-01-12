import { createAction } from './createAction';
import { CreateReducer, ReducerMetods, ReducerOptions } from './typeHelper';

export function createReducer<
  State,
  CR extends ReducerMetods<State>,
  Name extends string = string
>(options: ReducerOptions<State, CR, Name>): CreateReducer<State, CR, Name> {
  if (!options.name) {
    throw new Error('`name` is a required option for reducer');
  }

  const reducers: any = options.reducers || {};
  const actions: any = {};

  Object.keys(reducers).map((key) => {
    actions[key] = createAction(key);
  });

  return {
    name: options.name,
    initialState: options.initialState,
    actions: actions as any,
    reducers,
  };
}
