import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in to EngineerOS</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={from && from !== "/login" ? from : "/"} />
        </CardContent>
      </Card>
    </div>
  );
}
