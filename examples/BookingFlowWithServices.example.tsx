/**
 * EXEMPLE : BookingFlow avec services API
 * 
 * Démontre comment créer une réservation en utilisant les services
 */

import  { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { StripeCheckout } from '../components/booking/StripeCheckout';
import { Page } from '../types/navigation';
// 👇 NOUVEAU : Import des services
import { bookingService, authService } from '../services/ServiceFactory';
import { useBoat } from '../hooks/useServices';

interface BookingFlowWithServicesProps {
  boatId: number;
  startDate: string;
  endDate: string;
  isLoggedIn?: boolean;
  onNavigate: (page: Page, data?: any) => void;
  onAccountCreated?: () => void;
}

export function BookingFlowWithServices({ 
  boatId, 
  startDate, 
  endDate, 
  isLoggedIn = false,
  onNavigate,
  onAccountCreated 
}: BookingFlowWithServicesProps) {
  const [step, setStep] = useState(isLoggedIn ? 2 : 1);
  
  // User Account Data
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [accountError, setAccountError] = useState('');
  const [processing, setProcessing] = useState(false);

  // 👇 NOUVEAU : Utilisation du hook pour charger le bateau
  const { boat, loading } = useBoat(boatId);

  if (loading || !boat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();
  const subtotal = days * boat.price;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  // 👇 NOUVEAU : Créer le compte utilisateur via le service
  const handleAccountStep = async () => {
    setAccountError('');
    setProcessing(true);

    try {
      if (!accountData.name || !accountData.email || !accountData.phone) {
        setAccountError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(accountData.email)) {
        setAccountError('Adresse email invalide');
        return;
      }

      if (!isLoggedIn) {
        if (!accountData.password || accountData.password.length < 8) {
          setAccountError('Le mot de passe doit contenir au moins 8 caractères');
          return;
        }

        if (accountData.password !== accountData.confirmPassword) {
          setAccountError('Les mots de passe ne correspondent pas');
          return;
        }

        // 👇 NOUVEAU : Créer le compte via le service Auth
        const authResult = await authService.register({
          name: accountData.name,
          email: accountData.email,
          password: accountData.password,
          phone: accountData.phone,
          type: 'renter'
        });

        if (!authResult.success) {
          setAccountError(authResult.message || 'Erreur lors de la création du compte');
          return;
        }

        if (onAccountCreated) {
          onAccountCreated();
        }
      }

      // Passer à l'étape de paiement
      setStep(2);
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setProcessing(false);
    }
  };

  // 👇 NOUVEAU : Créer la réservation via le service
  const handlePaymentSuccess = async () => {
    setProcessing(true);

    try {
      // Récupérer l'utilisateur actuel
      const currentUser = await authService.getCurrentUser();
      const renterId = currentUser?.id || Date.now(); // Fallback pour le mode mock

      // Créer la réservation via le service
      const booking = await bookingService.createBooking({
        boatId: boat.id,
        startDate,
        endDate,
        totalPrice: total,
        serviceFee,
        renterId,
        renterName: accountData.name,
        renterEmail: accountData.email
      });

      console.log('✅ Réservation créée:', booking);

      // Naviguer vers la page de confirmation avec les données de la réservation
      onNavigate('booking-confirmation', {
        bookingId: booking.id,
        boat,
        startDate,
        endDate,
        totalPrice: total,
        serviceFee,
        renterEmail: accountData.email,
        renterName: accountData.name
      });
    } catch (error) {
      console.error('❌ Erreur lors de la création de la réservation:', error);
      alert('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => step === 1 ? onNavigate('boat-detail', { boatId }) : setStep(1)}
          className="flex items-center gap-2 text-ocean-600 hover:text-ocean-700 mb-6"
          disabled={processing}
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-ocean-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-ocean-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="hidden sm:inline">Informations</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-ocean-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-ocean-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-ocean-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="hidden sm:inline">Paiement</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card className="p-6 md:p-8">
                <h2 className="text-gray-900 mb-6">
                  {isLoggedIn ? 'Vos informations' : 'Créer votre compte'}
                </h2>

                {!isLoggedIn && (
                  <Alert type="info">
                    Un compte sera créé automatiquement pour gérer votre réservation
                  </Alert>
                )}

                {accountError && (
                  <Alert type="error">{accountError}</Alert>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleAccountStep(); }} className="space-y-6">
                  <Input
                    type="text"
                    label="Nom complet *"
                    placeholder="Jean Dupont"
                    value={accountData.name}
                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                    icon={<User size={20} />}
                    required
                    disabled={processing}
                  />

                  <Input
                    type="email"
                    label="Adresse email *"
                    placeholder="votre@email.com"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    icon={<Mail size={20} />}
                    required
                    disabled={processing}
                  />

                  <Input
                    type="tel"
                    label="Téléphone *"
                    placeholder="+33 6 12 34 56 78"
                    value={accountData.phone}
                    onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                    icon={<Phone size={20} />}
                    required
                    disabled={processing}
                  />

                  {!isLoggedIn && (
                    <>
                      <Input
                        type="password"
                        label="Mot de passe *"
                        placeholder="Minimum 8 caractères"
                        value={accountData.password}
                        onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                        icon={<Lock size={20} />}
                        required
                        disabled={processing}
                      />

                      <Input
                        type="password"
                        label="Confirmer le mot de passe *"
                        placeholder="Retapez votre mot de passe"
                        value={accountData.confirmPassword}
                        onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                        icon={<Lock size={20} />}
                        required
                        disabled={processing}
                      />
                    </>
                  )}

                  <Button type="submit" variant="primary" size="lg" fullWidth disabled={processing}>
                    {processing ? 'Traitement...' : 'Continuer vers le paiement'}
                  </Button>
                </form>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6 md:p-8">
                <h2 className="text-gray-900 mb-6">Paiement sécurisé</h2>
                
                <StripeCheckout
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setStep(1)}
                />
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="mb-4">
                <img 
                  src={boat.image} 
                  alt={boat.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="text-gray-900 mb-2">{boat.name}</h4>
                <p className="text-sm text-gray-600">{boat.location}</p>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Départ</div>
                  <div className="text-gray-900">{formatDate(startDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Retour</div>
                  <div className="text-gray-900">{formatDate(endDate)}</div>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{boat.price}€ × {days} jours</span>
                  <span className="text-gray-900">{subtotal}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais de service</span>
                  <span className="text-gray-900">{serviceFee.toFixed(2)}€</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-900">Total</span>
                <span className="text-2xl text-ocean-600">{total.toFixed(2)}€</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
