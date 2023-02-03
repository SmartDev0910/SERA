import {
  ADD_ORGANIZATION,
  ORGANIZATION_LIST_REQUEST,
  ORGANIZATION_LIST_SUCCESS,
  ORGANIZATION_LIST_FAIL,
} from "../utils/constants";

const OrganizationReducer = (state = { organizations: [] }, action) => {
  switch (action.type) {
    case ORGANIZATION_LIST_REQUEST:
      state = { organizations: [] };
      return state;
    case ORGANIZATION_LIST_SUCCESS:
      return {
        loading: false,
        organizations: action.payload.organizations,
      };
    case ORGANIZATION_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_ORGANIZATION:
      state.organizations = [...state.organizations, action.payload];
      return state;
    default:
      return state;
  }
};

export default OrganizationReducer;
