import { combineReducers, configureStore, Middleware, Reducer } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import chatReducer, { ChatState, initialState as chatInitial } from './Chat/Chat.reducer';

// =====================================
// STATE
// =====================================
export interface ApplicationState {
  chat: ChatState;
}

// =====================================
// REDUCERS
// =====================================
const appReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  chat: chatReducer,
});

// =====================================
// INITIAL
// =====================================
const emptyState: ApplicationState = {
  chat: chatInitial,
};

// =====================================
// ROOT HANDLERS (IGNORE)
// =====================================
const rootReducer: Reducer<ApplicationState> = (state, action) => appReducer(state, action);

// Init store
export const initStore = (initialState = emptyState) => {
  const middlewares: [Middleware] = [reduxThunk];
  // Client side logger
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }
  return configureStore({
    reducer: rootReducer,
    middleware: middlewares,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState,
  });
};
