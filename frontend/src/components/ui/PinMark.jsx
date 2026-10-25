import PropTypes from "prop-types";

// Old props (strokeColor / fillColor) are accepted but ignored, so existing usages keep working.
const PinMark = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 32 32" className={className} role="img" aria-label="SmartRent" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#384959" />
    <path d="M16 7.5 L6 16.2 H9.2 V24.5 H14 V19 H18 V24.5 H22.8 V16.2 H26 Z" fill="#FFFFFF" />
  </svg>
);

PinMark.propTypes = {
  className: PropTypes.string,
};

export default PinMark;