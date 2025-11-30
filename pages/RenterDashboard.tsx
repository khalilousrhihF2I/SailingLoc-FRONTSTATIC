import  { useState } from 'react';
import { Calendar, CreditCard, User, FileText, LogOut, Ship, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { bookings } from '../data/mockData';
import { Page } from '../types/navigation';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RenterDashboardProps {
  onNavigate: (page: Page, data?: any) => void;
  onLogout: () => void;
}

export function RenterDashboard({ onNavigate, onLogout }: RenterDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'documents' | 'payments'>('bookings');

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Mon espace locataire</h2>
          <p className="text-gray-600">Gérez vos réservations et votre profil</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-ocean-600 rounded-full flex items-center justify-center text-white text-2xl mb-3">
                  TP
                </div>
                <div className="text-center">
                  <div className="text-gray-900">Thomas Petit</div>
                  <div className="text-sm text-gray-600">thomas.petit@email.com</div>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Ship size={20} />
                  <span>Mes réservations</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User size={20} />
                  <span>Mon profil</span>
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'documents'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText size={20} />
                  <span>Mes documents</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Paiements</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center">
                        <Clock className="text-ocean-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{pendingBookings.length}</div>
                        <div className="text-sm text-gray-600">En attente</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{confirmedBookings.length}</div>
                        <div className="text-sm text-gray-600">Confirmées</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-gray-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{completedBookings.length}</div>
                        <div className="text-sm text-gray-600">Terminées</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Bookings List */}
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Mes réservations</h3>
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg hover:border-ocean-300 transition-colors overflow-hidden"
                      >
                        {/* Main booking info */}
                        <div
                          className="flex flex-col md:flex-row gap-4 p-4 cursor-pointer"
                          onClick={() => onNavigate('booking-detail', { bookingId: booking.id })}
                        >
                          <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={booking.boatImage}
                              alt={booking.boatName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-gray-900 mb-1">{booking.boatName}</h4>
                                <div className="text-sm text-gray-600">
                                  {booking.startDate} → {booking.endDate}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  booking.status === 'confirmed'
                                    ? 'success'
                                    : booking.status === 'pending'
                                    ? 'warning'
                                    : 'default'
                                }
                              >
                                {booking.status === 'confirmed' && 'Confirmée'}
                                {booking.status === 'pending' && 'En attente'}
                                {booking.status === 'completed' && 'Terminée'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                Réf: {booking.id}
                              </div>
                              <div className="text-ocean-600">{booking.totalPrice}€</div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed info - expandable section */}
                        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Prix journalier</div>
                              <div className="text-sm text-gray-900">{booking.dailyPrice}€ / jour</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Sous-total</div>
                              <div className="text-sm text-gray-900">{booking.subtotal}€</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Frais de service</div>
                              <div className="text-sm text-gray-900">{booking.serviceFee}€</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Locataire</div>
                              <div className="text-sm text-gray-900">{booking.renterName}</div>
                              <div className="text-xs text-gray-600">{booking.renterEmail}</div>
                              {booking.renterPhone && (
                                <div className="text-xs text-gray-600">{booking.renterPhone}</div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Statut de paiement</div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    booking.paymentStatus === 'paid'
                                      ? 'success'
                                      : booking.paymentStatus === 'pending'
                                      ? 'warning'
                                      : 'default'
                                  }
                                >
                                  {booking.paymentStatus === 'paid' && '✓ Payé'}
                                  {booking.paymentStatus === 'pending' && '⏳ En attente'}
                                  {booking.paymentStatus === 'failed' && '✗ Échec'}
                                </Badge>
                              </div>
                              {booking.paymentMethod && (
                                <div className="text-xs text-gray-600 mt-1">
                                  via {booking.paymentMethod === 'card' ? 'Carte bancaire' : booking.paymentMethod}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onNavigate('booking-detail', { bookingId: booking.id })}
                            >
                              Voir les détails complets
                            </Button>
                            {booking.status === 'confirmed' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate('boat-detail', { boatId: booking.boatId });
                                  }}
                                >
                                  Voir le bateau
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert('Fonctionnalité de contact en développement');
                                  }}
                                >
                                  Contacter le propriétaire
                                </Button>
                              </>
                            )}
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
                                    alert('Annulation en cours...');
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Annuler la réservation
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate('leave-review', { bookingId: booking.id, boatId: booking.boatId });
                                }}
                              >
                                Laisser un avis
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'profile' && (
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Mon profil</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Nom complet</label>
                      <input
                        type="text"
                        defaultValue="Thomas Petit"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="thomas.petit@email.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        defaultValue="+33 6 12 34 56 78"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Date de naissance</label>
                      <input
                        type="date"
                        defaultValue="1990-05-15"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Adresse</label>
                    <input
                      type="text"
                      defaultValue="123 Rue de la Mer, 17000 La Rochelle"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>
                  <Button variant="primary">Enregistrer les modifications</Button>
                </div>
              </Card>
            )}

            {activeTab === 'documents' && (
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Mes documents</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-ocean-600" size={24} />
                        <div>
                          <div className="text-gray-900">Pièce d'identité</div>
                          <div className="text-sm text-gray-600">Vérifié le 15/03/2024</div>
                        </div>
                      </div>
                      <Badge variant="success">Vérifié</Badge>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-ocean-600" size={24} />
                        <div>
                          <div className="text-gray-900">Permis bateau</div>
                          <div className="text-sm text-gray-600">Vérifié le 15/03/2024</div>
                        </div>
                      </div>
                      <Badge variant="success">Vérifié</Badge>
                    </div>
                  </div>
                  <Button variant="ghost">Ajouter un document</Button>
                </div>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Moyens de paiement</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-ocean-600" size={24} />
                        <div>
                          <div className="text-gray-900">•••• •••• •••• 4242</div>
                          <div className="text-sm text-gray-600">Expire 12/2025</div>
                        </div>
                      </div>
                      <Badge variant="default">Par défaut</Badge>
                    </div>
                  </div>
                  <Button variant="ghost">Ajouter une carte</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
