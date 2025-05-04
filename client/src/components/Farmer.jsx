import React, { useEffect, useState } from "react";
import TradersList from "./Traders";
import axiosInstance from "../api/axios";

const Farmer = () => {
  const [farmer, setFarmer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const fetchData = async () => {
    try {
      const userRole = localStorage.getItem("userRole");
      setRole(userRole);

      const res = await axiosInstance.get("/getUseryByRole/farmer");
      setFarmer(res.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/deleteUser/${id}`);
      // setFarmer((prev) => prev.filter((f) => f._id !== id)); // update local state
      fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <TradersList
        traders={farmer}
        loading={loading}
        role={role}
        onDelete={handleDelete}
        // fetchData={fetchData}
      />
    </div>
  );
};

export default Farmer;
