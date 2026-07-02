import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "Tenant",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      navigate("/personality-form");
    } catch (err) {
      setError(err.response?.data?.message || "Error signing up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-8 text-center">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">Takes about a minute &mdash; then a quick personality quiz.</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {error && <div className="mb-4"><Alert kind="error">{error}</Alert></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username">
              <input name="username" className={inputClasses} value={form.username} onChange={handleChange} required />
            </Field>
            <Field label="Password">
              <input
                type="password"
                name="password"
                className={inputClasses}
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </Field>
          </div>
          <Field label="Full name">
            <input name="name" className={inputClasses} value={form.name} onChange={handleChange} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <input type="email" name="email" className={inputClasses} value={form.email} onChange={handleChange} />
            </Field>
            <Field label="Phone">
              <input name="phone" className={inputClasses} value={form.phone} onChange={handleChange} />
            </Field>
          </div>
          <Field label="I am a...">
            <select name="role" className={inputClasses} value={form.role} onChange={handleChange}>
              <option value="Tenant">Tenant — looking to rent</option>
              <option value="Owner">Owner — listing a property</option>
            </select>
          </Field>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-ink-soft">
            Already have an account? <Link to="/login" className="text-blueprint hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
