import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth()
  return (
    <main>
      {JSON.stringify(session)}
    </main>
  );
}
