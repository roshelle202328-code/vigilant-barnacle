import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FactuFlow — Facturación Electrónica LATAM',
  description:
    'Plataforma moderna de facturación electrónica multi-país para PYMEs de Latinoamérica. Centraliza facturación, inventario, compras y reportes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
