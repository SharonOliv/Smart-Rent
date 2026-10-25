import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OwnerOnly = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === "Owner") return children;
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Owner accounts only</h1>
      <p className="mt-2 text-sm text-ink-soft">
        This page is for property owners. You can switch your account type in your profile.
      </p>
      <Link to="/profile" className="mt-5 inline-block text-sm font-semibold text-ink underline">
        Go to profile
      </Link>
    </div>
  );
};

OwnerOnly.propTypes = { children: PropTypes.node };

export default OwnerOnly;