import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export default function Page() {
  return (
    <>
      <ClerkLoaded>
        <SignIn path="/signin" />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='animated-spin text-muted-foreground' />
      </ClerkLoading>
    </>
  )
}
