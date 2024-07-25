import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
  isActive: boolean;
};

export const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button
      asChild
      size={'sm'}
      variant={'outline'}
      className={cn(
        'w-full',
        'lg:w-auto',
        'justify-between',
        'font-semibold',
        'hover:bg-orange-50',
        'hover:text-gray-600',
        'border-none',
        'focus-visible:ring-offset-0',
        'focus-visible:ring-transparent',
        'outline-none',
        'text-gray-500',
        'focus:bg-white/30',
        'transition',
        isActive ? 'bg-orange-100 text-gray-800' : 'bg-transparent text-gray-500',
      )}
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}