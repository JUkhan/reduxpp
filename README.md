# Redux plus plus

Developed redux pattern different way so that developer life is easy, easy async state change, select, subscribe, unsubscribe [React Demo](https://stackblitz.com/edit/reduxpp-react-demo?file=index.tsx)

## Installation

Add the Reduxpp, Reduxpp-React packages to your project:

```
# NPM
npm i reduxpp reduxpp-react
```

```
# YARN
yarn add reduxpp reduxpp-react
```

## Create a Reduxpp State Reducer

```ts
import { createSlice, PayloadAction } from 'reduxpp';

export interface CouterState {
  count: number;
  loading: boolean;
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0, loading: false },
  reducers: {
    increment(state, action: PayloadAction<number>) {
      return { count: state.count + action.payload, loading: false };
    },
    decrement(state) {
      return { count: state.count - 1, loading: false };
    },
    loading(state) {
      return { ...state, loading: true };
    },
  },

  effects: {
    async asyncInc(dispatch) {
      dispatch(loading());
      await new Promise((resolve) =>
        setTimeout(() => dispatch(increment(1)), 100)
      );
    },
  },
});

export const { increment, decrement, loading, asyncInc } = counterSlice.actions;
```

## Create a Reduxpp Store

```ts
import { createStore } from 'reduxpp';
import { counterSlice } from './counter/counterState';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'reduxpp-react';
import { todoSlice, todoFilterSlice } from './todo/todoState';

export const store = createStore({
  [counterSlice.name]: counterSlice.reducer,
  [todoSlice.name]: todoSlice.reducer,
  [todoFilterSlice.name]: todoFilterSlice.reducer,
});

type RootState = ReturnType<typeof store.getState>;
type Dispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => Dispatch = useDispatch;
```

## Provide the Reduxpp Store to React

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'reduxpp-react';
import { store } from './features/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

## Use Reduxpp State and Actions and Effects in React Components

```ts
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { asyncInc, decrement, increment } from './counterState';

export default () => {
  const { count, loading } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Counter</h1>
      <button onClick={() => dispatch(increment(10))}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
      <button onClick={() => dispatch(asyncInc())}>
        {loading ? 'loading...' : 'asyncInc'}
      </button>
      <b>{count}</b>
    </div>
  );
};
```
