import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth()
  return (
    <main>
      {JSON.stringify(session)}
      <form action={async () => {
        "use server";

        await signOut();
      }}>
        <Button type="submit">
            Sign Out!
        </Button>
      </form>
    </main>
  );
}
