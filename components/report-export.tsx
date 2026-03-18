"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { MillState } from "@/hooks/use-mill-control";
import { FileDown } from "lucide-react";

interface ReportExportProps {
  state: MillState;
  produzida: number;
  restante: number;
  ritmoH: number;
  tempoRestanteMin: number;
  previsaoTermino: Date;
  consumoTotal: number;
  totalParadasMin: number;
}

export function ReportExport({
  state,
  produzida,
  restante,
  ritmoH,
  tempoRestanteMin,
  previsaoTermino,
  consumoTotal,
  totalParadasMin,
}: ReportExportProps) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();

    // Header
    doc.setFontSize(16);
    doc.text("RELATORIO DE PRODUCAO - MILLCONTROL", 14, 20);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Gerado em: ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`,
      14,
      28
    );
    doc.setDrawColor(200);
    doc.line(14, 32, 196, 32);

    // Production data
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Dados de Producao", 14, 42);

    autoTable(doc, {
      startY: 46,
      head: [["Parametro", "Valor"]],
      body: [
        ["Meta de Producao", `${state.meta} unidades`],
        ["Producao Realizada", `${produzida} unidades`],
        ["Producao Restante", `${restante} unidades`],
        ["Ritmo de Producao", `${Math.round(ritmoH)} un/hora`],
        [
          "Previsao de Termino",
          ritmoH > 0
            ? previsaoTermino.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
        ],
        ["Tempo Restante", `${Math.round(tempoRestanteMin)} minutos`],
        ["Peso por Unidade", `${state.pesoUnidade} kg`],
        ["Consumo Total de Farinha", `${consumoTotal.toLocaleString("pt-BR")} kg`],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59] },
    });

    // Silos
    const siloY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Estado dos Silos", 14, siloY);

    autoTable(doc, {
      startY: siloY + 4,
      head: [["Silo", "Quantidade (kg)", "Capacidade (kg)", "Ocupacao (%)"]],
      body: Object.entries(state.silos).map(([nome, silo]) => [
        nome,
        Math.round(silo.atual).toLocaleString("pt-BR"),
        silo.max.toLocaleString("pt-BR"),
        ((silo.atual / silo.max) * 100).toFixed(1) + "%",
      ]),
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59] },
    });

    // Paradas
    if (state.paradas.length > 0) {
      const paradasY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text("Paradas Registradas", 14, paradasY);

      autoTable(doc, {
        startY: paradasY + 4,
        head: [["Motivo", "Tempo (min)"]],
        body: [
          ...state.paradas.map((p) => [p.motivo, `${p.tempo}`]),
          ["Almoco", `${state.almocoMinutos}`],
          ["TOTAL", `${totalParadasMin}`],
        ],
        theme: "grid",
        headStyles: { fillColor: [30, 41, 59] },
      });
    }

    doc.save(`relatorio-producao-${now.toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <button
      onClick={exportPDF}
      className="btn-secondary flex items-center gap-2 justify-center"
    >
      <FileDown size={14} />
      <span className="hidden sm:inline">Exportar Relatorio</span>
    </button>
  );
}
