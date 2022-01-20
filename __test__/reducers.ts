import { AnyAction } from './../dist/typeHelper.d';
import { createReducer } from '../src';
import { PayloadAction } from '../src/typeHelper';

export const counterSlice = createReducer({
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
    async counter_increment(dispatch, state, action: PayloadAction<number>) {
      console.log(state(), dispatch, action);
      dispatch(decrement());
      dispatch(doSomething({ name: 'test', age: 10 }));
    },
    doSomething(
      dispatch,
      state,
      action: PayloadAction<{ name: string; age: number }>
    ) {
      console.log(state(), dispatch, action);
      //dispatch(decrement());
    },
    $INIT(dispatch, state, action: AnyAction) {
      console.log('$INIT', state(), dispatch, action);
    },
  },
});

export const { increment, decrement, doSomething, counter_increment } = counterSlice.actions;
