import { useState, useCallback, useEffect, useRef, useMemo } from "react";

export interface Parada {
  id: string;
  motivo: string;
  tempo: number;
}

export interface SiloState {
  atual: number;
  max: number;
  sensorAtivo: boolean;
}

export interface TransferConfig {
  rotaAtiva: boolean;
  origens: string[];
  destinos: string[];
  fluxoKgMin: number;
  sensorPausado: Record<string, boolean>;
  origemPct: Record<string, number>;
  destinoPct: Record<string, number>;
}

export interface MillState {
  meta: number;
  contagemInicial: number;
  contagemAtual: number;
  horaInicio: string;
  almocoMinutos: number;
  pesoUnidade: number;
  ritmoMaximo: number;
  paradas: Parada[];
  silos: Record<string, SiloState>;
  transfer: TransferConfig;
  startTime: number | null;
  lastCalcTime: number | null;
}

const SENSOR_MAX = 8000;
const SENSOR_RESUME_THRESHOLD = 1000;

const initialState: MillState = {
  meta: 1000,
  contagemInicial: 0,
  contagemAtual: 0,
  horaInicio: "08:00",
  almocoMinutos: 60,
  pesoUnidade: 25,
  ritmoMaximo: 500,
  paradas: [],
  silos: {
    FA01: { atual: 35000, max: 35000, sensorAtivo: false },
    FA02: { atual: 35000, max: 35000, sensorAtivo: false },
    FA03: { atual: 35000, max: 35000, sensorAtivo: false },
    FA04: { atual: 35000, max: 35000, sensorAtivo: false },
    PM01: { atual: 4000, max: 8000, sensorAtivo: false },
    PM02: { atual: 4000, max: 8000, sensorAtivo: false },
  },
  transfer: {
    rotaAtiva: false,
    origens: ["FA01"],
    destinos: ["PM01"],
    fluxoKgMin: 50,
    sensorPausado: {},
    origemPct: { FA01: 100 },
    destinoPct: { PM01: 100 },
  },
  startTime: null,
  lastCalcTime: null,
};

export function useMillControl() {
  const [state, setState] = useState<MillState>(initialState);
  const prevContagemRef = useRef(state.contagemAtual);

  // Production calculations — only recalculate when production-related fields change
  const produzida = Math.max(0, state.contagemAtual - state.contagemInicial);
  const restante = Math.max(0, state.meta - produzida);

  const totalParadasMin =
    state.paradas.reduce((a, b) => a + b.tempo, 0) + state.almocoMinutos;

  const consumoTotal = produzida * state.pesoUnidade;

  // Snapshot calc time when production inputs change
  const calcDeps = useMemo(() => ({
    contagemAtual: state.contagemAtual,
    contagemInicial: state.contagemInicial,
    meta: state.meta,
    pesoUnidade: state.pesoUnidade,
    paradasCount: state.paradas.length,
    totalParadasMin,
  }), [state.contagemAtual, state.contagemInicial, state.meta, state.pesoUnidade, state.paradas.length, totalParadasMin]);

  // Update lastCalcTime whenever production inputs change
  useEffect(() => {
    setState((s) => ({ ...s, lastCalcTime: Date.now() }));
  }, [calcDeps]);

  const { ritmoH, tempoRestanteMin, previsaoTermino } = useMemo(() => {
    const calcTime = state.lastCalcTime || Date.now();
    const startT = state.startTime || calcTime;
    const elapsedMin = (calcTime - startT) / 60000;
    const effectiveMin = Math.max(0.1, elapsedMin - totalParadasMin);
    const ritmo = effectiveMin > 0 ? (produzida / effectiveMin) * 60 : 0;
    const tempoRest = ritmo > 0 ? (restante / ritmo) * 60 : 0;
    const previsao = new Date(calcTime + tempoRest * 60000);
    return { ritmoH: ritmo, tempoRestanteMin: tempoRest, previsaoTermino: previsao };
  }, [state.lastCalcTime, state.startTime, totalParadasMin, produzida, restante]);

  // Setters
  const setField = useCallback(
    <K extends keyof MillState>(key: K, value: MillState[K]) => {
      setState((s) => {
        const next = { ...s, [key]: value };
        if (key === "horaInicio" && typeof value === "string") {
          const [h, m] = value.split(":").map(Number);
          const now = new Date();
          now.setHours(h, m, 0, 0);
          next.startTime = now.getTime();
        }
        return next;
      });
    },
    []
  );

  const setSiloAtual = useCallback((nome: string, valor: number) => {
    setState((s) => ({
      ...s,
      silos: {
        ...s.silos,
        [nome]: { ...s.silos[nome], atual: Math.max(0, Math.min(valor, s.silos[nome].max)) },
      },
    }));
  }, []);

  const addParada = useCallback((motivo: string, tempo: number) => {
    setState((s) => ({
      ...s,
      paradas: [
        ...s.paradas,
        { id: crypto.randomUUID(), motivo, tempo },
      ],
    }));
  }, []);

  const removeParada = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      paradas: s.paradas.filter((p) => p.id !== id),
    }));
  }, []);

  const setTransfer = useCallback(
    (updates: Partial<TransferConfig>) => {
      setState((s) => ({
        ...s,
        transfer: { ...s.transfer, ...updates },
      }));
    },
    []
  );

  const toggleRota = useCallback(() => {
    setState((s) => ({
      ...s,
      transfer: { ...s.transfer, rotaAtiva: !s.transfer.rotaAtiva },
    }));
  }, []);

  // Real-time tick: transfer + consumption
  useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => {
        const newSilos = { ...s.silos };

        // Deep copy silo states
        Object.keys(newSilos).forEach((k) => {
          newSilos[k] = { ...newSilos[k] };
        });

        const newTransfer = { ...s.transfer, sensorPausado: { ...s.transfer.sensorPausado } };

        // 1. Transfer FA → PM
        if (s.transfer.rotaAtiva && s.transfer.origens.length > 0 && s.transfer.destinos.length > 0) {
          const fluxoPerSecond = s.transfer.fluxoKgMin / 60;
          const fluxoPerOrigem = fluxoPerSecond / s.transfer.origens.length;

          s.transfer.destinos.forEach((dest) => {
            const pm = newSilos[dest];

            // Sensor logic
            if (pm.atual >= SENSOR_MAX) {
              newTransfer.sensorPausado[dest] = true;
              pm.sensorAtivo = true;
              return;
            }

            if (newTransfer.sensorPausado[dest] && pm.atual > SENSOR_MAX - SENSOR_RESUME_THRESHOLD) {
              pm.sensorAtivo = true;
              return;
            }

            // Resume
            if (newTransfer.sensorPausado[dest] && pm.atual <= SENSOR_MAX - SENSOR_RESUME_THRESHOLD) {
              newTransfer.sensorPausado[dest] = false;
              pm.sensorAtivo = false;
            }

            // Use percentage-based distribution
            const totalDestPct = s.transfer.destinos.reduce((sum, d) => sum + (s.transfer.destinoPct[d] || 100 / s.transfer.destinos.length), 0);
            const destPct = (s.transfer.destinoPct[dest] || 100 / s.transfer.destinos.length) / totalDestPct;
            const fluxoPerDest = fluxoPerSecond * destPct;

            const totalOrigPct = s.transfer.origens.reduce((sum, o) => sum + (s.transfer.origemPct[o] || 100 / s.transfer.origens.length), 0);

            s.transfer.origens.forEach((orig) => {
              const fa = newSilos[orig];
              const origPct = (s.transfer.origemPct[orig] || 100 / s.transfer.origens.length) / totalOrigPct;
              const fluxoPerOrigemDest = fluxoPerDest * origPct;
              const transfer = Math.min(fluxoPerOrigemDest, fa.atual, pm.max - pm.atual);
              fa.atual = Math.max(0, fa.atual - transfer);
              pm.atual = Math.min(pm.max, pm.atual + transfer);
            });
          });
        }

        // 2. Consumption from PM by production
        const deltaContagem = s.contagemAtual - prevContagemRef.current;
        if (deltaContagem > 0) {
          const consumo = deltaContagem * s.pesoUnidade;
          const activePMs = s.transfer.destinos.filter((d) => d.startsWith("PM"));
          if (activePMs.length > 0) {
            const consumoPorPM = consumo / activePMs.length;
            activePMs.forEach((pm) => {
              newSilos[pm].atual = Math.max(0, newSilos[pm].atual - consumoPorPM);
            });
          }
          prevContagemRef.current = s.contagemAtual;
        }

        // Update sensor states for display
        Object.keys(newSilos).forEach((k) => {
          if (k.startsWith("PM")) {
            if (newSilos[k].atual >= SENSOR_MAX) {
              newSilos[k].sensorAtivo = true;
            } else if (newSilos[k].atual <= SENSOR_MAX - SENSOR_RESUME_THRESHOLD) {
              newSilos[k].sensorAtivo = false;
            }
          }
        });

        return { ...s, silos: newSilos, transfer: newTransfer };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize startTime from horaInicio
  useEffect(() => {
    if (!state.startTime && state.horaInicio) {
      const [h, m] = state.horaInicio.split(":").map(Number);
      const now = new Date();
      now.setHours(h, m, 0, 0);
      setState((s) => ({ ...s, startTime: now.getTime() }));
    }
  }, []);

  return {
    state,
    produzida,
    restante,
    ritmoH,
    tempoRestanteMin,
    previsaoTermino,
    consumoTotal,
    totalParadasMin,
    setField,
    setSiloAtual,
    addParada,
    removeParada,
    setTransfer,
    toggleRota,
  };
}
