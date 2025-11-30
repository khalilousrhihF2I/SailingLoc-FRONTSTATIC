import  { useState } from 'react';
import { Mail, Lock, User, Phone, Anchor } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Page } from '../types/navigation';

interface RegisterPageProps {
  onRegister: (userType: 'renter' | 'owner') => void;
  onNavigate: (page: Page) => void;
}

export function RegisterPage({ onRegister, onNavigate }: RegisterPageProps) {
  const [userType, setUserType] = useState<'renter' | 'owner'>('renter');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    onRegister(userType);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ocean-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Anchor className="text-white" size={32} />
          </div>
          <h2 className="text-gray-900 mb-2">Créer un compte</h2>
          <p className="text-gray-600">Rejoignez la communauté SailingLoc</p>
        </div>

        <Card className="p-8">
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setUserType('renter')}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === 'renter'
                  ? 'border-ocean-600 bg-ocean-50'
                  : 'border-gray-200 hover:border-ocean-300'
              }`}
            >
              <div className="text-center">
                <User className="mx-auto mb-2 text-ocean-600" size={32} />
                <div className="text-gray-900">Locataire</div>
                <div className="text-sm text-gray-600 mt-1">Je veux louer un bateau</div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setUserType('owner')}
              className={`p-4 rounded-xl border-2 transition-all ${
                userType === 'owner'
                  ? 'border-ocean-600 bg-ocean-50'
                  : 'border-gray-200 hover:border-ocean-300'
              }`}
            >
              <div className="text-center">
                <Anchor className="mx-auto mb-2 text-ocean-600" size={32} />
                <div className="text-gray-900">Propriétaire</div>
                <div className="text-sm text-gray-600 mt-1">Je veux louer mon bateau</div>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert type="error">{error}</Alert>
            )}

            <Input
              type="text"
              label="Nom complet *"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User size={20} />}
            />

            <Input
              type="email"
              label="Adresse email *"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail size={20} />}
            />

            <Input
              type="tel"
              label="Téléphone"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={<Phone size={20} />}
            />

            <Input
              type="password"
              label="Mot de passe *"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock size={20} />}
            />

            <Input
              type="password"
              label="Confirmer le mot de passe *"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              icon={<Lock size={20} />}
            />

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms"
                required
                className="mt-1 rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                J'accepte les{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="text-ocean-600 hover:text-ocean-700"
                >
                  conditions générales
                </button>
                {' '}et la{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="text-ocean-600 hover:text-ocean-700"
                >
                  politique de confidentialité
                </button>
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Créer mon compte
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-ocean-600 hover:text-ocean-700"
              >
                Se connecter
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
