import {
  ADD_INVOICE,
  INVOICE_LIST_REQUEST,
  INVOICE_LIST_SUCCESS,
  INVOICE_LIST_FAIL,
} from "../utils/constants";

const InvoiceReducer = (state = { invoices: [] }, action) => {
  switch (action.type) {
    case INVOICE_LIST_REQUEST:
      return { loading: true, invoices: [] };
    case INVOICE_LIST_SUCCESS:
      return {
        loading: false,
        invoices: action.payload.invoices,
      };
    case INVOICE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_INVOICE:
      state.invoices = [...state.invoices, action.payload];
      return state;
    default:
      return state;
  }
};

export default InvoiceReducer;
