// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Goods from "./components/Goods";
import Home from "./components/Home";
import TradersList from "./components/Traders";
import TransportersTable from "./components/Transporter";
import TransportBookingTable from "./components/TransportBooking";
import UserProfile from "./components/Profile";

import PurchaseOrdersTable from "./components/Orders";
import Farmer from "./components/Farmer";
import Traders from "./components/TradersList";
import TransporterList from "./components/TransporterList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />

        <Route element={<Layout />}>
          <Route path="/manage-goods" element={<Goods />} />
          <Route path="/view-traders" element={<TradersList />} />
          <Route path="/view-transporters" element={<TransportersTable />} />
          <Route path="/requests" element={<TransportBookingTable />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<PurchaseOrdersTable />} />
          <Route path="/farmers" element={<Farmer />} />
          <Route path="/traders" element={<Traders />} />
          <Route path="/transporters" element={<TransporterList />} />
          {/* <Route path="/goods-list" element={<GoodsList />} />
          <Route path="/view-farmers" element={<ViewFarmers />} />
          
          <Route path="/profile" element={<Profile />} />  */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
