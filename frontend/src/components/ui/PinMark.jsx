import PropTypes from "prop-types";

// The signature mark for Smart Rent: a map pin containing a simple house
// glyph. Reused as the logo, list bullets, loading indicator, and empty
// states so it reads as one consistent identity throughout the app.
const PinMark = ({ className = "", strokeColor = "currentColor", fillColor = "none" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 4C14.6 4 7 11.6 7 21c0 12.5 17 23 17 23s17-10.5 17-23c0-9.4-7.6-17-17-17Z"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="2.2"
    />
    <path
      d="M16.5 22.5 24 16l7.5 6.5"
      stroke={strokeColor}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 21v7.5h11V21"
      stroke={strokeColor}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

PinMark.propTypes = {
  className: PropTypes.string,
  strokeColor: PropTypes.string,
  fillColor: PropTypes.string,
};

export default PinMark;
