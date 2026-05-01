import React, { useState } from 'react';
import { 
  Calculator, 
  Zap, 
  ArrowDownCircle, 
  Lightbulb, 
  Plug, 
  Clock, 
  BarChart, 
  Settings,
  ChevronRight,
  Info,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

type CalculatorCategory = 'eletrotecnica' | 'eletronica' | 'eletromecanica';

const CalculatorsModule = ({ category = 'eletrotecnica' }: { category?: CalculatorCategory }) => {
  const [activeTab, setActiveTab] = useState<string>('basics');
  
  React.useEffect(() => {
    if (category === 'eletrotecnica') setActiveTab('basics');
    if (category === 'eletronica') setActiveTab('ohm_eletronica');
    if (category === 'eletromecanica') setActiveTab('power_convert');
  }, [category]);

  // Calculator States
  const [ohm, setOhm] = useState({ v: '', i: '', r: '', p: '' });
  const [consumption, setConsumption] = useState({ power: '', hours: '', days: '', rate: '', result: 0, cost: 0 });
  const [voltageDrop, setVoltageDrop] = useState({ length: '', current: '', section: '', phase: 'monofasico', resultV: 0, resultP: 0 });
  const [loadLighting, setLoadLighting] = useState({ area: '', result: 0 });
  const [loadTugs, setLoadTugs] = useState({ perimeter: '', type: 'outros', resultQty: 0, resultVa: 0 });
  const [motors, setMotors] = useState({ hp: '', voltage: '220', efficiency: '0.85', pf: '0.8', phase: 'trifasico', result: 0 });
  const [pfCorrection, setPfCorrection] = useState({ activePower: '', currentPf: '', targetPf: '0.95', result: 0 });
  // Eletronica
  const [voltDivider, setVoltDivider] = useState({ vin: '', r1: '', r2: '', result: 0 });
  const [frequency, setFrequency] = useState({ t: '', f: '' });
  
  // Eletromecanica
  const [powerConvert, setPowerConvert] = useState({ value: '', from: 'hp', to: 'w', result: 0 });
  const [mechTorque, setMechTorque] = useState({ powerKW: '', rpm: '', result: 0 });


  const handleOhmCalc = () => {
    const v = parseFloat(ohm.v);
    const i = parseFloat(ohm.i);
    const r = parseFloat(ohm.r);
    const p = parseFloat(ohm.p);
    let res = { ...ohm };
    if (v && i) {
      res.r = (v / i).toFixed(2);
      res.p = (v * i).toFixed(2);
    } else if (v && r) {
      res.i = (v / r).toFixed(2);
      res.p = (Math.pow(v, 2) / r).toFixed(2);
    } else if (i && r) {
      res.v = (i * r).toFixed(2);
      res.p = (Math.pow(i, 2) * r).toFixed(2);
    } else if (p && v) {
      res.i = (p / v).toFixed(2);
      res.r = (Math.pow(v, 2) / p).toFixed(2);
    }
    setOhm(res);
  };

  const handleConsumptionCalc = () => {
    const p = parseFloat(consumption.power) || 0;
    const h = parseFloat(consumption.hours) || 0;
    const d = parseFloat(consumption.days) || 0;
    const r = parseFloat(consumption.rate) || 0;
    const kwh = (p * h * d) / 1000;
    setConsumption({ ...consumption, result: kwh, cost: kwh * r });
  };

  const handleVoltageDropCalc = () => {
    const l = parseFloat(voltageDrop.length) || 0;
    const i = parseFloat(voltageDrop.current) || 0;
    const s = parseFloat(voltageDrop.section) || 1;
    const factor = voltageDrop.phase === 'trifasico' ? 1.732 : 2;
    const dropV = (factor * l * i) / (58 * s);
    const vNominal = voltageDrop.phase === 'trifasico' ? 380 : 220;
    setVoltageDrop({ ...voltageDrop, resultV: dropV, resultP: (dropV / vNominal) * 100 });
  };

  const handleLightingCalc = () => {
    const area = parseFloat(loadLighting.area) || 0;
    let va = area >= 6 ? 100 + Math.floor((area - 6) / 4) * 60 : (area > 0 ? 100 : 0);
    setLoadLighting({ ...loadLighting, result: va });
  };

  const handleTugsCalc = () => {
    const p = parseFloat(loadTugs.perimeter) || 0;
    let qty = loadTugs.type === 'cozinha' ? Math.ceil(p / 3.5) : Math.ceil(p / 5);
    let va = loadTugs.type === 'cozinha' ? (Math.min(qty, 3) * 600) + (Math.max(0, qty - 3) * 100) : qty * 100;
    setLoadTugs({ ...loadTugs, resultQty: qty, resultVa: va });
  };

  const handleMotorCalc = () => {
    const hp = parseFloat(motors.hp) || 0;
    const v = parseFloat(motors.voltage) || 1;
    const eff = parseFloat(motors.efficiency) || 1;
    const pf = parseFloat(motors.pf) || 1;
    const watts = hp * 735.5;
    let current = motors.phase === 'trifasico' ? watts / (v * 1.732 * eff * pf) : watts / (v * eff * pf);
    setMotors({ ...motors, result: current });
  };

  
  const handleVoltDivider = () => {
    const vin = parseFloat(voltDivider.vin) || 0;
    const r1 = parseFloat(voltDivider.r1) || 0;
    const r2 = parseFloat(voltDivider.r2) || 0;
    if (r1 + r2 > 0) {
      setVoltDivider({ ...voltDivider, result: (vin * r2) / (r1 + r2) });
    }
  };

  const handleFrequency = () => {
    const t = parseFloat(frequency.t);
    const f = parseFloat(frequency.f);
    if (t && !f) setFrequency({ ...frequency, f: (1 / t).toFixed(4) });
    else if (f && !t) setFrequency({ ...frequency, t: (1 / f).toFixed(4) });
  };

  const handlePowerConvert = () => {
    const val = parseFloat(powerConvert.value) || 0;
    let inWatts = 0;
    // convert to watts
    if (powerConvert.from === 'hp') inWatts = val * 745.7;
    else if (powerConvert.from === 'cv') inWatts = val * 735.5;
    else if (powerConvert.from === 'kw') inWatts = val * 1000;
    else inWatts = val;

    let res = 0;
    // convert to target
    if (powerConvert.to === 'hp') res = inWatts / 745.7;
    else if (powerConvert.to === 'cv') res = inWatts / 735.5;
    else if (powerConvert.to === 'kw') res = inWatts / 1000;
    else res = inWatts;

    setPowerConvert({ ...powerConvert, result: res });
  };

  const handleTorque = () => {
    const p = parseFloat(mechTorque.powerKW) || 0;
    const n = parseFloat(mechTorque.rpm) || 1;
    if (n > 0) {
      setMechTorque({ ...mechTorque, result: (p * 9550) / n });
    }
  };
  const handlePfCalc = () => {
    const p = parseFloat(pfCorrection.activePower) || 0;
    const pf1 = parseFloat(pfCorrection.currentPf) || 1;
    const pf2 = parseFloat(pfCorrection.targetPf) || 1;
    if (pf1 >= 1 || pf2 >= 1 || pf1 <= 0 || pf2 <= 0) return;
    const phi1 = Math.acos(pf1);
    const phi2 = Math.acos(pf2);
    const kVaR = p * (Math.tan(phi1) - Math.tan(phi2));
    setPfCorrection({ ...pfCorrection, result: kVaR });
  };

  let tabs: {id: string, label: string}[] = [];
  if (category === 'eletrotecnica') {
    tabs = [
      { id: 'basics', label: 'Básicos' },
      { id: 'sizing', label: 'Cabos & Queda' },
      { id: 'loading', label: 'Cargas NBR' },
      { id: 'consumption', label: 'Consumo' },
      { id: 'motors', label: 'Motores' },
      { id: 'powerfactor', label: 'Fator Pot.' },
    ];
  } else if (category === 'eletronica') {
    tabs = [
      { id: 'ohm_eletronica', label: 'Lei de Ohm' },
      { id: 'voltagedivider', label: 'Divisor Tensão' },
      { id: 'frequency', label: 'Freq / Período' },
    ];
  } else if (category === 'eletromecanica') {
    tabs = [
      { id: 'power_convert', label: 'Conv. Potência' },
      { id: 'torque', label: 'Torque Motor' },
      { id: 'motors', label: 'Corrente Motor' },
    ];
  }

  return (
    <div className="space-y-0 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="px-1">
          <h1 className="text-base font-bold text-slate-900 font-display">
            {category === 'eletrotecnica' ? 'Calculadoras Eletrotécnica' : category === 'eletronica' ? 'Calculadoras Eletrônica' : 'Calculadoras Eletromecânica'}
          </h1>
          <p className="text-slate-500 text-sm">Ferramentas e cálculos úteis baseados na área.</p>
        </div>
        
        <div className="flex items-end gap-0.5 overflow-x-auto px-1 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-bold transition-all relative whitespace-nowrap",
                "rounded-t-lg border-t border-x",
                activeTab === tab.id 
                  ? "bg-white border-slate-200 text-violet-800 z-10 translate-y-[1px]" 
                  : "bg-slate-50/80 border-transparent text-slate-400 hover:text-violet-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-3xl rounded-tr-3xl p-6 shadow-sm min-h-[400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            
            {(activeTab === 'basics' || activeTab === 'ohm_eletronica') && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Zap size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Lei de Ohm e Potência</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Tensão (V)', field: 'v', unit: 'V' },
                    { label: 'Corrente (A)', field: 'i', unit: 'A' },
                    { label: 'Resistência (Ω)', field: 'r', unit: 'Ω' },
                    { label: 'Potência (W)', field: 'p', unit: 'W' },
                  ].map(item => (
                    <div key={item.field} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">{item.label}</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" value={(ohm as any)[item.field]} onChange={e => setOhm({...ohm, [item.field]: e.target.value})} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                  <button onClick={() => setOhm({ v: '', i: '', r: '', p: '' })} className="px-4 py-2 text-sm font-bold text-slate-400 uppercase">Limpar</button>
                  <button onClick={handleOhmCalc} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular</button>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmulas Utilizadas
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>V = R × I</p>
                    <p>P = V × I</p>
                    <p>R = V / I</p>
                    <p>P = R × I²</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voltagedivider' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Activity size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Divisor de Tensão</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Vin (V)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltDivider.vin} onChange={e => setVoltDivider({...voltDivider, vin: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">R1 (Ω)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltDivider.r1} onChange={e => setVoltDivider({...voltDivider, r1: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">R2 (Ω)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltDivider.r2} onChange={e => setVoltDivider({...voltDivider, r2: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handleVoltDivider} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular Vout</button>
                  <div className="bg-slate-900 p-3 rounded-xl flex-1 flex justify-between items-center text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase">Vout (V)</p>
                    <p className="text-sm font-bold text-violet-500">{voltDivider.result.toFixed(2)} V</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmula Utilizada
                  </p>
                  <p className="text-xs text-slate-600">Vout = Vin × (R2 / (R1 + R2))</p>
                </div>
              </div>
            )}

            {activeTab === 'frequency' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Activity size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Frequência / Período</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Período T (s)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={frequency.t} onChange={e => setFrequency({...frequency, t: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Frequência f (Hz)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={frequency.f} onChange={e => setFrequency({...frequency, f: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center justify-end">
                  <button onClick={() => setFrequency({t: '', f: ''})} className="px-4 py-2 text-sm font-bold text-slate-400 uppercase">Limpar</button>
                  <button onClick={handleFrequency} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular Conversão</button>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmulas Utilizadas
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>f = 1 / T</p>
                    <p>T = 1 / f</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'power_convert' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Zap size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Conversão de Potência</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Valor</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={powerConvert.value} onChange={e => setPowerConvert({...powerConvert, value: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">De</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={powerConvert.from} onChange={e => setPowerConvert({...powerConvert, from: e.target.value})}>
                      <option value="hp">HP</option>
                      <option value="cv">CV</option>
                      <option value="kw">kW</option>
                      <option value="w">W</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Para</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={powerConvert.to} onChange={e => setPowerConvert({...powerConvert, to: e.target.value})}>
                      <option value="kw">kW</option>
                      <option value="w">W</option>
                      <option value="hp">HP</option>
                      <option value="cv">CV</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handlePowerConvert} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Converter</button>
                  <div className="bg-slate-900 p-3 rounded-xl flex-1 flex justify-between items-center text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase">Resultado ({powerConvert.to.toUpperCase()})</p>
                    <p className="text-sm font-bold text-violet-500">{powerConvert.result.toFixed(3)}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Referências de Conversão
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>1 HP ≈ 745.7 W</p>
                    <p>1 CV ≈ 735.5 W</p>
                    <p>1 kW = 1000 W</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'torque' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Settings size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Torque de Motor</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Potência (kW)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={mechTorque.powerKW} onChange={e => setMechTorque({...mechTorque, powerKW: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Rotação (RPM)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={mechTorque.rpm} onChange={e => setMechTorque({...mechTorque, rpm: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handleTorque} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular Torque</button>
                  <div className="bg-slate-900 p-3 rounded-xl flex-1 flex justify-between items-center text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase">Torque (N.m)</p>
                    <p className="text-sm font-bold text-violet-500">{mechTorque.result.toFixed(2)} N.m</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmula Utilizada
                  </p>
                  <p className="text-xs text-slate-600">T = (P_kW × 9550) / n_rpm</p>
                </div>
              </div>
            )}


            {activeTab === 'consumption' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Clock size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Consumo de Energia</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Potência (W)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={consumption.power} onChange={e => setConsumption({...consumption, power: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Horas / Dia</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={consumption.hours} onChange={e => setConsumption({...consumption, hours: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Dias / Mês</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={consumption.days} onChange={e => setConsumption({...consumption, days: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tarifa (R$/kWh)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={consumption.rate} onChange={e => setConsumption({...consumption, rate: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handleConsumptionCalc} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular</button>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase">Mensal (kWh)</p>
                      <p className="text-sm font-bold text-slate-900">{consumption.result.toFixed(2)}</p>
                    </div>
                    <div className="bg-violet-50 p-3 rounded-xl border border-violet-100">
                      <p className="text-xs font-bold text-violet-800 uppercase">Custo Estimado</p>
                      <p className="text-sm font-bold text-violet-900">R$ {consumption.cost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmulas Utilizadas
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>kWh = (Potência_W × Horas × Dias) / 1000</p>
                    <p>Custo = kWh × Tarifa_R$</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <ArrowDownCircle size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Queda de Tensão</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Comprimento (m)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltageDrop.length} onChange={e => setVoltageDrop({...voltageDrop, length: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Corrente (A)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltageDrop.current} onChange={e => setVoltageDrop({...voltageDrop, current: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Seção (mm²)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltageDrop.section} onChange={e => setVoltageDrop({...voltageDrop, section: e.target.value})}>
                      {[1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95].map(s => <option key={s} value={s}>{s} mm²</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Sistema</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={voltageDrop.phase} onChange={e => setVoltageDrop({...voltageDrop, phase: e.target.value})}>
                      <option value="monofasico">220V Mono/Bi</option>
                      <option value="trifasico">380V Trifásico</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handleVoltageDropCalc} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular</button>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase">Queda (V)</p>
                      <p className="text-sm font-bold text-slate-900">{voltageDrop.resultV.toFixed(2)}V</p>
                    </div>
                    <div className={cn("p-3 rounded-xl border", voltageDrop.resultP > 4 ? "bg-red-50 border-red-100" : "bg-violet-50 border-violet-100")}>
                      <p className={cn("text-xs font-bold uppercase", voltageDrop.resultP > 4 ? "text-red-600" : "text-violet-800")}>Queda (%)</p>
                      <p className={cn("text-sm font-bold", voltageDrop.resultP > 4 ? "text-red-700" : "text-violet-900")}>{voltageDrop.resultP.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmula Utilizada
                  </p>
                  <p className="text-xs text-slate-600">ΔV = (Fator × L × I) / (58 × S)</p>
                  <p className="text-[10px] text-slate-400 mt-1">* Fator: 2 (Mono) ou 1.732 (Trifásico). Condutividade do cobre: 58 m/(Ω.mm²)</p>
                </div>
              </div>
            )}

            {activeTab === 'loading' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2"><Lightbulb size={14}/> Iluminação</h2>
                    <input type="number" placeholder="Área m²" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs" value={loadLighting.area} onChange={e => setLoadLighting({...loadLighting, area: e.target.value})} />
                    <button onClick={handleLightingCalc} className="w-full bg-violet-800 text-white py-2 rounded-xl text-sm font-bold">Calcular VA</button>
                    <p className="text-center text-sm font-bold text-violet-900">{loadLighting.result} VA</p>
                  </div>
                  <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2"><Plug size={14}/> Tomadas TUGs</h2>
                    <input type="number" placeholder="Perímetro m" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs" value={loadTugs.perimeter} onChange={e => setLoadTugs({...loadTugs, perimeter: e.target.value})} />
                    <div className="flex gap-2">
                      <button onClick={() => setLoadTugs({...loadTugs, type: 'cozinha'})} className={cn("flex-1 py-1 text-xs font-bold rounded-lg border", loadTugs.type === 'cozinha' ? "bg-slate-900 text-white" : "bg-white text-slate-500")}>Cozinha</button>
                      <button onClick={() => setLoadTugs({...loadTugs, type: 'outros'})} className={cn("flex-1 py-1 text-xs font-bold rounded-lg border", loadTugs.type === 'outros' ? "bg-slate-900 text-white" : "bg-white text-slate-500")}>Outros</button>
                    </div>
                    <button onClick={handleTugsCalc} className="w-full bg-violet-800 text-white py-2 rounded-xl text-sm font-bold">Calcular</button>
                    <div className="flex justify-around text-sm font-bold text-violet-900"><span>{loadTugs.resultQty} un</span><span>{loadTugs.resultVa} VA</span></div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Critérios NBR 5410
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div>
                      <p className="font-bold mb-1">Iluminação:</p>
                      <p>Primeiros 6m² = 100 VA</p>
                      <p>Cada 4m² inteiros adicionais = +60 VA</p>
                    </div>
                    <div>
                      <p className="font-bold mb-1">TUGs:</p>
                      <p>Cozinhas/Serviço: 1 a cada 3,5m</p>
                      <p>Outros: 1 a cada 5m</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'motors' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Settings size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Motores (Corrente Nominal)</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">CV/HP</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={motors.hp} onChange={e => setMotors({...motors, hp: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tensão (V)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={motors.voltage} onChange={e => setMotors({...motors, voltage: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">η (Rend.)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={motors.efficiency} onChange={e => setMotors({...motors, efficiency: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">cos φ</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={motors.pf} onChange={e => setMotors({...motors, pf: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Rede</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={motors.phase} onChange={e => setMotors({...motors, phase: e.target.value})}>
                      <option value="trifasico">Trifásica</option>
                      <option value="monofasico">Monofásica</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handleMotorCalc} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular In</button>
                  <div className="bg-slate-900 p-3 rounded-xl flex-1 flex justify-between items-center text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase">In (A)</p>
                    <p className="text-sm font-bold text-violet-500">{motors.result.toFixed(2)} A</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmula Utilizada
                  </p>
                  <p className="text-xs text-slate-600">
                    {motors.phase === 'trifasico' 
                      ? 'In = (Pot_W) / (V × √3 × η × cos φ)' 
                      : 'In = (Pot_W) / (V × η × cos φ)'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">* Pot_W = CV/HP × 735.5 (aproximado)</p>
                </div>
              </div>
            )}

            {activeTab === 'powerfactor' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-xl">
                    <Activity size={18} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Correção de Fator de Potência</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">P Ativa (kW)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={pfCorrection.activePower} onChange={e => setPfCorrection({...pfCorrection, activePower: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">FP Atual</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={pfCorrection.currentPf} onChange={e => setPfCorrection({...pfCorrection, currentPf: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">FP Desejado</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" value={pfCorrection.targetPf} onChange={e => setPfCorrection({...pfCorrection, targetPf: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-50 items-center">
                  <button onClick={handlePfCalc} className="bg-violet-800 text-white px-6 py-2 rounded-xl text-sm font-bold">Calcular</button>
                  <div className="bg-brand-dark p-3 rounded-xl flex-1 flex justify-between items-center text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase">kVAr Requerido</p>
                    <p className="text-sm font-bold text-violet-500">{pfCorrection.result.toFixed(2)} kVAr</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <Info size={12} /> Fórmula Utilizada
                  </p>
                  <p className="text-xs text-slate-600">QC = P × (tan(φ1) - tan(φ2))</p>
                  <p className="text-[10px] text-slate-400 mt-1">* φ = acos(FP)</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-brand-dark p-6 rounded-xl text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-700/10 blur-3xl -mr-10 -mt-10" />
              <h3 className="text-xs font-bold mb-4 flex items-center gap-2"><Calculator size={14} className="text-violet-500" /> Dica Técnica</h3>
              <p className="text-sm text-slate-300 leading-relaxed p-3 bg-white/5 rounded-xl border border-white/5">
                Consulte sempre a NBR 5410 para fatores de agrupamento e temperatura que podem alterar esses cálculos básicos.
              </p>
              <button onClick={() => window.open('https://eletromguide.wordpress.com', '_blank')} className="w-full mt-4 py-2 bg-violet-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                Ver Blog Técnico <ChevronRight size={12} />
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2"><Info size={12} className="text-slate-400" /> Guia Rápido</h4>
              <div className="space-y-1.5">
                {[
                  { s: '1.5', i: '15.5' }, { s: '2.5', i: '21.0' }, { s: '4.0', i: '28.0' }, { s: '6.0', i: '36.0' }
                ].map(row => (
                  <div key={row.s} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-xs font-bold text-slate-700">{row.s} mm²</span>
                    <span className="text-xs font-bold text-violet-800">{row.i} A</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsModule;
