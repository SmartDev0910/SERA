import { useRoutes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuthParties from "./pages/AuthParties";
import BusinessEcosystem from "./pages/BusinessEcosystem";
import Contracts from "./pages/Contracts";
import CreateContract from "./pages/CreateContract";
import Invoices from "./pages/Invoices";
import Materials from "./pages/Materials";
import IssueInvoice from "./pages/IssueInvoice";
import Tokenization from "./pages/Tokenization";
import PurchaseOrders from "./pages/PurchaseOrders";
import CreatePurOrder from "./pages/CreatePurOrder";
import ShipmentManagement from "./pages/ShipmentManagement";
import CreateShipment from "./pages/CreateShipment";
import DocumentManagement from "./pages/DocumentManagement";

export default function Router() {
  let element = useRoutes([
    { path: "/", element: <Login /> },
    {
      path: "/auth-parties",
      element: <AuthParties />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/business-ecosystem",
      element: <BusinessEcosystem />,
    },
    {
      path: "/contracts",
      element: <Contracts />,
    },
    {
      path: "/create-contract",
      element: <CreateContract />,
    },
    {
      path: "/invoices",
      element: <Invoices />,
    },
    {
      path: "/materials",
      element: <Materials />,
    },
    {
      path: "/issue-invoice",
      element: <IssueInvoice />,
    },
    {
      path: "/tokenization",
      element: <Tokenization />,
    },
    {
      path: "/shipment-management",
      element: <ShipmentManagement />,
    },
    {
      path: "/create-shipment",
      element: <CreateShipment />,
    },
    {
      path: "/document-management",
      element: <DocumentManagement />,
    },
    {
      path: "/purchase-orders",
      element: <PurchaseOrders />,
    },
    {
      path: "/create-pur-order",
      element: <CreatePurOrder />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
  return element;
}
