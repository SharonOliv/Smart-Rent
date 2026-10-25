import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../utils/api";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await resetPassword({ token, newPassword });
      setMessage(data.message);
      setIsError(false);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not reset password.");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-8 text-center">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Set a new password</h1>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {message && <div className="mb-4"><Alert kind={isError ? "error" : "success"}>{message}</Alert></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="New password">
            <input
              type="password"
              className={inputClasses}
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Resetting..." : "Reset password"}
          </Button>
          <Link to="/login" className="block text-center text-sm text-ink-soft hover:text-ink">Back to login</Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;