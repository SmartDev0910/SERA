import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Tabs,
  Input,
  Table,
  Spin,
  Pagination,
  message,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import trackAbi from "../abis/trackingAbi.json";
import provAbi from "../abis/provenanceAbi.json";
import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const Invoices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState();
  const [tabKey, setTabKey] = useState("all");
  const [search_text, setSearchText] = useState("");
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const { chainId, active, account } = useWeb3React();

  const dataSource = useMemo(() => {
    switch (tabKey) {
      case "all":
        return data;
      case "issued":
        return data.filter((i) =>
          JSON.stringify(i.bus_partner).includes(account)
        );
    }
  }, [data, tabKey, account]);

  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
  let TrackContract = null;

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

        let ProvContract = new ethers.Contract(
          process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
          provAbi,
          myProvider.getSigner()
        );
        if (contract.sender === account) {
          let bus_partner = await ProvContract.producers(contract.recipient);

          tmp.push({
            invoice_id: i,
            bus_partner: (
              <>
                {" "}
                {bus_partner.name} <br /> {contract.recipient}
              </>
            ),
            delivery_term: (
              <Row className="width-100">
                <Row gutter={4} className="width-100">
                  <Col span={12}>Material</Col>
                  <Col span={12}>Quantity</Col>
                </Row>
                <Row gutter={4} className="width-100">
                  <Col span={12}>{contract.item1}</Col>
                  <Col span={12}>{Number(contract.quantity1)}</Col>
                </Row>
                <Row gutter={4} className="width-100">
                  <Col span={12}>{contract.item2}</Col>
                  <Col span={12}>{Number(contract.quantity2)}</Col>
                </Row>
              </Row>
            ),
            payment_term: net_value,
            due_date: "2023/1/18",
            status: "Ready",
            actions: "1",
          });
        }
      }
      await setData(tmp);
    } catch (e) {
      setLoading(false);
      message.error("Internal Server Error.\n" + e, 5);
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
    {
      title: "Actions",
      dataIndex: "actions",
      sorter: {
        compare: (a, b) => a.actions - b.actions,
        multiple: 8,
      },
    },
  ];
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
          onChange={onChange}
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
