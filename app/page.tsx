"use client"
import { auth, signOut } from '@/auth';
import AuthButtonServer from '@/components/auth/authbutton.server';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/user';



export default function Home() {
  const user = useCurrentUser()
  return (
    <main>
      <div className='py-8'>
        {JSON.stringify(user,null,2)}
      </div>
    </main>
  );
}
