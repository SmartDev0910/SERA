import { Menu } from "antd";
import { Link } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    "Landing Page",
    "group_landing_page",
    null,
    [
      getItem(
        <Link to="/business-ecosystem">Business Ecosystem</Link>,
        "business_ecosystem"
      ),
    ],
    "group"
  ),
  {
    type: "divider",
  },
  getItem(
    "Applications",
    "group_applications",
    null,
    [
      getItem("Contract Manager", "sub_contract_manager", "", [
        getItem(
          <Link to="/auth-parties">Authorized Parties</Link>,
          "authorized_parties"
        ),
        getItem(<Link to="/materials">Materials</Link>, "materials"),
        getItem(<Link to="/contracts">Contracts</Link>, "contracts"),
        getItem(
          <Link to="/purchase-orders">Purchase Orders</Link>,
          "purchase_orders"
        ),
        getItem(<Link to="/invoices">Invoices</Link>, "invoices"),
      ]),
    ],
    "group"
  ),
  {
    type: "divider",
  },
  getItem(
    "Core Services",
    "group_core_services",
    null,
    [getItem(<Link to="/tokenization">Tokenization</Link>, "tokenization")],
    "group"
  ),
];

const Menubar = ({ clickEvent }) => {
  const menuStyle = {
    fontSize: "15px",
    marginTop: "15px",
  };

  return (
    <Menu
      defaultOpenKeys={["sub_contract_manager"]}
      mode="inline"
      items={items}
      style={menuStyle}
      onClick={() => (clickEvent ? clickEvent() : null)}
    />
  );
};

export default Menubar;
