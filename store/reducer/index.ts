import { combineReducers } from "redux";
import title from "./title";

const rootReducer = combineReducers({
  title
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;