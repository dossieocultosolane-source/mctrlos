"use client";

import { useMillControl } from "@/hooks/use-mill-control";
import { ProductionPanel } from "@/components/production-panel";
import { ProductionChart } from "@/components/production-chart";
import { FlowDiagram } from "@/components/flow-diagram";
import { TransferControl } from "@/components/transfer-control";
import { ReportExport } from "@/components/report-export";
import { Factory } from "lucide-react";

export default function Home() {
  const mill = useMillControl();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Factory size={16} className="text-primary" />
          <h1 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            MillControl <span className="text-primary">OS</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <div
              className={`w-1.5 h-1.5 rounded-full ${mill.state.transfer.rotaAtiva ? "bg-success" : "bg-muted-foreground"}`}
            />
            {mill.state.transfer.rotaAtiva ? "SISTEMA ATIVO" : "STANDBY"}
          </div>
          <ReportExport
            state={mill.state}
            produzida={mill.produzida}
            restante={mill.restante}
            ritmoH={mill.ritmoH}
            tempoRestanteMin={mill.tempoRestanteMin}
            previsaoTermino={mill.previsaoTermino}
            consumoTotal={mill.consumoTotal}
            totalParadasMin={mill.totalParadasMin}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">
        {/* Left: Production Panel + Chart */}
        <div className="lg:w-[400px] xl:w-[440px] border-r border-border/50 overflow-y-auto p-3 space-y-3">
          <ProductionPanel
            state={mill.state}
            produzida={mill.produzida}
            restante={mill.restante}
            ritmoH={mill.ritmoH}
            tempoRestanteMin={mill.tempoRestanteMin}
            previsaoTermino={mill.previsaoTermino}
            consumoTotal={mill.consumoTotal}
            totalParadasMin={mill.totalParadasMin}
            oee={mill.oee}
            setField={mill.setField}
            addParada={mill.addParada}
            removeParada={mill.removeParada}
          />
          <ProductionChart
            produzida={mill.produzida}
            restante={mill.restante}
            meta={mill.state.meta}
          />
        </div>

        {/* Right: Flow Diagram + Transfer */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <FlowDiagram
            state={mill.state}
            setSiloAtual={mill.setSiloAtual}
            setTransfer={mill.setTransfer}
          />
          <TransferControl
            transfer={mill.state.transfer}
            setTransfer={mill.setTransfer}
            toggleRota={mill.toggleRota}
            sensorPausado={mill.state.transfer.sensorPausado}
          />
        </div>
      </div>
    </div>
  );
}
