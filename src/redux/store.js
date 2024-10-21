import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { spriteReducer } from './sprites.slice';

const reducers = combineReducers({
  spriteUseCase: spriteReducer,
});

export const reduxStore = configureStore({
  reducer: reducers,
});
