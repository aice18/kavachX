# System Flow Diagrams

## 1. Workflow Diagram (End-to-End Threat Lifecycle)

```mermaid
graph TD
    A[Raw Log Generation (VPN, DB, APIs)] --> B[Event Collection Layer]
    B --> C[Data Normalization]
    C --> D{Is Known Threat?}
    D -->|Yes| E[Trigger Playbook]
    D -->|No| F[AI Correlation & Anomaly Detection]
    F --> G{Anomaly Score > Threshold?}
    G -->|Yes| H[Generate AI Threat Alert]
    G -->|No| I[Store for Baseline]
    H --> J[SOC Analyst Triage]
    J --> K[AI Copilot Analysis]
    K --> E
    E --> L[Containment & Audit]
```

## 2. Sequence Diagram (AI Anomaly Detection Flow)

```mermaid
sequenceDiagram
    participant User/Sensor
    participant Backend (Express)
    participant Database (PG)
    participant AI Engine (Gemini)
    participant Frontend (React)

    User/Sensor->>Backend: Ingest Telemetry Data
    Backend->>Database: Log raw telemetry
    Backend->>AI Engine: POST /api/ml/anomaly (Send features)
    AI Engine-->>Backend: Return Anomaly Score & Reasoning
    Backend->>Database: Save Incident if Anomalous
    Frontend->>Backend: Polling GET /api/metrics/soc
    Backend-->>Frontend: Return latest incidents
    Frontend->>User/Sensor: Display Alert on SOC Dashboard
```

## 3. Data Flow Diagram (DFD)

```mermaid
flowchart LR
    A[Bank Infrastructure] -->|Network Traffic, Logs| B((Event Collector))
    B -->|Normalized Events| C[(PostgreSQL DB)]
    C -->|Query Historical Data| D((AI Engine))
    D -->|Correlated Incidents| C
    E[SOC Analyst] -->|Fetches Dashboards| F((API Layer))
    C -->|Aggregated Metrics| F
    F -->|JSON Response| E
```

## 4. Deployment Diagram

```mermaid
graph TD
    subgraph "Cloud Hosting (Vercel & Render)"
        A[Vercel Edge Network] --> B[React Frontend SPA]
        C[Render Web Service] --> D[Node.js / Express API]
        B <-->|HTTPS REST| D
    end
    
    subgraph "Database Tier (Supabase)"
        D <-->|PostgreSQL Protocol| E[(PostgreSQL Instance)]
        E <--> F[Connection Pooler]
    end
    
    subgraph "External Services"
        D <-->|HTTPS POST| G[Google Gemini API]
    end
```
