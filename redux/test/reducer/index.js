import { TEST_REDUX } from "../constants";

const INITIAL_STATE = {
  testText: "SOME TEXT TEST",
};

export const testReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TEST_REDUX:
      return {
        ...state,
        testText: action.payload,
      };
    default:
      return state;
  }
};
