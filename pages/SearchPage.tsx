import  { useState } from 'react';
import { SlidersHorizontal, MapPin, X } from 'lucide-react';
import { BoatCard } from '../components/boats/BoatCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { boats, boatTypes } from '../data/mockData';
import { Page } from '../types/navigation';

interface SearchPageProps {
  onNavigate: (page: Page, data?: any) => void;
  initialFilters?: any;
}

export function SearchPage({ onNavigate, initialFilters = {} }: SearchPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    destination: initialFilters.destination || '',
    type: initialFilters.type || 'all',
    priceMin: '',
    priceMax: '',
    capacityMin: '',
    equipment: [] as string[]
  });

  const filteredBoats = boats.filter(boat => {
    if (filters.location && !boat.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.destination && boat.destination && !boat.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && boat.type !== filters.type) {
      return false;
    }
    if (filters.priceMin && boat.price < parseInt(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && boat.price > parseInt(filters.priceMax)) {
      return false;
    }
    if (filters.capacityMin && boat.capacity < parseInt(filters.capacityMin)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">Résultats de recherche</h2>
          <p className="text-gray-600">{filteredBoats.length} bateaux disponibles</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-gray-900 mb-6">Filtres</h3>
              
              <div className="space-y-6">
                <Input
                  label="Destination"
                  placeholder="Ex: Côte d'Azur, Grèce..."
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  icon={<MapPin size={20} />}
                />

                <Input
                  label="Ville ou port"
                  placeholder="Ex: Nice, Cannes..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  icon={<MapPin size={20} />}
                />
                
                <Select
                  label="Type de bateau"
                  options={boatTypes}
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                />
                
                <div>
                  <label className="block mb-2 text-gray-700">Prix par jour</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    />
                  </div>
                </div>
                
                <Input
                  label="Capacité minimale"
                  type="number"
                  placeholder="Nombre de personnes"
                  value={filters.capacityMin}
                  onChange={(e) => setFilters({ ...filters, capacityMin: e.target.value })}
                />
                
                <div>
                  <label className="block mb-2 text-gray-700">Équipements</label>
                  <div className="space-y-2">
                    {['GPS', 'Pilote automatique', 'Annexe', 'WiFi', 'Climatisation'].map((eq) => (
                      <label key={eq} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                        />
                        <span className="text-sm text-gray-700">{eq}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setFilters({
                    location: '',
                    destination: '',
                    type: 'all',
                    priceMin: '',
                    priceMax: '',
                    capacityMin: '',
                    equipment: []
                  })}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Filtres
            </Button>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Active Filters */}
            {(filters.location || filters.destination || filters.type !== 'all' || filters.priceMin || filters.priceMax) && (
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Filtres actifs:</span>
                  {filters.destination && (
                    <Badge variant="info">
                      {filters.destination}
                      <button 
                        onClick={() => setFilters({ ...filters, destination: '' })}
                        className="ml-2"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge variant="info">
                      {filters.location}
                      <button 
                        onClick={() => setFilters({ ...filters, location: '' })}
                        className="ml-2"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  )}
                  {filters.type !== 'all' && (
                    <Badge variant="info">
                      {boatTypes.find(t => t.value === filters.type)?.label}
                      <button 
                        onClick={() => setFilters({ ...filters, type: 'all' })}
                        className="ml-2"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Boats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBoats.map((boat) => (
                <BoatCard
                  key={boat.id}
                  boat={boat}
                  onClick={() => onNavigate('boat-detail', { boatId: boat.id })}
                />
              ))}
            </div>

            {filteredBoats.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <p className="text-gray-600 mb-4">Aucun bateau ne correspond à vos critères</p>
                <Button 
                  variant="ghost"
                  onClick={() => setFilters({
                    location: '',
                    destination: '',
                    type: 'all',
                    priceMin: '',
                    priceMax: '',
                    capacityMin: '',
                    equipment: []
                  })}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
