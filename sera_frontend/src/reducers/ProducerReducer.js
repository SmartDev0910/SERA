import {
  ADD_PRODUCER,
  PRODUCER_LIST_REQUEST,
  PRODUCER_LIST_SUCCESS,
  PRODUCER_LIST_FAIL,
} from "../utils/constants";

const ProducerListReducer = (state = { producers: [] }, action) => {
  switch (action.type) {
    case PRODUCER_LIST_REQUEST:
      return { loading: true, producers: [] };
    case PRODUCER_LIST_SUCCESS:
      return {
        loading: false,
        producers: action.payload.producers,
      };
    case PRODUCER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_PRODUCER:
      state.producers = [...state.producers, action.payload];
      return state;
    default:
      return state;
  }
};

export default ProducerListReducer;
