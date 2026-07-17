'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Bot,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed?: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Facturas', href: '/invoices', icon: Receipt },
  { name: 'Cotizaciones', href: '/quotes', icon: FileText },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Compras', href: '/purchases', icon: ShoppingCart },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Receipt className="h-6 w-6 shrink-0 text-primary" />
        {!collapsed && <span className="ml-3 text-lg font-bold">FactuFlow</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
              collapsed && 'justify-center px-2',
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t p-3">
        <button
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
            collapsed && 'justify-center',
          )}
        >
          <ChevronLeft className={cn('h-5 w-5 shrink-0 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span className="ml-3">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
