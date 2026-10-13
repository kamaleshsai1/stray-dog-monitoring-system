import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import LiveMap from './components/LiveMap';
import AIVisionCenter from './components/AIVisionCenter';
import DogRegistry from './components/DogRegistry';
import RescuesOperations from './components/RescuesOperations';
import CitizenReporting from './components/CitizenReporting';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { 
  X, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [dogs, setDogs] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [stats, setStats] = useState(null);
  const [rescues, setRescues] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedDogModal, setSelectedDogModal] = useState(null);
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Form states for Register Dog Modal
  const [regName, setRegName] = useState('');
  const [regBreed, setRegBreed] = useState('Indian Pariah (Indie)');
  const [regColor, setRegColor] = useState('Tan Brown');
  const [regZone, setRegZone] = useState('CAMPUS');
  const [regLocation, setRegLocation] = useState('Central Campus Admin Quad');
  const [regGender, setRegGender] = useState('Male');
  const [regVaccination, setRegVaccination] = useState('Up to date');
  const [regSterilized, setRegSterilized] = useState('Sterilized');
  const [regImage, setRegImage] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');

  // Quick report modal states
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');
  const [repCategory, setRepCategory] = useState('Injured Stray Sighting');
  const [repLocation, setRepLocation] = useState('');
  const [repDesc, setRepDesc] = useState('');

  // Futuristic Web Audio Synthesizer Tone
  const playAlertTone = (type = 'success') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.18); // A5
      } else {
        osc.frequency.setValueAtTime(349.23, audioCtx.currentTime); // F4
        osc.frequency.exponentialRampToValueAtTime(261.63, audioCtx.currentTime + 0.25); // C4
      }

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext muted or blocked
    }
  };

  // 1. Initial Load of Backend Data
  const fetchData = async () => {
    try {
      const [dogsRes, statsRes, rescuesRes, reportsRes] = await Promise.all([
        fetch('http://localhost:5000/api/dogs'),
        fetch('http://localhost:5000/api/analytics'),
        fetch('http://localhost:5000/api/rescues'),
        fetch('http://localhost:5000/api/reports')
      ]);

      const dogsData = await dogsRes.json();
      const statsData = await statsRes.json();
      const rescuesData = await rescuesRes.json();
      const reportsData = await reportsRes.json();

      if (dogsData.success) setDogs(dogsData.dogs);
      if (statsData.success) setStats(statsData);
      if (rescuesData.success) setRescues(rescuesData.rescues);
      if (reportsData.success) setReports(reportsData.reports);
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Poll Real-Time Telemetry Every 3 Seconds
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/telemetry');
        const data = await res.json();
        if (data.success) {
          setTelemetry(data.telemetry);
        }
      } catch (err) {
        console.error('Telemetry fetch failed:', err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  // Register New Dog
  const handleRegisterDog = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName || 'Campus Indie',
          breed: regBreed,
          color: regColor,
          zone: regZone,
          locationName: regLocation,
          gender: regGender,
          vaccinationStatus: regVaccination,
          sterilizationStatus: regSterilized,
          imageUrl: regImage
        })
      });

      const data = await res.json();
      if (data.success) {
        playAlertTone('success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setShowRegisterModal(false);
        fetchData();
        setRegName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Incident Report
  const handleCreateReport = async (reportData) => {
    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      const data = await res.json();
      if (data.success) {
        playAlertTone('success');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Report Modal Submission
  const handleQuickReportSubmit = (e) => {
    e.preventDefault();
    handleCreateReport({
      reporterName: repName || 'Campus Student',
      reporterPhone: repPhone || '+91 99887 76655',
      category: repCategory,
      location: repLocation || 'Campus Area',
      description: repDesc,
      priority: 'High'
    });
    setShowReportModal(false);
    setRepDesc('');
  };

  // Create Rescue Mission
  const handleCreateRescue = async (rescueData) => {
    try {
      const res = await fetch('http://localhost:5000/api/rescues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rescueData)
      });
      const data = await res.json();
      if (data.success) {
        playAlertTone('success');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Rescue Status
  const handleUpdateRescueStatus = async (rescueId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/rescues/${rescueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        if (newStatus === 'Completed') {
          playAlertTone('success');
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
        }
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        stats={stats}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'map' && (
          <LiveMap 
            dogs={dogs} 
            telemetry={telemetry} 
            onSelectDog={dog => setSelectedDogModal(dog)} 
          />
        )}

        {activeTab === 'ai-vision' && (
          <AIVisionCenter 
            onDispatchRescue={() => setActiveTab('rescues')}
          />
        )}

        {activeTab === 'registry' && (
          <DogRegistry 
            dogs={dogs} 
            onSelectDog={dog => setSelectedDogModal(dog)}
            selectedDogModal={selectedDogModal}
            setSelectedDogModal={setSelectedDogModal}
            onRegisterDog={() => setShowRegisterModal(true)}
          />
        )}

        {activeTab === 'rescues' && (
          <RescuesOperations 
            rescues={rescues}
            dogs={dogs}
            onCreateRescue={handleCreateRescue}
            onUpdateRescueStatus={handleUpdateRescueStatus}
          />
        )}

        {activeTab === 'reports' && (
          <CitizenReporting 
            reports={reports}
            onNewReport={handleCreateReport}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            stats={stats}
            dogs={dogs}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 24px', fontSize: '0.78rem', color: 'var(--text-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: 'rgba(10, 15, 29, 0.95)' }}>
        <div>
          <strong>AI-Powered Real-Time Stray Dogs Monitoring System</strong> ? GITAM Bengaluru Capstone Batch DS-15
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Supervised by: Dr. C Gopal Krishnan (Assoc. Prof)</span>
          <span>?</span>
          <span style={{ color: 'var(--emerald-400)' }}>15 Campus Dogs Registered ? Digital QR & GPS Tracking</span>
        </div>
      </footer>

      {/* Modal: Register New Stray Dog */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} color="var(--emerald-400)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>Register New Stray Dog</h3>
              </div>
              <button 
                onClick={() => setShowRegisterModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ?
              </button>
            </div>

            <form onSubmit={handleRegisterDog} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Dog Name / Call Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Charlie"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select 
                    value={regGender}
                    onChange={e => setRegGender(e.target.value)}
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Breed Type</label>
                  <input 
                    type="text" 
                    value={regBreed}
                    onChange={e => setRegBreed(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Coat Color</label>
                  <input 
                    type="text" 
                    value={regColor}
                    onChange={e => setRegColor(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Primary Sector / Zone</label>
                  <select 
                    value={regZone}
                    onChange={e => setRegZone(e.target.value)}
                    className="form-input"
                  >
                    <option value="CAMPUS">Central Campus Quad</option>
                    <option value="SBH">SBH - South Boys Hostel</option>
                    <option value="NBH">NBH - North Boys Hostel</option>
                    <option value="SBH-NBH LAWN">SBH-NBH Connecting Lawn</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Sterilization Status</label>
                  <select 
                    value={regSterilized}
                    onChange={e => setRegSterilized(e.target.value)}
                    className="form-input"
                  >
                    <option value="Sterilized (Ear-Notched)">Sterilized (Ear-Notched)</option>
                    <option value="Not Sterilized (Scheduled)">Not Sterilized (Scheduled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Location Landmark</label>
                <input 
                  type="text" 
                  value={regLocation}
                  onChange={e => setRegLocation(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Profile Image URL</label>
                <input 
                  type="text" 
                  value={regImage}
                  onChange={e => setRegImage(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  <Sparkles size={16} /> Save & Issue QR Collar Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Report Incident */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="var(--rose-400)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>Quick Stray Dog Alert</h3>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ?
              </button>
            </div>

            <form onSubmit={handleQuickReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">Issue Category</label>
                <select 
                  value={repCategory}
                  onChange={e => setRepCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="Injured Stray Sighting">Injured Stray Dog Sighting</option>
                  <option value="Aggressive Behavior Alert">Aggressive Barking / Chasing Alert</option>
                  <option value="Suspected Rabies Symptoms">Suspected Rabies Signs (Salivating/Twitching)</option>
                  <option value="Lost / Unidentified Dog">Unidentified Stray Dog Without Tag</option>
                </select>
              </div>

              <div>
                <label className="form-label">Location Spot</label>
                <input 
                  type="text" 
                  placeholder="e.g. Outside Library Steps"
                  value={repLocation}
                  onChange={e => setRepLocation(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Observation Details</label>
                <textarea 
                  rows={3}
                  placeholder="Describe dog appearance and situation..."
                  value={repDesc}
                  onChange={e => setRepDesc(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-danger"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
