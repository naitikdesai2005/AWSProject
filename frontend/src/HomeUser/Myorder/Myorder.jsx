import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../pages/context/StoreContext";
import UserNavbar from "../UserNavbar/UserNavbar";
import Footer from "../../pages/Footer/Footer";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { token, currency } = useContext(StoreContext);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState();

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/order/user-orders",
        {},
        { headers: { token } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch orders",
      });
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/order/update",
        { orderId: orderIdToCancel, cancel: true },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Order canceled successfully",
        });

        setData((prevData) =>
          prevData.map((order) =>
            order._id === orderIdToCancel
              ? { ...order, status: "Cancelled" }
              : order
          )
        );
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to cancel order",
      });
    } finally {
      setVisible(false);
    }
  };

  const accept = () => {
    handleCancelOrder();
  };

  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Action Cancelled",
      detail: "Order was not canceled",
    });
    setVisible(false);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const generateBillPDF = async (order) => {
    const doc = new jsPDF();
    const logoUrl = "../../images/Logo.png"; // Your logo file path
    const photoUrl = order.items[0]?.productId?.image
      ? `http://localhost:3000/uploads/${order.items[0]?.productId?.image}`
      : "";

    try {
      // Add logo
      const logoImage = await fetch(logoUrl);
      if (logoImage.ok) {
        const logoBlob = await logoImage.blob();
        const logoBase64 = await blobToBase64(logoBlob);
        doc.addImage(logoBase64, "PNG", 80, 10, 50, 30);
      }

      // Add title
      doc.setFontSize(20);
      doc.setTextColor("#333333");
      doc.text("Order Bill", 20, 50);

      // Add order details
      doc.setFontSize(12);
      doc.text(`Order ID: ${order._id}`, 20, 70);
      doc.text(`Status: ${order.status}`, 20, 80);
      doc.text(`Total Price: Rs. ${order.totalPrice}`, 20, 90);

      // Add product image if available
      if (photoUrl) {
        const productImage = await fetch(photoUrl);
        if (productImage.ok) {
          const productBlob = await productImage.blob();
          const productBase64 = await blobToBase64(productBlob);
          doc.addImage(productBase64, "JPEG", 20, 100, 60, 60);
        }
      }

      // Prepare table data
      const columns = [
        { title: "Product", dataKey: "product" },
        { title: "Quantity", dataKey: "quantity" },
        { title: "Price per Item", dataKey: "price" },
        { title: "Total", dataKey: "total" },
      ];

      const tableData = order.items.map((item) => ({
        product: item.productId?.name || "Product Name Not Available",
        quantity: item.quantity,
        price: `Rs. ${item.productId?.price || 0}`,
        total: `Rs. ${item.quantity * (item.productId?.price || 0)}`,
      }));

      // Add table to the PDF
      doc.autoTable({
        columns: columns,
        body: tableData,
        startY: 170,
        theme: "grid",
        styles: {
          headFillColor: "#f79c3e",
          headTextColor: "#ffffff",
          textColor: "#333333",
          lineWidth: 0.2,
          lineColor: "#dddddd",
        },
        headStyles: {
          fillColor: "#f79c3e",
        },
      });

      // Add a subtle border
      doc.setLineWidth(0.5);
      doc.setDrawColor("#f79c3e");
      doc.rect(10, 10, 190, doc.internal.pageSize.height - 20);

      // Save the PDF
      doc.save(`${order._id}-bill.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <>
      <UserNavbar />
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="Are you sure you want to cancel this order?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
      />
      <div className="my-orders p-10 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-10">
          My Orders
        </h1>
        <div className="container mx-auto">
          {data.length === 0 ? (
            <h2 className="text-center text-2xl text-gray-600 mt-20">
              <span className="block text-5xl">😒</span>
              <span>Oops! You have no orders.</span>
            </h2>
          ) : (
            data.map((order) => (
              <div
                key={order._id}
                className="my-orders-order bg-white p-6 rounded-xl shadow-lg mb-8 transform transition duration-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold text-gray-800">
                    Order ID: {order._id}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Out for Delivery"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-lg text-gray-600 mb-2">
                  <strong>Total Price:</strong> {currency} {order.totalPrice}
                </p>
                <div className="order-items grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="order-item flex items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-indigo-50"
                    >
                      {item.productId && item.productId.image ? (
                        <img
                          src={`http://localhost:3000/uploads/${item.productId.image}`}
                          alt={item.productId.name || "Product Image"}
                          className="w-20 h-20 object-cover rounded-lg mr-4"
                        />
                      ) : (
                        <p className="text-sm text-gray-400">
                          Image not available
                        </p>
                      )}
                      <div className="item-details text-gray-700 text-sm space-y-1">
                        <p className="font-semibold text-lg">
                          {item.productId?.name || "Product Name Not Available"}
                        </p>
                        <p>
                          Quantity: <span>{item.quantity}</span>
                        </p>
                        <p>
                          Price per item:{" "}
                          <span className="font-medium">
                            {currency} {item.productId?.price || 0}
                          </span>
                        </p>
                        <p>
                          Total:{" "}
                          <span className="font-medium">
                            {currency}{" "}
                            {item.quantity * (item.productId?.price || 0)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => generateBillPDF(order)}
                    className="text-sm text-blue-500 font-semibold py-1 px-3 rounded-lg transition duration-300"
                  >
                    <i className="pi pi-download mr-1"></i>Download Bill
                  </button>
                  {order.status !== "Delivered" &&
                    order.status !== "Cancelled" &&
                    order.items.every((item) => item.productId !== null) && (
                      <button
                        onClick={() => {
                          setOrderIdToCancel(order._id);
                          setVisible(true);
                        }}
                        className="text-sm text-red font-semibold py-1 px-3 rounded-lg transition duration-300"
                      >
                        <i className="pi pi-times mr-1"></i>Cancel Order
                      </button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
