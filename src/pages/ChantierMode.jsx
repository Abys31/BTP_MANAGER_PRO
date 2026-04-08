import React from 'react';
import { 
  Users, 
  FileEdit, 
  Truck, 
  Fuel, 
  HardHat, 
  AlertTriangle, 
  Camera, 
  Package, 
  ShoppingCart,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChantierMode() {
  const navigate = useNavigate();

  const tiles = [
    { id: 'POINTAGE', label: 'Pointage Ouvriers', icon: Users, color: '#F97316' },
    { id: 'RAPPORT', label: 'Rapport Journalier', icon: FileEdit, color: '#3B82F6' },
    { id: 'LIVRAISON', label: 'Réception BL', icon: Truck, color: '#10B981' },
    { id: 'GASOIL', label: 'Consommation Gasoil', icon: Fuel, color: '#EF4444' },
    { id: 'ENGINS', label: 'Heures Engins', icon: HardHat, color: '#8B5CF6' },
    { id: 'INCIDENT', label: 'Incident / Alerte', icon: AlertTriangle, color: '#FCD34D' },
    { id: 'PHOTO', label: 'Photo Chantier', icon: Camera, color: '#EC4899' },
    { id: 'STOCK', label: 'Stock Local', icon: Package, color: '#6B7280' },
    { id: 'ACHAT', label: 'Demande Achat', icon: ShoppingCart, color: '#1C2333' }
  ];

  return (
    <div className="flex flex-col min-h-[80vh] space-y-6">
      {/* Header for Field Mode */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-50 text-[#F97316] rounded-xl flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 bg-[#F97316] rounded-full" />
           </div>
           <div>
              <h1 className="text-xl font-black text-[#111827] uppercase tracking-tighter">Terminal Chantier Live</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Connecté • Lot-42 • Alger</p>
           </div>
        </div>
        <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#111827] transition-all">
           <Maximize2 size={20} />
        </button>
      </div>

      {/* 9-Tile Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
         {tiles.map((tile) => (
            <button 
               key={tile.id}
               onClick={() => console.log(`Action: ${tile.id}`)}
               className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 group relative overflow-hidden"
            >
               {/* Decorative background circle */}
               <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" style={{ backgroundColor: tile.color }} />
               
               <div className="w-20 h-20 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg group-hover:shadow-xl" style={{ backgroundColor: `${tile.color}15`, color: tile.color }}>
                  <tile.icon size={40} strokeWidth={2.5} />
               </div>
               
               <div className="text-center">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter leading-tight">{tile.label}</h3>
                  <div className="flex items-center justify-center gap-1 mt-2 text-[10px] font-black text-gray-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                     Démarrer <ChevronRight size={12} />
                  </div>
               </div>

               {/* Large ID Indicator */}
               <span className="absolute bottom-4 right-6 text-[8px] font-black text-gray-100 uppercase tracking-[0.5em] group-hover:text-gray-200">BTP-DZ</span>
            </button>
         ))}
      </div>

      {/* Bottom status bar for Field Mode */}
      <div className="bg-[#1C2333] p-4 rounded-2xl flex items-center justify-between text-white shadow-xl">
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Batterie Tablette</span>
               <span className="text-xs font-black">94% — En charge</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Signal Réseau</span>
               <span className="text-xs font-black text-green-400 font-mono">4G+ (HAUT DÉBIT)</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316]">Synchronisation Auto: Activée</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         </div>
      </div>
    </div>
  );
}
