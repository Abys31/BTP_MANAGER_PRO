import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2, HardHat } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@constructions-dz.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        localStorage.setItem('btp_token', data.data.token);
        onLogin(data.data.user);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map(err => err.message).join(', '));
        } else {
          setError(data.message || 'Identifiants invalides');
        }
      }
    } catch (err) {
      setError('Impossible de joindre le serveur. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', display: 'flex' }}>
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{ width: '45%', background: '#1a1f2e', color: 'white' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#E07B2A' }}>
            <HardHat size={22} color="white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight">Atlas Manager</div>
            <div className="text-xs" style={{ color: '#64748b' }}>Gestion de Chantiers • Algérie</div>
          </div>
        </div>

        {/* Middle content */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Gérez vos chantiers<br />
            <span style={{ color: '#E07B2A' }}>avec précision.</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7' }}>
            Application complète de gestion BTP pour les entreprises algériennes. 
            Projets, stocks, RH, facturation et reporting — tout en un.
          </p>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              '✓ Multi-projets et multi-chantiers',
              '✓ Calculs IRG/CNAS conformes DZ 2024',
              '✓ Exports PDF & Excel professionnels',
              '✓ Suivi stock avec prix moyen pondéré',
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                <span style={{ color: '#E07B2A' }}>{feat.split(' ')[0]}</span>
                <span>{feat.substring(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div>
          <p className="text-xs" style={{ color: '#4a5568' }}>
            © 2026 Atlas Manager — Tous droits réservés
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E07B2A' }}>
              <HardHat size={20} color="white" />
            </div>
            <span className="font-bold text-lg text-gray-800">Atlas Manager</span>
          </div>

          <div className="card p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
              <p className="text-gray-500 text-sm mt-1">Entrez vos identifiants pour accéder à l'application</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="alert alert-danger">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="form-label">
                  <Mail size={14} className="inline mr-1.5 text-gray-400" />
                  Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@constructions-dz.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0">
                    <Lock size={14} className="inline mr-1.5 text-gray-400" />
                    Mot de passe
                  </label>
                  <a href="#" className="text-xs font-medium" style={{ color: '#E07B2A' }}>Oublié ?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full justify-center mt-2"
                style={{ width: '100%' }}
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Connexion en cours...</>
                  : 'Se connecter'
                }
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className="text-xs font-semibold text-gray-500 mb-1">🔑 Compte de démonstration</p>
              <p className="text-xs text-gray-500">Email : <span className="font-mono text-gray-700">admin@constructions-dz.com</span></p>
              <p className="text-xs text-gray-500">Mdp : <span className="font-mono text-gray-700">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
