function generateRecommendations() {
    // Get form data
    const age = parseInt(document.getElementById('age').value) || 0;
    const surgery = document.getElementById('surgeryType').value;
    const anesthesia = document.getElementById('anesthesiaType').value;
    
    // Get checked conditions
    const conditions = Array.from(document.querySelectorAll('input[name="conditions"]:checked'))
        .map(cb => cb.value);
    
    const recs = [];
    
    // Laboratory Studies
    const labTests = ['Complete Blood Count (CBC)'];
    labTests.push('Basic Metabolic Panel (BMP)');
    
    if (age >= 50 || conditions.includes('diabetes') || conditions.includes('kidney_disease')) {
        labTests.push('Comprehensive Metabolic Panel (CMP)');
    }
    
    if (conditions.includes('bleeding_disorder') || surgery === 'cardiac' || surgery === 'neurological') {
        labTests.push('PT/PTT/INR');
    }
    
    if (surgery === 'cardiac' || surgery === 'orthopedic' || surgery === 'abdominal') {
        labTests.push('Type and Screen');
    }
    
    if (conditions.includes('diabetes')) {
        labTests.push('HbA1c');
    }
    
    if (conditions.includes('liver_disease')) {
        labTests.push('Liver Function Tests');
    }
    
    recs.push({ title: 'Laboratory Studies', items: labTests });
    
    // Diagnostic Studies
    const diagnosticTests = [];
    
    if (age >= 40 || conditions.includes('heart_disease') || conditions.includes('hypertension')) {
        diagnosticTests.push('ECG (Electrocardiogram)');
    }
    
    if (conditions.includes('heart_disease') || surgery === 'cardiac') {
        diagnosticTests.push('Echocardiogram');
    }
    
    if (conditions.includes('copd')) {
        diagnosticTests.push('Pulmonary Function Tests');
    }
    
    if (diagnosticTests.length > 0) {
        recs.push({ title: 'Diagnostic Studies', items: diagnosticTests });
    }
    
    // Imaging Studies
    const imagingTests = [];
    
    if (age >= 60 || conditions.includes('copd') || surgery === 'thoracic' || surgery === 'cardiac') {
        imagingTests.push('Chest X-ray');
    }
    
    if (surgery === 'orthopedic') {
        imagingTests.push('X-rays of surgical site');
    }
    
    if (imagingTests.length > 0) {
        recs.push({ title: 'Imaging Studies', items: imagingTests });
    }
    
    // Consultations
    if (conditions.length > 0) {
        const consultations = [];
        
        if (conditions.includes('heart_disease')) {
            consultations.push('Cardiology Consultation');
        }
        
        if (conditions.includes('copd')) {
            consultations.push('Pulmonology Consultation');
        }
        
        if (conditions.includes('kidney_disease')) {
            consultations.push('Nephrology Consultation');
        }
        
        if (conditions.includes('diabetes') && age >= 65) {
            consultations.push('Endocrinology Consultation (if poorly controlled)');
        }
        
        if (consultations.length > 0) {
            recs.push({ title: 'Specialist Consultations', items: consultations });
        }
    }
    
    // Medications
    const medications = [
        'Review all current medications',
        'Consider holding anticoagulants per protocol',
        'Continue beta-blockers and statins if prescribed',
    ];
    
    if (conditions.includes('diabetes')) {
        medications.push('Adjust diabetes medications per anesthesia protocol');
    }
    
    recs.push({ title: 'Medication Management', items: medications });
    
    // Store recommendations globally for PDF/print use
    window.currentRecommendations = recs;
    
    // Generate HTML with new styling
    let html = '';
    recs.forEach((category) => {
        html += `
            <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                <div class="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h4 class="font-semibold text-[#0e2657]">${category.title}</h4>
                </div>
                <ul class="divide-y divide-slate-200">
        `;
        category.items.forEach((item) => {
            html += `
                    <li class="flex items-center gap-3 px-4 py-3 text-slate-700">
                        <svg class="w-4 h-4 text-[#6ba818] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm">${item}</span>
                    </li>
            `;
        });
        html += `
                </ul>
            </div>
        `;
    });
    
    // Set the content and show recommendations
    document.getElementById('recommendationsContent').innerHTML = html;
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.classList.remove('hidden');
    recommendationsDiv.classList.add('animate-in');
    recommendationsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Helper function to get patient information
function getPatientInfo() {
    const patientName = document.getElementById('patientName').value || 'N/A';
    const age = document.getElementById('age').value || 'N/A';
    const gender = document.getElementById('gender').value || 'N/A';
    const weight = document.getElementById('weight').value || 'N/A';
    const height = document.getElementById('height').value || 'N/A';
    const surgeryType = document.getElementById('surgeryType').value || 'N/A';
    const anesthesiaType = document.getElementById('anesthesiaType').value || 'N/A';
    const surgeryDate = document.getElementById('surgeryDate').value || 'N/A';
    
    // Format gender display
    const genderDisplay = gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : gender === 'other' ? 'Other' : 'N/A';
    
    // Format surgery type display
    const surgeryTypeDisplay = surgeryType !== 'N/A' ? 
        surgeryType.charAt(0).toUpperCase() + surgeryType.slice(1).replace('_', ' ') + ' Surgery' : 'N/A';
    
    // Format anesthesia type display
    const anesthesiaTypeDisplay = anesthesiaType !== 'N/A' ? 
        anesthesiaType.charAt(0).toUpperCase() + anesthesiaType.slice(1) + ' Anesthesia' : 'N/A';
    
    return {
        patientName,
        age,
        gender: genderDisplay,
        weight: weight !== 'N/A' ? weight + ' kg' : 'N/A',
        height: height !== 'N/A' ? height + ' cm' : 'N/A',
        surgeryType: surgeryTypeDisplay,
        anesthesiaType: anesthesiaTypeDisplay,
        surgeryDate: surgeryDate !== 'N/A' ? new Date(surgeryDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : 'N/A'
    };
}

// Helper function to create formatted content for PDF/Print
function createFormattedContent() {
    const patientInfo = getPatientInfo();
    const recs = window.currentRecommendations || [];
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Build recommendations HTML with larger sizing
    let recommendationsHTML = '';
    recs.forEach((category, index) => {
        const isLastCategory = index === recs.length - 1;
        recommendationsHTML += `
            <div style="margin-bottom: ${isLastCategory ? '10px' : '12px'}; page-break-inside: avoid; orphans: 3; widows: 3; width: 100%;" class="page-break-avoid">
                <h4 style="color: #0e2657; margin: 0 0 8px 0; font-size: 16px; font-weight: bold; background-color: #e2e8f0; padding: 10px 15px; border-left: 4px solid #008045; page-break-after: avoid;">${category.title}</h4>
                <ul style="margin: 0; padding: 0; list-style: none; width: 100%; page-break-inside: avoid;">
        `;
        category.items.forEach((item, itemIndex) => {
            const isLastItem = itemIndex === category.items.length - 1;
            recommendationsHTML += `
                    <li style="padding: 5px 15px 5px 35px; color: #1e293b; font-size: 13px; position: relative; width: 100%; box-sizing: border-box; line-height: 1.4; ${isLastItem ? 'margin-bottom: 0;' : ''}">
                        <span style="position: absolute; left: 12px; color: #6ba818; font-weight: bold; font-size: 14px;">✓</span>
                        ${item}
                    </li>
            `;
        });
        recommendationsHTML += `
                </ul>
            </div>
        `;
    });
    
    return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 25px; color: #1e293b; box-sizing: border-box; page-break-inside: avoid;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 18px; border-bottom: 3px solid #0e2657; padding-bottom: 12px; page-break-after: avoid;">
                <h1 style="color: #0e2657; margin: 0 0 8px 0; font-size: 32px; font-weight: bold;">NorthBay Health</h1>
                <h2 style="color: #008045; margin: 0; font-size: 24px; font-weight: 600;">Preoperative Orders</h2>
            </div>
            
            <!-- Patient Information - Larger and Centered -->
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 0 auto 12px auto; border-left: 4px solid #009ee0; font-size: 13px; max-width: 100%; page-break-inside: avoid;">
                <h3 style="color: #0e2657; margin: 0 0 12px 0; font-size: 18px; font-weight: bold; text-align: center;">Patient Information</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 0 auto;">
                    <tr>
                        <td style="padding: 6px 15px 6px 0; width: 38%; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Patient Name:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.patientName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Age:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.age}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Gender:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.gender}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Weight:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.weight}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Height:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.height}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Surgery Type:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.surgeryType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Anesthesia:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.anesthesiaType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Scheduled Date:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.surgeryDate}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Recommendations - Larger and Centered -->
            <div style="margin-bottom: 20px; width: 100%;">
                <h3 style="color: #0e2657; margin: 0 0 12px 0; font-size: 20px; font-weight: bold; border-bottom: 3px solid #008045; padding-bottom: 8px; text-align: center; page-break-after: avoid;">Recommended Preoperative Orders</h3>
                ${recommendationsHTML}
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 11px; page-break-inside: avoid;">
                <p style="margin: 5px 0;">Generated on ${currentDate}</p>
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} NorthBay Health. All rights reserved.</p>
            </div>
        </div>
    `;
}

// Download PDF function
function downloadPDF() {
    if (!window.currentRecommendations || window.currentRecommendations.length === 0) {
        alert('Please generate recommendations first.');
        return;
    }
    
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }
    
    const content = createFormattedContent();
    const patientInfo = getPatientInfo();
    
    // Use the printContent div that we know works for printing
    const printContent = document.getElementById('printContent');
    printContent.innerHTML = content;
    
    // Store original styles
    const originalStyles = {
        display: printContent.style.display,
        position: printContent.style.position,
        visibility: printContent.style.visibility,
        left: printContent.style.left,
        top: printContent.style.top,
        width: printContent.style.width,
        height: printContent.style.height,
        zIndex: printContent.style.zIndex,
        backgroundColor: printContent.style.backgroundColor
    };
    
    // Style exactly like print mode for consistent output
    printContent.style.display = 'block';
    printContent.style.position = 'static';
    printContent.style.visibility = 'visible';
    printContent.style.maxWidth = '100%';
    printContent.style.width = 'auto';
    printContent.style.margin = '0 auto';
    printContent.style.padding = '20px';
    printContent.style.backgroundColor = 'white';
    printContent.style.zIndex = '999999';
    printContent.style.opacity = '1';
    printContent.style.boxSizing = 'border-box';
    printContent.style.fontFamily = 'Arial, sans-serif';
    printContent.style.color = '#1e293b';
    
    // Force layout calculation
    const height = printContent.scrollHeight;
    const width = printContent.scrollWidth;
    
    // Verify content exists
    if (!printContent.innerHTML || printContent.innerHTML.trim().length === 0) {
        alert('Error: Content is empty. Please try again.');
        // Restore styles
        Object.keys(originalStyles).forEach(key => {
            printContent.style[key] = originalStyles[key] || '';
        });
        return;
    }
    
    // Wait for content to be fully rendered
    setTimeout(() => {
        try {
            const options = {
                margin: [8, 8, 8, 8],
                filename: `PreoperativeOrders_${patientInfo.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 1.5,
                    useCORS: true,
                    logging: false,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    width: width,
                    height: height + 50, // Add extra height to prevent cutoff
                    windowWidth: width,
                    windowHeight: height + 50,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: ['.page-break-avoid'] }
            };
            
            console.log('Generating PDF from element:', printContent);
            console.log('Element dimensions:', { width, height, scrollHeight: printContent.scrollHeight });
            console.log('Element innerHTML length:', printContent.innerHTML.length);
            
            // Generate PDF
            html2pdf().set(options).from(printContent).save().then(() => {
                console.log('PDF generated successfully');
                // Restore original styles
                Object.keys(originalStyles).forEach(key => {
                    printContent.style[key] = originalStyles[key] || '';
                });
            }).catch((error) => {
                console.error('PDF generation error:', error);
                console.error('Error stack:', error.stack);
                // Restore original styles
                Object.keys(originalStyles).forEach(key => {
                    printContent.style[key] = originalStyles[key] || '';
                });
                alert('Error generating PDF. Check console for details. Error: ' + (error.message || 'Unknown error'));
            });
        } catch (error) {
            console.error('Exception in PDF generation:', error);
            // Restore original styles
            Object.keys(originalStyles).forEach(key => {
                printContent.style[key] = originalStyles[key] || '';
            });
            alert('Error: ' + error.message);
        }
    }, 500); // Increased delay to ensure rendering
}

// Print function
function printOrders() {
    if (!window.currentRecommendations || window.currentRecommendations.length === 0) {
        alert('Please generate recommendations first.');
        return;
    }
    
    const content = createFormattedContent();
    const printContent = document.getElementById('printContent');
    
    // Set the print content
    printContent.innerHTML = content;
    printContent.style.display = 'block';
    
    // Trigger print dialog
    window.print();
    
    // Hide print content after printing (or if cancelled)
    setTimeout(() => {
        printContent.style.display = 'none';
    }, 100);
}
