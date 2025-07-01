import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportChartAsPNG = async (chartElement: any, title: string) => {
  if (!chartElement) {
    throw new Error('Chart element not found');
  }

  try {
    const canvas = await html2canvas(chartElement.canvas || chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });

    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_chart.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    throw new Error('Failed to export chart as PNG');
  }
};

export const exportChartAsPDF = async (chartElement: any, title: string) => {
  if (!chartElement) {
    throw new Error('Chart element not found');
  }

  try {
    const canvas = await html2canvas(chartElement.canvas || chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 280;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFontSize(16);
    pdf.text(title, 20, 20);
    pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
    
    pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}_chart.pdf`);
  } catch (error) {
    throw new Error('Failed to export chart as PDF');
  }
};