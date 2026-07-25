# Database Schema

KavachX utilizes a multi-tenant PostgreSQL database designed for high-throughput security event logging and role-based access control.

## ER Diagram

```mermaid
erDiagram
    TENANTS ||--o{ USERS : "has"
    TENANTS ||--o{ INCIDENTS : "owns"
    TENANTS ||--o{ PLAYBOOKS : "defines"
    TENANTS ||--o{ AUDIT_LOGS : "generates"
    USERS ||--o{ INCIDENTS : "assigned to"
    USERS ||--o{ AUDIT_LOGS : "performs"

    TENANTS {
        uuid id PK
        varchar name
        varchar domain
    }

    USERS {
        uuid id PK
        uuid tenant_id FK
        varchar email
        varchar role
    }

    INCIDENTS {
        uuid id PK
        uuid tenant_id FK
        varchar title
        varchar severity
        varchar status
        uuid assigned_to FK
        timestamp created_at
    }

    PLAYBOOKS {
        uuid id PK
        uuid tenant_id FK
        varchar name
        jsonb trigger_conditions
        jsonb actions
    }

    AUDIT_LOGS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        varchar action
        inet ip_address
    }
```

## Core Tables Explained

1. **`tenants`**
   - **Purpose:** Supports multi-tenancy. Every piece of data in the system belongs to a tenant (e.g., a specific bank branch or corporate entity).
   
2. **`users`**
   - **Purpose:** Manages authentication and RBAC (Role-Based Access Control). Includes fields for `role` (admin, analyst, viewer) and MFA configuration.

3. **`incidents`**
   - **Purpose:** The core table for the SOC Dashboard. Stores correlated security alerts, their `severity` (low, medium, high, critical), and their lifecycle `status` (active, investigating, resolved).

4. **`playbooks`**
   - **Purpose:** Stores JSON-defined automated response workflows (e.g., "If ransomware detected -> Isolate VLAN").

5. **`audit_logs`**
   - **Purpose:** Immutable ledger of all system actions for compliance (e.g., RBI cybersecurity guidelines). Tracks who did what, when, and from what IP address.
