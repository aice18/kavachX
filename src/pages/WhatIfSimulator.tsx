import React, { useState } from 'react';
import { FlaskConical, Play, ShieldAlert, Activity, Server, Database, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function WhatIfSimulator() {
  const { t } = useTranslation();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [appliedActions, setAppliedActions] = useState<number[]>([]);
  const [analyzingAnomaly, setAnalyzingAnomaly] = useState(false);
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const [activeScenarioName, setActiveScenarioName] = useState<string>("ATM_143 Compromise");
  const [activeScenarioResults, setActiveScenarioResults] = useState<any>({
    loss: "₹5,25,02,126",
    blast: "12,500",
    branches: "14",
    time: "12 hrs",
    controls: [
      { action: 'Isolate VLAN 40', desc: 'Prevent lateral movement from ATM subnets to core banking.', type: 'network' },
      { action: 'Failover to DR-Site-B', desc: 'Maintain uptime for critical transaction processing.', type: 'infra' },
      { action: 'Suspend internal routing to asset', desc: 'Immediately drop all packets destined for ATM_143.', type: 'firewall' }
    ]
  });

  const runAnomalyAnalysis = async () => {
    setAnalyzingAnomaly(true);
    setAnomalyData(null);
    try {
      const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/ml/anomaly`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telemetryData: { loginAttempts: 500, timeWindow: "10mins", sourceRegion: "Unknown" } })
      });
      const data = await res.json();
      setAnomalyData(data);
    } catch(err) {
      console.error(err);
    }
    setAnalyzingAnomaly(false);
  };

  const runSimulation = (scenarioName = "Custom Scenario") => {
    setActiveScenarioName(typeof scenarioName === 'string' ? scenarioName : "ATM_143 Compromise");
    setActiveScenarioResults({
      loss: typeof scenarioName === 'string' ? "₹8,40,11,000" : "₹5,25,02,126",
      blast: typeof scenarioName === 'string' ? "45,000" : "12,500",
      branches: typeof scenarioName === 'string' ? "All" : "14",
      time: "24 hrs",
      controls: [
        { action: 'Execute Global Playbook X-1', desc: 'Lockdown all external APIs.' },
        { action: 'Isolate Core Segment', desc: 'Disconnect core DB from DMZ.' }
      ]
    });
    setIsSimulating(true);
    setSimulationComplete(false);
    setAppliedActions([]);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 2500);
  };

  const triggerStressTest = async () => {
    setActiveScenarioName("Kafka Stress Test (54 Concurrent Attacks)");
    setActiveScenarioResults({
      loss: "₹142,50,00,000",
      blast: "100,000+",
      branches: "API Gateway",
      time: "4 hrs",
      controls: [
        { action: 'Enable Flink Rate Limiting', desc: 'Throttle incoming transactions automatically.' },
        { action: 'Deploy WAF Ruleset Beta', desc: 'Block Tor exit nodes and anomalous IPs.' }
      ]
    });
    setIsSimulating(true);
    setSimulationComplete(false);
    try {
      await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/demo/stress-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 54 })
      });
      setTimeout(() => {
        setIsSimulating(false);
        setSimulationComplete(true);
      }, 3000);
    } catch(err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  const triggerMoneyMule = async () => {
    setActiveScenarioName("Multi-Hop Money Mule Ring");
    setActiveScenarioResults({
      loss: "₹1,20,00,000",
      blast: "4 Entities",
      branches: "0",
      time: "Immediate Freeze",
      controls: [
        { action: 'Freeze Associated Accounts', desc: 'Lock all 4 nodes in the graph.' },
        { action: 'Report to FIU-IND', desc: 'Auto-generate compliance report.' }
      ]
    });
    setIsSimulating(true);
    setSimulationComplete(false);
    try {
      await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/demo/money-mule`, { method: 'POST' });
      setTimeout(() => {
        setIsSimulating(false);
        setSimulationComplete(true);
      }, 2000);
    } catch(err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  const applyAction = (index: number) => {
    if (!appliedActions.includes(index)) {
      setAppliedActions(prev => [...prev, index]);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            {t('whatif.title', 'What-If Simulator')}
            <span className="px-2 py-0.5 text-xs font-bold tracking-wider text-indigo-600 bg-indigo-100 border border-indigo-200 rounded">
              EXP
            </span>
          </h1>
          <p className="text-slate-500 mt-1">{t('whatif.subtitle', 'Sandbox environment for threat modeling and containment planning.')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">{t('whatif.parameters', 'Scenario Parameters')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{t('whatif.target_asset', 'Target Asset / Node')}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>ATM_143 (Branch 7)</option>
                  <option>CORE_DB_PRIMARY</option>
                  <option>SWIFT_GATEWAY_NODE</option>
                  <option>VPN_CONCENTRATOR_02</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">{t('whatif.attack_vector', 'Attack Vector')}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>{t('whatif.ransomware', 'Ransomware (LockBit Variant)')}</option>
                  <option>{t('whatif.ddos', 'DDoS (Volumetric)')}</option>
                  <option>{t('whatif.insider', 'Insider Threat (Data Exfil)')}</option>
                  <option>{t('whatif.zeroday', 'Zero-Day Exploit (RCE)')}</option>
                </select>
              </div>

              <button 
                onClick={() => runSimulation()}
                disabled={isSimulating}
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('whatif.simulating', 'Simulating Impact...')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {t('whatif.run_scenario', 'Run Scenario')}
                  </>
                )}
              </button>

              <button 
                onClick={runAnomalyAnalysis}
                disabled={analyzingAnomaly}
                className="w-full bg-indigo-100 text-indigo-700 rounded-lg px-4 py-3 font-semibold text-sm hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {analyzingAnomaly ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin"></div>
                    {t('whatif.analyzing', 'Analyzing Telemetry...')}
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    {t('whatif.run_anomaly', 'Run Anomaly Detection')}
                  </>
                )}
              </button>

              {anomalyData && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-indigo-900">{t('whatif.anomaly_score', 'Anomaly Score')}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-xs ${anomalyData.isAnomalous ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {anomalyData.anomalyScore}
                    </span>
                  </div>
                  <ul className="text-xs text-indigo-700 space-y-1 list-disc pl-4">
                     {anomalyData.contributingFactors?.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('whatif.preset_scenarios', 'Preset Scenarios')}</h3>
            <div className="space-y-2">
              {[
                t('whatif.p1', 'Ransomware outbreak on ATM network'),
                t('whatif.p2', 'Database compromise via Phishing'),
                t('whatif.p3', 'Quantum decryption of TLS traffic')
              ].map((preset, i) => (
                <button onClick={() => runSimulation(preset)} key={i} className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-sm text-slate-200 font-medium">
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
              <Server className="w-24 h-24 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-4 relative z-10 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Extreme Scale Demos
            </h3>
            <div className="space-y-3 relative z-10">
              <button 
                onClick={triggerStressTest}
                disabled={isSimulating}
                className="w-full text-left p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 transition-colors text-sm text-red-100 font-medium disabled:opacity-50 flex items-center justify-between group"
              >
                <span>Kafka Stress Test (54 Attacks)</span>
                <Play className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={triggerMoneyMule}
                disabled={isSimulating}
                className="w-full text-left p-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 transition-colors text-sm text-indigo-100 font-medium disabled:opacity-50 flex items-center justify-between group"
              >
                <span>Multi-Hop Money Mule Ring</span>
                <Play className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('whatif.scenario_impact', 'Scenario Impact:')} <span className="text-red-600">{activeScenarioName}</span></h3>
              {simulationComplete && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded uppercase tracking-wider">{t('whatif.risk_critical', 'Risk: Critical')}</span>
              )}
            </div>
            
            <div className="flex-1 p-6 relative bg-slate-50/30">
              {!simulationComplete && !isSimulating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <FlaskConical className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium">{t('whatif.configure', 'Configure parameters and run a scenario to see projected impact.')}</p>
                </div>
              )}

              {isSimulating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 mb-4 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-slate-900 tracking-wider uppercase animate-pulse">{t('whatif.running_twin', 'Running Digital Twin Simulation')}</p>
                </div>
              )}

              <AnimatePresence>
                {simulationComplete && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                        <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">{t('whatif.projected_loss', 'Projected Loss Exposure')}</p>
                        <p className="text-2xl font-black text-slate-900">{activeScenarioResults.loss}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">{t('whatif.blast_radius', 'Customer Blast Radius')}</p>
                        <p className="text-2xl font-black text-slate-900">{activeScenarioResults.blast}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{t('whatif.branches', 'Branches Disrupted')}</p>
                        <p className="text-2xl font-black text-slate-900">{activeScenarioResults.branches}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t('whatif.recovery', 'Estimated Recovery Time')}</p>
                        <p className="text-2xl font-black text-slate-900">{activeScenarioResults.time}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t('whatif.recommended', 'Recommended Proactive Controls')}</h4>
                      <div className="space-y-3">
                        {activeScenarioResults.controls.map((rec: any, i: number) => (
                          <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-md text-slate-500">
                              <ShieldAlert className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{rec.action}</p>
                              <p className="text-xs text-slate-500">{rec.desc}</p>
                            </div>
                            <button 
                              onClick={() => applyAction(i)}
                              disabled={appliedActions.includes(i)}
                              className={`ml-auto text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors ${
                                appliedActions.includes(i) 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                              }`}
                            >
                              {appliedActions.includes(i) ? t('whatif.applied', 'Applied') : t('whatif.apply', 'Apply')}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
