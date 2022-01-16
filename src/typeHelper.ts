export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => S;

export type ReducerMetods<State> = {
  [K: string]: Reducer<State, PayloadAction<any>>;
};
export type ValidateReducers<S, ACR extends ReducerMetods<S>> = ACR & {
  [T in keyof ACR]: ACR[T] extends {
    reducer(s: S, action?: infer A): any;
  }
    ? {
        prepare(...a: never[]): Omit<A, 'type'>;
      }
    : {};
};

export interface Action<T = any> {
  type: T;
}
export declare type PayloadAction<P = void, T extends string = string> = {
  payload: P;
  type: T;
};

export interface ActionCreatorWithoutPayload<T extends string = string> {
  /**
   * Calling this {@link redux#ActionCreator} will
   * return a {@link PayloadAction} of type `T` with a payload of `undefined`
   */
  (): PayloadAction<undefined, T>;
}

export interface ActionCreatorWithPayload<P, T extends string = string> {
  /**
   * Calling this {@link redux#ActionCreator} with an argument will
   * return a {@link PayloadAction} of type `T` with a payload of `P`
   */
  (payload: P): PayloadAction<P, T>;
}
type ActionCreatorForReducer<R> = R extends (
  state: any,
  action: infer Action
) => any
  ? Action extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;

export type ReducerActions<Reducers extends ReducerMetods<any>> = {
  [Type in keyof Reducers]: ActionCreatorForReducer<Reducers[Type]>;
};
export type Efectype<A extends Action = Action> = (
  getState: () => any,
  Action: A,
  dispatch: (action: A) => void
) => void;

export type EfffectOptioons = {
  [key: string]: Efectype;
};
export interface ReducerOptions<
  State = any,
  R extends ReducerMetods<State> = ReducerMetods<State>,
  Name extends string = string
> {
  name: Name;
  initialState: State;
  reducers: ValidateReducers<State, R>;
  effects?: EfffectOptioons;
}
export interface CreateReducer<
  State = any,
  R extends ReducerMetods<State> = ReducerMetods<State>,
  Name extends string = string
> {
  name: Name;
  initialState: State;
  reducers: ValidateReducers<State, R>;
  actions: ReducerActions<R>;
  effects: EfffectOptioons;
}
