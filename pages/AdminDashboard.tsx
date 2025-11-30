import  { useState } from 'react';
import { Users, Ship, Calendar, DollarSign, AlertCircle, Settings, LogOut, CheckCircle, X, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { adminStats, users, boats, bookings } from '../data/mockData';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'boats' | 'bookings' | 'payments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Administration SailingLoc</h2>
            <p className="text-gray-600">Panneau de gestion de la plateforme</p>
          </div>
          <Button variant="danger" onClick={onLogout}>
            <LogOut size={20} />
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <DollarSign size={20} />
                  <span>Vue d'ensemble</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'users'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users size={20} />
                  <span>Utilisateurs</span>
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
                  <span>Annonces</span>
                  <Badge variant="warning" size="sm">3</Badge>
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
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-ocean-50 text-ocean-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <DollarSign size={20} />
                  <span>Paiements</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={20} />
                  <span>Paramètres</span>
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
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center">
                        <Users className="text-ocean-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{adminStats.totalUsers}</div>
                        <div className="text-sm text-gray-600">Utilisateurs</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-turquoise-100 rounded-lg flex items-center justify-center">
                        <Ship className="text-turquoise-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{adminStats.totalBoats}</div>
                        <div className="text-sm text-gray-600">Bateaux</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-green-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{adminStats.totalBookings}</div>
                        <div className="text-sm text-gray-600">Réservations</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="text-orange-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl text-gray-900">{adminStats.totalRevenue}€</div>
                        <div className="text-sm text-gray-600">Revenus</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Alerts */}
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-orange-600 shrink-0" size={24} />
                    <div>
                      <h4 className="text-orange-900 mb-2">Actions requises</h4>
                      <ul className="space-y-1 text-sm text-orange-800">
                        <li>• {adminStats.pendingVerifications} annonces en attente de vérification</li>
                        <li>• 5 documents utilisateurs à vérifier</li>
                        <li>• 2 litiges en cours</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Activité récente</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'booking', text: 'Nouvelle réservation pour "Oceanis 45"', time: 'Il y a 5 min' },
                      { type: 'user', text: 'Nouvel utilisateur inscrit: Marie Laurent', time: 'Il y a 1h' },
                      { type: 'boat', text: 'Nouvelle annonce créée: "Lagoon 42"', time: 'Il y a 2h' },
                      { type: 'payment', text: 'Paiement reçu: 1,750€', time: 'Il y a 3h' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                        <div className="text-gray-700">{activity.text}</div>
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900">Gestion des utilisateurs</h3>
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={<Search size={20} />}
                      className="max-w-xs"
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Utilisateur</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Email</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Statut</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-ocean-600 rounded-full flex items-center justify-center text-white text-sm">
                                  {user.avatar}
                                </div>
                                <div>
                                  <div className="text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-600">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={user.type === 'owner' ? 'info' : 'default'}>
                                {user.type === 'owner' ? 'Propriétaire' : 'Locataire'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.verified ? 'success' : 'warning'}>
                                {user.verified ? 'Vérifié' : 'Non vérifié'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">Voir</Button>
                                <Button variant="ghost" size="sm">
                                  <Settings size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'boats' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-gray-900 mb-6">Gestion des annonces</h3>
                  <div className="space-y-4">
                    {boats.slice(0, 5).map((boat) => (
                      <div key={boat.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <img src={boat.image} alt={boat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-900 mb-1">{boat.name}</div>
                          <div className="text-sm text-gray-600">{boat.location}</div>
                          <div className="text-sm text-gray-600">Propriétaire: {boat.ownerName}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="success">Actif</Badge>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'bookings' && (
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Toutes les réservations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Référence</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Bateau</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Locataire</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Dates</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Montant</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700">{booking.id}</td>
                          <td className="py-3 px-4 text-gray-700">{booking.boatName}</td>
                          <td className="py-3 px-4 text-gray-700">{booking.renterName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {booking.startDate} → {booking.endDate}
                          </td>
                          <td className="py-3 px-4 text-gray-900">{booking.totalPrice}€</td>
                          <td className="py-3 px-4">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card className="p-6">
                <h3 className="text-gray-900 mb-6">Gestion des paiements</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-800 mb-1">Payés</div>
                      <div className="text-2xl text-green-900">28,765€</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-800 mb-1">En attente</div>
                      <div className="text-2xl text-orange-900">4,900€</div>
                    </div>
                    <div className="p-4 bg-ocean-50 rounded-lg border border-ocean-200">
                      <div className="text-sm text-ocean-800 mb-1">Frais SailingLoc (10%)</div>
                      <div className="text-2xl text-ocean-900">{adminStats.totalRevenue}€</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
