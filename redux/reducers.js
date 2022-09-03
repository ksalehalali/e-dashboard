import { combineReducers } from "redux";

// import all reducers
import { testReducer } from "./test/reducer";
import { modalReducer } from "./modal/reducer";
import { drawerReducer } from "./drawer/reducer";

// COMBINED REDUCERS
const reducers = {
  test: testReducer,
  modal: modalReducer,
  drawer: drawerReducer,
};

export default combineReducers(reducers);
