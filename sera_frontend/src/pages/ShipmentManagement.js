import React, { useState, useEffect } from "react";
import {
  Row,
  Divider,
  Button,
  Input,
  Table,
  Descriptions,
  Tag,
  message,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import "./page.css";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import trackAbi from "../abis/trackingAbi.json";
import { TRANSACTION_ERROR } from "../utils/messages";

const ShipmentManagement = () => {
  const [search_text, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chainId, account } = useWeb3React();

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
      title: "Importer",
      dataIndex: "importer",
      sorter: {
        compare: (a, b) => a.importer - b.importer,
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
    },
  ];

  const onSearch = (value) => {
    setSearchText(value);
  };

  const updatePurOrders = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    let TrackContract = new ethers.Contract(
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
          tmp.push({
            pur_order_id: i,
            importer: (
              <>
                {buyer.data.data.Trade_name} <br /> {contract.recipient}
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

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="margin-top-20">
          <span className="title-style">Shipment Management</span>
        </Row>
        <Divider />
        <Row justify="space-between">
          <Link to="/create-shipment">
            <Button className="black-button">Create Shipment</Button>
          </Link>
          <Input.Search
            placeholder="Search Party"
            className="search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Spin>
    </>
  );
};

export default ShipmentManagement;
