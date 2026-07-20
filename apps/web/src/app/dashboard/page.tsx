'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LogOut, User, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success('Sesión cerrada');
    router.push('/login');
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">FactuFlow</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold">
          Bienvenido{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Este es tu panel de FactuFlow. Aquí podrás gestionar tu facturación electrónica.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <User className="mb-2 h-5 w-5 text-primary" />
              <CardTitle className="text-base">Perfil</CardTitle>
              <CardDescription>
                {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </p>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">Facturación</CardTitle>
              <CardDescription>Próximamente</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">Clientes</CardTitle>
              <CardDescription>Próximamente</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
