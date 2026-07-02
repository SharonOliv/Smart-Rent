import PropTypes from "prop-types";

const alertStyles = {
  success: "bg-moss/10 border-moss/30 text-moss",
  error: "bg-clay/10 border-clay/30 text-clay",
  info: "bg-blueprint/10 border-blueprint/30 text-blueprint",
  warning: "bg-brass/15 border-brass/40 text-[#8a5a1f]",
};

export const Alert = ({ kind = "info", children }) => (
  <div className={`rounded-lg border px-4 py-3 text-sm ${alertStyles[kind]}`} role="status">
    {children}
  </div>
);

Alert.propTypes = {
  kind: PropTypes.oneOf(Object.keys(alertStyles)),
  children: PropTypes.node,
};

export const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-ink/8 text-ink",
    moss: "bg-moss/12 text-moss",
    brass: "bg-brass/15 text-[#8a5a1f]",
    blueprint: "bg-blueprint/10 text-blueprint",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  tone: PropTypes.oneOf(["neutral", "moss", "brass", "blueprint"]),
};
