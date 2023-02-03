import {
  ADD_BUSPARTNER,
  BUSPARTNER_LIST_REQUEST,
  BUSPARTNER_LIST_SUCCESS,
  BUSPARTNER_LIST_FAIL,
} from "../utils/constants";

const BusPartnerListReducer = (state = { buspartners: [] }, action) => {
  switch (action.type) {
    case BUSPARTNER_LIST_REQUEST:
      return { loading: true, buspartners: [] };
    case BUSPARTNER_LIST_SUCCESS:
      return {
        loading: false,
        buspartners: action.payload.buspartners,
      };
    case BUSPARTNER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_BUSPARTNER:
      state.buspartners = [...state.buspartners, action.payload];
      return state;
    default:
      return state;
  }
};

export default BusPartnerListReducer;
