import {
  Action,
  AnyAction,
  CombinedState,
  ReducersMapObject,
} from './typeHelper';
import { Store } from './store';

export function createStore<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>,
  initialState = {}
): Store<CombinedState<S>> {
  return new Store<CombinedState<S>>(reducers as any, initialState);
}
