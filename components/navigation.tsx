"use client"

import { useState } from "react";
import { NavButton } from "@/components/nav-button";
import { usePathname, useRouter } from "next/navigation"
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

const routes = [
  {
    href: '/',
    label: 'Dashboard'
  },
  {
    href: '/transactions',
    label: 'Transações'
  },
  // {
  //   href: '/accounts',
  //   label: 'Accounts'
  // },
  {
    href: '/categories',
    label: 'Categorias'
  },
  // {
  //   href: '/budgets',
  //   label: 'Budgets'
  // },
  // {
  //   href: '/reports',
  //   label: 'Reports'
  // },
  {
    href: '/settings',
    label: 'Configurações'
  },
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia('(max-width: 1024px)', false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={'outline'}
            size={'sm'}
            className="font-semibold
            bg-orange-100
            hover:bg-orange-50
            hover:text-gray-600
            border-none
            focus-visible:ring-offset-0
            focus-visible:ring-transparent
            transition
            outline-none
            "
          >
            <MenuIcon className="h-4 w-4 to-blue-800"/>
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? 'secondary' : 'ghost'}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  )
}