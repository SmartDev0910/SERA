import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import UserReducer from "./reducers/UserReducer";
import ProducerReducer from "./reducers/ProducerReducer";
import ProductReducer from "./reducers/ProductReducer";
import BusPartnerReducer from "./reducers/BusPartnerReducer";
import OrganizationReducer from "./reducers/OrganizationReducer";
import MaterialReducer from "./reducers/MaterialReducer";
import ContractReducer from "./reducers/ContractReducer";
import PurOrderReducer from "./reducers/PurOrderReducer";
import InvoiceReducer from "./reducers/InvoiceReducer";

const reducer = combineReducers({
  userInfo: UserReducer,
  producerList: ProducerReducer,
  productList: ProductReducer,
  busPartnerList: BusPartnerReducer,
  orgList: OrganizationReducer,
  materialList: MaterialReducer,
  contractList: ContractReducer,
  purOrderList: PurOrderReducer,
  invoiceList: InvoiceReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
