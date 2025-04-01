import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For development purposes, bypass authentication check
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="admin-layout">
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">Development Mode</p>
            <p>Authentication is bypassed in development mode. In production, this page would require admin privileges.</p>
          </div>
          {children}
        </div>
      </div>
    );
  }

  // Production authentication check
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  // Get user role from database
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  // Check if user is admin
  if (!user || user.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <div className="admin-layout">
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
}