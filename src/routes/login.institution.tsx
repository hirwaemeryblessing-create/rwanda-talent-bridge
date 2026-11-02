import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, LoginForm } from "@/components/AuthForms";

export const Route = createFileRoute("/login/institution")({
  head: () => ({
    meta: [
      { title: "Institution sign in — hiJOBS RWANDA" },
      { name: "description", content: "Employers: sign in to post jobs and manage candidates." },
      { property: "og:title", content: "Institution sign in — hiJOBS RWANDA" },
      { property: "og:description", content: "Recruit qualified talent across Rwanda." },
    ],
  }),
  component: () => (
    <AuthLayout title="Institution sign in" sub="Post jobs, review matched candidates and manage interviews.">
      <LoginForm portal="institution" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Not registered? <Link to="/join/institution" className="text-gold hover:underline">Register your institution</Link>
      </p>
    </AuthLayout>
  ),
});
