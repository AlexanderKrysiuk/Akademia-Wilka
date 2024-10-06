"use client"
import { auth, signOut } from '@/auth';
import AuthButtonServer from '@/components/auth/authbutton.server';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/user';
import { useSession } from 'next-auth/react';



export default function Home() {
  const session = useSession()
  const user = useCurrentUser()
  return (
    <main>
      <div className='py-8 space-y-4'>
        <div>

        USER:
        {JSON.stringify(user,null,2)}
        </div>
        <div>

        SESSION:
        {JSON.stringify(session,null,2)}
        </div>
      </div>
    </main>
  );
}
