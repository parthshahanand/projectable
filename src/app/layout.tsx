import type { Metadata } from 'next';
import './globals.css';
import { DataProvider } from '@/lib/data-context';
import { DemoDataProvider } from '@/lib/demo-data-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Reporting + Analytics Coverage',
  description: 'Project Tracker',
};

const isDemo = process.env.NEXT_PUBLIC_DEMO === 'true';
const Provider = isDemo ? DemoDataProvider : DataProvider;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground h-screen overflow-hidden">
        <Provider>
          {children}
        </Provider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
