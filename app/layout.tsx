import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Autonomía Digital',
  applicationName: 'Autonomía Digital',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon-192.png', apple: '/icon-180.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Autonomía' },
  description: 'Practicá trámites cotidianos con calma, ayuda y guía por voz. No se mueve dinero.',
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#005dbb',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>
        <a href="#main-content" className="skip-link">
          Ir al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
