import { CreateReducer } from './typeHelper';
import { Store } from './store';

export function createStore<State = any>(
  reducers: CreateReducer[],
  initialState = {}
): Store<State> {
  return new Store<State>(reducers, initialState);
}
