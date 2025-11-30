import  { useState } from 'react';
import { MapPin, Users, Anchor, Calendar, Star, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { boats, reviews } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Page } from '../types/navigation';

interface BoatDetailPageProps {
  boatId: number;
  onNavigate: (page: Page, data?: any) => void;
}

export function BoatDetailPage({ boatId, onNavigate }: BoatDetailPageProps) {
  const boat = boats.find(b => b.id === boatId);
  const boatReviews = reviews.filter(r => r.boatId === boatId);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!boat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Bateau non trouvé</p>
      </div>
    );
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = calculateDays();
  const subtotal = days * boat.price;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const typeLabels: Record<string, string> = {
    sailboat: 'Voilier',
    catamaran: 'Catamaran',
    motor: 'Moteur',
    semirigid: 'Semi-rigide'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 h-96 rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={boat.image}
                alt={boat.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-gray-900 mb-2">{boat.name}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={18} />
                      <span>{boat.location}</span>
                    </div>
                    <Badge variant="info">{typeLabels[boat.type]}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-orange-500 fill-orange-500" />
                  <span className="text-xl text-gray-900">{boat.rating}</span>
                  <span className="text-gray-500">({boat.reviews} avis)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <Users className="text-ocean-600 mx-auto mb-2" size={24} />
                  <div className="text-sm text-gray-600">Capacité</div>
                  <div className="text-gray-900">{boat.capacity} pers.</div>
                </div>
                <div className="text-center">
                  <Anchor className="text-ocean-600 mx-auto mb-2" size={24} />
                  <div className="text-sm text-gray-600">Longueur</div>
                  <div className="text-gray-900">{boat.length} ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="text-ocean-600 mx-auto mb-2" size={24} />
                  <div className="text-sm text-gray-600">Année</div>
                  <div className="text-gray-900">{boat.year}</div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{boat.description}</p>
            </Card>

            {/* Equipment */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Équipements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {boat.equipment.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cabines</div>
                  <div className="text-gray-900">{boat.cabins} cabines</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Capacité</div>
                  <div className="text-gray-900">{boat.capacity} personnes</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="text-gray-900">{typeLabels[boat.type]}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Année</div>
                  <div className="text-gray-900">{boat.year}</div>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Avis des locataires</h3>
              <div className="space-y-6">
                {boatReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-ocean-600 rounded-full flex items-center justify-center text-white shrink-0">
                        {review.userAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-gray-900">{review.userName}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Owner */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Propriétaire</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-ocean-600 rounded-full flex items-center justify-center text-white text-xl">
                  {boat.ownerAvatar}
                </div>
                <div>
                  <div className="text-gray-900">{boat.ownerName}</div>
                  <div className="text-sm text-gray-600">Membre depuis 2023</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl text-gray-900 mb-1">
                  {boat.price}€
                  <span className="text-base text-gray-500">/jour</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
              </div>

              {days > 0 && (
                <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>{boat.price}€ × {days} jours</span>
                    <span>{subtotal}€</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Frais de service (10%)</span>
                    <span>{serviceFee}€</span>
                  </div>
                </div>
              )}

              {days > 0 && (
                <div className="flex justify-between mb-6 text-xl">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{total}€</span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={days === 0}
                onClick={() => onNavigate('booking-step1', { boatId: boat.id, startDate, endDate })}
              >
                Réserver maintenant
              </Button>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-green-500" />
                <span>Paiement sécurisé - Annulation gratuite</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
