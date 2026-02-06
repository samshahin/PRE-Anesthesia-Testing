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

    // Required Actions / Warnings for Cardiac Devices
    const requiredActions = [];
    
    // Check for weight loss medications
    const weightLossMeds = Array.from(document.querySelectorAll('input[name="weightLossMed"]:checked'))
        .map(cb => cb.value);
    
    if (weightLossMeds.includes('glp1')) {
        requiredActions.push('Stop GLP-1 medication 7 days before surgery.');
    }
    
    if (weightLossMeds.includes('sglt2')) {
        requiredActions.push('Stop SGLT2 medication 3 days before surgery.');
    }
    
    // Check for substance abuse
    const substanceAbuse = document.querySelector('input[name="substanceAbuse"]:checked');
    if (substanceAbuse && substanceAbuse.value === 'yes') {
        const lastSubstanceUse = document.getElementById('lastSubstanceUse');
        const lastSubstanceUseValue = lastSubstanceUse ? lastSubstanceUse.value : '';
        
        // Add action if within last 5 days or not sure
        if (lastSubstanceUseValue === 'within_5_days' || lastSubstanceUseValue === 'not_sure') {
            requiredActions.push('Must abstain from stimulant substance use for at least 5 days prior to surgery.');
        }
        // If "More than 5 days ago" or no selection, no action is added
    }
    
    // Check for implantable cardiac device
    const cardiacDevice = document.querySelector('input[name="cardiacDevice"]:checked');
    if (cardiacDevice && cardiacDevice.value === 'yes') {
        const lastInterrogation = document.getElementById('lastInterrogation');
        const lastInterrogationValue = lastInterrogation ? lastInterrogation.value : '';
        
        // Flag if interrogation is over 6 months ago, unknown, or not selected
        if (lastInterrogationValue === 'over_6_months' || 
            lastInterrogationValue === 'not_sure' || 
            lastInterrogationValue === '') {
            requiredActions.push('Device interrogation must be scheduled');
        }
        
        // Check cardiologist visit
        const cardiologistVisit = document.querySelector('input[name="cardiologistVisit"]:checked');
        if (cardiologistVisit && cardiologistVisit.value === 'no') {
            requiredActions.push('Cardiology consult required');
        }
    }
    
    // Only add Required Actions category if there are actions to display
    if (requiredActions.length > 0) {
        recs.push({ title: 'Required Actions', items: requiredActions });
    }
    
    // Store recommendations globally for PDF/print use
    window.currentRecommendations = recs;
    
    // Generate HTML with new styling
    let html = '';
    recs.forEach((category) => {
        const isRequiredActions = category.title === 'Required Actions';
        html += `
            <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden ${isRequiredActions ? 'border-orange-300' : ''}">
                <div class="bg-slate-100 px-4 py-3 border-b border-slate-200 ${isRequiredActions ? 'bg-orange-50 border-orange-200' : ''}">
                    <h4 class="font-semibold ${isRequiredActions ? 'text-orange-700' : 'text-[#0e2657]'}">${category.title}</h4>
                </div>
                <ul class="divide-y divide-slate-200">
        `;
        category.items.forEach((item) => {
            if (isRequiredActions) {
                html += `
                    <li class="flex items-center gap-3 px-4 py-3 text-slate-700">
                        <svg class="w-4 h-4 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <span class="text-sm font-medium text-orange-800">${item}</span>
                    </li>
                `;
            } else {
                html += `
                    <li class="flex items-center gap-3 px-4 py-3 text-slate-700">
                        <svg class="w-4 h-4 text-[#6ba818] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm">${item}</span>
                    </li>
                `;
            }
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

// Calculate METs functional capacity based on selected checkboxes
function calculateMETs() {
    // Get all checked checkboxes with name="functionalCapacity"
    const selectedOptions = Array.from(document.querySelectorAll('input[name="functionalCapacity"]:checked'))
        .map(cb => cb.value);
    
    // METs value mapping for activity options
    const metsMapping = {
        'stairs_4': 4,
        'walk_4': 4,
        'housework_8': 8,
        'vigorous_10': 10
    };
    
    // Check for "shortness at rest" - this overrides everything
    if (selectedOptions.includes('shortness_rest')) {
        return {
            category: 'poor',
            mets: 0,
            display: 'Poor (<4 METs)'
        };
    }
    
    // Check for "not sure" OR no selections - treat as unknown/poor
    if (selectedOptions.includes('not_sure') || selectedOptions.length === 0) {
        return {
            category: 'poor',
            mets: null,
            display: 'Unknown (treat as Poor)'
        };
    }
    
    // Filter out non-activity options and get METs values
    const activityOptions = selectedOptions.filter(opt => 
        opt !== 'shortness_rest' && opt !== 'not_sure'
    );
    
    // If no activity options selected (shouldn't happen after above check, but safety)
    if (activityOptions.length === 0) {
        return {
            category: 'poor',
            mets: null,
            display: 'Unknown (treat as Poor)'
        };
    }
    
    // Find highest METs value from selected activities
    const metsValues = activityOptions
        .map(opt => metsMapping[opt])
        .filter(mets => mets !== undefined);
    
    if (metsValues.length === 0) {
        return {
            category: 'poor',
            mets: null,
            display: 'Unknown (treat as Poor)'
        };
    }
    
    const highestMETs = Math.max(...metsValues);
    
    // Categorize based on highest METs
    let category, display;
    if (highestMETs < 4) {
        category = 'poor';
        display = 'Poor (<4 METs)';
    } else if (highestMETs >= 4 && highestMETs <= 10) {
        category = 'moderate';
        display = 'Moderate (4-10 METs)';
    } else {
        category = 'excellent';
        display = 'Excellent (>10 METs)';
    }
    
    return {
        category: category,
        mets: highestMETs,
        display: display
    };
}

// Test function for calculateMETs() - tests all checkbox combinations and edge cases
// Call this function from browser console: testMETsCalculations()
function testMETsCalculations() {
    console.log('=== Testing calculateMETs() Function ===\n');
    
    const testCases = [
        {
            name: 'Test 1: Shortness at rest (should override everything)',
            setup: () => {
                // Uncheck all first
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                // Check shortness_rest and other options
                document.querySelector('input[value="shortness_rest"]').checked = true;
                document.querySelector('input[value="vigorous_10"]').checked = true;
            },
            expected: { category: 'poor', mets: 0, display: 'Poor (<4 METs)' }
        },
        {
            name: 'Test 2: Not sure selected',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="not_sure"]').checked = true;
            },
            expected: { category: 'poor', mets: null, display: 'Unknown (treat as Poor)' }
        },
        {
            name: 'Test 3: No selections (empty)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
            },
            expected: { category: 'poor', mets: null, display: 'Unknown (treat as Poor)' }
        },
        {
            name: 'Test 4: Only stairs_4 (4 METs - MODERATE)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="stairs_4"]').checked = true;
            },
            expected: { category: 'moderate', mets: 4, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 5: Only walk_4 (4 METs - MODERATE)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="walk_4"]').checked = true;
            },
            expected: { category: 'moderate', mets: 4, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 6: Only housework_8 (8 METs - MODERATE)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="housework_8"]').checked = true;
            },
            expected: { category: 'moderate', mets: 8, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 7: Only vigorous_10 (10 METs - MODERATE, boundary case)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="vigorous_10"]').checked = true;
            },
            expected: { category: 'moderate', mets: 10, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 8: Multiple activities - stairs + walk (4 METs - MODERATE)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="stairs_4"]').checked = true;
                document.querySelector('input[value="walk_4"]').checked = true;
            },
            expected: { category: 'moderate', mets: 4, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 9: Multiple activities - stairs + housework (8 METs - MODERATE, highest)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="stairs_4"]').checked = true;
                document.querySelector('input[value="housework_8"]').checked = true;
            },
            expected: { category: 'moderate', mets: 8, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 10: All activities selected (10 METs - MODERATE, highest)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="stairs_4"]').checked = true;
                document.querySelector('input[value="walk_4"]').checked = true;
                document.querySelector('input[value="housework_8"]').checked = true;
                document.querySelector('input[value="vigorous_10"]').checked = true;
            },
            expected: { category: 'moderate', mets: 10, display: 'Moderate (4-10 METs)' }
        },
        {
            name: 'Test 11: Not sure with activities (should treat as not sure)',
            setup: () => {
                document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
                document.querySelector('input[value="not_sure"]').checked = true;
                document.querySelector('input[value="stairs_4"]').checked = true;
            },
            expected: { category: 'poor', mets: null, display: 'Unknown (treat as Poor)' }
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach((testCase, index) => {
        try {
            // Setup the test
            testCase.setup();
            
            // Run the function
            const result = calculateMETs();
            
            // Compare results
            const categoryMatch = result.category === testCase.expected.category;
            const metsMatch = result.mets === testCase.expected.mets;
            const displayMatch = result.display === testCase.expected.display;
            
            if (categoryMatch && metsMatch && displayMatch) {
                console.log(`✓ ${testCase.name}`);
                console.log(`  Result: ${JSON.stringify(result)}`);
                passed++;
            } else {
                console.error(`✗ ${testCase.name}`);
                console.error(`  Expected: ${JSON.stringify(testCase.expected)}`);
                console.error(`  Got:      ${JSON.stringify(result)}`);
                failed++;
            }
        } catch (error) {
            console.error(`✗ ${testCase.name}`);
            console.error(`  Error: ${error.message}`);
            failed++;
        }
        console.log('');
    });
    
    console.log(`=== Test Results: ${passed} passed, ${failed} failed ===`);
    
    // Clean up - uncheck all
    document.querySelectorAll('input[name="functionalCapacity"]').forEach(cb => cb.checked = false);
    
    return { passed, failed, total: testCases.length };
}

// Helper function to validate height input format
function validateHeightInput(heightInput) {
    if (!heightInput || heightInput.trim() === '') {
        return { valid: true, error: '' }; // Empty is valid (optional field)
    }
    
    const input = heightInput.trim();
    
    // Check if input contains an apostrophe (feet'inches format)
    if (input.includes("'") || input.includes("'")) {
        // Match patterns like: 5'10, 5'10", 5' 10, etc.
        const feetInchesPattern = /^(\d+(?:\.\d+)?)\s*['']\s*(\d+(?:\.\d+)?)\s*"?$/i;
        const match = input.match(feetInchesPattern);
        
        if (match) {
            const feet = parseFloat(match[1]);
            const inches = parseFloat(match[2]);
            
            // Validate reasonable ranges
            if (feet < 0 || feet > 10) {
                return { valid: false, error: 'Feet must be between 0 and 10' };
            }
            if (inches < 0 || inches >= 12) {
                return { valid: false, error: 'Inches must be between 0 and 11' };
            }
            return { valid: true, error: '' };
        }
        
        // Try pattern with "ft" and "in"
        const ftInPattern = /^(\d+(?:\.\d+)?)\s*ft\s*(\d+(?:\.\d+)?)\s*in$/i;
        const ftInMatch = input.match(ftInPattern);
        if (ftInMatch) {
            const feet = parseFloat(ftInMatch[1]);
            const inches = parseFloat(ftInMatch[2]);
            
            if (feet < 0 || feet > 10) {
                return { valid: false, error: 'Feet must be between 0 and 10' };
            }
            if (inches < 0 || inches >= 12) {
                return { valid: false, error: 'Inches must be between 0 and 11' };
            }
            return { valid: true, error: '' };
        }
        
        // Has apostrophe but doesn't match pattern
        return { valid: false, error: 'Invalid format. Use feet\'inches (e.g., 5\'10") or total inches' };
    }
    
    // If no apostrophe, treat as total inches (number only)
    const numericValue = parseFloat(input.replace(/[^\d.]/g, ''));
    if (!isNaN(numericValue) && numericValue > 0 && numericValue <= 120) {
        return { valid: true, error: '' };
    }
    
    if (isNaN(numericValue)) {
        return { valid: false, error: 'Invalid format. Use feet\'inches (e.g., 5\'10") or total inches' };
    }
    
    return { valid: false, error: 'Height must be between 1 and 120 inches' };
}

// Helper function to parse height input (feet'inches format) and convert to total inches
function parseHeightToInches(heightInput) {
    if (!heightInput || heightInput === 'N/A' || heightInput.trim() === '') return 'N/A';
    
    const input = heightInput.trim();
    
    // Check if input contains an apostrophe (feet'inches format)
    if (input.includes("'") || input.includes("'")) {
        // Match patterns like: 5'10, 5'10", 5' 10, 5ft 10in, etc.
        const feetInchesPattern = /(\d+(?:\.\d+)?)\s*['']\s*(\d+(?:\.\d+)?)/i;
        const match = input.match(feetInchesPattern);
        
        if (match) {
            const feet = parseFloat(match[1]);
            const inches = parseFloat(match[2]);
            const totalInches = (feet * 12) + inches;
            return totalInches;
        }
        
        // Try pattern with "ft" and "in"
        const ftInPattern = /(\d+(?:\.\d+)?)\s*ft\s*(\d+(?:\.\d+)?)\s*in/i;
        const ftInMatch = input.match(ftInPattern);
        if (ftInMatch) {
            const feet = parseFloat(ftInMatch[1]);
            const inches = parseFloat(ftInMatch[2]);
            const totalInches = (feet * 12) + inches;
            return totalInches;
        }
    }
    
    // If no apostrophe, treat as total inches (number only)
    const numericValue = parseFloat(input.replace(/[^\d.]/g, ''));
    if (!isNaN(numericValue)) {
        return numericValue;
    }
    
    return 'N/A';
}

// Helper function to convert inches to feet and inches format for display
function formatHeightInches(inches) {
    if (inches === 'N/A' || isNaN(inches)) return 'N/A';
    const totalInches = parseFloat(inches);
    const feet = Math.floor(totalInches / 12);
    const remainingInches = Math.round(totalInches % 12);
    return `${feet}'${remainingInches}"`;
}

// Helper function to get patient information
function getPatientInfo() {
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
    
    // Format weight (lbs) and height (feet/inches)
    const weightDisplay = weight !== 'N/A' ? weight + ' lbs' : 'N/A';
    
    // Parse height input (feet'inches) to total inches, then format for display
    const heightInInches = parseHeightToInches(height);
    const heightDisplay = heightInInches !== 'N/A' ? formatHeightInches(heightInInches) : 'N/A';
    
    // Get cardiac device information
    const cardiacDevice = document.querySelector('input[name="cardiacDevice"]:checked');
    const cardiacDeviceValue = cardiacDevice ? cardiacDevice.value : 'no';
    let deviceTypeDisplay = 'N/A';
    let lastInterrogationDisplay = 'N/A';
    let cardiologistVisitDisplay = 'N/A';
    
    if (cardiacDeviceValue === 'yes') {
        const deviceType = document.getElementById('deviceType');
        const deviceTypeOther = document.getElementById('deviceTypeOther');
        if (deviceType && deviceType.value) {
            if (deviceType.value === 'other' && deviceTypeOther && deviceTypeOther.value) {
                deviceTypeDisplay = deviceTypeOther.value;
            } else {
                deviceTypeDisplay = deviceType.value === 'pacemaker' ? 'Pacemaker' : 
                                   deviceType.value === 'aicd' ? 'AICD' : 
                                   deviceType.value;
            }
        }
        
        const lastInterrogation = document.getElementById('lastInterrogation');
        if (lastInterrogation && lastInterrogation.value) {
            const interrogationMap = {
                'over_6_months': 'Over 6 months ago',
                'within_6_months': 'Within the past 6 months',
                'not_sure': 'Not sure/Unknown'
            };
            lastInterrogationDisplay = interrogationMap[lastInterrogation.value] || lastInterrogation.value;
        }
        
        const cardiologistVisit = document.querySelector('input[name="cardiologistVisit"]:checked');
        if (cardiologistVisit) {
            cardiologistVisitDisplay = cardiologistVisit.value === 'yes' ? 'Yes' : 'No';
        }
    }
    
    return {
        age,
        gender: genderDisplay,
        weight: weightDisplay,
        height: heightDisplay,
        surgeryType: surgeryTypeDisplay,
        anesthesiaType: anesthesiaTypeDisplay,
        surgeryDate: surgeryDate !== 'N/A' ? new Date(surgeryDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : 'N/A',
        cardiacDevice: cardiacDeviceValue === 'yes' ? 'Yes' : 'No',
        deviceType: deviceTypeDisplay,
        lastInterrogation: lastInterrogationDisplay,
        cardiologistVisit: cardiologistVisitDisplay
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
        const isRequiredActions = category.title === 'Required Actions';
        const borderColor = isRequiredActions ? '#ea580c' : '#008045';
        const bgColor = isRequiredActions ? '#fff7ed' : '#e2e8f0';
        const titleColor = isRequiredActions ? '#9a3412' : '#0e2657';
        recommendationsHTML += `
            <div style="margin-bottom: ${isLastCategory ? '10px' : '12px'}; page-break-inside: avoid; orphans: 3; widows: 3; width: 100%;" class="page-break-avoid">
                <h4 style="color: ${titleColor}; margin: 0 0 8px 0; font-size: 16px; font-weight: bold; background-color: ${bgColor}; padding: 10px 15px; border-left: 4px solid ${borderColor}; page-break-after: avoid;">${category.title}</h4>
                <ul style="margin: 0; padding: 0; list-style: none; width: 100%; page-break-inside: avoid;">
        `;
        category.items.forEach((item, itemIndex) => {
            const isLastItem = itemIndex === category.items.length - 1;
            const iconSymbol = isRequiredActions ? '⚠' : '✓';
            const iconColor = isRequiredActions ? '#ea580c' : '#6ba818';
            const textColor = isRequiredActions ? '#9a3412' : '#1e293b';
            const fontWeight = isRequiredActions ? 'bold' : 'normal';
            recommendationsHTML += `
                    <li style="padding: 5px 15px 5px 35px; color: ${textColor}; font-size: 13px; position: relative; width: 100%; box-sizing: border-box; line-height: 1.4; font-weight: ${fontWeight}; ${isLastItem ? 'margin-bottom: 0;' : ''}">
                        <span style="position: absolute; left: 12px; color: ${iconColor}; font-weight: bold; font-size: 14px;">${iconSymbol}</span>
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
                    ${patientInfo.cardiacDevice === 'Yes' ? `
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Cardiac Device:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.deviceType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Last Interrogation:</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.lastInterrogation}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 15px 6px 0; color: #475569; font-weight: 600; text-align: right; font-size: 13px;">Cardiologist Visit (Past Year):</td>
                        <td style="padding: 6px 0; color: #1e293b; text-align: left; font-size: 13px;">${patientInfo.cardiologistVisit}</td>
                    </tr>
                    ` : ''}
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
                filename: `PreoperativeOrders_${new Date().toISOString().split('T')[0]}.pdf`,
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
