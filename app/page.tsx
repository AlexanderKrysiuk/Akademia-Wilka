import { auth, signOut } from '@/auth';
import AuthButtonServer from '@/components/auth/authbutton.server';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth()
  const user = session?.user.role
  return (
    <main>
      {JSON.stringify(session, null, 2)}
      <div className='py-8'>

      {JSON.stringify(user, null, 2)}
      </div>
      <AuthButtonServer/>
    </main>
  );
}
