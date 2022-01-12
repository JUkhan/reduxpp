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
});

export const { increment, decrement } = counterReducer.actions;
