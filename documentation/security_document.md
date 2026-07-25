# Security Document

As a cybersecurity platform for the banking sector, KavachX is engineered with a defense-in-depth approach to ensure the integrity, confidentiality, and availability of financial data.

## Zero Trust Architecture
KavachX operates on a strict Zero Trust model. **"Never trust, always verify."**
- Every API request is authenticated independently.
- Internal lateral movement between microservices requires mutual TLS (mTLS) in production environments.

## JWT (JSON Web Tokens)
- **Stateless Authentication:** User sessions are managed via signed JWTs.
- **Security:** Tokens are signed using strong algorithmic secrets (e.g., HS256/RS256) and are strictly scoped with role claims.

## HTTPS / TLS
- **Encryption in Transit:** All communication between the React frontend, Express backend, and the Supabase PostgreSQL database is encrypted using industry-standard TLS 1.2/1.3 to prevent man-in-the-middle (MitM) attacks.

## Role-Based Access Control (RBAC)
- **Granular Permissions:** The system implements strict RBAC. 
  - `Admin`: Full access to configure Playbooks and manage users.
  - `Analyst`: Access to the SOC Dashboard and AI Copilot.
  - `Viewer`: Read-only access to the Executive Dashboard.

## Encryption
- **Encryption at Rest:** Supabase provides default AES-256 encryption at rest for the PostgreSQL database.
- **Sensitive Data:** Passwords and secrets are salted and hashed (via bcrypt) before being committed to the database.

## Audit Logs
- **Non-repudiation:** The `audit_logs` table maintains an immutable record of all critical actions performed within the KavachX platform (e.g., who executed a containment playbook, from what IP, and when).

## Session Management
- Tokens are configured with strict expiration times (e.g., 1 hour).
- Secure, HttpOnly cookies are utilized in production to prevent Cross-Site Scripting (XSS) attacks from stealing authentication tokens.
