import { Link } from "react-router-dom";
import PinMark from "../ui/PinMark";

const Footer = () => (
  <footer className="border-t border-ink/10 bg-ink text-paper/80">
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <PinMark className="h-7 w-7" strokeColor="#F2F0E6" fillColor="#C2873E" />
            <span className="font-display text-lg font-semibold text-paper">Smart Rent</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
            A straightforward way to find a place to live, list a property, and book it with
            confidence.
          </p>
        </div>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/rent" className="hover:text-brass-light">Browse listings</Link></li>
            <li><Link to="/post" className="hover:text-brass-light">Post a property</Link></li>
            <li><Link to="/matches" className="hover:text-brass-light">Roommate matches</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-brass-light">About us</Link></li>
            <li><Link to="/contact" className="hover:text-brass-light">Contact</Link></li>
            <li><Link to="/report-issue" className="hover:text-brass-light">Report an issue</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>support@smartrent.com</li>
            <li>+1-800-555-RENT</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-paper/10 pt-6 font-mono text-xs text-paper/40">
        © {new Date().getFullYear()} Smart Rent. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
