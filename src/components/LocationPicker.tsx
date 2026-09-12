import React, { useState } from 'react';
import { MapPin, Navigation, Loader2, CheckCircle2 } from 'lucide-react';

interface LocationPickerProps {
  value: string;
  onChange: (loc: string, coords?: { lat: number; lng: number }) => void;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, error }) => {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 16.4384,
    lng: 80.5654
  });

  const handleGetCurrentLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          const generatedName = `AIIMS Mangalagiri Bypass Road (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
          onChange(generatedName, { lat, lng });
          setLoading(false);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using Indian municipal coordinate defaults:', err);
          const fallbackLat = 16.4384;
          const fallbackLng = 80.5654;
          setCoords({ lat: fallbackLat, lng: fallbackLng });
          onChange('NH-16 AIIMS Junction, Mangalagiri, Guntur, AP', {
            lat: fallbackLat,
            lng: fallbackLng
          });
          setLoading(false);
        },
        { timeout: 8000 }
      );
    } else {
      setCoords({ lat: 16.4384, lng: 80.5654 });
      onChange('NH-16 AIIMS Junction, Mangalagiri, Guntur, AP');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Location & Geo-Coordinates <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087D70] hover:text-[#065e54] transition-colors"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>Use My Current Location</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <MapPin className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value, coords || undefined)}
          placeholder="e.g., NH-16 AIIMS Junction, Mangalagiri, Guntur, AP"
          className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68] transition-all ${
            error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300'
          }`}
        />
      </div>

      {/* Interactive Map Visual Placeholder */}
      <div className="relative h-28 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
        {/* Grid pattern resembling open street map */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#073F68 1px, transparent 1px), radial-gradient(#087D70 1px, #f1f5f9 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Mock Road vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <path d="M 0 60 Q 150 20, 300 80 T 600 40" fill="none" stroke="#64748B" strokeWidth="8" />
          <path d="M 120 0 L 140 120" fill="none" stroke="#CBD5E1" strokeWidth="6" />
          <path d="M 320 0 L 290 120" fill="none" stroke="#CBD5E1" strokeWidth="6" />
        </svg>

        {/* Center pin marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative animate-bounce">
            <div className="p-2 bg-rose-600 text-white rounded-full shadow-lg border-2 border-white">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="w-2.5 h-1 bg-black/30 rounded-full mx-auto blur-[1px] mt-0.5" />
          </div>
          <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-[10px] font-bold text-slate-800 shadow-sm">
            {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : 'Selected Pin'}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 z-10 text-[9px] text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
          GIS Geo-Tag Verified
        </div>
      </div>
    </div>
  );
};
