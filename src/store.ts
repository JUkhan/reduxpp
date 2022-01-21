import { AnyAction, EffectHandler, ReducersMapObject } from './typeHelper';
import { shallowEqual as equal } from './shallowEqual';

export class Store<State = any> {
  private reducers: ReducersMapObject;
  private state = {} as any;
  private map = new Map<string, any>();
  private effectMap = new Map<string, any>();
  constructor(reducers: ReducersMapObject, initialState: any) {
    this.reducers = reducers;
    this.state = initialState;
    for (let key in reducers) {
      const reducer: any = reducers[key];
      if (!this.state[key]) {
        this.state[key] = reducer.initialState;
      }
    }

    this.dispatch({ type: '$INIT' });
  }
  getState(): State {
    return this.state;
  }

  subscribe<T = any>(
    selector: (state: State) => T,
    notifier: (value: T) => void,
    equalityFn?: (left: T, right: T) => boolean
  ) {
    let key = Number(new Date()).toString() + Math.random();
    let value = selector(this.state);
    notifier(value);
    let notifyCallback = () => {
      const newValue = selector(this.state);
      if (!(equalityFn || equal)(value, newValue)) {
        notifier(newValue);
        value = newValue;
      }
    };
    this.map.set(key, notifyCallback);

    return {
      unsubscribe: () => {
        this.map.delete(key);
      },
    };
  }
  select<T = any>(
    selector: (state: State) => T,
    equalityFn?: (left: T, right: T) => boolean
  ) {
    return {
      subscribe: (outputFn: (value: T) => void) => {
        return this.subscribe(selector, outputFn, equalityFn);
      },
    };
  }

  dispatch(action: AnyAction | any) {
    if (!action) return;
    if (typeof action === 'function') {
      return action(
        (a: any) => this.dispatch(a),
        () => this.getState()
      );
    }
    if (!action.type) return;
    let hasChanged = false;
    const nextState = {} as any;
    for (let key in this.reducers) {
      const previousStateForKey = this.state[key];
      const nextStateForKey = this.reducers[key](previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
    }
    this.state = hasChanged ? nextState : this.state;
    this.map.forEach((cal) => cal());
    this.effectMap.forEach((cal) => cal(action));
  }

  subscribeForEffect(actionTypes: string[], callback: EffectHandler) {
    let key = Number(new Date()).toString() + Math.random();
    let notifyCallback = (action: AnyAction) => {
      if (actionTypes.includes(action.type)) {
        callback(
          (newAction: AnyAction) => this.dispatch(newAction),
          () => this.getState(),
          action
        );
      }
    };
    this.effectMap.set(key, notifyCallback);

    return {
      unsubscribe: () => {
        this.effectMap.delete(key);
      },
    };
  }
  effectOn(...actionTypes: string[]) {
    return {
      subscribe: (callback: EffectHandler) => {
        return this.subscribeForEffect(actionTypes, callback);
      },
    };
  }
  clean() {
    this.map.clear();
    this.effectMap.clear();
    this.reducers = {};
    this.state = {};
  }
}
