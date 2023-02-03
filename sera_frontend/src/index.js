import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import store from "./store";
import "./index.css";
import "antd/dist/reset.css";
function getLibrary(provider) {
  return new Web3(provider);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </Web3ReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
