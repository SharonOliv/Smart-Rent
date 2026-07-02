import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "../utils/api";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";
import PinMark from "../components/ui/PinMark";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [devToken, setDevToken] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!username) {
      setMessage("Please enter your username.");
      setIsError(true);
      return;
    }
    try {
      const data = await requestPasswordReset(username.trim());
      setMessage(data.message);
      setIsError(false);
      if (data.devResetToken) setDevToken(data.devResetToken);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
      setIsError(true);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
      <div className="mb-8 text-center">
        <PinMark className="mx-auto h-10 w-10" strokeColor="#16232B" fillColor="#C2873E" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-soft">We'll generate a reset token for your account.</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {message && <div className="mb-4"><Alert kind={isError ? "error" : "success"}>{message}</Alert></div>}
        {devToken && (
          <div className="mb-4">
            <Alert kind="warning">
              <strong>Dev mode:</strong> no email service is configured yet, so here's your token directly:{" "}
              <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono">{devToken}</code>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="brass"
                  size="sm"
                  onClick={() => navigate("/reset-password", { state: { username, token: devToken } })}
                >
                  Continue to reset password
                </Button>
              </div>
            </Alert>
          </div>
        )}
        <form onSubmit={handleReset} className="space-y-4">
          <Field label="Username">
            <input
              className={inputClasses}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" variant="primary" className="w-full">Send reset token</Button>
          <Link to="/login" className="block text-center text-sm text-ink-soft hover:text-ink">Back to login</Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
