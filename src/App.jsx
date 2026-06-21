import { useEffect, useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function App() {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    async function modifyPdf() {
      try {
        // Fetch the original PDF
        const existingPdfBytes = await fetch('/weezmo.pdf').then((res) => res.arrayBuffer());

        // Load the PDF into pdf-lib
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the first page
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Format the current date as DD-MM-YYYY
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const currentDateStr = `${dd}-${mm}-${yyyy}`;

        // Get the font
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Define the exact location and dimensions of the old date "04-05-2026"
        const x = 83.08;
        const y = 814.32;
        const width = 82;
        const height = 16;

        // Draw a white rectangle over the old date to hide it
        firstPage.drawRectangle({
          x: x,
          y: y,
          width: width,
          height: height,
          color: rgb(1, 1, 1),
        });

        // Draw the new date over the white rectangle
        // The y-coordinate for drawText represents the baseline, so we adjust slightly
        // 16 is the font size. We will position it similarly to the original.
        // We'll put it at y + 3 so the baseline aligns correctly inside the rectangle.
        firstPage.drawText(currentDateStr, {
          x: x,
          y: y + 3,
          size: 16,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Create a blob URL to display it
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

      } catch (error) {
        console.error('Error modifying PDF:', error);
      }
    }

    modifyPdf();
  }, []);

  if (!pdfUrl) {
    return <div className="loading">Loading PDF...</div>;
  }

  return (
    <div className="pdf-container">
      <embed src={`${pdfUrl}#toolbar=0&view=FitH`} type="application/pdf" width="100%" height="100%" />
    </div>
  );
}

export default App;
