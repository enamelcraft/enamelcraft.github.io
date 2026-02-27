// Header drawing function for prescription PDF
function drawPrescriptionHeader(doc) {
    const marginX = 15;
    const headerTopY = 10;
    const topSectionHeight = 25;
    const bottomSectionHeight = 20;
    const totalHeaderHeight = topSectionHeight + bottomSectionHeight;
    const pageWidth = 210; // A4 width in mm
    const themeColor = [0, 128, 128]; // #008080 in RGB
    
    // Top section - Dark background
    doc.setFillColor(30, 30, 30); // Dark gray/black
    doc.rect(marginX, headerTopY, pageWidth - 2 * marginX, topSectionHeight, 'F');
    
    // Tooth icon (simplified - a rectangle with rounded top)
    const iconX = marginX + 5;
    const iconY = headerTopY + 5;
    const iconSize = 8;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(iconX, iconY, iconSize, iconSize * 1.2, 1, 1, 'F');
    
    // "ENAMEL CRAFT" text in white
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ENAMEL CRAFT', iconX + iconSize + 3, iconY + 5);
    
    // "DENTAL STUDIO" text in light green
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('DENTAL STUDIO', iconX + iconSize + 3, iconY + 10);
    
    // Clinic address on the right (white text)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    const addressX = pageWidth - marginX - 50;
    doc.text('Shop No. 3, Shreeban building,', addressX, iconY + 3);
    doc.text('Sneh Park Society, Pancard Club Rd,', addressX, iconY + 7);
    doc.text('Baner Gaon, Baner, Pune, Maharashtra 411045', addressX, iconY + 11);
    
    // Bottom section - White background with green accent
    const bottomY = headerTopY + topSectionHeight;
    
    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(marginX, bottomY, pageWidth - 2 * marginX, bottomSectionHeight, 'F');
    
    // Light green trapezoid on the right
    doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
    const trapezoidX1 = pageWidth - marginX - 30;
    const trapezoidX2 = pageWidth - marginX;
    doc.triangle(
        trapezoidX1, bottomY,
        trapezoidX2, bottomY,
        trapezoidX2, bottomY + bottomSectionHeight,
        'F'
    );
    doc.triangle(
        trapezoidX1, bottomY,
        trapezoidX2, bottomY + bottomSectionHeight,
        trapezoidX1, bottomY + bottomSectionHeight,
        'F'
    );
    
    // Doctor's name and qualifications (left side)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Dr. Girija Nandanwar Dhakite', marginX + 5, bottomY + 5);
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('Dental Surgeon', marginX + 5, bottomY + 9);
    doc.text('Fellowship in Microdentistry', marginX + 5, bottomY + 12);
    doc.text('BDS, FMD', marginX + 5, bottomY + 15);
    doc.text('Reg. No. A38107', marginX + 5, bottomY + 18);
    
    // Draw a horizontal line below the header
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(marginX, headerTopY + totalHeaderHeight + 5, pageWidth - marginX, headerTopY + totalHeaderHeight + 5);
    
    return headerTopY + totalHeaderHeight + 15; // Return Y position for content
}

