import { createAction } from './createAction';
import {
  CreateSlice,
  ReducerMetods,
  SliceOptions,
  EffectHandlers,
} from './typeHelper';

/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "state name", and also it can have an object full of effect handlers, and automatically generates
 * action creators and action types that correspond to the
 * reducers and state and effects.
 *
 */
export function createSlice<
  State,
  CR extends ReducerMetods<State>,
  M extends EffectHandlers,
  Name extends string = string
>(options: SliceOptions<State, CR, M, Name>): CreateSlice<State, CR, M, Name> {
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

  reducer.initialState = options.initialState;

  Object.keys(reducers).map((key) => {
    const mkey = `${options.name}_${key}`;
    reducers[mkey] = reducers[key];
    reducers[key] = undefined;
    actions[key] = createAction(mkey);
  });

  Object.keys(effects).map((key) => {
    const handler = effects[key];
    actions[key] = (payload: any) => (dispatch: any, getState: any) =>
      handler(dispatch, getState, { payload: payload });
  });

  return {
    name: options.name,
    actions,
    reducer,
  };
}
