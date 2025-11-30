
import { HeroSection } from '../components/home/HeroSection';
import { BoatCard } from '../components/boats/BoatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Anchor, Shield, ThumbsUp, Award, Star } from 'lucide-react';
import { boats, destinations } from '../data/mockData';
import { Page } from '../types/navigation';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: Page, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const handleSearch = (params: any) => {
    onNavigate('search', params);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} />
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Explorez nos catégories</h2>
            <p className="text-gray-600 text-lg">Trouvez le bateau parfait pour votre aventure</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Voiliers', count: 89, type: 'sailboat' },
              { name: 'Catamarans', count: 45, type: 'catamaran' },
              { name: 'Bateaux à moteur', count: 67, type: 'motor' },
              { name: 'Semi-rigides', count: 34, type: 'semirigid' }
            ].map((category) => (
              <Card 
                key={category.type} 
                hover 
                className="p-6 text-center cursor-pointer"
                onClick={() => onNavigate('search', { type: category.type })}
              >
                <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Anchor className="text-ocean-600" size={32} />
                </div>
                <h4 className="text-gray-900 mb-2">{category.name}</h4>
                <p className="text-gray-600">{category.count} bateaux</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Boats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-gray-900 mb-2">Bateaux populaires</h2>
              <p className="text-gray-600">Les mieux notés par notre communauté</p>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('search')}>
              Voir tout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boats.slice(0, 6).map((boat) => (
              <BoatCard
                key={boat.id}
                boat={boat}
                onClick={() => onNavigate('boat-detail', { boatId: boat.id })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Destinations populaires</h2>
            <p className="text-gray-600 text-lg">Découvrez les plus belles régions nautiques</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Card 
                key={destination.id} 
                hover 
                className="overflow-hidden cursor-pointer"
                onClick={() => onNavigate('search', { destination: destination.name })}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-white mb-1">{destination.name}</h4>
                    <p className="text-sm text-gray-200">{destination.boats} bateaux disponibles</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why SailingLoc */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Pourquoi choisir SailingLoc ?</h2>
            <p className="text-gray-600 text-lg">La plateforme de confiance pour louer un bateau</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Paiement sécurisé',
                description: 'Transactions 100% sécurisées et protection contre les fraudes'
              },
              {
                icon: Award,
                title: 'Bateaux vérifiés',
                description: 'Tous nos bateaux sont inspectés et certifiés conformes'
              },
              {
                icon: ThumbsUp,
                title: 'Assurance incluse',
                description: 'Couverture complète pour votre tranquillité d\'esprit'
              },
              {
                icon: Star,
                title: 'Support 24/7',
                description: 'Notre équipe est là pour vous aider à tout moment'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-turquoise-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-turquoise-600" size={32} />
                </div>
                <h4 className="text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ocean-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Propriétaire de bateau ?</h2>
          <p className="text-xl text-ocean-100 mb-8">
            Gagnez jusqu'à 20 000€ par an en louant votre bateau sur SailingLoc
          </p>
          <Button 
            variant="ghost" 
            size="lg" className="bg-white text-ocean-600 hover:bg-gray-100"
            onClick={() => onNavigate('register')}
          >
            Proposer mon bateau
          </Button>
        </div>
      </section>
    </div>
  );
}
