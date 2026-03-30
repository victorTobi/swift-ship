import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Navbar } from "@/components/Navbar";
import { PackageForm } from "@/components/PackageForm";
import { AdminGate } from "@/components/AdminGate";
import {
  fetchAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  type Package as Pkg,
  type ShipmentStatus,
  statusTimestampMap,
} from "@/lib/supabase-helpers";

const statusColors: Record<string, string> = {
  "Order Placed": "bg-muted text-muted-foreground",
  "Picked Up": "bg-blue-100 text-blue-700",
  "In Transit": "bg-yellow-100 text-yellow-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  "Delivered": "bg-green-100 text-green-700",
  "Seized": "bg-red-100 text-red-700",
  "Suspended": "bg-purple-100 text-purple-700",
};

export default function Admin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editPkg, setEditPkg] = useState<Pkg | null>(null);
  const [deletePkg, setDeletePkg] = useState<Pkg | null>(null);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchAllPackages,
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const insert = {
        tracking_number: data.tracking_number as string,
        sender_name: data.sender_name as string,
        recipient_name: data.recipient_name as string,
        origin: data.origin as string,
        destination: data.destination as string,
        status: data.status as string,
        current_location: (data.current_location as string) || null,
        estimated_delivery: (data.estimated_delivery as string) || null,
        order_placed_at: new Date().toISOString(),
      };
      return createPackage(insert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setFormOpen(false);
      toast.success("Package created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const updates: Record<string, unknown> = {
        sender_name: data.sender_name,
        recipient_name: data.recipient_name,
        origin: data.origin,
        destination: data.destination,
        status: data.status,
        current_location: (data.current_location as string) || null,
        estimated_delivery: (data.estimated_delivery as string) || null,
      };
      // Set timestamp for the status
      const status = data.status as ShipmentStatus;
      const tsKey = statusTimestampMap[status];
      if (tsKey && !editPkg?.[tsKey]) {
        updates[tsKey] = new Date().toISOString();
      }
      return updatePackage(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setEditPkg(null);
      toast.success("Package updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setDeletePkg(null);
      toast.success("Package deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = packages.filter(
    (p) =>
      p.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      p.recipient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminGate>
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage all shipments</p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="bg-accent-gradient text-accent-foreground font-semibold hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Package
          </Button>
        </div>

        {/* Search */}
        <div className="mt-6 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tracking # or recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="mt-6 rounded-xl border bg-card overflow-auto">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Package className="mx-auto h-12 w-12 opacity-30" />
              <p className="mt-3">No packages found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead className="hidden md:table-cell">Origin</TableHead>
                  <TableHead className="hidden md:table-cell">Destination</TableHead>
                  <TableHead>Status</TableHead>
                  
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="group">
                    <TableCell className="font-mono text-sm font-medium">
                      {p.tracking_number}
                    </TableCell>
                    <TableCell>{p.recipient_name}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.origin}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.destination}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${statusColors[p.status] || ""}`}>
                        {p.status}
                      </Badge>
                    </TableCell>


                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditPkg(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletePkg(p)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Create form */}
      <PackageForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data) => createMutation.mutate(data as Record<string, unknown>)}
        isLoading={createMutation.isPending}
      />

      {/* Edit form */}
      {editPkg && (
        <PackageForm
          key={editPkg.id}
          open={!!editPkg}
          onOpenChange={(open) => !open && setEditPkg(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editPkg.id, data: data as Record<string, unknown> })
          }
          initialData={editPkg}
          isLoading={updateMutation.isPending}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deletePkg} onOpenChange={(o) => !o && setDeletePkg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete package{" "}
              <span className="font-mono font-semibold">{deletePkg?.tracking_number}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePkg && deleteMutation.mutate(deletePkg.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </AdminGate>
  );
}
