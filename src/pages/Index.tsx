import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Truck, Globe, Shield, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const services = [
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Next-day delivery for time-sensitive shipments across the country.",
  },
  {
    icon: Globe,
    title: "Global Freight",
    description: "International shipping solutions with customs clearance support.",
  },
  {
    icon: Shield,
    title: "Secure Handling",
    description: "Insured packages with real-time monitoring and safe handling protocols.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description: "Track every package with live updates from origin to destination.",
  },
];

export default function Index() {
  const [trackingInput, setTrackingInput] = useState("");
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingInput.trim()) {
      navigate(`/tracking?q=${encodeURIComponent(trackingInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient py-24 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-accent blur-[140px]" />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="animate-fade-in font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Deliver with
            <span className="text-gradient"> Confidence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70 animate-fade-in [animation-delay:200ms]">
            Fast, reliable logistics solutions that keep your business moving.
            Track shipments in real time, anywhere in the world.
          </p>

          {/* Tracking search bar */}
          <div className="mx-auto mt-10 flex max-w-xl gap-2 animate-fade-in [animation-delay:400ms]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter tracking number (e.g. SWF123456789)"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="h-12 pl-10 bg-card text-foreground border-0 text-base"
              />
            </div>
            <Button
              onClick={handleTrack}
              className="h-12 px-6 bg-accent-gradient text-accent-foreground font-semibold hover:opacity-90"
            >
              Track
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Our Services
            </h2>
            <p className="mt-3 text-muted-foreground">
              End-to-end logistics solutions tailored to your needs
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <div
                key={service.title}
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold">
            Ready to ship?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Get started with SwiftShip today and experience logistics done right.
          </p>
          <Button
            onClick={() => navigate("/tracking")}
            className="mt-6 h-12 px-8 bg-accent-gradient text-accent-foreground font-semibold hover:opacity-90"
          >
            Track a Package
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
