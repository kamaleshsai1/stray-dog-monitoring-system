import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  Camera, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export default function CitizenReporting({ reports, onNewReport }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Injured Stray Sighting');
  const [location, setLocation] = useState('Central Campus Walkway');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    onNewReport({
      reporterName: name || 'Campus Student / Resident',
      reporterPhone: phone || '+91 99000 11223',
      category,
      location,
      description,
      priority
    });

    setSubmittedId('REP-' + Math.floor(500 + Math.random() * 500));
    setName('');
    setPhone('');
    setDescription('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 440px) 1fr', gap: '24px' }}>
      
      {/* Left: Reporting Form */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} color="var(--rose-400)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>
              Report Stray Dog Incident
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Public & Student reporting portal for injured stray dogs, aggressive behavior, rabies suspicion, or newly arrived dogs.
          </p>
        </div>

        {submittedId && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-500)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={20} color="var(--emerald-400)" />
            <div style={{ fontSize: '0.8rem' }}>
              <strong style={{ color: 'white' }}>Report Logged Successfully!</strong>
              <div style={{ color: 'var(--emerald-400)', fontSize: '0.74rem' }}>
                Assigned Ticket ID: {submittedId}. Municipal unit alerted.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="form-label">Your Name</label>
              <input 
                type="text" 
                placeholder="Student / Citizen Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Mobile Number</label>
              <input 
                type="text" 
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Incident Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="form-input"
            >
              <option value="Injured Stray Sighting">Injured Stray Sighting (Wound / Limp)</option>
              <option value="Aggressive Pack Behavior">Aggressive Pack Behavior / Chasing Vehicles</option>
              <option value="Suspected Rabies Signs">Suspected Rabies Signs (Excessive Saliva / Disorientation)</option>
              <option value="Unvaccinated Litter / Pups">Unvaccinated Litter / Newborn Puppies</option>
              <option value="New Stray Dog Without Collar Tag">New Stray Dog (Not in System)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="form-label">Location / Sector</label>
              <input 
                type="text" 
                placeholder="e.g. Near SBH Gate 2 / Admin Lawn"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Urgency Level</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value)}
                className="form-input"
              >
                <option value="High">High (Requires Immediate Response)</option>
                <option value="Medium">Medium (Attention within 24 Hours)</option>
                <option value="Low">Low (Informational Observation)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Description & Landmarks</label>
            <textarea 
              rows={3}
              placeholder="Describe the dog's appearance, behavior, exact spot, and if any human contact occurred..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit"
            className="btn btn-danger"
            style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
          >
            <Send size={16} /> Submit Incident Report
          </button>
        </form>
      </div>

      {/* Right: Existing Public Reports Feed */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'white' }}>
              Citizen & Community Report Tracker
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Real-time feed of submitted reports verified by campus animal welfare officers
            </p>
          </div>
          <span className="badge badge-cyan">{reports.length} Reports Logged</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          {reports.map(rep => {
            const isResolved = rep.status.toLowerCase().includes('resolved');

            return (
              <div 
                key={rep.id} 
                className="glass-card" 
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-dark)' }}>{rep.id}</span>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'white' }}>{rep.category}</h4>
                      {rep.priority === 'High' && <span className="badge badge-rose">High</span>}
                      {rep.priority === 'Medium' && <span className="badge badge-amber">Medium</span>}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--cyan-400)" /> {rep.location}
                      </span>
                      <span>?</span>
                      <span>Reported by: {rep.reporterName}</span>
                      <span>?</span>
                      <span>{rep.timestamp}</span>
                    </div>
                  </div>

                  <span className={`badge ${isResolved ? 'badge-emerald' : 'badge-amber'}`}>
                    {rep.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', background: 'rgba(255, 255, 255, 0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                  "{rep.description}"
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
