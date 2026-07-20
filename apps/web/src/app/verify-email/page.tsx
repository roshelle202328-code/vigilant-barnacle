'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type Status = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Correo verificado exitosamente.');
      })
      .catch((err: unknown) => {
        setStatus('error');
        const msg =
          (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
            ?.message;
        setMessage(
          Array.isArray(msg)
            ? msg.join(', ')
            : (msg as string) ?? 'Error al verificar el correo.',
        );
      });
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <CardTitle>Verificando correo</CardTitle>
              <CardDescription>Estamos verificando tu dirección de correo electrónico...</CardDescription>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>¡Correo verificado!</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Error de verificación</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardFooter className="justify-center">
          {status === 'success' && (
            <Button onClick={() => router.push('/login')}>Ir al inicio de sesión</Button>
          )}
          {status === 'error' && (
            <Link href="/login">
              <Button variant="outline">Volver al inicio de sesión</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
