import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
