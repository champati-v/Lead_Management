import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lead } from "@/types/leads";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email is required"),
  source: z.enum(["website", "instagram", "referral"]),
  status: z.enum(["new", "contacted", "qualified", "lost"]),
});

export type LeadFormValues = z.infer<typeof schema>;

export function LeadFormDialog({ open, onOpenChange, lead, loading, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; lead: Lead | null; loading: boolean; onSubmit: (values: LeadFormValues) => void }) {
  const form = useForm<LeadFormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", source: "website", status: "new" } });

  useEffect(() => {
    if (lead) {
      form.reset({ name: lead.name, email: lead.email, source: (lead.source as LeadFormValues["source"]) ?? "website", status: lead.status });
    } else {
      form.reset({ name: "", email: "", source: "website", status: "new" });
    }
  }, [lead, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5" overlayClassName="backdrop-blur-md">
        <DialogHeader><DialogTitle className="text-xl">{lead ? "Edit Lead" : "Create Lead"}</DialogTitle></DialogHeader>
        <form className="mt-3 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5"><Label className="text-sm">Name</Label><Input className="h-9 text-sm" {...form.register("name")} /><p className="text-xs text-destructive">{form.formState.errors.name?.message}</p></div>
          <div className="space-y-1.5"><Label className="text-sm">Email</Label><Input className="h-9 text-sm" {...form.register("email")} /><p className="text-xs text-destructive">{form.formState.errors.email?.message}</p></div>
          <div className="space-y-1.5">
            <Label className="text-sm">Source</Label>
            <Select value={form.watch("source")} onValueChange={(value) => form.setValue("source", value as LeadFormValues["source"], { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Status</Label>
            <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as LeadFormValues["status"], { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="h-9 w-full text-sm" disabled={loading} type="submit">{loading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
