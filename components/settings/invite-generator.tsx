"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createInvite } from "@/app/settings/actions";
import { toast } from "sonner";
import { UserPlus, Copy } from "lucide-react";

export function InviteGenerator() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const generate = async () => {
    setPending(true);
    try {
      const token = await createInvite(email || undefined);
      setLink(`${window.location.origin}/register?invite=${token}`);
    } finally {
      setPending(false);
    }
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast.success("Invite link copied");
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <UserPlus className="h-4 w-4 text-muted-foreground" />
          Invite someone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="invite-email">Email (optional)</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={generate} disabled={pending}>
          {pending ? "Generating…" : "Generate invite link"}
        </Button>
        {link && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-2">
            <code className="flex-1 truncate text-xs text-muted-foreground">{link}</code>
            <Button size="icon-xs" variant="ghost" onClick={copy} aria-label="Copy invite link">
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Expires in 7 days, single use. Shown once — copy it now.</p>
      </CardContent>
    </Card>
  );
}
