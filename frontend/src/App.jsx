import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      {/* Global toast notification configuration matching Vercel/Linear dark theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            background: '#111827',
            color: '#FAFAFA',
            border: '1px solid #27272A',
            fontSize: '12px',
            fontWeight: 500,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#FAFAFA' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FAFAFA' },
          },
        }}
      />

      <AppRoutes />
    </AuthProvider>
  );
}
