import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient">
                <Package className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold">SwiftShip</span>
            </Link>
            <p className="mt-3 text-sm opacity-70">
              Reliable logistics solutions for businesses worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold">Quick Links</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm opacity-70">
              <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
              <Link to="/tracking" className="hover:opacity-100 transition-opacity">Track Package</Link>
        
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold">Contact</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm opacity-70">
              <p>support@swiftship.world</p>
              <p>+1 (800) 555-SHIP</p>
              <p>Mon-Fri, 8AM - 8PM EST</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-50">
          © {new Date().getFullYear()} SwiftShip Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
