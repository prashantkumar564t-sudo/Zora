import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZORA — Stream Cinema',
  description:
    'Cinematic Indian Streaming Showcase — curated films and original web series in Hindi with 4K UHD & Dolby Atmos.',
  openGraph: {
    title: 'ZORA — Stream Cinema',
    description:
      'Cinematic Indian Streaming Showcase — curated films and original web series in Hindi with 4K UHD & Dolby Atmos.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZORA — Stream Cinema',
    description:
      'Cinematic Indian Streaming Showcase — curated films and original web series in Hindi with 4K UHD & Dolby Atmos.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} dark`}
    >
      <body
        className="min-h-screen bg-[#141414] text-white antialiased selection:bg-[#E50914] selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
