import { Router } from 'express';
import { io } from '../index.js';
import crypto from 'crypto';

const router = Router();

router.post('/trigger-attack', (req, res) => {
    // We simulate a critical incident involving Insider Threat + RTGS Fraud
    const incidentId = `INC-${Math.floor(Math.random() * 10000)}`;
    const newIncident = {
        id: incidentId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Insider Threat + RTGS Fraud Anomaly',
        user: 'USR_' + Math.floor(Math.random() * 9999),
        status: 'Active',
        riskScore: 98 // Highly critical
    };

    // Broadcast emergency telemetry to the frontend via WebSockets
    // We force the risk score to 98 and increase active incidents.
    io.emit('telemetry_update', {
        riskScore: 98,
        activeIncidents: 15,
        xgbAccuracy: 99.2,
        rfAccuracy: 96.8
    });

    // We can also emit a specific event for the new incident feed
    io.emit('critical_incident', newIncident);

    res.json({ success: true, message: 'Demo attack triggered', incident: newIncident });
});

export default router;
