import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { STATUSES, generateTrackingNumber, type Package } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = z.object({
  tracking_number: z.string().min(1, "Required"),
  sender_name: z.string().min(1, "Required"),
  recipient_name: z.string().min(1, "Required"),
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  estimated_delivery: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface PackageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  initialData?: Package | null;
  isLoading?: boolean;
}

export function PackageForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: PackageFormProps) {
  const isEdit = !!initialData;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          tracking_number: initialData.tracking_number,
          sender_name: initialData.sender_name,
          recipient_name: initialData.recipient_name,
          origin: initialData.origin,
          destination: initialData.destination,
          status: initialData.status,
          estimated_delivery: initialData.estimated_delivery || "",
        }
      : {
          tracking_number: generateTrackingNumber(),
          sender_name: "",
          recipient_name: "",
          origin: "",
          destination: "",
          status: "Order Placed",
          estimated_delivery: "",
        },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Package" : "Create New Package"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 pt-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="tracking_number">Tracking Number</Label>
            <div className="flex gap-2">
              <Input
                id="tracking_number"
                {...form.register("tracking_number")}
                readOnly={isEdit}
                className={isEdit ? "opacity-60" : ""}
              />
              {!isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    form.setValue("tracking_number", generateTrackingNumber())
                  }
                >
                  Generate
                </Button>
              )}
            </div>
            {form.formState.errors.tracking_number && (
              <p className="text-xs text-destructive">{form.formState.errors.tracking_number.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sender_name">Sender Name</Label>
              <Input id="sender_name" {...form.register("sender_name")} />
              {form.formState.errors.sender_name && (
                <p className="text-xs text-destructive">{form.formState.errors.sender_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipient_name">Recipient Name</Label>
              <Input id="recipient_name" {...form.register("recipient_name")} />
              {form.formState.errors.recipient_name && (
                <p className="text-xs text-destructive">{form.formState.errors.recipient_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="origin">Origin City</Label>
              <Input id="origin" {...form.register("origin")} />
              {form.formState.errors.origin && (
                <p className="text-xs text-destructive">{form.formState.errors.origin.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination City</Label>
              <Input id="destination" {...form.register("destination")} />
              {form.formState.errors.destination && (
                <p className="text-xs text-destructive">{form.formState.errors.destination.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(val) => form.setValue("status", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimated_delivery">Est. Delivery Date</Label>
              <Input
                id="estimated_delivery"
                type="date"
                {...form.register("estimated_delivery")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-accent-gradient text-accent-foreground hover:opacity-90">
              {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
