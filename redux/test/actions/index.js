import { TEST_REDUX } from "../constants";

export const testRedux = () => (dispatch) =>
  dispatch({ type: TEST_REDUX, payload: "TEST WORKED" });
