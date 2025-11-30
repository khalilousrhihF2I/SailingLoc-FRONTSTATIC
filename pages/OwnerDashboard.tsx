import  { useState } from 'react';
import { Ship, Calendar, TrendingUp, Plus, LogOut, Edit, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { boats, bookings } from '../data/mockData';
import { Page } from '../types/navigation';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AvailabilityCalendar } from '../components/availability/AvailabilityCalendar';

interface OwnerDashboardProps {
  onNavigate: (page: Page, data?: any) => void;
  onLogout: () => void;
}

export function OwnerDashboard({ onNavigate, onLogout }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'boats' | 'bookings' | 'revenue' | 'calendar'>('overview');
  const [selectedBoatForCalendar, setSelectedBoatForCalendar] = useState<number>(1);

  const ownerBoats = boats.filter(b => b.ownerId === 1); // Assuming owner ID is 1
  const ownerBookings = bookings.filter(b => b.ownerId === 1);
  const totalRevenue = ownerBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingBookings = ownerBookings.filter(b => b.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Espace propriétaire</h2>
          <p className="text-gray-600">Gérez vos bateaux et vos réservations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-ocean-600 rounded-full flex items-center justify-center text-white text-2xl mb-3">
                  JD
                </div>
                <div className="text-center">
                  <div className="text-gray-900">Jean Dupont</div>
                  <div className="text-sm text-gray-600">Propriétaire vérifié</div>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp size={20} />
                  <span>Tableau de bord</span>
                </button>
                <button
                  onClick={() => setActiveTab('boats')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'boats'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Ship size={20} />
                  <span>Mes bateaux</span>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar size={20} />
                  <span>Réservations</span>
                  {pendingBookings.length > 0 && (
                    <Badge variant="warning" size="sm">{pendingBookings.length}</Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('revenue')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'revenue'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp size={20} />
                  <span>Revenus</span>
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'calendar'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar size={20} />
                  <span>Disponibilités</span>
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Bateaux</div>
                    <div className="text-3xl text-gray-900 mb-1">{ownerBoats.length}</div>
                    <div className="text-xs text-green-600">+1 ce mois</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Réservations</div>
                    <div className="text-3xl text-gray-900 mb-1">{ownerBookings.length}</div>
                    <div className="text-xs text-orange-600">{pendingBookings.length} en attente</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Revenus totaux</div>
                    <div className="text-3xl text-gray-900 mb-1">{totalRevenue}€</div>
                    <div className="text-xs text-green-600">+15% ce mois</div>
                  </Card>
                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Taux d'occupation</div>
                    <div className="text-3xl text-gray-900 mb-1">78%</div>
                    <div className="text-xs text-gray-600">Sur 30 jours</div>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900">Réservations récentes</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('bookings')}>
                      Voir tout
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {ownerBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <ImageWithFallback
                            src={booking.boatImage}
                            alt={booking.boatName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-900">{booking.boatName}</div>
                          <div className="text-sm text-gray-600">{booking.renterName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900">{booking.totalPrice}€</div>
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'success'
                                : booking.status === 'pending'
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                          >
                            {booking.status === 'confirmed' && 'Confirmée'}
                            {booking.status === 'pending' && 'En attente'}
                            {booking.status === 'completed' && 'Terminée'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Alerts */}
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <h4 className="text-orange-900 mb-3">Actions requises</h4>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>• {pendingBookings.length} réservation(s) en attente de confirmation</li>
                    <li>• Complétez le calendrier de disponibilités pour "Oceanis 45"</li>
                  </ul>
                </Card>
              </div>
            )}

            {activeTab === 'boats' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-900">Mes bateaux</h3>
                  <Button variant="primary" onClick={() => onNavigate('create-listing')}>
                    <Plus size={20} />
                    Ajouter un bateau
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownerBoats.map((boat) => (
                    <Card key={boat.id} hover className="overflow-hidden">
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={boat.image}
                          alt={boat.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge variant="success">
                          Actif
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h4 className="text-gray-900 mb-2">{boat.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{boat.location}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-ocean-600">{boat.price}€/jour</div>
                          <div className="text-sm text-gray-600">{boat.reviews} avis</div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            fullWidth
                            onClick={() => onNavigate('boat-detail', { boatId: boat.id })}
                          >
                            <Eye size={16} />
                            Voir
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            fullWidth
                            onClick={() => onNavigate('edit-listing', { boatId: boat.id })}
                          >
                            <Edit size={16} />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Toutes les réservations</h3>
                <div className="space-y-4">
                  {ownerBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg hover:border-ocean-300 transition-colors overflow-hidden"
                    >
                      {/* Main booking info */}
                      <div className="flex flex-col md:flex-row gap-4 p-4">
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
                                Locataire: {booking.renterName}
                              </div>
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
                            <div className="text-xs text-gray-500 mb-1">Votre revenu</div>
                            <div className="text-sm text-green-600">{booking.subtotal}€</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Contact locataire</div>
                            <div className="text-sm text-gray-900">{booking.renterEmail}</div>
                            {booking.renterPhone && (
                              <div className="text-sm text-gray-600">{booking.renterPhone}</div>
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
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onNavigate('booking-detail', { bookingId: booking.id })}
                          >
                            Voir les détails
                          </Button>
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Êtes-vous sûr de vouloir refuser cette réservation ?')) {
                                    alert('Réservation refusée');
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Refuser
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Confirmer cette réservation ?')) {
                                    alert('Réservation acceptée');
                                  }
                                }}
                              >
                                Accepter
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Fonctionnalité de contact en développement');
                              }}
                            >
                              Contacter le locataire
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Revenus</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <div>
                        <div className="text-sm text-gray-600">Revenus totaux</div>
                        <div className="text-2xl text-gray-900">{totalRevenue}€</div>
                      </div>
                      <Button variant="ghost" size="sm">Exporter CSV</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Ce mois</div>
                        <div className="text-xl text-gray-900">1,750€</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Paiements à venir</div>
                        <div className="text-xl text-gray-900">3,150€</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-4">Gérer les disponibilités</h3>
                  <p className="text-gray-600 mb-6">
                    Sélectionnez un bateau et gérez ses disponibilités en bloquant ou débloquant des périodes.
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm text-gray-700 mb-2">Sélectionner un bateau</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      value={selectedBoatForCalendar}
                      onChange={(e) => setSelectedBoatForCalendar(parseInt(e.target.value))}
                    >
                      {ownerBoats.map((boat) => (
                        <option key={boat.id} value={boat.id}>{boat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Informations du bateau sélectionné */}
                  {ownerBoats.find(b => b.id === selectedBoatForCalendar) && (
                    <div className="mb-6 p-4 bg-ocean-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <ImageWithFallback
                            src={ownerBoats.find(b => b.id === selectedBoatForCalendar)!.image}
                            alt={ownerBoats.find(b => b.id === selectedBoatForCalendar)!.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-gray-900">{ownerBoats.find(b => b.id === selectedBoatForCalendar)!.name}</h4>
                          <p className="text-sm text-gray-600">{ownerBoats.find(b => b.id === selectedBoatForCalendar)!.location}</p>
                          <p className="text-sm text-ocean-600">{ownerBoats.find(b => b.id === selectedBoatForCalendar)!.price}€/jour</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Calendrier interactif */}
                <Card className="p-6">
                  <AvailabilityCalendar 
                    boatId={selectedBoatForCalendar} 
                    onUpdate={() => {
                      // Rafraîchir les données si nécessaire
                      console.log('Disponibilités mises à jour');
                    }}
                  />
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
