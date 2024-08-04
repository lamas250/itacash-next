import { Filters } from "@/components/filters";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/navigation";
import MenuDropdown from "@/components/navigation/menu-dropdown";
import { WelcomeMsg } from "@/components/welcome-msg";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2, Settings2 } from "lucide-react";

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
          <div className="flex flex-row gap-x-4">
            <MenuDropdown />
            <ClerkLoaded>
              <UserButton />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-6 animate-spin text-slate-400" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  );
}