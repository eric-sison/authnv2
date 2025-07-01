import { LoginForm } from "@/components/features/auth/LoginForm";
import { ThemeToggler } from "@/components/features/theme/ThemeToggler";

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <div className="absolute top-10 left-10">
        <ThemeToggler align="start" />
      </div>
      <LoginForm className="w-96" />
    </div>
  );
}
