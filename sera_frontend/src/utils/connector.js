import { InjectedConnector } from "@web3-react/injected-connector";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 2, 3, 4, 5, 56, 97, 80001],
});

// export const walletconnect = new WalletConnectConnector({
//   rpc: { 56: "https://bsc-dataseed4.binance.org/" },
//   qrcode: true,
//   pollingInterval: 12000,
// });
