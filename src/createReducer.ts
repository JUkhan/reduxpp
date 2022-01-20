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
  function reducer(state: any, action: any) {
    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    }
    return state;
  }
  reducer.effects = effects;
  reducer.initialState = options.initialState;

  Object.keys(reducers).map((key) => {
    const mkey = `${options.name}_${key}`;
    reducers[mkey] = reducers[key];
    reducers[key] = undefined;
    actions[key] = createAction(mkey);
  });

  Object.keys(effects).map((key) => {
    actions[key] = createAction(key);
  });

  return {
    name: options.name,
    //initialState: options.initialState,
    actions,
    //reducers,
    //effects,
    reducer,
  };
}
