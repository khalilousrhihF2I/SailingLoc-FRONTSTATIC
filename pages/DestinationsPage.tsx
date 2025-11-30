import  { useState } from 'react';
import { Search, MapPin, Anchor, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
// data imports not required here
import { Page } from '../types/navigation';

interface DestinationsPageProps {
  onNavigate: (page: Page, data?: any) => void;
}

const allDestinations = [
  {
    id: 1,
    name: 'Côte d\'Azur',
    region: 'France',
    boats: 145,
    image: 'https://images.unsplash.com/photo-1734410308581-f6d5d5ed7286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvciUyMHlhY2h0JTIwbHV4dXJ5fGVufDF8fHx8MTc2NDI1NTMzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Eaux cristallines, ports de luxe et villages pittoresques',
    averagePrice: 380,
    popularMonths: ['Juin', 'Juillet', 'Août'],
    highlights: ['Nice', 'Cannes', 'Saint-Tropez', 'Monaco']
  },
  {
    id: 2,
    name: 'Bretagne',
    region: 'France',
    boats: 89,
    image: 'https://images.unsplash.com/photo-1544539800-e94908a8f477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWlsYm9hdCUyMG1hcmluYSUyMHBvcnR8ZW58MXx8fHwxNzY0MjU1MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Côtes sauvages, phares emblématiques et îles préservées',
    averagePrice: 220,
    popularMonths: ['Mai', 'Juin', 'Septembre'],
    highlights: ['Belle-Île', 'Golfe du Morbihan', 'Ouessant', 'Saint-Malo']
  },
  {
    id: 3,
    name: 'Caraïbes',
    region: 'Antilles Françaises',
    boats: 124,
    image: 'https://images.unsplash.com/photo-1651714920753-e42bddd18321?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJpYmJlYW4lMjBiZWFjaCUyMHNhaWxpbmd8ZW58MXx8fHwxNzY0MjU1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Plages paradisiaques, eaux turquoise et climat tropical',
    averagePrice: 520,
    popularMonths: ['Décembre', 'Janvier', 'Février'],
    highlights: ['Martinique', 'Guadeloupe', 'Saint-Martin', 'Les Saintes']
  },
  {
    id: 4,
    name: 'Grèce',
    region: 'Méditerranée',
    boats: 203,
    image: 'https://images.unsplash.com/photo-1569235397686-54a750d35f08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlY2UlMjBpc2xhbmRzJTIwY29hc3R8ZW58MXx8fHwxNzY0MjY1MTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Archipels mythiques, culture millénaire et cuisine exceptionnelle',
    averagePrice: 420,
    popularMonths: ['Mai', 'Juin', 'Septembre'],
    highlights: ['Cyclades', 'Dodécanèse', 'Îles Ioniennes', 'Sporades']
  },
  {
    id: 5,
    name: 'Croatie',
    region: 'Adriatique',
    boats: 178,
    image: 'https://images.unsplash.com/photo-1697547287608-230d56030d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHJpYXRpYyUyMHNlYSUyMGNvYXN0fGVufDF8fHx8MTc2NDI2NTExM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Plus de 1000 îles, villes historiques et nature préservée',
    averagePrice: 350,
    popularMonths: ['Juin', 'Juillet', 'Août'],
    highlights: ['Dubrovnik', 'Split', 'Hvar', 'Kornati']
  },
  {
    id: 6,
    name: 'Espagne',
    region: 'Méditerranée',
    boats: 156,
    image: 'https://images.unsplash.com/photo-1502919963290-40096b6983ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFpbiUyMGNvYXN0JTIwbWFyaW5hfGVufDF8fHx8MTc2NDI2NTExOXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Côtes ensoleillées, tapas et vie nocturne animée',
    averagePrice: 320,
    popularMonths: ['Juin', 'Juillet', 'Août'],
    highlights: ['Baléares', 'Costa Brava', 'Málaga', 'Valence']
  },
  {
    id: 7,
    name: 'Corse',
    region: 'France',
    boats: 95,
    image: 'https://images.unsplash.com/photo-1630512996510-c6a301d874cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JzaWNhJTIwY29hc3QlMjBzYWlsaW5nfGVufDF8fHx8MTc2NDI2NTEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Île de beauté, montagnes plongeant dans la mer',
    averagePrice: 340,
    popularMonths: ['Juin', 'Juillet', 'Septembre'],
    highlights: ['Bonifacio', 'Porto-Vecchio', 'Calvi', 'Îles Lavezzi']
  },
  {
    id: 8,
    name: 'Îles Baléares',
    region: 'Espagne',
    boats: 167,
    image: 'https://images.unsplash.com/photo-1633428714207-e77ec31ac1d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxlYXJpYyUyMGlzbGFuZHMlMjBjb2FzdHxlbnwxfHx8fDE3NjQyNjUxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Archipel paradisiaque, criques secrètes et fêtes légendaires',
    averagePrice: 380,
    popularMonths: ['Mai', 'Juin', 'Septembre'],
    highlights: ['Majorque', 'Minorque', 'Ibiza', 'Formentera']
  }
];

export function DestinationsPage({ onNavigate }: DestinationsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = ['all', 'France', 'Méditerranée', 'Atlantique', 'Caraïbes'];

  const filteredDestinations = allDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-ocean-900 text-white py-20">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1733272967076-3a2ce81226e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwY29hc3QlMjBzYWlsaW5nfGVufDF8fHx8MTc2NDI1NTMzNXww&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-white mb-4">Destinations de rêve</h1>
            <p className="text-white-600 mb-8">
              Explorez les plus belles destinations nautiques et trouvez le bateau parfait pour votre prochaine aventure
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher une destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={20} />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {regions.map(region => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region === 'all' ? 'Toutes' : region}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl text-ocean-600 mb-2">
                {allDestinations.length}+
              </div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div>
              <div className="text-3xl text-ocean-600 mb-2">
                {allDestinations.reduce((sum, d) => sum + d.boats, 0)}+
              </div>
              <div className="text-gray-600">Bateaux disponibles</div>
            </div>
            <div>
              <div className="text-3xl text-ocean-600 mb-2">50+</div>
              <div className="text-gray-600">Ports partenaires</div>
            </div>
            <div>
              <div className="text-3xl text-ocean-600 mb-2">4.8</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-gray-900 mb-2">
                {filteredDestinations.length} destination{filteredDestinations.length > 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600">Trouvez votre prochaine destination de navigation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} hover className="overflow-hidden cursor-pointer group">
                <div className="relative h-64">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="success">
                      <TrendingUp size={14} />
                      Populaire
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={18} />
                      <span className="text-sm text-gray-200">{destination.region}</span>
                    </div>
                    <h3 className="text-white mb-1">{destination.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-200">
                      <div className="flex items-center gap-1">
                        <Anchor size={16} />
                        <span>{destination.boats} bateaux</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>dès {destination.averagePrice}€/jour</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{destination.description}</p>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Meilleure période :</div>
                    <div className="flex gap-2 flex-wrap">
                      {destination.popularMonths.map((month, idx) => (
                        <Badge key={idx} variant="default">
                          {month}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 height-bc">
                    <div className="text-sm text-gray-500 mb-2">À découvrir :</div>
                    <div className="flex gap-2 flex-wrap">
                      {destination.highlights.slice(0, 3).map((highlight, idx) => (
                        <Badge key={idx} variant="default">
                          {highlight}
                        </Badge>
                      ))}
                      {destination.highlights.length > 3 && (
                        <Badge variant="default">
                          +{destination.highlights.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onNavigate('search', { destination: destination.name })}
                  >
                    <Search size={18} />
                    Voir les bateaux
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ocean-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Anchor className="mx-auto mb-6 text-ocean-100" size={48} />
          <h2 className="text-white mb-4">Vous ne trouvez pas votre destination ?</h2>
          <p className="text-xl text-ocean-100 mb-8">
            Contactez-nous et nous vous aiderons à trouver le bateau parfait pour votre prochaine aventure
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-3">
            <Button 
              variant="ghost" 
              size="lg" className="bg-white text-ocean-600 hover:bg-ocean-50"
              onClick={() => onNavigate('contact')}
            >
              Nous contacter
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => onNavigate('search')}
              className="bg-white text-ocean-600 hover:bg-ocean-50"
            >
              Voir tous les bateaux
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
