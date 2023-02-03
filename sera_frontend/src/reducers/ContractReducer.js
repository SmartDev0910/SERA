import {
  ADD_CONTRACT,
  CONTRACT_LIST_REQUEST,
  CONTRACT_LIST_SUCCESS,
  CONTRACT_LIST_FAIL,
} from "../utils/constants";

const BusPartnerListReducer = (state = { contracts: [] }, action) => {
  switch (action.type) {
    case CONTRACT_LIST_REQUEST:
      return { loading: true, contracts: [] };
    case CONTRACT_LIST_SUCCESS:
      return {
        loading: false,
        contracts: action.payload.contracts,
      };
    case CONTRACT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_CONTRACT:
      state.contracts = [...state.contracts, action.payload];
      return state;
    default:
      return state;
  }
};

export default BusPartnerListReducer;
