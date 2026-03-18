"use client";

import { useMillControl } from "@/hooks/use-mill-control";
import { ProductionPanel } from "@/components/production-panel";
import { FlowDiagram } from "@/components/flow-diagram";
import { TransferControl } from "@/components/transfer-control";
import { Menu, HelpCircle, LogOut } from "lucide-react";

export default function Home() {
  const mill = useMillControl();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-[#333]">
        <div className="flex items-center gap-3">
          <Menu size={20} className="text-gray-400 cursor-pointer hover:text-white" />
          <h1 className="text-sm font-semibold tracking-wide text-white">
            SISTEMA SUPERVISORIO - CONTROLE DE FARINHA
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <HelpCircle size={18} className="text-gray-400 cursor-pointer hover:text-white" />
          <LogOut size={18} className="text-gray-400 cursor-pointer hover:text-white" />
        </div>
      </header>

      {/* Main content - 3 columns */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Dashboard de Producao */}
        <div className="lg:w-[340px] border-r border-[#333] overflow-y-auto p-4">
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
        </div>

        {/* Center: Gerenciamento de Silos */}
        <div className="flex-1 overflow-y-auto p-4">
          <FlowDiagram
            state={mill.state}
            setSiloAtual={mill.setSiloAtual}
            setTransfer={mill.setTransfer}
          />
        </div>

        {/* Right: Controle de Transilagem */}
        <div className="lg:w-[280px] border-l border-[#333] overflow-y-auto p-4">
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
