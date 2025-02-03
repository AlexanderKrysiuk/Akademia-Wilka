import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { UserRole } from '@prisma/client';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody & { metadata: { lessonId: string } }; // Dodajemy metadata
    const session = await auth(); // Pobranie sesji użytkownika
    const user = session?.user;

  // Sprawdzanie ról użytkownika
  if (!user?.role.includes(UserRole.Admin) && !user?.role.includes(UserRole.Teacher)) {
    return NextResponse.json({ error: "Nieautoryzowany dostęp" }, { status: 401 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['video/mp4'],
          tokenPayload: JSON.stringify({
            userId: user.id, // Przekazujemy userId do payload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Przesłano plik:', blob);

        // Aktualizowanie lekcji w bazie danych po udanym przesłaniu
        await prisma.lesson.update({
          where: { id: body.metadata.lessonId },
          data: { media: JSON.stringify([{ url: blob.url, source: 'vercel' }]) },
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
