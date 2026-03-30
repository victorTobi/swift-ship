import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Package = Tables<"packages">;
export type PackageInsert = TablesInsert<"packages">;
export type PackageUpdate = TablesUpdate<"packages">;

export const STATUSES = [
  "Order Placed",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Seized",
  "Suspended",
] as const;

export type ShipmentStatus = (typeof STATUSES)[number];

export const statusTimestampMap: Partial<Record<ShipmentStatus, keyof Package>> = {
  "Order Placed": "order_placed_at",
  "Picked Up": "picked_up_at",
  "In Transit": "in_transit_at",
  "Out for Delivery": "out_for_delivery_at",
  "Delivered": "delivered_at",
};

export function generateTrackingNumber(): string {
  const prefix = "SWF";
  const num = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${num}`;
}

export async function fetchAllPackages() {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchPackageByTracking(trackingNumber: string) {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("tracking_number", trackingNumber.trim().toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPackage(pkg: PackageInsert) {
  const { data, error } = await supabase
    .from("packages")
    .insert(pkg)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePackage(id: string, updates: PackageUpdate) {
  // Auto-set timestamp for the current status
  const status = updates.status as ShipmentStatus | undefined;
  if (status && statusTimestampMap[status]) {
    const tsKey = statusTimestampMap[status];
    if (!(updates as Record<string, unknown>)[tsKey]) {
      (updates as Record<string, unknown>)[tsKey] = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from("packages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePackage(id: string) {
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw error;
}
