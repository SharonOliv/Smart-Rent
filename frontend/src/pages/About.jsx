import { ShieldCheck, Users, Sparkles, Compass } from "lucide-react";
import PinMark from "../components/ui/PinMark";

const values = [
  { icon: ShieldCheck, title: "Verified listings", body: "Every property is tied to a real owner account, so you know who you're dealing with." },
  { icon: Compass, title: "Real-time availability", body: "Bookings are checked against existing reservations, so you never lose a place to a double-booking." },
  { icon: Sparkles, title: "360° virtual tours", body: "Step inside a listing before you ever schedule a visit." },
  { icon: Users, title: "Roommate matching", body: "A short personality quiz helps connect tenants who are actually compatible." },
];

const team = [
  { name: "Kushala", role: "Product" },
  { name: "Olivia", role: "Engineering" },
  { name: "Soumika", role: "Design" },
  { name: "Yasaswini", role: "Marketing" },
];

const About = () => (
  <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">About us</span>
    <h1 className="mt-1 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
      Renting a home shouldn't feel like guesswork.
    </h1>
    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
      Smart Rent connects tenants and property owners directly &mdash; with real listings, instant
      booking, and tools that help you find not just a place, but the right place.
    </p>

    <div className="mt-14 grid gap-8 sm:grid-cols-2">
      {values.map(({ icon: Icon, title, body }) => (
        <div key={title} className="flex gap-4 rounded-2xl border border-ink/10 bg-paper p-6">
          <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brass" />
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-16">
      <h2 className="font-display text-2xl font-semibold text-ink">Meet the team</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((person) => (
          <div key={person.name} className="rounded-2xl border border-ink/10 bg-paper-deep p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
              {person.name.charAt(0)}
            </div>
            <p className="mt-3 font-display font-semibold text-ink">{person.name}</p>
            <p className="text-xs text-ink-soft">{person.role}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-16 flex items-center gap-3 rounded-2xl border border-brass/30 bg-brass/10 p-6">
      <PinMark className="h-8 w-8 shrink-0" strokeColor="#8a5a1f" />
      <p className="text-sm text-[#5a3c14]">
        Have feedback on a listing or a feature idea? We read every message that comes through the
        contact page.
      </p>
    </div>
  </div>
);

export default About;
