"use client"

import { useUser } from "@clerk/nextjs"

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="flex items-center justify-start h-full">
      {isLoaded && (
        <div>
          <h1 className="text-2xl font-semibold">
            {user ? `Bem vindo, ${user.firstName} 👋` : 'Bem vindo 👋'}
          </h1>
        </div>
      )}
    </div>
  )
}