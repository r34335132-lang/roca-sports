export async function captureCard(node: HTMLElement) {
  const html2canvas = (await import("html2canvas")).default;
  return html2canvas(node, {
    scale: 3,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadCardPng(node: HTMLElement, filename: string) {
  const canvas = await captureCard(node);
  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("No se pudo generar el PNG"));
        return;
      }
      downloadBlob(blob, filename);
      resolve();
    }, "image/png");
  });
}

export async function downloadCardPdf(node: HTMLElement, filename: string) {
  const canvas = await captureCard(node);
  const { jsPDF } = await import("jspdf");
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}

/** Pack PDF: 2 cédulas por hoja carta horizontal. */
export async function downloadPackPdf(
  nodes: HTMLElement[],
  filename: string,
  onProgress?: (done: number, total: number) => void,
) {
  if (nodes.length === 0) throw new Error("No hay cédulas para exportar");

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const marginX = 28;
  const marginY = 22;
  const gap = 14;
  const cardW = pageW - marginX * 2;
  const cardH = (pageH - marginY * 2 - gap) / 2;

  for (let i = 0; i < nodes.length; i++) {
    const canvas = await captureCard(nodes[i]!);
    const img = canvas.toDataURL("image/png");
    const slot = i % 2;
    if (i > 0 && slot === 0) pdf.addPage();
    const y = marginY + slot * (cardH + gap);
    pdf.addImage(img, "PNG", marginX, y, cardW, cardH, undefined, "FAST");
    onProgress?.(i + 1, nodes.length);
  }

  pdf.save(filename);
}
