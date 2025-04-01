import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "./components/Navigation";
import { createClient } from '@/utils/supabase/server';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Academy Rooms",
  description: "Room booking and management system",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get user role for navigation
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  let userRole = 'user';
  
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (user) {
      userRole = user.role;
    }
  }

  return (
    <ClerkProvider>
      <html className="pt-4" lang="en">
        <body>
          <Navigation userRole={userRole} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
