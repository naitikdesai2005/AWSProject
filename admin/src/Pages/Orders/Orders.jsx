import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "react-feather";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Orders = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/ordersData"
        );
        if (response.data.status) {
          setOrders(response.data.data);
        } else {
          setError("Failed to load orders data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="flex min-h-screen from-orange-100 to-pastel-peach">
      <Sidebar visible={isSidebarVisible} />

      <div className="flex-grow bg-white p-8 rounded-xl ml-64 mt-10 mx-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-brown-800">Orders List</h2>
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Search by email, address, or status"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full focus:ring-4 focus:ring-orange-400 focus:border-orange-300 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-left bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-100 text-orange-800 uppercase text-sm font-semibold">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order, index) => (
                <tr
                  key={index}
                  className={`transition-colors hover:bg-orange-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-4">{order.email}</td>
                  <td className="py-4 px-4">{order.address}</td>
                  <td className="py-4 px-4">{order.totalPrice}</td>
                  <td className="py-4 px-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <br />
        <p className="text-lg text-gray-700">
          Total Orders: {filteredOrders.length}
        </p>

        <Stack spacing={2} className="mt-8 items-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
};

export default Orders;
