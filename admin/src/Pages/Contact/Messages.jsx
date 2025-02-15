import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Messages = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  useEffect(() => {
    const storedStatus =
      JSON.parse(localStorage.getItem("emailSentStatus")) || {};
    setEmailSentStatus(storedStatus);

    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/contactus"
        );
        if (response.data.success) {
          setContacts(response.data.contacts);
        }
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  // Paginate contacts
  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const sendEmail = async () => {
    setIsSendingEmail(true);
    try {
      await axios.post("http://localhost:3000/api/user/send-email", {
        email: selectedEmail,
        message: emailMessage,
      });

      // Update sent status and store in localStorage
      const updatedStatus = { ...emailSentStatus, [selectedEmail]: true };
      setEmailSentStatus(updatedStatus);
      localStorage.setItem("emailSentStatus", JSON.stringify(updatedStatus));

      setSuccessMessage(`Email has been sent successfully to ${selectedEmail}`);
      setEmailMessage("");
      setTimeout(() => setShowEmailModal(false), 3000);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.log("Error sending email:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openEmailModal = (email) => {
    setSelectedEmail(email);
    setShowEmailModal(true);
    setEmailMessage("");
  };

  // Calculate total pages
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  return (
    <div className="flex min-h-screen">
      <Sidebar visible={isSidebarVisible} totalMessages={contacts.length} />{" "}
      {/* Pass total messages */}
      <div className="flex-grow p-6 bg-white rounded-lg mx-9 my-10 ml-64">
        <h2 className="text-3xl font-bold text-brown-800 mb-6">
          User Messages
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-orange-100 text-orange-700">
              <tr>
                <th className="py-3 px-4 font-semibold border-b">Name</th>
                <th className="py-3 px-4 font-semibold border-b">Email</th>
                <th className="py-3 px-4 font-semibold border-b">Phone</th>
                <th className="py-3 px-4 font-semibold border-b">Message</th>
                <th className="py-3 px-4 font-semibold border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact) => (
                <tr key={contact._id} className="transition duration-200">
                  <td className="py-3 px-4 border-b text-gray-800">
                    {contact.name}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-800">
                    {contact.email}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-800">
                    {contact.phone}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-800">
                    {contact.message}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {!emailSentStatus[contact.email] ? (
                      <button
                        onClick={() => openEmailModal(contact.email)}
                        className="bg-orange-400 text-white py-2 px-4 rounded-lg hover:bg-orange-500 transition duration-300"
                      >
                        Send Email
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Sent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-lg font-semi text-gray-700">
          <p>Total Messages: {contacts.length}</p>
        </div>

        {successMessage && (
          <div className="mt-4 text-green-600 text-lg font-semibold">
            {successMessage}
          </div>
        )}

        {/* Pagination Controls */}
        <Stack spacing={2} className="mt-6 items-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </Stack>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full animate__animated animate__fadeIn">
            <h3 className="text-xl font-bold text-brown-700 mb-4">
              Send Custom Email
            </h3>
            <textarea
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-32 p-3 border border-brown-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-gray-200 text-brown-700 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              {!emailSentStatus[selectedEmail] ? (
                <button
                  onClick={sendEmail}
                  disabled={isSendingEmail}
                  className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-300"
                >
                  {isSendingEmail ? "Sending..." : "Send Email"}
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Send Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
