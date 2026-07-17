import { Receipt, Globe, Zap, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">FactuFlow</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentación
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Comenzar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Facturación Electrónica{' '}
            <span className="text-primary">sin fronteras</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            La plataforma SaaS más moderna para PYMEs de Latinoamérica. Facturación
            multi-país, inventario, compras y reportes — todo en un solo lugar.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Probar Gratis <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Todo lo que necesitas para facturar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Diseñado específicamente para los requisitos fiscales de cada país
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Globe,
                title: 'Multi-país',
                description: 'México, Colombia, Chile, Perú — y más en camino. Cumplimiento fiscal local.',
              },
              {
                icon: Zap,
                title: 'IA Integrada',
                description: 'Crea cotizaciones con lenguaje natural y extrae datos de PDFs con IA.',
              },
              {
                icon: Shield,
                title: 'Seguro y Confiable',
                description: 'Timbrado fiscal certificado, cifrado de datos y respaldo automático.',
              },
              {
                icon: Receipt,
                title: 'Reportes Avanzados',
                description: 'Dashboard en tiempo real, reportes fiscales y análisis de cuentas por cobrar.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-card p-6 text-card-foreground">
                <feature.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 FactuFlow. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
