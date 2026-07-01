"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createApplication, updateApplication } from "@/app/applications/actions";
import type { ApplicationStage } from "@/db/schema";

export type ApplicationRow = {
  id: number;
  company: string;
  role: string;
  stage: ApplicationStage;
  appliedDate: string | null;
  recruiterName: string | null;
  referral: boolean;
  salary: string | null;
  notes: string | null;
};

export function ApplicationCardDialog({
  open,
  onOpenChange,
  application,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationRow | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    company: "",
    role: "",
    appliedDate: "",
    recruiterName: "",
    referral: false,
    salary: "",
    notes: "",
  });

  useEffect(() => {
    if (application) {
      setForm({
        company: application.company,
        role: application.role,
        appliedDate: application.appliedDate ?? "",
        recruiterName: application.recruiterName ?? "",
        referral: application.referral,
        salary: application.salary ?? "",
        notes: application.notes ?? "",
      });
    } else if (open) {
      setForm({ company: "", role: "", appliedDate: "", recruiterName: "", referral: false, salary: "", notes: "" });
    }
  }, [application, open]);

  const save = async () => {
    if (application) {
      await updateApplication(application.id, form);
    } else {
      await createApplication(form);
    }
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{application ? "Edit Application" : "New Application"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Applied Date</Label>
              <Input type="date" value={form.appliedDate} onChange={(e) => setForm({ ...form, appliedDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Salary</Label>
              <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Recruiter</Label>
              <Input value={form.recruiterName} onChange={(e) => setForm({ ...form, recruiterName: e.target.value })} />
            </div>
            <div className="flex items-end gap-2 pb-1.5">
              <Checkbox checked={form.referral} onCheckedChange={(c) => setForm({ ...form, referral: Boolean(c) })} />
              <Label className="text-xs text-muted-foreground">Referral</Label>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={save} disabled={!form.company || !form.role}>
            {application ? "Save changes" : "Add application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
