import {
  ADD_PUR_ORDER,
  PUR_ORDER_LIST_REQUEST,
  PUR_ORDER_LIST_SUCCESS,
  PUR_ORDER_LIST_FAIL,
} from "../utils/constants";

const PurOrderReducer = (state = { purorders: [] }, action) => {
  switch (action.type) {
    case PUR_ORDER_LIST_REQUEST:
      return { loading: true, purorders: [] };
    case PUR_ORDER_LIST_SUCCESS:
      return {
        loading: false,
        purorders: action.payload.purorders,
      };
    case PUR_ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_PUR_ORDER:
      state.purorders = [...state.purorders, action.payload];
      return state;
    default:
      return state;
  }
};

export default PurOrderReducer;
