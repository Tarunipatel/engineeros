import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "./register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Create your EngineerOS account</CardTitle>
        </CardHeader>
        <CardContent>
          {invite ? (
            <RegisterForm invite={invite} />
          ) : (
            <p className="text-sm text-muted-foreground">
              This page needs a valid invite link to register. Ask whoever invited you for the link.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
