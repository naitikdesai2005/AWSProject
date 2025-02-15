import React, { useState, useEffect } from "react";
import { Search } from "react-feather";
import Sidebar from "../Sidebar/Sidebar.jsx";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Bakers = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [bakersData, setBakersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchBakersData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/bakersData"
        );
        if (response.data.status) {
          setBakersData(response.data.data);
        } else {
          setError("Failed to load bakers data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBakersData();
  }, []);

  const filteredBakers = bakersData.filter(
    (baker) =>
      baker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      baker.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      baker.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered bakers
  const totalPages = Math.ceil(filteredBakers.length / itemsPerPage);
  const currentItems = filteredBakers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen from-orange-100 to-pastel-peach">
      <Sidebar visible={isSidebarVisible} />

      <div className="flex-grow bg-white p-8 rounded-xl ml-64 mt-10 mx-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-brown-800">Bakers List</h2>
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full focus:ring-4 focus:ring-orange-400 focus:border-orange-300 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        <table className="w-full text-left bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-orange-100 text-orange-800 uppercase text-sm font-semibold">
            <tr>
              <th className="py-3 px-4">Baker Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Total Items</th>
              <th className="py-3 px-4">Total Orders</th>{" "}
              {/* Display total orders */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((baker, index) => (
              <tr
                key={baker.id}
                className={`transition-colors hover:bg-orange-50 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-4 flex items-center">{baker.name}</td>
                <td className="py-4 px-4">{baker.email}</td>
                <td className="py-4 px-4">{baker.products?.length || 0}</td>
                <td className="py-4 px-4">{baker.orders?.length || 0}</td>{" "}
                {/* Show total orders */}
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <p className="text-lg text-gray-700">
          Total Bakers: {filteredBakers.length}
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

export default Bakers;
