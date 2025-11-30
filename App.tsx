import  { useState } from 'react';
import { Page } from './types/navigation';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { BoatDetailPage } from './pages/BoatDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RenterDashboard } from './pages/RenterDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BookingFlow } from './pages/BookingFlow';
import { FAQPage, ContactPage, TermsPage, PrivacyPage, NotFoundPage } from './pages/SecondaryPages';
import { DestinationsPage } from './pages/DestinationsPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { CreateBoatListingPage } from './pages/CreateBoatListingPage';
import { EditBoatListingPage } from './pages/EditBoatListingPage';
import { AboutPage } from './pages/AboutPage';

// Use shared Page type from `types/navigation`

type UserType = 'renter' | 'owner' | 'admin' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);

  const navigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    setPageData(data || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (type: UserType) => {
    setIsLoggedIn(true);
    setUserType(type);
    
    if (type === 'admin') {
      navigate('admin-dashboard');
    } else if (type === 'owner') {
      navigate('owner-dashboard');
    } else {
      navigate('renter-dashboard');
    }
  };

  const handleRegister = (type: 'renter' | 'owner') => {
    setIsLoggedIn(true);
    setUserType(type);
    
    if (type === 'owner') {
      navigate('owner-dashboard');
    } else {
      navigate('renter-dashboard');
    }
  };

  const handleAccountCreatedDuringBooking = () => {
    setIsLoggedIn(true);
    setUserType('renter');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    navigate('home');
  };

  // Pages that don't need header/footer
  const fullScreenPages: Page[] = ['admin-dashboard'];
  const showLayout = !fullScreenPages.includes(currentPage);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      
      case 'search':
        return <SearchPage onNavigate={navigate} initialFilters={pageData} />;
      
      case 'boat-detail':
        return <BoatDetailPage boatId={pageData.boatId} onNavigate={navigate} />;
      
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigate={navigate} />;
      
      case 'renter-dashboard':
        return <RenterDashboard onNavigate={navigate} onLogout={handleLogout} />;
      
      case 'owner-dashboard':
        return <OwnerDashboard onNavigate={navigate} onLogout={handleLogout} />;
      
      case 'admin-dashboard':
        return <AdminDashboard onLogout={handleLogout} />;
      
      case 'booking-step1':
        return (
          <BookingFlow
            boatId={pageData.boatId}
            startDate={pageData.startDate}
            endDate={pageData.endDate}
            isLoggedIn={isLoggedIn}
            onNavigate={navigate}
            onAccountCreated={handleAccountCreatedDuringBooking}
          />
        );
      
      case 'booking-confirmation':
        return (
          <BookingConfirmationPage
            bookingData={pageData}
            onNavigate={navigate}
          />
        );
      
      case 'faq':
        return <FAQPage onNavigate={navigate} />;
      
      case 'contact':
        return <ContactPage />;
      
      case 'terms':
        return <TermsPage />;
      
      case 'privacy':
        return <PrivacyPage />;
      
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      
      case 'destinations':
        return <DestinationsPage onNavigate={navigate} />;
      
      case 'forgot-password':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div style={{ width: '100%', maxWidth: '28rem' }}>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-gray-900 mb-6">Mot de passe oublié</h3>
                <p className="text-gray-600 mb-6">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full mt-4 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500 mb-6"
                />
                <button
                  onClick={() => navigate('login')}
                  className="w-full mt-4 px-5 py-2.5 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
                >
                  Envoyer le lien
                </button>
                <button
                  onClick={() => navigate('login')}
                  className="w-full mt-4 text-ocean-600 hover:text-ocean-700"
                >
                  Retour à la connexion
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'create-listing':
        return (
          <CreateBoatListingPage
            onNavigate={navigate}
            ownerId="1"
          />
        );
      
      case 'edit-listing':
        return (
          <EditBoatListingPage
            onNavigate={navigate}
            boatId={pageData.boatId}
          />
        );
      
      case 'booking-detail':
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-gray-900 mb-8">Détail de la réservation</h2>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <p className="text-gray-600 mb-6">
                  Informations détaillées sur la réservation, statut, dates, prix, contact propriétaire, etc.
                </p>
                <button
                  onClick={() => navigate('renter-dashboard')}
                  className="px-5 py-2.5 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
                >
                  Retour au tableau de bord
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <NotFoundPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showLayout && (
        <Header 
          isLoggedIn={isLoggedIn} 
          userType={userType}
          onNavigate={navigate} 
        />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      {showLayout && <Footer onNavigate={navigate} />}
    </div>
  );
}
