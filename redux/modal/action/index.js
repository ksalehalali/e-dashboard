//constants
import * as constants from "../constants";
export const openModal =
  (modalType = 0, successAction, mPayloads, editMode = false) =>
  (dispatch) => {
    dispatch({
      type: editMode ? constants.OPEN_EDIT_MODAL : constants.OPEN_MODAL,
      payload: {
        modalType: modalType,
        successAction: successAction,
        mPayloads: mPayloads,
      },
    });
  };

export const closeModal =
  (modalType = 0) =>
  (dispatch) => {
    dispatch({ type: constants.CLOSE_MODAL, payload: modalType });
  };
