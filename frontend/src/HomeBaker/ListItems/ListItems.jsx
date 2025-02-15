import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import { RotatingLines } from "react-loader-spinner";
import "jspdf-autotable";

const ListItems = () => {
  const [list, setList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const url = "http://localhost:3000";

  const fetchList = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/api/product/bakerProduct`, {
        headers: {
          token: token,
        },
      });
      if (response.data.success) {
        setList(response.data.data);
        setFilteredItems(response.data.data);
      } else {
        toast.error(response.data.message || "Error fetching products");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false); // Set loading to false once data is fetched
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = list.filter(
      (item) => item.name.toLowerCase().indexOf(query) >= 0
    );
    setFilteredItems(filtered);
  };

  const removeFood = async (foodId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/product/delete`,
        { productId: foodId },
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        toast.success("Food item deleted successfully!");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to delete food item.");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the item.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${url}/uploads/${rowData.image}`}
        alt={rowData.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return <p>Rs.{rowData.price}</p>;
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <p className="text-xs text-gray-600 w-full">{rowData.description}</p>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash" // Change label to icon for delete
        className="p-button-danger"
        onClick={() => removeFood(rowData._id)}
      />
    );
  };

  const header = (
    <div className="p-2">
      <input
        type="text"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        placeholder="Search for a food item"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );

  const footer = (
    <div className="p-2 text-right text-sm text-gray-600">
      <span>Displaying {filteredItems.length} items</span>
    </div>
  );

  // Function to generate PDF from the table data
  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredItems.map((item) => [
      item.name || "No name",
      item.price || "No price",
      item.category || "No category",
      item.description || "No description",
    ]);

    const columns = ["Name", "Price", "Category", "Description"];

    doc.autoTable({
      head: [columns],
      body: tableData,
      startY: 20,
    });

    doc.save("food-items.pdf");
  };

  return (
    <div className="list-items-container p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-opacity-50">
          <RotatingLines
            strokeColor="#f79c3e"
            strokeWidth="5"
            animationDuration="0.75"
            width="80"
            visible={true}
          />
        </div>
      ) : (
        <div>
          <Button
            label="Download PDF"
            icon="pi pi-download"
            className="p-button-success mb-4"
            onClick={downloadPDF}
          />
          <DataTable
            value={filteredItems}
            header={header}
            footer={footer}
            tableStyle={{ minWidth: "80rem" }}
            paginator
            rows={3}
            rowsPerPageOptions={[, 8]}
            className="p-datatable-striped"
          >
            <Column
              field="name"
              header="Name"
              className="font-medium text-sm sm:col-span-4"
            />
            <Column header="Image" body={imageBodyTemplate} />
            <Column field="price" header="Price" body={priceBodyTemplate} />
            <Column field="category" header="Category" />
            <Column
              field="description"
              header="Description"
              body={descriptionBodyTemplate}
              style={{ maxWidth: "400px", whiteSpace: "normal" }} 
            />
            <Column header="Delete" body={statusBodyTemplate} />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default ListItems;
