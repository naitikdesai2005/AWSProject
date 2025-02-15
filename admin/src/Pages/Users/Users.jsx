import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "react-feather";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Users = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/usersData"
        );
        if (response.data.status) {
          setUsers(response.data.data);
        } else {
          setError("Failed to load users data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalOrders = filteredUsers.reduce(
    (total, user) => total + (user.orderCount || 0),
    0
  );
  const totalUsers = filteredUsers.length;

  return (
    <div className="flex min-h from-orange-100 to-pastel-peach">
      <Sidebar visible={isSidebarVisible} />
      <div className="flex-grow bg-white p-8 rounded-xl ml-64 mt-10 mx-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-brown-800">Users List</h2>
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full focus:ring-4 focus:ring-orange-400 focus:border-orange-300 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <table className="w-full text-left bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-100 text-orange-800 uppercase text-sm font-semibold">
              <tr>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr
                  key={user.email} // Updated key to user.email
                  className={`transition-colors hover:bg-orange-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">{user.orderCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <br />
        <div className="text-lg text-gray-700 font-semi">
          <p>Total Users: {totalUsers}</p>
          <p>Total Orders: {totalOrders}</p>
        </div>

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

export default Users;
