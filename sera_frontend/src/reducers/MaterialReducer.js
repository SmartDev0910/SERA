import {
  ADD_MATERIAL,
  MATERIAL_LIST_REQUEST,
  MATERIAL_LIST_SUCCESS,
  MATERIAL_LIST_FAIL,
} from "../utils/constants";

const MaterialReducer = (state = { materials: [] }, action) => {
  switch (action.type) {
    case MATERIAL_LIST_REQUEST:
      state = { materials: [] };
      return state;
    case MATERIAL_LIST_SUCCESS:
      return {
        loading: false,
        materials: action.payload.materials,
      };
    case MATERIAL_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_MATERIAL:
      state.materials = [...state.materials, action.payload];
      return state;
    default:
      return state;
  }
};

export default MaterialReducer;
