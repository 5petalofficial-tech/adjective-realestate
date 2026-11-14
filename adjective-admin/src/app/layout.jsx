import "./globals.css"; // loads Tailwind + all custom design-system classes
import { Toaster } from "sonner";

export const metadata = {
  title: "Adjective Admin",
  description:
    "Defining The Noun.",
};

/**
 * RootLayout — wraps every page in the application.
 *
 * @param {React.ReactNode} children — the current page's JSX content,
 *   injected by Next.js App Router automatically.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>


      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
