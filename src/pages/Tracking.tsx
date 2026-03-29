import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, PackageX, MapPin, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { fetchPackageByTracking } from "@/lib/supabase-helpers";

const statusColors: Record<string, string> = {
  "Order Placed": "bg-muted text-muted-foreground",
  "Picked Up": "bg-blue-100 text-blue-700",
  "In Transit": "bg-yellow-100 text-yellow-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  "Delivered": "bg-green-100 text-green-700",
};

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const { data: pkg, isLoading, isError } = useQuery({
    queryKey: ["tracking", query],
    queryFn: () => fetchPackageByTracking(query),
    enabled: !!query,
  });

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      setQuery(q);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (input.trim()) setQuery(input.trim());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-navy-gradient py-12">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Track Your Package
          </h1>
          <p className="mt-2 text-primary-foreground/70">
            Enter your tracking number to see real-time shipment updates
          </p>
          <div className="mx-auto mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter tracking number..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 pl-10 bg-card text-foreground border-0 text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-6 bg-accent-gradient text-accent-foreground font-semibold hover:opacity-90"
            >
              Track
            </Button>
          </div>
        </div>
      </section>

      <section className="flex-1 py-10">
        <div className="container max-w-3xl">
          {isLoading && (
            <div className="text-center py-20">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              <p className="mt-4 text-muted-foreground">Looking up your package...</p>
            </div>
          )}

          {!isLoading && query && !pkg && (
            <Card className="text-center py-12 animate-fade-in">
              <CardContent>
                <PackageX className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 font-display text-xl font-semibold">
                  Package Not Found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We couldn't find a package with tracking number{" "}
                  <span className="font-mono font-semibold text-foreground">{query}</span>.
                  Please double-check and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {pkg && (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <CardTitle className="font-display text-2xl font-mono">
                        {pkg.tracking_number}
                      </CardTitle>
                    </div>
                    <Badge className={`text-sm px-3 py-1 ${statusColors[pkg.status] || ""}`}>
                      {pkg.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Sender</p>
                        <p className="font-medium">{pkg.sender_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Recipient</p>
                        <p className="font-medium">{pkg.recipient_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Route</p>
                        <p className="font-medium">{pkg.origin} → {pkg.destination}</p>
                      </div>
                    </div>
                    {pkg.estimated_delivery && (
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                          <p className="font-medium">
                            {format(new Date(pkg.estimated_delivery), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Shipment Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrackingTimeline pkg={pkg} />
                </CardContent>
              </Card>
            </div>
          )}

          {!query && (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="mx-auto h-16 w-16 opacity-30" />
              <p className="mt-4">Enter a tracking number above to get started</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
