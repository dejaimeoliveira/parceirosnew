import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-brand-background px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-[540px]">
        <LoginForm />
      </div>
    </main>
  );
}
