import { Link } from "react-router-dom";
import PinMark from "../components/ui/PinMark";
import Button from "../components/ui/Button";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
    <PinMark className="h-12 w-12 text-ink/20" />
    <h1 className="mt-5 font-display text-3xl font-semibold text-ink">Page not found</h1>
    <p className="mt-2 text-ink-soft">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="mt-6">
      <Button variant="primary">Back to home</Button>
    </Link>
  </div>
);

export default NotFound;
