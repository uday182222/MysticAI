import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFGenerationOptions {
  filename: string;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export async function generatePDF(
  elementId: string, 
  options: PDFGenerationOptions
): Promise<void> {
  const {
    filename,
    quality = 0.95,
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    // Get the element to convert
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight
    });

    const imgData = canvas.toDataURL('image/png', quality);
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
      compress: true
    });

    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scaling to fit the page
    const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
    const scaledWidth = imgWidth * 0.264583 * ratio;
    const scaledHeight = imgHeight * 0.264583 * ratio;
    
    // Center the content
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight, '', 'FAST');
    
    // If content is too long, split into multiple pages
    if (scaledHeight > pdfHeight) {
      const pageCount = Math.ceil(scaledHeight / pdfHeight);
      
      for (let i = 1; i < pageCount; i++) {
        pdf.addPage();
        const pageY = y - (i * pdfHeight);
        pdf.addImage(imgData, 'PNG', x, pageY, scaledWidth, scaledHeight, '', 'FAST');
      }
    }
    
    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateReportFilename(
  reportType: 'ai-chat' | 'post-analysis',
  analysisType?: string
): string {
  const date = new Date().toISOString().split('T')[0];
  const timestamp = Date.now();
  
  if (reportType === 'ai-chat') {
    return `MysticRead_AI_Chat_${date}_${timestamp}.pdf`;
  } else {
    const type = analysisType ? (analysisType.charAt(0).toUpperCase() + analysisType.slice(1)) : 'Analysis';
    return `MysticRead_${type}_Chat_${date}_${timestamp}.pdf`;
  }
}