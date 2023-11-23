import React, { useEffect, useState } from "react";

const StudentDashBoard = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchRequestData();
  }, []);

  const fetchRequestData = async () => {
    const studentId = "655dc58d8f6f0f87ed8b59cd";
    const statuses = ["accepted", "returning"]; // Use an array for multiple statuses
    const statusQueryParam = statuses.join(",");

    try {
      const response = await fetch(
        `http://localhost:3000/api/transaction/srequests/${studentId}?status=${statusQueryParam}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      // Ensure that data.requests and data.equipments are arrays
      const requestsArray = Array.isArray(data.requests) ? data.requests : [];
      const equipmentsArray = Array.isArray(data.equipments)
        ? data.equipments
        : [];

      const requestDataArray = requestsArray.map((request, index) => {
        return {
          request: requestsArray[index] || {},
          equipment: equipmentsArray[index] || {},
        };
      });

      // Check if requestDataArray is not empty before updating the state
      if (requestDataArray.length > 0) {
        setTableData(requestDataArray);
      } else {
        console.error(
          "Error fetching requests: Request or equipments array is empty",
          data
        );
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const sendReturnRequest = async (transactionId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/transaction/return",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: "655dc58d8f6f0f87ed8b59cd", // Replace with the actual studentId
            transactionId: transactionId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        throw new Error(errorData.error);
      }
      fetchRequestData();
    } catch (error) {
      console.error("Error sending request:", error.message);
      // Handle the error, show a notification, or take other actions as needed
    }
  };

  const columnNames = [
    "S.No",
    "Equipment Name",
    "lab",
    "Quantity",
    "Last date of Return",
    "Action",
  ];
  const returnedHeader = [
    "S.No",
    "Equipment Name",
    "Quantity",
    "Last date of Return",
    "Status",
  ];

  const renderEquipedRow = (data, index) => {
    const { equipment, request } = data;

    return (
      <tr className="text-center" key={index}>
        <td className="border p-2">{index + 1}</td>
        <td className="border p-2">{equipment.name}</td>
        <td className="border p-2">{request.lab}</td>
        <td className="border p-2">{request.quantity}</td>
        <td className="border p-2">{request.returnDate}</td>
        <td className="border p-2">
          <div className="flex items-center justify-center">
            {request.status === "returning" ? (
              <span className="text-yellow-500">Waiting for Approval</span>
            ) : (
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded-md flex items-center mr-1"
                onClick={() => sendReturnRequest(request._id)}
              >
                Return
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderReturnedRow = (data, index) => {
    return (
      <tr className="text-center" key={index}>
        <td className="border p-2">{index + 1}</td>
        <td className="border p-2">{data.equipmentName}</td>
        <td className="border p-2">{data.quantity}</td>
        <td className="border p-2">{data.lastReturnDate}</td>
        <td className="border p-2">Waiting for Approval</td>
      </tr>
    );
  };

  const renderEquipedHeader = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        {columnNames.map((columnName, index) => (
          <th className="border p-2 text-center" key={index}>
            {columnName}
          </th>
        ))}
      </tr>
    );
  };

  const renderReturnedHeader = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        {returnedHeader.map((columnName, index) => (
          <th className="border p-2 text-center" key={index}>
            {columnName}
          </th>
        ))}
      </tr>
    );
  };

  return (
    <div className="overflow-auto max-w-[83vw] max-h-[1000px] mt-4">
      <div className="flex justify-center">
        <h3 className="font-bold text-3xl text-[#3dafaa]">Equiped Items</h3>
      </div>
      <table className="w-full border-collapse border">
        <thead className="sticky top-0">{renderEquipedHeader()}</thead>
        <tbody>
          {tableData.map((data, index) => renderEquipedRow(data, index))}
        </tbody>
      </table>
      <div className="flex justify-center mt-8">
        <h3 className="font-bold text-3xl text-[#3dafaa]">Returned Items</h3>
      </div>
      <table className="w-full border-collapse border">
        <thead className="sticky top-0">{renderReturnedHeader()}</thead>
        <tbody>
          {/* {tableData.map((data, index) => renderReturnedRow(data, index))} */}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashBoard;
