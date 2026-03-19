import type { Metadata } from 'next';
import './globals.css';
import { DataProvider } from '@/lib/data-context';

export const metadata: Metadata = {
  title: 'Reporting + Analytics Coverage',
  description: 'Project Tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground h-screen overflow-hidden">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
