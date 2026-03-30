import { STATUSES, type Package, type ShipmentStatus, statusTimestampMap } from "@/lib/supabase-helpers";
import { CheckCircle2, Circle, Package as PackageIcon, Truck, MapPin, Home, ShieldAlert, PauseCircle } from "lucide-react";
import { format } from "date-fns";

const TIMELINE_STATUSES = ["Order Placed", "Picked Up", "In Transit", "Out for Delivery", "Delivered"] as const;

const statusIcons: Record<string, typeof PackageIcon> = {
  "Order Placed": PackageIcon,
  "Picked Up": MapPin,
  "In Transit": Truck,
  "Out for Delivery": Truck,
  "Delivered": Home,
};

interface TrackingTimelineProps {
  pkg: Package;
}

export function TrackingTimeline({ pkg }: TrackingTimelineProps) {
  const isSpecialStatus = pkg.status === "Seized" || pkg.status === "Suspended";
  const currentIdx = isSpecialStatus ? -1 : TIMELINE_STATUSES.indexOf(pkg.status as typeof TIMELINE_STATUSES[number]);

  return (
    <div className="relative space-y-4">
      {isSpecialStatus && (
        <div className={`flex items-center gap-3 rounded-lg p-4 ${pkg.status === "Seized" ? "bg-red-50 border border-red-200 text-red-800" : "bg-purple-50 border border-purple-200 text-purple-800"}`}>
          {pkg.status === "Seized" ? <ShieldAlert className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
          <div>
            <p className="font-semibold">Shipment {pkg.status}</p>
            <p className="text-sm opacity-80">
              {pkg.status === "Seized"
                ? "This shipment has been seized by authorities. Please contact support."
                : "This shipment has been temporarily suspended. Please contact support."}
            </p>
          </div>
        </div>
      )}

      {/* Mobile: vertical timeline */}
      <div className="flex flex-col gap-0 md:hidden">
        {TIMELINE_STATUSES.map((status, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const tsKey = statusTimestampMap[status as ShipmentStatus];
          const timestamp = tsKey ? (pkg[tsKey] as string | null) : null;
          const Icon = statusIcons[status];

          return (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-muted bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-4 ring-accent/20" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {idx < TIMELINE_STATUSES.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-[2rem] ${
                      idx < currentIdx ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
              <div className="pb-6 pt-1.5">
                <p className={`text-sm font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                  {status}
                </p>
                {timestamp && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(timestamp), "MMM d, yyyy · h:mm a")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {TIMELINE_STATUSES.map((status, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const tsKey = statusTimestampMap[status as ShipmentStatus];
            const timestamp = tsKey ? (pkg[tsKey] as string | null) : null;
            const Icon = statusIcons[status];

            return (
              <div key={status} className="flex flex-1 flex-col items-center relative">
                {idx > 0 && (
                  <div
                    className={`absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                      idx <= currentIdx ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-muted bg-card text-muted-foreground"
                  } ${isCurrent ? "ring-4 ring-accent/20 scale-110" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <p className={`mt-3 text-xs font-semibold text-center ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                  {status}
                </p>
                {timestamp && (
                  <p className="mt-1 text-[11px] text-muted-foreground text-center">
                    {format(new Date(timestamp), "MMM d, yyyy")}
                    <br />
                    {format(new Date(timestamp), "h:mm a")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
