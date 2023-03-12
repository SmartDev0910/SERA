import React, { useState } from "react";
import { Row, Divider, Button, Input, Modal, Select } from "antd";
import { Link } from "react-router-dom";
import "./page.css";

const ShipmentManagement = () => {
  const [search_text, setSearchText] = useState("");

  const onSearch = (value) => {
    setSearchText(value);
  };

  return (
    <>
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
    </>
  );
};

export default ShipmentManagement;
