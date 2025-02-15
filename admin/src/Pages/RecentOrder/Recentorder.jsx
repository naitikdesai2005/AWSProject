import React, { useState, useEffect } from "react";
import { Search } from "react-feather";
import Sidebar from "../Sidebar/Sidebar.jsx";
import axios from "axios";

const Bakers = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [bakersData, setBakersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 4;

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

  const totalPages = Math.ceil(filteredBakers.length / itemsPerPage);
  const currentItems = filteredBakers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h from-orange-100 to-pastel-peach">
      <Sidebar visible={isSidebarVisible} />

      <div className="flex-grow bg-white p-8 rounded-xl shadow-xl ml-0 mt-10 mx-1">
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
              <th className="py-3 px-4"></th> {/* Empty header for spacing */}
              <th className="py-3 px-4">Baker Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Total Items</th>
              <th className="py-3 px-4">Total Orders</th>
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
                <td className="py-4 px-4"></td> {/* Empty cell for spacing */}
                <td className="py-4 px-4 flex items-center">{baker.name}</td>
                <td className="py-4 px-4">{baker.email}</td>
                <td className="py-4 px-4">{baker.products?.length || 0}</td>
                <td className="py-4 px-4">{baker.orders?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 text-gray-600">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredBakers.length)} of{" "}
            {filteredBakers.length}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full"
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors ${
                  currentPage === index + 1
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-200 text-gray-800"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full"
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bakers;
