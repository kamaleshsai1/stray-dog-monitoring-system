const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const readData = (filename) => {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading ' + filename + ':', err);
    return [];
  }
};

const writeData = (filename, data) => {
  try {
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing ' + filename + ':', err);
    return false;
  }
};

// 1. Dogs API
app.get('/api/dogs', (req, res) => {
  let dogs = readData('dogs.json');
  const { zone, search, status, sterilized } = req.query;

  if (zone && zone !== 'ALL') {
    dogs = dogs.filter(d => d.zone === zone);
  }
  if (status && status !== 'ALL') {
    dogs = dogs.filter(d => d.vaccinationStatus.toLowerCase().includes(status.toLowerCase()));
  }
  if (sterilized && sterilized !== 'ALL') {
    if (sterilized === 'YES') {
      dogs = dogs.filter(d => d.sterilizationStatus.toLowerCase().includes('sterilized'));
    } else if (sterilized === 'NO') {
      dogs = dogs.filter(d => !d.sterilizationStatus.toLowerCase().includes('sterilized'));
    }
  }
  if (search) {
    const q = search.toLowerCase();
    dogs = dogs.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.locationName.toLowerCase().includes(q) ||
      d.breed.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: dogs.length, dogs });
});

app.get('/api/dogs/:id', (req, res) => {
  const dogs = readData('dogs.json');
  const dog = dogs.find(d => d.id === req.params.id || d.code.toLowerCase() === req.params.id.toLowerCase() || d.qrCodeId === req.params.id);
  if (!dog) {
    return res.status(404).json({ success: false, message: 'Dog record not found' });
  }
  res.json({ success: true, dog });
});

app.post('/api/dogs', (req, res) => {
  const dogs = readData('dogs.json');
  const nextNum = dogs.length + 1;
  const newCode = 'D' + nextNum;
  const newId = 'D' + String(nextNum).padStart(2, '0');
  
  const newDog = {
    id: newId,
    code: newCode,
    name: req.body.name || ('Stray-' + newCode),
    gender: req.body.gender || 'Unknown',
    age: req.body.age || 'Estimated 2 years',
    breed: req.body.breed || 'Indie (Desi Dog)',
    color: req.body.color || 'Tan',
    zone: req.body.zone || 'CAMPUS',
    locationName: req.body.locationName || 'Campus Main Grounds',
    latitude: req.body.latitude ? parseFloat(req.body.latitude) : 13.2886 + (Math.random() - 0.5) * 0.005,
    longitude: req.body.longitude ? parseFloat(req.body.longitude) : 77.5974 + (Math.random() - 0.5) * 0.005,
    vaccinationStatus: req.body.vaccinationStatus || 'Pending Initial Drive',
    sterilizationStatus: req.body.sterilizationStatus || 'Not Sterilized',
    sterilizationDate: req.body.sterilizationDate || 'Not applicable',
    healthScore: req.body.healthScore || 85,
    healthStatus: req.body.healthStatus || 'Active & Healthy',
    temperament: req.body.temperament || 'Calm',
    collar: {
      active: true,
      battery: 100,
      lastPing: 'Just registered',
      
    },
    ownerOrCaretaker: req.body.ownerOrCaretaker || 'Campus Animal Welfare Volunteer Cell',
    caretakerPhone: req.body.caretakerPhone || '+91 98450 12345',
    qrCodeId: 'SD-GITAM-' + newId + '-' + (req.body.name || 'DOG').toUpperCase(),
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    vaccines: req.body.vaccines || [
      { name: 'Anti-Rabies Initial', date: new Date().toISOString().split('T')[0], nextDue: '2027-10-13', status: 'Valid', vet: 'Campus Vet' }
    ],
    aiVisionSightings: [
      { camera: 'Registration Desk Cam', timestamp: 'Just now', confidence: 0.99, behavior: 'Calm during intake', aggressionRisk: 'Zero (0.0)' }
    ]
  };

  dogs.push(newDog);
  writeData('dogs.json', dogs);
  res.status(201).json({ success: true, dog: newDog });
});

app.put('/api/dogs/:id', (req, res) => {
  const dogs = readData('dogs.json');
  const index = dogs.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Dog not found' });
  }

  dogs[index] = { ...dogs[index], ...req.body, id: dogs[index].id, code: dogs[index].code };
  writeData('dogs.json', dogs);
  res.json({ success: true, dog: dogs[index] });
});

// 2. Real-time Telemetry with realistic micro-movement
app.get('/api/telemetry', (req, res) => {
  const dogs = readData('dogs.json');
  const now = new Date();
  
  // Apply realistic subtle GPS wander jitter for active collars
  const telemetry = dogs.map(d => {
    const codeNum = parseInt(d.code.replace('D', '')) || 1;
    const jitterLat = Math.sin(now.getTime() / 15000 + codeNum) * 0.00018;
    const jitterLng = Math.cos(now.getTime() / 15000 + codeNum) * 0.00018;
    
    return {
      id: d.id,
      code: d.code,
      name: d.name,
      zone: d.zone,
      currentLat: d.latitude + jitterLat,
      currentLng: d.longitude + jitterLng,
      battery: Math.max(25, d.collar.battery - Math.floor((Math.sin(now.getTime() / 60000) + 1) * 2)),
      
      activity: (Math.sin(now.getTime() / 10000 + codeNum) > 0.2) ? 'Walking / Roaming' : 'Resting',
      speed: (Math.sin(now.getTime() / 10000 + codeNum) > 0.2) ? '1.8 km/h' : '0.0 km/h',
      lastHeartbeat: 'Real-time (Active)',
      healthStatus: d.healthStatus,
      vaccinationStatus: d.vaccinationStatus,
      sterilizationStatus: d.sterilizationStatus
    };
  });

  res.json({ success: true, timestamp: now.toISOString(), telemetry });
});

// 3. Analytics
app.get('/api/analytics', (req, res) => {
  const dogs = readData('dogs.json');
  const rescues = readData('rescues.json');
  const reports = readData('reports.json');
  const zones = readData('zones.json');

  const totalDogs = dogs.length;
  const vaccinatedCount = dogs.filter(d => d.vaccinationStatus.toLowerCase().includes('up to date') || d.vaccinationStatus.toLowerCase().includes('vaccinated')).length;
  const sterilizedCount = dogs.filter(d => d.sterilizationStatus.toLowerCase().includes('sterilized')).length;
  const pendingSterilization = totalDogs - sterilizedCount;
  
  const zoneCounts = {};
  dogs.forEach(d => {
    zoneCounts[d.zone] = (zoneCounts[d.zone] || 0) + 1;
  });

  const healthDistribution = {
    optimal: dogs.filter(d => d.healthScore >= 90).length,
    good: dogs.filter(d => d.healthScore >= 80 && d.healthScore < 90).length,
    needsAttention: dogs.filter(d => d.healthScore < 80).length
  };

  res.json({
    success: true,
    summary: {
      totalMonitoredDogs: totalDogs,
      vaccinatedCount,
      vaccinationRate: Math.round((vaccinatedCount / totalDogs) * 100),
      sterilizedCount,
      sterilizationRate: Math.round((sterilizedCount / totalDogs) * 100),
      pendingSterilization,
      activeGPSCollars: dogs.filter(d => d.collar.active).length,
      activeRescueOperations: rescues.filter(r => r.status !== 'Completed').length,
      openCitizenReports: reports.filter(r => !r.status.toLowerCase().includes('resolved')).length
    },
    zoneCounts,
    healthDistribution,
    zones
  });
});



// 5. Operations / Rescues
app.get('/api/rescues', (req, res) => {
  const rescues = readData('rescues.json');
  res.json({ success: true, rescues });
});

app.post('/api/rescues', (req, res) => {
  const rescues = readData('rescues.json');
  const newOp = {
    id: 'OP-' + (100 + rescues.length + 1),
    type: req.body.type || 'Vaccination & Checkup',
    targetDogId: req.body.targetDogId || 'D01',
    dogName: req.body.dogName || 'Copper',
    zone: req.body.zone || 'CAMPUS',
    priority: req.body.priority || 'Medium',
    status: req.body.status || 'Scheduled',
    scheduledDate: req.body.scheduledDate || new Date().toISOString().split('T')[0],
    assignedTeam: req.body.assignedTeam || 'Animal Welfare Mobile Unit',
    notes: req.body.notes || 'Routine municipal welfare round.'
  };

  rescues.unshift(newOp);
  writeData('rescues.json', rescues);
  res.status(201).json({ success: true, rescue: newOp });
});

app.put('/api/rescues/:id', (req, res) => {
  const rescues = readData('rescues.json');
  const index = rescues.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Rescue not found' });
  
  rescues[index] = { ...rescues[index], ...req.body };
  writeData('rescues.json', rescues);
  res.json({ success: true, rescue: rescues[index] });
});

// 6. Public Reports
app.get('/api/reports', (req, res) => {
  const reports = readData('reports.json');
  res.json({ success: true, reports });
});

app.post('/api/reports', (req, res) => {
  const reports = readData('reports.json');
  const newRep = {
    id: 'REP-' + (500 + reports.length + 1),
    reporterName: req.body.reporterName || 'Anonymous Citizen',
    reporterPhone: req.body.reporterPhone || 'N/A',
    category: req.body.category || 'General Sighting',
    location: req.body.location || 'Campus Perimeter',
    description: req.body.description || 'Stray dog observation.',
    status: 'Pending Dispatch Review',
    timestamp: 'Just now',
    priority: req.body.priority || 'Medium'
  };

  reports.unshift(newRep);
  writeData('reports.json', reports);
  res.status(201).json({ success: true, report: newRep });
});

// 7. AI Computer Vision Analysis Endpoint (Simulated Neural Engine)
app.post('/api/ai/analyze-image', (req, res) => {
  const { sampleType, dogId } = req.body;
  const dogs = readData('dogs.json');
  const matchedDog = dogs.find(d => d.id === dogId || d.code === dogId);
  
  let primaryEmotion = 'Relaxed & Happy';
  let facialAnalysis = 'Ears neutral-relaxed, loose mouth posture, soft eye gaze, absence of dental exposure.';
  let emotionScores = { relaxed: 0.89, attentive: 0.08, curious: 0.02, anxious: 0.01, aggressive: 0.00 };
  let rabiesRisk = 'NEGATIVE (Clean mouth cavity, normal saliva flow, symmetrical head posture)';
  let mobility = 'NORMAL (Symmetrical weight distribution)';
  let aggressionIdx = 0.02;

  if (sampleType === 'aggressive') {
    primaryEmotion = 'Aggressive / Defensive Snarl';
    facialAnalysis = 'Retracted lips exposing canine dentition, wrinkling along dorsal snout, ears flattened back, fixed dilated gaze.';
    emotionScores = { aggressive: 0.88, anxious: 0.09, attentive: 0.03, relaxed: 0.00 };
    rabiesRisk = 'LOW-MODERATE (High reactivity, keep distance)';
    aggressionIdx = 0.84;
  } else if (sampleType === 'injured') {
    primaryEmotion = 'Pain / Lethargic Distress';
    facialAnalysis = 'Drooping eyelids, depressed facial muscle tone, furrowed inner brow, head hanging low.';
    emotionScores = { anxious: 0.76, pain: 0.18, attentive: 0.04, relaxed: 0.02 };
    mobility = 'ANOMALOUS (Forelimb limping detected)';
    aggressionIdx = 0.12;
  } else if (sampleType === 'attentive') {
    primaryEmotion = 'Curious & Attentive';
    facialAnalysis = 'Pricked upright ears, forward head tilt, focused pupils, closed calm mouth.';
    emotionScores = { attentive: 0.85, curious: 0.11, relaxed: 0.04, aggressive: 0.00 };
    aggressionIdx = 0.05;
  }

  // Exact pinpoint facial landmark extraction
  let faceBoundingBox = [0.16, 0.22, 0.82, 0.78];
  let facialLandmarks = {
    leftEye: [0.36, 0.38],
    rightEye: [0.36, 0.62],
    snoutNose: [0.54, 0.50],
    mouthLeft: [0.66, 0.44],
    mouthRight: [0.66, 0.56],
    leftEar: [0.22, 0.26],
    rightEar: [0.22, 0.74]
  };

  if (matchedDog && matchedDog.faceBoundingBox && matchedDog.facialLandmarks) {
    faceBoundingBox = matchedDog.faceBoundingBox;
    facialLandmarks = matchedDog.facialLandmarks;
    if (!sampleType && matchedDog.facialEmotion) {
      primaryEmotion = matchedDog.facialEmotion;
    }
  }

  let result = {
    detected: true,
    species: 'Canis lupus familiaris (Indie Canine)',
    confidence: 0.984,
    boundingBox: [0.10, 0.12, 0.90, 0.88],
    faceDetected: true,
    faceBoundingBox,
    facialLandmarks,
    emotionRecognition: {
      primaryEmotion,
      confidence: 0.972,
      emotionScores,
      facialExpressionAnalysis: facialAnalysis
    },
    breedIdentification: matchedDog ? matchedDog.breed : 'Indian Pariah (Indie Hound)',
    healthDiagnostics: {
      rabiesRisk,
      skinHealth: 'HEALTHY COAT (No mange or lesion detected)',
      physicalMobility: mobility,
      nutritionalScore: 'B.C.S. 4.5/9 (Ideal Street Dog Nutrition)'
    },
    matchedDogProfile: matchedDog ? {
      dogId: matchedDog.id,
      name: matchedDog.name,
      zone: matchedDog.zone,
      vaccinationStatus: matchedDog.vaccinationStatus
    } : {
      dogId: 'CUSTOM',
      name: 'Custom Field Canine',
      zone: 'FIELD-INPUT',
      vaccinationStatus: 'Pending Database Verification'
    },
    inferenceTimeMs: 34
  };

  res.json({ success: true, analysis: result });
});

app.listen(PORT, () => {
  console.log('AI Stray Dog Monitoring Backend running on http://localhost:' + PORT);
});
