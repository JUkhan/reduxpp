import { CreateReducer, AnyAction } from './typeHelper';
import equal from './shallowEqual';

export class Store<State = any> {
  private reducers: CreateReducer[];
  private state = {} as any;
  private map = new Map<string, any>();
  private effectMap = new Map<string, any>();
  constructor(reducers: CreateReducer[], initialState: any) {
    this.reducers = reducers;
    this.state = initialState;
    this.reducers.forEach((reducer) => {
      this.state[reducer.name] = reducer.initialState;
      Object.keys(reducer.efffecs).forEach((efffect) => {
        this.subscribeForEffect(efffect.split('$'), reducer.efffecs[efffect]);
      });
    });

    this.dispatch({ type: '@INIT' });
  }
  getState(): State {
    return this.state;
  }

  subscribe<T = any>(
    selector: (state: State) => T,
    notifier: (value: T) => void
  ) {
    let key = Number(new Date()).toString() + Math.random();
    let value = selector(this.state);
    notifier(value);
    let notifyCallback = () => {
      const newValue = selector(this.state);
      if (!equal(value, newValue)) {
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
  select<T = any>(selectCallback: (state: State) => T) {
    return {
      subscribe: (scb: (value: T) => void) => {
        return this.subscribe(selectCallback, scb);
      },
    };
  }

  dispatch(action: AnyAction) {
    if (!action) return;
    if (typeof action.type === 'undefined') return;
    let hasChanged = false;
    const nextState = {} as any;
    for (let reducer of this.reducers) {
      const key = reducer.name;
      const previousStateForKey = this.state[key];
      const nextStateForKey =
        typeof reducer.reducers[action.type] === 'function'
          ? reducer.reducers[action.type](previousStateForKey, action as any)
          : previousStateForKey;
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
    }
    this.state = hasChanged ? nextState : this.state;
    this.map.forEach((cal) => cal());
    this.effectMap.forEach((cal) => cal(action));
  }

  private subscribeForEffect(actionTypes: string[], callback: any) {
    let key = Number(new Date()).toString() + Math.random();
    let notifyCallback = (action: AnyAction) => {
      if (actionTypes.includes(action.type)) {
        callback(
          () => this.getState(),
          action,
          (newAction: AnyAction) => this.dispatch(newAction)
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
      subscribe: (
        callback: (
          getState: () => State,
          action: AnyAction,
          dispatch: (acion: AnyAction) => void
        ) => void
      ) => {
        return this.subscribeForEffect(actionTypes, callback);
      },
    };
  }
  clean() {
    this.map.clear();
    this.effectMap.clear();
    this.reducers = [];
    this.state = {};
  }
}
