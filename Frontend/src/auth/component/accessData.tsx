import React, { useEffect, useState } from "react";
import api from "../../api";

const SecureData: React.FC = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const response = await api.get("/secure", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the request
          },
        });
        setData(response.data as string);
      } catch (error: any) {
        console.error(
          "Failed to fetch data:",
          error?.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Secure Data</h1>
      <p>{data || "No data available"}</p>
    </div>
  );
};

export default SecureData;
