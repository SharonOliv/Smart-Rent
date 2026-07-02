import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PinMark from "./ui/PinMark";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <PinMark className="h-10 w-10 animate-pulse" strokeColor="#C2873E" />
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
