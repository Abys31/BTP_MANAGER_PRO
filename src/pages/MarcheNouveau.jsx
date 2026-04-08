import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Landmark, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { api } from '../utils/api';

export default function MarcheNouveau() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    numero_contrat: '',
    titre: '',
    maitre_ouvrage_nom: '',
    maitre_ouvrage_adresse: '',
    origine: 'PUBLIC',
    type_contrat: 'Appel d\'offres',
    montant_ht: '',
    tva_taux: 19,
    delai_initial_jours: '',
    ods_demarrage: '',
    retenue_garantie_taux: 5,
    avance_forfaitaire: 0,
    notation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        montant_ht: parseFloat(formData.montant_ht) || 0,
        tva_taux: parseFloat(formData.tva_taux) || 19,
        montant_ttc: (parseFloat(formData.montant_ht) || 0) * (1 + (parseFloat(formData.tva_taux) || 19) / 100),
        delai_initial_jours: parseInt(formData.delai_initial_jours) || 0,
        ods_demarrage: formData.ods_demarrage ? new Date(formData.ods_demarrage) : null,
      };
      
      const res = await api.post('/marches', payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/marches-publics'), 1500);
      } else {
        setError(res.message || 'Une erreur est survenue lors de la création.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Marché créé avec succès !</h2>
        <p className="text-gray-500 mt-2">Redirection vers la liste des marchés...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/marches-publics')}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Nouveau Marché Public</h1>
          <p className="text-sm text-gray-500">Initialisation d'un nouveau contrat ou convention</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Identité */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
            <FileText className="text-[#F97316]" size={20} />
            <h3 className="font-bold text-gray-800">Identification du Marché</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Intitulé de l'opération *</label>
              <input 
                type="text" 
                name="titre"
                required
                value={formData.titre}
                onChange={handleChange}
                placeholder="ex: RÉALISATION D'UN GROUPE SCOLAIRE TYPE 1 À ALGER"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">N° de contrat / Marché *</label>
              <input 
                type="text" 
                name="numero_contrat"
                required
                value={formData.numero_contrat}
                onChange={handleChange}
                placeholder="ex: 124/2026"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type de contrat</label>
              <select 
                name="type_contrat"
                value={formData.type_contrat}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
              >
                <option>Appel d'offres</option>
                <option>Conventionnel</option>
                <option>Gré à gré simple</option>
                <option>Gré à gré après consultation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Maître d'ouvrage */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
            <Landmark className="text-[#F97316]" size={20} />
            <h3 className="font-bold text-gray-800">Maître d'Ouvrage</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nom du Maître d'Ouvrage *</label>
              <input 
                type="text" 
                name="maitre_ouvrage_nom"
                required
                value={formData.maitre_ouvrage_nom}
                onChange={handleChange}
                placeholder="ex: Direction des Équipements Publics (DEP)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Origine du marché</label>
              <select 
                name="origine"
                value={formData.origine}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all font-bold"
              >
                <option value="PUBLIC">PUBLIQUE (Marché d'État)</option>
                <option value="PRIVE">PRIVÉE (Entreprise/Individu)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Financier & Délais */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
            <DollarSign className="text-[#F97316]" size={20} />
            <h3 className="font-bold text-gray-800">Finances & Délais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Montant HT (DA) *</label>
              <input 
                type="number" 
                name="montant_ht"
                required
                value={formData.montant_ht}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all font-bold text-[#F97316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TVA (%)</label>
              <select 
                name="tva_taux"
                value={formData.tva_taux}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
              >
                <option value={19}>19% (Standard)</option>
                <option value={9}>9% (Spécifique)</option>
                <option value={0}>0% (Exonéré)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Délai initial (jours)</label>
              <input 
                type="number" 
                name="delai_initial_jours"
                value={formData.delai_initial_jours}
                onChange={handleChange}
                placeholder="ex: 365"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ODS Probable / Réel</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date" 
                  name="ods_demarrage"
                  value={formData.ods_demarrage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pb-12">
          <button 
            type="button"
            onClick={() => navigate('/marches-publics')}
            className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-[#F97316] hover:bg-[#EA6C0A] text-white rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            <span>{loading ? 'Enregistrement...' : 'Enregistrer le marché'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
