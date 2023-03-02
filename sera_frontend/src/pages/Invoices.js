import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Descriptions,
  Button,
  Tabs,
  Tag,
  Input,
  Table,
  Spin,
  Pagination,
  message,
} from "antd";
import axios from "axios";
import { FileAddOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import trackAbi from "../abis/trackingAbi.json";
import "./page.css";
import { TRANSACTION_ERROR } from "../utils/messages";

const { Title } = Typography;
const { Search } = Input;

const Invoices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState("all");
  const [search_text, setSearchText] = useState("");
  const { account } = useWeb3React();

  const dataSource = useMemo(() => {
    switch (tabKey) {
      case "all":
        return data;
      case "issued":
        return data.filter((i) =>
          JSON.stringify(i.bus_partner).includes(account)
        );
      case "received":
        return data.filter((i) => i.sender === account);
    }
  }, [data, tabKey, account]);

  let TrackContract = null;

  const items = [
    {
      key: "all",
      label: `All`,
    },
    {
      key: "issued",
      label: `Issued`,
    },
    {
      key: "received",
      label: `Received`,
    },
  ];

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoice_id",
      sorter: {
        compare: (a, b) => a.invoice_id - b.invoice_id,
        multiple: 1,
      },
    },
    {
      title: "Business Partner",
      dataIndex: "bus_partner",
      sorter: {
        compare: (a, b) => a.bus_partner - b.bus_partner,
        multiple: 2,
      },
    },
    {
      title: "Delivery term",
      dataIndex: "delivery_term",
    },
    {
      title: "Payment term",
      dataIndex: "payment_term",
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      sorter: {
        compare: (a, b) => a.due_date - b.due_date,
        multiple: 6,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 7,
      },
    },
  ];
  const updateInvoices = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );

    let tmp = [];
    try {
      let invoice_id = await TrackContract.invoice_id();
      for (let i = 0; i <= invoice_id; i++) {
        let contract_id = await TrackContract.invoice_list(i);
        let contract = await TrackContract.shipments(contract_id);
        let net_value =
          contract.quantity1 * contract.price1 +
          contract.quantity2 * contract.price2;

        if (contract.recipient === account || contract.sender === account) {
          const bus_partner = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: contract.recipient,
            }
          );
          tmp.push({
            invoice_id: i,
            bus_partner: (
              <>
                {bus_partner.data.data.Trade_name} <br /> {contract.recipient}
              </>
            ),
            sender: contract.sender,
            delivery_term: (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Material">Quantity</Descriptions.Item>
                <Descriptions.Item label={contract.item1}>
                  {Number(contract.quantity1)}
                </Descriptions.Item>
                <Descriptions.Item label={contract.item2}>
                  {Number(contract.quantity2)}
                </Descriptions.Item>
              </Descriptions>
            ),
            payment_term: net_value,
            due_date: "2023/1/18",
            status: <Tag color="magenta">Active</Tag>,
          });
        }
      }
      await setData(tmp);
    } catch (e) {
      message.error(TRANSACTION_ERROR, 5);
      console.log(e);
      setLoading(false);
    }
    setLoading(false);
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  useEffect(() => {
    updateInvoices();
  }, []);

  useEffect(() => {
    updateInvoices();
  }, [account]);

  const onChange = (key) => {
    setTabKey(key);
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="contract-header">
          <span className="title-style float-left">Invoices</span>
          <Link to="/issue-invoice">
            <Button className="contract-btn" icon={<FileAddOutlined />}>
              Issue Invoice
            </Button>
          </Link>
        </Row>
        <Divider />
        <Tabs defaultActiveKey="all" items={items} onChange={onChange} />
        <Row justify="space-between">
          <Search
            placeholder="Search Invoices"
            className="contract-search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          scroll={{ x: 2000 }}
          dataSource={dataSource}
          pagination={false}
        />
        {/* <Pagination
          total={85}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          defaultCurrent={1}
          className="margin-top-20"
        /> */}
      </Spin>
    </>
  );
};

export default Invoices;
