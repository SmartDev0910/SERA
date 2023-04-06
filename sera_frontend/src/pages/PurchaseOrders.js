import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Col,
  Divider,
  Button,
  Input,
  Table,
  Spin,
  Tag,
  Descriptions,
  Pagination,
  message,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { TRANSACTION_ERROR } from "../utils/messages";
import trackAbi from "../abis/trackingAbi.json";
import "./page.css";

const { Search } = Input;

const PurchaseOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search_text, setSearchText] = useState("");
  const { chainId, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
  let TrackContract = null;

  const updatePurOrders = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );

    let tmp = [];
    try {
      let purchase_id = await TrackContract.purchase_id();
      for (let i = 0; i <= purchase_id; i++) {
        let contract_id = await TrackContract.purchase_list(i);
        let contract = await TrackContract.shipments(contract_id);
        let net_value =
          contract.quantity1 * contract.price1 +
          contract.quantity2 * contract.price2;

        if (contract.recipient === account) {
          const buyer = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: contract.recipient,
            }
          );
          const supplier = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: contract.sender,
            }
          );
          tmp.push({
            pur_order_id: i,
            contract_id: Number(contract_id),
            buyer: (
              <>
                {buyer.data.data.Trade_name} <br /> {contract.recipient}
              </>
            ),
            supplier: (
              <>
                {supplier.data.data.Trade_name} <br /> {contract.sender}
              </>
            ),
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

  useEffect(() => {
    updatePurOrders();
  }, []);

  useEffect(() => {
    updatePurOrders();
  }, [account]);

  const onChange = (key) => {
    console.log(key);
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Purchase Order ID",
      dataIndex: "pur_order_id",
      sorter: {
        compare: (a, b) => a.pur_order_id - b.pur_order_id,
        multiple: 1,
      },
    },
    {
      title: "Contract ID",
      dataIndex: "contract_id",
      sorter: {
        compare: (a, b) => a.contract_id - b.contract_id,
        multiple: 2,
      },
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      sorter: {
        compare: (a, b) => a.buyer - b.buyer,
        multiple: 3,
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      sorter: {
        compare: (a, b) => a.supplier - b.supplier,
        multiple: 4,
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
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 7,
      },
    },
  ];
  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="contract-header">
          <span className="title-style float-left">Purchase Orders</span>
          <Link to="/create-pur-order">
            <Button className="contract-btn" icon={<FileAddOutlined />}>
              Create Purchase Order
            </Button>
          </Link>
        </Row>
        <Divider />
        <Row justify="space-between">
          <Search
            placeholder="Search Purchase Orders"
            className="contract-search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          scroll={{ x: 2000 }}
          dataSource={
            data &&
            (search_text === ""
              ? data
              : data.filter(
                (i) =>
                  i.buyer.includes(search_text) ||
                  i.supplier.includes(search_text) ||
                  i.material.includes(search_text)
              ))
          }
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

export default PurchaseOrders;
