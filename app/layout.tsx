import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import FirebaseProvider from '@/components/FirebaseProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Life Saver – Emergency Blood Donor Network',
  description: 'Connecting blood donors with seekers in emergencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <FirebaseProvider>
          {children}
          <Toaster position="top-right" />
        </FirebaseProvider>
      </body>
    </html>
  );
}
