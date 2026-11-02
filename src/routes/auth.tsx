import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, LoginForm } from "@/components/AuthForms";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — hiJOBS RWANDA" },
      { name: "description", content: "Sign in to your hiJOBS RWANDA account." },
      { property: "og:title", content: "Sign in — hiJOBS RWANDA" },
      { property: "og:description", content: "Access your job seeker, institution or admin dashboard." },
    ],
  }),
  component: () => (
    <AuthLayout title="Welcome back" sub="Sign in and we'll take you to your dashboard.">
      <div className="mb-5 grid grid-cols-2 gap-2 text-center text-xs">
        <Link to="/login/seeker" className="rounded-lg border border-border p-2 hover:border-primary">Job seeker sign-in</Link>
        <Link to="/login/institution" className="rounded-lg border border-border p-2 hover:border-gold">Institution sign-in</Link>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/join/seeker" className="text-primary-glow hover:underline">Find a job</Link> or <Link to="/join/institution" className="text-gold hover:underline">register an institution</Link>
      </p>
    </AuthLayout>
  ),
});
