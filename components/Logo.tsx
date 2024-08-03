import { cn } from "@/lib/utils";
import Image from "next/image";

export type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
}

export const Logo = ({ size = 'md' }) => {
  const sizes: { [key: string]: number } = {
    'sm': 24,
    'md': 32,
    'lg': 48,
  }

  const textSizes: { [key: string]: string } = {
    'sm': 'text-md',
    'md': 'text-lg',
    'lg': 'text-3xl'
  }

  return (
    <div className="flex gap-2">
      <Image
        src={'logo.svg'}
        alt="Logo"
        width={sizes[size]}
        height={sizes[size]}
      />
      <p className={cn('font-bold', textSizes[size])}>Itacash</p>
    </div>
  )
}