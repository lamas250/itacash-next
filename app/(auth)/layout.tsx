import { Logo } from "@/components/Logo"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Logo size="lg" />
      <div className="mt-10">{children}</div>
    </div>
  )
}
