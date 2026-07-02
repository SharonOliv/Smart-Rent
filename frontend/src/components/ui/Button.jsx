import PropTypes from "prop-types";

const variants = {
  primary:
    "bg-ink text-paper hover:bg-blueprint focus-visible:bg-blueprint disabled:bg-ink-soft/50",
  brass:
    "bg-brass text-ink hover:bg-brass-light focus-visible:bg-brass-light disabled:bg-brass/40",
  outline:
    "bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink/5 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 disabled:opacity-50",
  danger:
    "bg-transparent text-clay border border-clay/40 hover:bg-clay/10 disabled:opacity-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(Object.keys(variants)),
  size: PropTypes.oneOf(Object.keys(sizes)),
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
