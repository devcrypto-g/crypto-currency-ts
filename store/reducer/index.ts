import { combineReducers } from "redux";
import title from "./title";
import price from "./price";

const rootReducer = combineReducers({
  title,
  price,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
