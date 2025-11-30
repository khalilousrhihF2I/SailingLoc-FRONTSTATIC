/**
 * EXEMPLE : SearchPage avec services API
 * 
 * Cette version démontre comment utiliser les services API au lieu des données mockées directement.
 * Pour activer cette version, remplacez le contenu de /pages/SearchPage.tsx
 */

import  { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { BoatCard } from '../components/boats/BoatCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { boatTypes } from '../data/mockData';
import { Page } from '../types/navigation';
// 👇 NOUVEAU : Import du hook de service
import { useBoats } from '../hooks/useServices';

interface SearchPageProps {
  onNavigate: (page: Page, data?: any) => void;
  initialFilters?: any;
}

export function SearchPageWithServices({ onNavigate, initialFilters = {} }: SearchPageProps) {
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    destination: initialFilters.destination || '',
    type: initialFilters.type || 'all',
    priceMin: '',
    priceMax: '',
    capacityMin: '',
    equipment: [] as string[]
  });

  // 👇 NOUVEAU : Utilisation du hook useBoats au lieu de filtrer directement les données
  const { boats, loading, error } = useBoats({
    location: filters.location || undefined,
    destination: filters.destination || undefined,
    type: filters.type !== 'all' ? filters.type : undefined,
    priceMin: filters.priceMin ? parseInt(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? parseInt(filters.priceMax) : undefined,
    capacityMin: filters.capacityMin ? parseInt(filters.capacityMin) : undefined,
  });

  // Le hook se charge de faire la requête et retourne les bateaux filtrés
  const filteredBoats = boats;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">Résultats de recherche</h2>
          
          {/* 👇 NOUVEAU : Afficher le statut de chargement */}
          {loading && (
            <p className="text-gray-600">Chargement des bateaux...</p>
          )}
          
          {/* 👇 NOUVEAU : Afficher les erreurs */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">Erreur : {error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <p className="text-gray-600">{filteredBoats.length} bateaux disponibles</p>
          )}
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
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBoats.map((boat) => (
                  <BoatCard
                    key={boat.id}
                    boat={boat}
                    onClick={() => onNavigate('boat-detail', { boatId: boat.id })}
                  />
                ))}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredBoats.length === 0 && (
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
