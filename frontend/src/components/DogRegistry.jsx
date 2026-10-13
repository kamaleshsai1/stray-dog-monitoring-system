import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Search, 
  Filter, 
  QrCode, 
  CheckCircle, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Syringe, 
  MapPin, 
  Eye, 
  Printer, 
  Plus, 
  Calendar, 
  UserCheck, 
  Sparkles,
  Phone,
  ScanLine
} from 'lucide-react';

export default function DogRegistry({ 
  dogs, 
  onSelectDog, 
  selectedDogModal, 
  setSelectedDogModal, 
  onRegisterDog 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [sterilizedFilter, setSterilizedFilter] = useState('ALL');
  const [qrModalDog, setQrModalDog] = useState(null);
  const [qrScannerInput, setQrScannerInput] = useState('');
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Filtered Dogs
  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = 
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = selectedZone === 'ALL' || dog.zone === selectedZone;
    const matchesSterilized = 
      sterilizedFilter === 'ALL' ||
      (sterilizedFilter === 'STERILIZED' && dog.sterilizationStatus.toLowerCase().includes('sterilized')) ||
      (sterilizedFilter === 'SCHEDULED' && !dog.sterilizationStatus.toLowerCase().includes('sterilized'));

    return matchesSearch && matchesZone && matchesSterilized;
  });

  const handleLookupQr = () => {
    if (!qrScannerInput.trim()) return;
    const q = qrScannerInput.trim().toLowerCase();
    const found = dogs.find(d => 
      d.qrCodeId.toLowerCase().includes(q) || 
      d.code.toLowerCase() === q || 
      d.id.toLowerCase() === q
    );
    if (found) {
      setSelectedDogModal(found);
      setShowScannerModal(false);
      setQrScannerInput('');
    } else {
      alert('No dog profile found matching QR code tag: ' + qrScannerInput);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Search & Action Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by dog name, code (e.g. D1), breed, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            value={selectedZone} 
            onChange={e => setSelectedZone(e.target.value)}
            className="form-input"
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="ALL">All Campus Zones</option>
            <option value="GITAM-MAIN">GITAM University Main Building</option>
            <option value="SBH">South Block (SBH)</option>
            <option value="NBH">North Block (NBH)</option>
            <option value="STAFF">Staff Quarters</option>
            <option value="CENTRAL-LAWN">Central Lawn (SBH-NBH Lawn)</option>
          </select>

          <select 
            value={sterilizedFilter} 
            onChange={e => setSterilizedFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="ALL">All Sterilization Status</option>
            <option value="STERILIZED">Sterilized Only</option>
            <option value="SCHEDULED">Pending / Scheduled</option>
          </select>

          <button 
            className="btn btn-cyan"
            onClick={() => setShowScannerModal(true)}
            style={{ fontSize: '0.8rem', padding: '9px 14px' }}
          >
            <ScanLine size={16} />
            <span>Scan / Lookup QR Tag</span>
          </button>
        </div>

      </div>

      {/* Grid of Dogs (D1 to D15) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
        {filteredDogs.map(dog => {
          const isSterilized = dog.sterilizationStatus.toLowerCase().includes('sterilized');
          const isVaccinated = dog.vaccinationStatus.toLowerCase().includes('up to date') || dog.vaccinationStatus.toLowerCase().includes('vaccinated');

          return (
            <div key={dog.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Card Photo Header */}
              <div style={{ position: 'relative', height: '175px', background: '#090d16' }}>
                <img 
                  src={dog.imageUrl} 
                  alt={dog.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Code badge */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.9)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', border: '1px solid var(--border-subtle)', fontFamily: 'monospace' }}>
                  {dog.code}
                </div>

                {/* Zone badge */}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span className="badge badge-emerald" style={{ background: 'rgba(15, 23, 42, 0.9)' }}>
                    {dog.zone}
                  </span>
                </div>

                {/* Ear-notch badge */}
                {isSterilized && (
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(16, 185, 129, 0.92)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Ear-Notched (Sterilized)
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>{dog.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{dog.breed} ? {dog.gender}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Health Score</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: dog.healthScore >= 90 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                      {dog.healthScore}/100
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--cyan-400)" />
                  <span>{dog.locationName}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '6px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dark)', display: 'block' }}>ANTI-RABIES</span>
                    <strong style={{ color: isVaccinated ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                      {isVaccinated ? 'Valid (ARV)' : 'Booster Due'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dark)', display: 'block' }}>COLOR & AGE</span>
                    <strong style={{ color: 'white' }}>{dog.color} ? {dog.age}</strong>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSelectedDogModal(dog)}
                    style={{ flex: 1, fontSize: '0.76rem', padding: '6px 10px' }}
                  >
                    <Eye size={14} /> Medical Record
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setQrModalDog(dog)}
                    style={{ fontSize: '0.76rem', padding: '6px 10px' }}
                    title="Generate QR Collar Tag"
                  >
                    <QrCode size={14} color="var(--cyan-400)" /> Collar Tag
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Full Dog Medical & Profile Card */}
      {selectedDogModal && (
        <div className="modal-overlay" onClick={() => setSelectedDogModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            
            <div style={{ position: 'relative', height: '180px', background: '#0f172a' }}>
              <img 
                src={selectedDogModal.imageUrl} 
                alt={selectedDogModal.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.95) 0%, transparent 80%)' }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>{selectedDogModal.name}</h2>
                    <span className="badge badge-cyan">{selectedDogModal.code}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {selectedDogModal.breed} ? {selectedDogModal.gender} ? {selectedDogModal.age}
                  </p>
                </div>
                <button 
                  className="btn btn-cyan"
                  onClick={() => setQrModalDog(selectedDogModal)}
                  style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                >
                  <QrCode size={14} /> View QR Tag
                </button>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Primary Attributes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>ZONE / TERRITORY</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--emerald-400)', marginTop: '2px' }}>
                    {selectedDogModal.zone}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{selectedDogModal.locationName}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>STERILIZATION (ABC)</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: selectedDogModal.sterilizationStatus.includes('Sterilized') ? 'var(--emerald-400)' : 'var(--amber-400)', marginTop: '2px' }}>
                    {selectedDogModal.sterilizationStatus}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Date: {selectedDogModal.sterilizationDate}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>GPS COLLAR STATUS</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--cyan-400)', marginTop: '2px' }}>
                    Active ({selectedDogModal.collar?.battery}%)
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Status: Continuous GPS Sync</div>
                </div>
              </div>

              {/* Vaccination Ledger */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Syringe size={16} color="var(--emerald-400)" />
                  Official Vaccination History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(selectedDogModal.vaccines || []).map((v, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem' }}>
                      <div>
                        <strong style={{ color: 'white' }}>{v.name}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Administered: {v.date} by {v.vet}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-emerald">Valid</span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--cyan-400)', marginTop: '2px' }}>Next Due: {v.nextDue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campus Welfare Contact */}
              <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--cyan-400)', textTransform: 'uppercase', fontWeight: '600' }}>Designated Caretaker / Welfare Desk</span>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'white', marginTop: '2px' }}>{selectedDogModal.ownerOrCaretaker}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  <Phone size={14} color="var(--emerald-400)" />
                  <span>{selectedDogModal.caretakerPhone}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedDogModal(null)}
                >
                  Close Record
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal: Printable QR Collar Tag  */}
      {qrModalDog && (
        <div className="modal-overlay" onClick={() => setQrModalDog(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>Official QR Collar Tag</h3>
              <span className="badge badge-cyan">{qrModalDog.code}</span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
              Field-deployable physical collar tag. Public citizens or veterinarians scan with any phone camera to access complete medical and vaccination records instantly .
            </p>

            {/* Tag Preview Box */}
            <div style={{ 
              background: '#ffffff', 
              color: '#0f172a', 
              padding: '20px', 
              borderRadius: '16px', 
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              border: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.05em', color: '#059669', textTransform: 'uppercase' }}>
                GITAM CAMPUS ANIMAL WELFARE
              </div>

              <QRCodeSVG 
                value={`https://canineai.gitam.edu/verify/${qrModalDog.qrCodeId}`} 
                size={160}
                level="H"
                includeMargin={true}
              />

              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{qrModalDog.name} ({qrModalDog.code})</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>Zone: {qrModalDog.zone}</div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
                  ANTI-RABIES VACCINATED ? STERILIZED
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '6px', width: '100%' }}>
                Emergency: {qrModalDog.caretakerPhone}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => { window.print(); }}
                style={{ flex: 1 }}
              >
                <Printer size={16} /> Print Tag Collar
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setQrModalDog(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: QR Code Scanner / Lookup Simulation */}
      {showScannerModal && (
        <div className="modal-overlay" onClick={() => setShowScannerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ScanLine size={20} color="var(--cyan-400)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>Scan QR Collar Tag</h3>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
              Simulate scanning a dog's collar QR code or type dog ID (e.g. <code>D1</code>, <code>D3</code>, or <code>SD-GITAM-D01-COPPER</code>):
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Enter QR Code or Dog ID (e.g. D1)"
                value={qrScannerInput}
                onChange={e => setQrScannerInput(e.target.value)}
                className="form-input"
                autoFocus
              />
              <button 
                className="btn btn-primary"
                onClick={handleLookupQr}
              >
                Lookup
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dark)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Quick Test Shortcuts (1-Click Lookup):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dogs.slice(0, 8).map(d => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDogModal(d);
                      setShowScannerModal(false);
                    }}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {d.code} ? {d.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowScannerModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
