export type EventSource = "vpn" | "atm" | "api" | "database" | "employee_login" | "upi" | "firewall";

export interface Actor {
  user_id: string;
  role: "employee" | "customer" | "system";
}

export interface Geo {
  city: string;
  country: string;
}

export interface Target {
  account_id: string | null;
  resource: string | null;
}

export interface Event {
  event_id: string;
  timestamp: string;
  source: EventSource;
  actor: Actor;
  device_id: string;
  ip: string;
  geo: Geo;
  action: string;
  target: Target;
  amount: number | null;
  metadata: Record<string, any>;
}

export interface ExplainabilityFactor {
  factor: string;
  score: number;
}

export interface BusinessImpact {
  loss_exposure_inr: number;
  customers_affected: number;
  estimated_downtime_hours: number;
  compliance_severity: "Low" | "Medium" | "High" | "Critical";
}

export interface Forecast {
  threat_type: string;
  probability: number;
  eta_hours: number;
  confidence: number;
}

export interface Incident {
  incident_id: string;
  status: "active" | "contained" | "resolved";
  severity: "critical" | "high" | "medium" | "low";
  risk_score: number;
  reasons: ExplainabilityFactor[];
  created_at: string;
  updated_at: string;
  events: Event[];
  entity_id: string; // The primary entity this incident centers on
  entity_type: "user" | "device" | "account" | "ip";
  business_impact: BusinessImpact;
  forecast: Forecast;
  recommended_actions: string[];
}

export interface GraphNode {
  id: string;
  label: string; // "Employee", "Customer", "Account", etc.
  type?: string;
  properties: Record<string, any>;
  isFlagged?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string; // "LOGS_IN", "TRANSFERS", etc.
  properties?: Record<string, any>;
}

export interface QuantumAsset {
  system_id: string;
  name: string;
  algorithm: "RSA-2048" | "ECC" | "AES-256";
  vulnerable: boolean;
  recommendation: string;
}
