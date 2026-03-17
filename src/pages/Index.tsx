import { useMillControl } from "@/hooks/useMillControl";
import { ProductionPanel } from "@/components/ProductionPanel";
import { ProductionChart } from "@/components/ProductionChart";
import { FlowDiagram } from "@/components/FlowDiagram";
import { TransferControl } from "@/components/TransferControl";
import { ReportExport } from "@/components/ReportExport";
import { Factory } from "lucide-react";

const Index = () => {
  const mill = useMillControl();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Factory size={18} className="text-primary" />
          <h1 className="text-sm sm:text-base font-semibold tracking-wide uppercase text-foreground">
            MillControl <span className="text-primary">OS</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${mill.state.transfer.rotaAtiva ? "bg-success" : "bg-muted-foreground"}`} />
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
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Production Panel */}
        <div className="lg:w-[380px] xl:w-[420px] border-r border-border/50 overflow-y-auto p-4 space-y-4">
          <ProductionPanel
            state={mill.state}
            produzida={mill.produzida}
            restante={mill.restante}
            ritmoH={mill.ritmoH}
            tempoRestanteMin={mill.tempoRestanteMin}
            previsaoTermino={mill.previsaoTermino}
            consumoTotal={mill.consumoTotal}
            totalParadasMin={mill.totalParadasMin}
            setField={mill.setField}
            addParada={mill.addParada}
            removeParada={mill.removeParada}
          />
        </div>

        {/* Right: Flow Diagram + Transfer */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
};

export default Index;
