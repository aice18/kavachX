# KavachX Backend Architecture & ML Strategy

This document outlines the complete backend architecture, database schema, and machine learning models required to support KavachX as a production-grade cybersecurity platform for banking systems.

## 1. Core Architecture

The backend will be built as a robust, scalable microservices-oriented monolithic API (modular monolith) initially, allowing easy separation into microservices as load increases.

*   **Runtime:** Node.js 20+ with TypeScript
*   **Framework:** Express.js (v5) or Fastify for high-throughput log ingestion
*   **Database (Relational):** PostgreSQL 16+ for multi-tenant configuration, policies, user management, and incident records
*   **Database (Time-series):** ClickHouse or TimescaleDB for high-volume security logs and telemetry data
*   **Caching & Message Broker:** Redis (ElastiCache or similar) for real-time telemetry caching, rate limiting, and pub/sub event distribution
*   **Authentication:** JWT (JSON Web Tokens) with short expiration (15 mins) and sliding window refresh tokens securely stored in HTTP-only cookies

## 2. PostgreSQL Schema (Multi-Tenant Bank Data)

The relational database uses Row-Level Security (RLS) to enforce multi-tenancy.

```sql
-- Core Tenants (Banks)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    subscription_tier VARCHAR(50) DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'analyst', 'viewer')),
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
    assigned_to UUID REFERENCES users(id),
    ai_confidence_score FLOAT, -- Score given by ML models
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Playbooks (Automated Response)
CREATE TABLE playbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Node.js/Express API Specifications & Security

*   **Rate Limiting (Redis-backed):**
    *   `/api/auth/*`: Strict limiting (e.g., 5 requests / minute per IP) to prevent brute-force attacks.
    *   `/api/ingest/*`: High throughput, token-bucket algorithm based on tenant subscription tier.
    *   `/api/copilot/*`: Moderate limiting (e.g., 20 requests / minute per user) to manage LLM costs.

*   **Security Middlewares:**
    *   `helmet`: For setting secure HTTP headers (HSTS, X-Frame-Options, CSP).
    *   `cors`: Strictly configured to only allow requests from the trusted frontend domain.
    *   `express-mongo-sanitize` (if using MongoDB) or parameterized queries (pg/Drizzle) to prevent NoSQL/SQL injection.
    *   Input Validation using `zod` or `joi`.

*   **JWT Handling:**
    *   Access Tokens (JWT) are short-lived (15 minutes).
    *   Refresh Tokens are opaque strings stored in the database, associated with device fingerprints, and stored on the client as `HttpOnly`, `Secure`, `SameSite=Strict` cookies.

## 4. Machine Learning Models & Integration

KavachX relies on a multi-layered AI approach, combining specialized ML models for fast anomaly detection with Large Language Models (LLMs) for complex reasoning and user interaction.

### A. Real-time Telemetry & Anomaly Detection Models
These models run continuously on the telemetry stream (using technologies like Apache Flink or Python microservices).

1.  **Isolation Forest / One-Class SVM:**
    *   **Use Case:** Unsupervised anomaly detection on network traffic volume, API request rates, and login frequencies.
    *   **Goal:** Flag behavior that deviates significantly from a tenant's established baseline.
2.  **LSTM Autoencoders (Deep Learning):**
    *   **Use Case:** Sequential pattern recognition in user activity logs (e.g., User logs in from new IP -> Accesses unusual database table -> Downloads large file).
    *   **Goal:** Detect "living off the land" attacks and insider threats based on temporal sequences.
3.  **XGBoost / LightGBM (Supervised Classifier):**
    *   **Use Case:** Triaging and scoring alerts generated by signature-based tools (WAF, IDS).
    *   **Goal:** Reduce false positives by predicting the probability that an alert is a true threat, using historical incident resolution data as training labels.

### B. NLP & Generative AI (The Copilot layer)
Powered by the Gemini API (`gemini-3.1-pro-preview` for complex reasoning, `gemini-3.6-flash` for fast chat).

1.  **Threat Intel Correlation (RAG Pipeline):**
    *   **Use Case:** When a new CVE or threat actor TTP is published, the LLM ingests the report and checks the tenant's infrastructure (via Vector DB embeddings of asset configurations) for vulnerabilities.
2.  **Automated Incident Summarization:**
    *   **Use Case:** Summarize complex PCAP (Packet Capture) analysis, firewall logs, and process trees into a human-readable incident timeline.
3.  **Remediation Code/Script Generation:**
    *   **Use Case:** Generating precise firewall rules, AWS IAM policies, or endpoint isolation scripts based on the specific threat context (What-If Simulator backing).

## 5. System Data Flow

1.  **Ingestion:** Security logs (Syslog, CloudTrail, WAF) hit the Ingestion API -> Kafka/Pulsar.
2.  **Stream Processing:** Flink consumes Kafka, runs ML Anomaly Detection (Isolation Forest), updates Redis caches.
3.  **Storage:** Raw logs go to ClickHouse. Alerts/Incidents go to PostgreSQL.
4.  **Backend API:** Node.js serves the frontend Dashboard, fetching real-time metrics from Redis and historical data from PostgreSQL/ClickHouse.
5.  **Copilot:** Node.js API acts as a secure proxy to the Gemini API, injecting system context and threat data into the prompt before querying the LLM.
