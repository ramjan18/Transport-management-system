import React, { useEffect, useState } from 'react'
import TradersList from './Traders'
import axiosInstance from '../api/axios'

const Traders = () => {
    const [trader,setTrader] = useState({});
    const [loading , setLoading] = useState(true)
    const [role , setRole] = useState("");
    const fetchData =async () =>{
        try {
            const userRole = localStorage.getItem("userRole");
            const res = await axiosInstance.get("/getUseryByRole/trader");
            setTrader(res.data.users);
            // console.log(res.data);
            setRole(userRole)
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }
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
      <TradersList traders={trader} loading={loading} role={role} onDelete ={handleDelete} />
    </div>
  );
}

export default Traders;
