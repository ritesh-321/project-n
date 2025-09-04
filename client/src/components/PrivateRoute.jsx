import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        await API.get("/auth/data"); // 🔐 backend will check token
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!authorized) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
