import React from 'react';
import {
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown,
  Building2, HardHat, AlertTriangle, CheckCircle, Clock,
  Package, Users, Car, CreditCard, Wallet, ArrowRight,
  ChevronUp, ChevronDown
} from 'lucide-react';
import {
  LineChart as ReLineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- FORMATTERS ---
const formatDZD = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} M DA`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} k DA`;
  return `${value.toLocaleString('fr-DZ')} DA`;
};

// --- MOCK DATA ---
const caChargesData = [
  { mois: 'Oct', ca: 12500000, charges: 9800000 },
  { mois: 'Nov', ca: 18200000, charges: 14100000 },
  { mois: 'Déc', ca: 15800000, charges: 12300000 },
  { mois: 'Jan', ca: 22100000, charges: 17500000 },
  { mois: 'Fév', ca: 19500000, charges: 15200000 },
  { mois: 'Mar', ca: 28400000, charges: 21800000 },
];

const depensesCategories = [
  { name: 'Matériaux', value: 42, color: '#E07B2A' },
  { name: 'Main d\'œuvre', value: 28, color: '#1B3A5C' },
  { name: 'Sous-traitance', value: 15, color: '#10b981' },
  { name: 'Matériel', value: 10, color: '#3b82f6' },
  { name: 'Autres', value: 5, color: '#94a3b8' },
];

const chantiersAvancement = [
  { name: 'Bât. A - El Bahia', avancement: 68 },
  { name: 'Bât. B - El Bahia', avancement: 45 },
  { name: 'Lycée - Ain Benian', avancement: 32 },
  { name: 'Villa Kouba', avancement: 89 },
];

const alertes = [
  { type: 'danger', icon: Package, msg: '3 articles sous seuil minimum', link: '/stocks' },
  { type: 'warning', icon: CreditCard, msg: '2 factures fournisseurs échues', link: '/achats' },
  { type: 'info', icon: Users, msg: '2 contrats CDD expirent dans 15 jours', link: '/rh' },
  { type: 'warning', icon: Car, msg: '1 maintenance engin à planifier', link: '/materiel' },
];

const recentActivity = [
  { type: 'achat', icon: '🛒', text: 'BC #2024-0089 — Ciment Lafarge, 50 T', time: 'Il y a 35 min', amount: '850 000 DA' },
  { type: 'paiement', icon: '💰', text: 'Encaissement client — Lot A12, Tranche 2', time: 'Il y a 2h', amount: '3 500 000 DA' },
  { type: 'pointage', icon: '👥', text: 'Pointage chantier "Bât. A" — 18 présents', time: 'Il y a 3h', amount: '' },
  { type: 'stock', icon: '📦', text: 'Sortie ciment — 20 sacs vers Bât. B', time: 'Hier', amount: '' },
  { type: 'facture', icon: '📄', text: 'Facture #F-2024-0234 reçue — Aciérie', time: 'Hier', amount: '1 250 000 DA' },
];

// --- COMPONENTS ---
const StatCard = ({ label, value, sub, icon: Icon, iconBg, trend, trendValue }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="stat-card-icon" style={{ background: iconBg || '#fff7ed' }}>
        <Icon size={20} color={iconBg ? 'white' : '#E07B2A'} />
      </div>
    </div>
    {trendValue !== undefined && (
      <div className={`stat-card-trend mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
        {trend === 'up' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {trendValue}% vs mois précédent
      </div>
    )}
  </div>
);

const CustomTooltipDZD = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card p-3 text-xs shadow-xl">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}: {formatDZD(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ user }) {
  return (
    <div className="p-6 md:p-8 animate-slide-up">
      {/* Welcome banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">
            Bonjour, {user?.prenom || 'Administrateur'} 👋
          </h1>
          <p className="page-subtitle">
            Voici un résumé de vos activités BTP — {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="badge badge-success">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Système actif
          </span>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Projets actifs" value="3" sub="2 en cours, 1 en étude" icon={Building2} iconBg="#fff7ed" trend="up" trendValue={0} />
        <StatCard label="Chantiers en cours" value="5" sub="Sur 3 projets" icon={HardHat} iconBg="#dbeafe" />
        <StatCard label="CA encaissé (Mars)" value="28,4 M DA" sub="↑ Cumulé: 148 M DA" icon={TrendingUp} iconBg="#d1fae5" trend="up" trendValue={12} />
        <StatCard label="Dépenses (Mars)" value="21,8 M DA" sub="Budget: 25 M DA" icon={TrendingDown} iconBg="#fee2e2" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Marge globale" value="23,2%" sub="Objectif: 25%" icon={BarChart3} iconBg="#fff7ed" trend="down" trendValue={1.8} />
        <StatCard label="Créances clients" value="45,6 M DA" sub="8 tranches en retard" icon={Wallet} iconBg="#fef3c7" />
        <StatCard label="Dettes fournisseurs" value="12,3 M DA" sub="3 factures échues" icon={CreditCard} iconBg="#fee2e2" />
        <StatCard label="Valeur stock" value="8,7 M DA" sub="150 références actives" icon={Package} iconBg="#f0fdf4" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* CA vs Charges */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Évolution CA vs Dépenses</h3>
              <p className="text-xs text-gray-400 mt-0.5">6 derniers mois</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#E07B2A' }} /> CA</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#1B3A5C' }} /> Dépenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ReLineChart data={caChargesData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltipDZD />} />
              <Line type="monotone" dataKey="ca" name="CA" stroke="#E07B2A" strokeWidth={2.5} dot={{ fill: '#E07B2A', r: 4 }} />
              <Line type="monotone" dataKey="charges" name="Dépenses" stroke="#1B3A5C" strokeWidth={2.5} dot={{ fill: '#1B3A5C', r: 4 }} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Dépenses */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-1">Répartition dépenses</h3>
          <p className="text-xs text-gray-400 mb-4">Par catégorie</p>
          <ResponsiveContainer width="100%" height={160}>
            <RePieChart>
              <Pie data={depensesCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {depensesCategories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {depensesCategories.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avancement chantiers + Alertes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Avancement chantiers */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Avancement des chantiers</h3>
            <a href="/projets" className="text-xs font-medium flex items-center gap-1" style={{ color: '#E07B2A' }}>
              Voir tous <ArrowRight size={12} />
            </a>
          </div>
          <div className="space-y-4">
            {chantiersAvancement.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  <span className="text-sm font-bold" style={{ color: c.avancement >= 70 ? '#10b981' : c.avancement >= 40 ? '#E07B2A' : '#3b82f6' }}>
                    {c.avancement}%
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${c.avancement}%`,
                      background: c.avancement >= 70 ? '#10b981' : c.avancement >= 40 ? '#E07B2A' : '#3b82f6'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Alertes & Notifications</h3>
          <div className="space-y-2.5">
            {alertes.map((a, i) => {
              const Icon = a.icon;
              const colors = {
                danger: { bg: '#fee2e2', icon: '#ef4444', border: '#fecaca' },
                warning: { bg: '#fef3c7', icon: '#f59e0b', border: '#fde68a' },
                info: { bg: '#dbeafe', icon: '#3b82f6', border: '#bfdbfe' },
              };
              const c = colors[a.type];
              return (
                <a
                  key={i}
                  href={a.link}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, textDecoration: 'none' }}
                >
                  <Icon size={15} style={{ color: c.icon, marginTop: 1, flexShrink: 0 }} />
                  <span className="text-xs font-medium text-gray-700">{a.msg}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Activité récente</h3>
          <span className="text-xs text-gray-400">Dernières opérations</span>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{item.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
              </div>
              {item.amount && (
                <span className="text-sm font-bold text-gray-800 flex-shrink-0">{item.amount}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
