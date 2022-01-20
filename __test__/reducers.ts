import { AnyAction } from './../dist/typeHelper.d';
import { createReducer } from '../src';
import { PayloadAction } from '../src/typeHelper';

export const counterReducer = createReducer({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment(state, action: PayloadAction<number>) {
      return state + action.payload;
    },
    decrement(state) {
      return state - 1;
    },
  },
  effects: {
    async increment(state, dispatch, action: PayloadAction<number>) {
      console.log(state(), dispatch, action);
      dispatch(decrement());
      dispatch(doSomething({ name: 'test', age: 10 }));
    },
    doSomething(
      state,
      dispatch,
      action: PayloadAction<{ name: string; age: number }>
    ) {
      console.log(state(), dispatch, action);
      //dispatch(decrement());
    },
  },
});

export const { increment, decrement, doSomething } = counterReducer.actions;
