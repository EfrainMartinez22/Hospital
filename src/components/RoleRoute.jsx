import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowed, children }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (!user || !allowed.includes(user.role)) return <Navigate to="/no-autorizado" replace />;
  return children;
}