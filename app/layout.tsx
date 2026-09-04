import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Bug Reporter | PRO SaaS',
  description: 'Generá reportes con IA, analizá video/red y exportá en 1 clic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}