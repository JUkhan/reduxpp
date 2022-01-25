import { createSlice, createAction } from '../src';
import { PayloadAction } from '../src/typeHelper';

export const counterSlice = createSlice({
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
    async asyncInc(dispatch, state, action: PayloadAction<string>) {
      console.log(action.payload, state);
      await new Promise((resolve) => setTimeout(resolve, 100));
      dispatch(increment(1));
    },
  },
});

export const { increment, decrement, asyncInc } = counterSlice.actions;
