import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../components/../resources/redux_sample/counterSlice";
import userReducer from "../slices/userSlice";
import searchReducer from "../slices/searchSlice";
import currentPlanReducer from "../slices/currentPlanSlice";
// import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    search: searchReducer,
    currentPlan: currentPlanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }), //.concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
