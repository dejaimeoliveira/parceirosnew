import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { getAuthErrorMessageFromCode } from "@/lib/auth/error-messages";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error_code?: string; type?: string }>;
}) {
  const params = await searchParams;

  if (params?.type === "recovery") {
    return (
      <>
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-2xl">Link inválido ou expirado</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted-foreground">
          Este link de alteração de senha não é mais válido. Solicite um novo link para continuar.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href="/protected/alterar-senha">Solicitar novo link</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-2xl">Ocorreu um erro.</CardTitle>
      </CardHeader>
      <p className="text-sm text-muted-foreground">
        {getAuthErrorMessageFromCode(params?.error_code, "confirm")}
      </p>
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error_code?: string; type?: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-6">
              <Suspense
                fallback={
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-2xl">Ocorreu um erro.</CardTitle>
                  </CardHeader>
                }
              >
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
