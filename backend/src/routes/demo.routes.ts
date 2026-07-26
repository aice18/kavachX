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

router.post('/stress-test', async (req, res) => {
    try {
        const { count = 54 } = req.body;
        const { simulateEvent } = await import('../services/simulator.js');
        
        // Broadcast that a Kafka stress test is starting
        io.emit('telemetry_update', {
            riskScore: 99,
            activeIncidents: count,
            xgbAccuracy: 99.9,
            rfAccuracy: 98.5
        });

        const promises = [];
        for (let i = 0; i < count; i++) {
            // Push exactly 54 concurrent promises (force fraud = true)
            promises.push(simulateEvent(true));
        }
        
        await Promise.all(promises);
        
        // Emit 54 rapid incidents to the UI
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                io.emit('critical_incident', {
                    id: `INC-KAFKA-${Math.floor(Math.random() * 10000)}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    type: 'Kafka Burst Anomaly',
                    user: 'USR_' + Math.floor(Math.random() * 9999),
                    status: 'Active',
                    riskScore: 99
                });
            }, i * 50); // Stagger by 50ms for visual effect
        }

        res.json({ success: true, message: `Successfully injected ${count} concurrent attacks via mock Kafka stream.` });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/money-mule', async (req, res) => {
    try {
        // Generate a multi-hop money mule transaction
        const incidentId = `INC-MULE-${Math.floor(Math.random() * 10000)}`;
        
        io.emit('telemetry_update', { riskScore: 95, activeIncidents: 1, xgbAccuracy: 98, rfAccuracy: 97 });
        
        io.emit('critical_incident', {
            id: incidentId,
            time: new Date().toLocaleTimeString(),
            type: 'Multi-Hop Money Mule Ring',
            user: 'COMPROMISED_CORP',
            status: 'Active',
            riskScore: 95
        });

        res.json({ 
            success: true, 
            message: 'Money Mule Ring detected. Topology: Corp Account -> Mule A (50%) -> Mule B (25%) / Mule C (25%) -> Offshore Account.' 
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
