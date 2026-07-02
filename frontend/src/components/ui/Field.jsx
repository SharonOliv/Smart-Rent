import PropTypes from "prop-types";

const Field = ({ label, children, hint, error }) => (
  <label className="block">
    {label && (
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </span>
    )}
    {children}
    {hint && !error && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    {error && <span className="mt-1 block text-xs text-clay">{error}</span>}
  </label>
);

Field.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  hint: PropTypes.string,
  error: PropTypes.string,
};

export const inputClasses =
  "w-full rounded-lg border border-ink/15 bg-paper px-3.5 py-2.5 text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-brass";

export default Field;
