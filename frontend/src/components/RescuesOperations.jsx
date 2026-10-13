import React, { useState } from 'react';
import { 
  Ambulance, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  MapPin, 
  ShieldAlert, 
  Truck, 
  FileCheck,
  Send
} from 'lucide-react';

export default function RescuesOperations({ 
  rescues, 
  dogs, 
  onCreateRescue, 
  onUpdateRescueStatus 
}) {
  const [showNewOpModal, setShowNewOpModal] = useState(false);
  const [formDogId, setFormDogId] = useState('D08');
  const [formType, setFormType] = useState('Animal Birth Control (ABC) Surgery');
  const [formPriority, setFormPriority] = useState('High');
  const [formTeam, setFormTeam] = useState('BBMP Mobile Vet Van 01 (Dr. Sharma)');
  const [formNotes, setFormNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const dog = dogs.find(d => d.id === formDogId) || dogs[0];
    
    onCreateRescue({
      targetDogId: dog.id,
      dogName: dog.name,
      zone: dog.zone,
      type: formType,
      priority: formPriority,
      assignedTeam: formTeam,
      notes: formNotes || `Scheduled ${formType} for ${dog.name} (${dog.code}) in ${dog.zone}.`
    });

    setShowNewOpModal(false);
    setFormNotes('');
  };

  const getPriorityBadge = (p) => {
    if (p === 'High') return <span className="badge badge-rose">High Priority</span>;
    if (p === 'Medium') return <span className="badge badge-amber">Medium Priority</span>;
    return <span className="badge badge-cyan">Routine</span>;
  };

  const getStatusBadge = (s) => {
    if (s === 'Completed') return <span className="badge badge-emerald"><CheckCircle size={12} /> Completed</span>;
    if (s === 'En Route') return <span className="badge badge-amber"><Truck size={12} /> En Route</span>;
    if (s === 'In Progress') return <span className="badge badge-cyan"><Clock size={12} /> In Progress</span>;
    return <span className="badge badge-secondary"><Calendar size={12} /> Scheduled</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner & Dispatch CTA */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ambulance size={22} color="var(--rose-400)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
              Municipal Veterinary Dispatches & ABC Sterilization Drives
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Schedule humane capture, Animal Birth Control (ABC) neutering, and anti-rabies vaccination rounds.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowNewOpModal(true)}
          style={{ fontSize: '0.85rem', padding: '10px 16px' }}
        >
          <Plus size={16} />
          <span>Dispatch / Schedule Operation</span>
        </button>
      </div>

      {/* KPI Ticker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Active Field Missions</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--cyan-400)', marginTop: '4px' }}>
            {rescues.filter(r => r.status !== 'Completed').length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dark)', textTransform: 'uppercase' }}>ABC Sterilizations Needed</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--amber-400)', marginTop: '4px' }}>
            {dogs.filter(d => !d.sterilizationStatus.toLowerCase().includes('sterilized')).length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Completed Operations</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--emerald-400)', marginTop: '4px' }}>
            {rescues.filter(r => r.status === 'Completed').length + 18}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Veterinary Units Ready</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>
            3 Mobile Vans
          </div>
        </div>
      </div>

      {/* Operations List */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
          Current Dispatch Pipeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rescues.map(op => {
            const dog = dogs.find(d => d.id === op.targetDogId);
            return (
              <div 
                key={op.id}
                className="glass-card"
                style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={22} color="var(--rose-400)" />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-dark)', fontWeight: '700' }}>{op.id}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>{op.type}</h4>
                      {getPriorityBadge(op.priority)}
                      {getStatusBadge(op.status)}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--cyan-400)', fontWeight: '600' }}>
                        Target: {op.dogName} ({op.targetDogId})
                      </span>
                      <span>?</span>
                      <span>Sector: {op.zone}</span>
                      <span>?</span>
                      <span>Unit: {op.assignedTeam}</span>
                    </div>

                    <p style={{ fontSize: '0.74rem', color: 'var(--text-dark)', marginTop: '4px' }}>
                      {op.notes}
                    </p>
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {op.status === 'Scheduled' && (
                    <button 
                      className="btn btn-cyan"
                      onClick={() => onUpdateRescueStatus(op.id, 'En Route')}
                      style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                    >
                      Dispatch Van
                    </button>
                  )}

                  {op.status === 'En Route' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => onUpdateRescueStatus(op.id, 'In Progress')}
                      style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                    >
                      Mark In Clinic
                    </button>
                  )}

                  {op.status !== 'Completed' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => onUpdateRescueStatus(op.id, 'Completed')}
                      style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                    >
                      <CheckCircle size={14} /> Complete & Release
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Dispatch New Operation */}
      {showNewOpModal && (
        <div className="modal-overlay" onClick={() => setShowNewOpModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'white' }}>Dispatch Veterinary / ABC Operation</h3>
              <button 
                onClick={() => setShowNewOpModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ?
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Target Stray Dog</label>
                <select 
                  value={formDogId}
                  onChange={e => setFormDogId(e.target.value)}
                  className="form-input"
                >
                  {dogs.map(d => (
                    <option key={d.id} value={d.id} style={{ background: '#0f172a' }}>
                      {d.code} - {d.name} ({d.zone}) ? {d.sterilizationStatus.includes('Sterilized') ? 'Sterilized' : 'NOT STERILIZED'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Operation Type</label>
                <select 
                  value={formType}
                  onChange={e => setFormType(e.target.value)}
                  className="form-input"
                >
                  <option value="Animal Birth Control (ABC) Surgery">Animal Birth Control (ABC) Surgery & Ear Notch</option>
                  <option value="Annual Anti-Rabies Vaccination">Annual Anti-Rabies Vaccination (ARV)</option>
                  <option value="Emergency Injury & Wound Dressing">Emergency Injury & Wound Dressing</option>
                  <option value="General Health Examination & Deworming">General Health Examination & Deworming</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Priority</label>
                  <select 
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value)}
                    className="form-input"
                  >
                    <option value="High">High (Immediate)</option>
                    <option value="Medium">Medium (This Week)</option>
                    <option value="Routine">Routine Drive</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Assigned Unit</label>
                  <select 
                    value={formTeam}
                    onChange={e => setFormTeam(e.target.value)}
                    className="form-input"
                  >
                    <option value="Mobile Vet Van 01 (Dr. Sharma)">Mobile Vet Van 01 (Dr. Sharma)</option>
                    <option value="Humane Capture Team 02">Humane Capture Team 02</option>
                    <option value="Campus Volunteer Support Cell">Campus Volunteer Support Cell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Field Notes / Instructions</label>
                <textarea 
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Specific capture instructions, post-op shelter period, or location landmark..."
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewOpModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  <Send size={15} /> Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
