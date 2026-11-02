import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, LoginForm } from "@/components/AuthForms";

export const Route = createFileRoute("/login/seeker")({
  head: () => ({
    meta: [
      { title: "Job seeker sign in — hiJOBS RWANDA" },
      { name: "description", content: "Sign in to find and apply for jobs in Rwanda." },
      { property: "og:title", content: "Job seeker sign in — hiJOBS RWANDA" },
      { property: "og:description", content: "Your job matches are waiting." },
    ],
  }),
  component: () => (
    <AuthLayout title="Job seeker sign in" sub="Access your matches, applications and messages.">
      <LoginForm portal="seeker" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account? <Link to="/join/seeker" className="text-primary-glow hover:underline">Create a job seeker account</Link>
      </p>
    </AuthLayout>
  ),
});
