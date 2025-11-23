// src/components/LeafletMap.tsx
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix untuk icon marker Leaflet di Next.js
// Mengatasi masalah icon marker yang tidak muncul
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon merah untuk lokasi utama
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Interface untuk lokasi
interface MapLocation {
  lat: number;
  lng: number;
  title?: string;
  address?: string;
  phone?: string;
  description?: string;
}

// Props untuk komponen LeafletMap
interface LeafletMapProps {
  location?: MapLocation;
  height?: string;
  zoom?: number;
  markers?: MapLocation[];
  enableScrollZoom?: boolean;
}

// Default location (Jakarta - ganti dengan koordinat Anda)
const defaultLocation: MapLocation = {
  lat: -6.200000,
  lng: 106.816666,
  title: 'UMKM Delicious',
  address: 'Jl. Contoh No. 123, Jakarta Pusat',
  phone: '+62 812-3456-7890',
  description: 'Lokasi toko kami di pusat kota Jakarta'
};

// Component untuk recenter map ketika location berubah
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

// Komponen utama LeafletMap
export default function LeafletMap({
  location = defaultLocation,
  height = '400px',
  zoom = 15,
  markers = [],
  enableScrollZoom = true
}: LeafletMapProps) {
  // Gabungkan marker utama dengan markers tambahan
  const allMarkers = markers.length > 0 ? markers : [location];

  // Format nomor telepon untuk WhatsApp
  const formatPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  return (
    <div 
      style={{ 
        height, 
        width: '100%', 
        borderRadius: '15px', 
        overflow: 'hidden', 
        position: 'relative',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={zoom}
        scrollWheelZoom={enableScrollZoom}
        style={{ 
          height: '100%', 
          width: '100%',
          zIndex: 0
        }}
      >
        {/* Tile Layer - OpenStreetMap (Gratis selamanya) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Alternative Tile Layers - Uncomment untuk ganti style:
        
        // CartoDB Positron (Light & Clean)
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        // CartoDB Dark Matter (Dark Theme)
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        */}

        {/* Render semua markers */}
        {allMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.lat, marker.lng]}
            icon={index === 0 ? redIcon : icon}
          >
            <Popup maxWidth={300}>
              <div style={{ padding: '10px 5px' }}>
                {/* Title */}
                <h6 
                  className="fw-bold mb-2" 
                  style={{ 
                    fontSize: '1.1rem',
                    color: '#2c3e50',
                    borderBottom: '2px solid #e74c3c',
                    paddingBottom: '8px'
                  }}
                >
                  📍 {marker.title || 'Lokasi'}
                </h6>

                {/* Description */}
                {marker.description && (
                  <p 
                    className="mb-2 text-muted" 
                    style={{ fontSize: '0.9rem' }}
                  >
                    {marker.description}
                  </p>
                )}

                {/* Address */}
                {marker.address && (
                  <p 
                    className="mb-2" 
                    style={{ fontSize: '0.9rem', lineHeight: '1.5' }}
                  >
                    <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                    <strong>Alamat:</strong><br />
                    <span className="text-muted">{marker.address}</span>
                  </p>
                )}

                {/* Phone */}
                {marker.phone && (
                  <p 
                    className="mb-3" 
                    style={{ fontSize: '0.9rem' }}
                  >
                    <i className="fas fa-phone me-2 text-primary"></i>
                    <strong>Telepon:</strong><br />
                    <a 
                      href={`tel:${marker.phone}`}
                      className="text-decoration-none"
                      style={{ color: '#0d6efd' }}
                    >
                      {marker.phone}
                    </a>
                  </p>
                )}

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  {/* Google Maps Direction Button */}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ 
                      fontSize: '0.85rem',
                      padding: '8px 12px'
                    }}
                  >
                    <i className="fas fa-directions me-2"></i>
                    Petunjuk Arah
                  </a>

                  {/* WhatsApp Button */}
                  {marker.phone && (
                    <a 
                      href={`https://wa.me/${formatPhoneForWhatsApp(marker.phone)}?text=Halo, saya ingin bertanya tentang ${marker.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-sm"
                      style={{ 
                        fontSize: '0.85rem',
                        padding: '8px 12px',
                        backgroundColor: '#25D366'
                      }}
                    >
                      <i className="fab fa-whatsapp me-2"></i>
                      Hubungi via WhatsApp
                    </a>
                  )}

                  {/* Copy Coordinates Button */}
                  <button
                    onClick={() => {
                      const coords = `${marker.lat}, ${marker.lng}`;
                      navigator.clipboard.writeText(coords);
                      alert('Koordinat disalin: ' + coords);
                    }}
                    className="btn btn-outline-secondary btn-sm"
                    style={{ 
                      fontSize: '0.85rem',
                      padding: '8px 12px'
                    }}
                  >
                    <i className="fas fa-copy me-2"></i>
                    Salin Koordinat
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Component untuk recenter map */}
        <RecenterMap lat={location.lat} lng={location.lng} />
      </MapContainer>

      {/* Info overlay di pojok kiri bawah */}
      <div 
        className="position-absolute bottom-0 start-0 m-3 bg-white rounded shadow-sm p-2 px-3" 
        style={{ zIndex: 1000 }}
      >
        <small className="text-muted d-flex align-items-center">
          <i className="fas fa-map-marker-alt text-danger me-2"></i>
          <span className="fw-bold">{location.title || 'Lokasi Kami'}</span>
        </small>
      </div>

      {/* Zoom info di pojok kanan bawah */}
      <div 
        className="position-absolute bottom-0 end-0 m-3 bg-white rounded shadow-sm p-2 px-3" 
        style={{ zIndex: 1000 }}
      >
        <small className="text-muted">
          <i className="fas fa-search-plus me-1"></i>
          Zoom: {zoom}x
        </small>
      </div>

      {/* Global styles untuk Leaflet */}
      <style jsx global>{`
        /* Leaflet Container */
        .leaflet-container {
          height: 100%;
          width: 100%;
          font-family: inherit;
        }
        
        /* Popup Styling */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .leaflet-popup-content {
          margin: 15px;
          font-family: inherit;
        }
        
        .leaflet-popup-tip {
          background: white;
        }
        
        /* Control buttons styling */
        .leaflet-control-zoom a {
          border-radius: 8px;
        }
        
        /* Attribution styling */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          font-size: 0.7rem;
        }
        
        /* Marker animation */
        .leaflet-marker-icon {
          transition: transform 0.3s ease;
        }
        
        .leaflet-marker-icon:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}