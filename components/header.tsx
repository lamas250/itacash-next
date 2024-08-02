import { Logo } from "@/components/logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMsg } from "@/components/welcome-msg";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export const Header = () => {
  return (
    <header
      className="px-4 py-8 lg:px-14 pb-32 bg-orange-100">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <div className="hidden lg:flex">
              <Logo />
            </div>
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-6 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
}