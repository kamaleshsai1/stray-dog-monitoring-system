# AI-Powered Real-Time Stray Dogs Monitoring System (CanineAI)

> **Capstone Project Review - 1 (Batch DS-15)**  
> **Institution:** GITAM School of CSE, GITAM (Deemed to be University), Bengaluru, Karnataka, India  
> **Guide:** Dr. C Gopal Krishnan (Associate Professor, Department of Computer Science Engineering)  
> **Team Members:**  
> - Gaddam Kamalesh Sai (2023005563) - Team Lead  
> - M Sai Kiran Reddy (2023006917)  
> - Uddala Teja (2023003849)  
> - Moda Sai Manoj (2023001988)  

---

## ?? Executive Summary & Architecture Overview

The increasing population of stray dogs in urban and campus environments presents critical challenges involving public safety, rabies disease vector control, territorial pack aggression, traffic accidents, and animal welfare. Existing municipal and campus tracking workflows are manual, fragmented, and lack real-time geolocation telemetry and data analytics.

This project delivers a **full-stack, production-grade AI-powered real-time stray dog tracking, monitoring, and municipal welfare system**.

### ? Critical Design Decision: Zero-RFID Architecture
As explicitly specified in the project requirements, **RFID tags and RFID readers have been excluded entirely**. Instead, the system uses:
1. **QR-Enabled Collar Digital Identity Tags**: Scannable by any citizen, student, security guard, or veterinarian using any smartphone camera without proprietary hardware.
2. **GPS IoT Collar Telemetry**: Continuous latitude/longitude coordinates, battery level, body temperature, and kinetic activity logs.
3. **AI Computer Vision (Field Vision Surveillance)**: Automated real-time dog detection (YOLOv8), behavioral emotion classification (Calm, Playful, Alert Guarding, Pack Socialization), and automated clinical rabies symptom screening.

---

## ?? Key Modules & System Features

### 1. ??? GIS Real-Time GPS Tracking Map
- High-performance interactive **Leaflet OpenStreetMap** interface.
- Sector Geofencing Polygons for:
  - **CAMPUS**: Central Academic & Admin Quadrangle
  - **SBH**: South Boys Hostel & Dining Zone
  - **NBH**: North Boys Hostel & Cafeteria Zone
  - **SBH-NBH LAWN**: Connecting Central Green Lawn
- Real-time animated telemetry markers for **all 15 surveyed campus dogs (D1 through D15)**.
- Color-coded status halos:
  - ?? **Green**: Vaccinated, Sterilized, and in optimal health.
  - ?? **Amber**: Booster vaccination due or ABC surgery scheduled.
  - ?? **Rose/Red**: Under observation for medical injury or aggression alert.
- Live telemetry ticker reporting battery %, body temperature, speed, and real-time activity status.

### 2. ??? AI Computer Vision & Field Vision Surveillance Hub
- **4-Camera Live Surveillance Matrix**:
  - `CAM-01`: Admin Block Quadrangle (Tracking D01 Tiger)
  - `CAM-05`: SBH Hostel Entrance (Tracking D03 Brownie, D14 Biscuit)
  - `CAM-09`: NBH Courtyard & Garden (Tracking D07 Leo, D12 Zorro)
  - `CAM-12`: Central Connecting Lawn (Tracking D15 )
- Real-time YOLOv8 bounding box overlays, confidence score metrics (e.g. `97.4%`), and threat classification.
- **Interactive AI Diagnostic Lab**:
  - Upload field photos or test standard benchmark scenarios (Calm Pariah, Defensive Aggression, Injured/Limping Stray).
  - Neural engine outputs: Species identification, emotion classification, rabies clinical risk assessment, and biometric match against the digital registry.

### 3. ?? Digital Dog Registry (D1 to D15)
- Directly reflects the **15 campus dogs cataloged in Page 17 of the Capstone survey**:
  - **D1 (Tiger)**: Golden Brown Pariah mix, Admin Lawn
  - **D2 (Rusty)**: Copper Brown Hound, Main Pathway
  - **D3 (Brownie)**: Warm Brown Indie, SBH Porch
  - **D4 (Midnight)**: Jet Black Hound, SBH Courtyard
  - **D5 (Snowy)**: White & Pale Cream, SBH Garden
  - **D6 (Spotty / Oreo)**: Black & White Spotted Indie, NBH Pathway
  - **D7 (Leo)**: Honey Tan, NBH Courtyard
  - **D8 (Bruno)**: Black & Tan, Library Boulevard
  - **D9 (Milo)**: Blonde & Cream, North Mess
  - **D10 (Rocky)**: Fawn with Dark Mask, NBH Gate 1
  - ** (Daisy)**: Tricolor Indie, NBH Hedge
  - **D12 (Zorro)**: Black & Tan Pinscher Mix, NBH Green
  - **D13 (Simba)**: Golden Tan, Sports Complex
  - **D14 (Biscuit)**: Fawn Indie, SBH West Veranda
  - **D15 ()**: Cohesive pack of 4, Central Lawn
- **Printable QR Collar Tag Generator**: Produces print-ready, high-resolution QR collar tags displaying dog code, emergency contact, and verified vaccination badges.
- **QR Code Scanner / ID Lookup Tool**: 1-click lookup simulating smartphone camera scans to pull authenticated dog profiles.

### 4. ?? Municipal Rescues & ABC Drives
- Manages field operations for **Animal Birth Control (ABC)** neutering and **Anti-Rabies Vaccination (ARV)** campaigns.
- Workflow tracking: `Scheduled` ? `En Route` ? `In Progress` ? `Completed & Released`.
- Automated dispatch ticket generation and mobile vet van assignment.

### 5. ?? Citizen & Student Incident Reporting Portal
- Public reporting portal for campus students, faculty, and urban citizens.
- Categories: Injured Stray Sighting, Aggressive Pack Behavior, Rabies Suspicion, Newborn Pups, Untagged Strays.
- Live community feed of verified reports with progress status.

### 6. ?? Population & Hotspot Demographic Analytics
- **Total Population**: 15 Dogs
- **Vaccination Rate**: 93% (WHO Herd Immunity Target > 70% achieved)
- **Sterilization Compliance**: 87% (13/15 Sterilized & Ear-notched)
- Population distribution breakdown by campus zone.
- Automated municipal resource recommendations for upcoming veterinary drives.

---

## ??? Technology Stack

- **Frontend:**
  - React 18 + Vite
  - Vanilla CSS Design System (Sleek dark theme, Glassmorphism, Neon glow accents)
  - Leaflet GIS mapping with custom HTML pulse markers
  - Lucide React Iconography
  - QRCode.React (Collar tag generation)
  - Web Audio API (Synthesized tactical acoustic chimes)
  - Canvas Confetti (Celebration effects on completed missions)
- **Backend:**
  - Node.js + Express
  - RESTful APIs with CORS
  - Real-time IoT GPS Telemetry simulator
  - AI Deep Learning Computer Vision diagnostic inference endpoint
  - JSON persistent data store

---

## ????? How to Run the Project

### Option A: 1-Click Launch (Recommended)
Double-click `start-system.bat` in the project root:
```bat
start-system.bat
```
This automatically starts both the backend API on port 5000 and the React frontend on port 5173, then launches your default browser.

### Option B: Manual Terminal Execution

#### 1. Start the Backend API
```powershell
cd D:\AntigravityProjects\stray-dog-monitoring-systemackend
node server.js
```
*API will run on: `http://localhost:5000/`*

#### 2. Start the Frontend
```powershell
cd D:\AntigravityProjects\stray-dog-monitoring-systemrontend
npm run dev
```
*Frontend will run on: `http://localhost:5173/`*

---

## ?? Backend API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/dogs` | GET | Retrieve all dogs with search, zone, vaccination & sterilization filters |
| `/api/dogs/:id` | GET | Get single dog medical profile, vaccine card, and Field Vision sighting history |
| `/api/dogs` | POST | Register new stray dog into database & assign QR digital identity |
| `/api/dogs/:id` | PUT | Update dog medical, vaccination, or sterilization status |
| `/api/telemetry` | GET | Fetch real-time simulated IoT GPS coordinates, battery, and motion status |
| `/api/vision` | GET | List active Field Vision camera streams with live detection status |
| `/api/rescues` | GET / POST / PUT | Fetch, schedule, and advance municipal rescue & ABC surgery drives |
| `/api/reports` | GET / POST | Submit and view citizen incident reports |
| `/api/ai/analyze-image` | POST | Execute AI computer vision inference (breed, behavior, rabies screening) |
| `/api/analytics` | GET | Demographic KPIs, herd immunity rate, and sector distribution |

---

*Developed for Academic Review DS-15, GITAM University Bengaluru.*
