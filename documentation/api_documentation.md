# API Documentation

This document outlines the core RESTful endpoints available in the KavachX backend.

---

### `POST /api/auth/login`
Authenticates a user and issues a JWT session token.

- **Input Payload:**
  ```json
  {
    "email": "admin@kavachx.bank",
    "password": "password123"
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbG...",
    "user": {
      "email": "admin@kavachx.bank",
      "role": "admin"
    }
  }
  ```

---

### `GET /api/metrics/soc`
Retrieves live SOC metrics, including the risk score, active incident count, and the real-time incident feed from the database.

- **Authentication:** Required (Bearer Token)
- **Output (200 OK):**
  ```json
  {
    "riskScore": 72,
    "activeIncidents": 14,
    "incidentFeed": [
      {
        "id": "uuid-1234",
        "time": "14:30",
        "type": "Unusual data exfiltration pattern",
        "user": "SYSTEM",
        "status": "Active"
      }
    ],
    "threatGraph": [...],
    "incidentTypes": [...]
  }
  ```

---

### `GET /api/metrics/executive`
Retrieves aggregated board-level metrics like Cyber Health Index, Value at Risk, and Predictive Risk Heatmaps.

- **Authentication:** Required (Bearer Token)
- **Output (200 OK):**
  ```json
  {
    "healthIndex": 27,
    "valueAtRisk": 12106344,
    "complianceStance": "RBI SLA AT RISK"
  }
  ```

---

### `POST /api/ml/score`
Calls the AI engine (simulated XGBoost) to classify an incident as a True Positive or False Positive.

- **Authentication:** Required (Bearer Token)
- **Input Payload:**
  ```json
  {
    "alertData": {
      "type": "Anomalous geographic login attempt",
      "user": "USR_1254"
    }
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "classification": "True Positive",
    "truePositiveProbability": 0.94,
    "keyIndicators": [
      "Login from unrecognized subnet",
      "Failed MFA challenge"
    ]
  }
  ```

---

### `POST /api/ml/anomaly`
Calls the AI engine (simulated Isolation Forest) to evaluate telemetry data for outliers.

- **Input Payload:**
  ```json
  {
    "telemetryData": {
      "loginAttempts": 500,
      "timeWindow": "10mins",
      "sourceRegion": "Unknown"
    }
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "isAnomalous": true,
    "anomalyScore": 0.88,
    "contributingFactors": [
      "Login velocity 50x above baseline"
    ]
  }
  ```

---

### `POST /api/ml/sequence`
Calls the AI engine (simulated LSTM) to analyze a temporal sequence of attacker movements.

- **Input Payload:**
  ```json
  {
    "actionTimeline": ["VPN Login", "Accessed CORE_DB", "High data transfer"]
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "threatDetected": true,
    "threatType": "Data Exfiltration (Insider Threat)",
    "sequenceRiskScore": 89,
    "reasoning": "Sequential progression from external access directly to sensitive core database followed by massive outbound traffic indicates successful exfiltration."
  }
  ```
