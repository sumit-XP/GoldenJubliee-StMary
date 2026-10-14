import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { JubileeProvider } from './context/JubileeContext.tsx';
import { ClientHome } from './pages/ClientHome.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminLogin } from './pages/admin/AdminLogin.tsx';
import { ContributePage } from './pages/ContributePage.tsx';

const AppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'contribute'>('home');

  if (currentPage === 'admin') {
    if (isAdmin) {
      return <AdminDashboard onBackToHome={() => setCurrentPage('home')} />;
    }
    return <AdminLogin onBackToHome={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'contribute') {
    return (
      <ContributePage
        onBackToHome={() => setCurrentPage('home')}
        onOpenAdmin={() => setCurrentPage('admin')}
      />
    );
  }

  return (
    <ClientHome
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onOpenAdmin={() => setCurrentPage('admin')}
    />
  );
};

export function App() {
  return (
    <AuthProvider>
      <JubileeProvider>
        <AppContent />
      </JubileeProvider>
    </AuthProvider>
  );
}

export default App;
