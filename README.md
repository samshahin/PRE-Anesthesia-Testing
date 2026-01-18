# Pre-Anesthesia Testing / Preoperative Assessment Application
Link:
https://pre-anesthesia-testing-9tvlz8cj9.vercel.app/

A comprehensive web-based application designed to streamline preoperative patient evaluation and automate the generation of evidence-based preoperative orders for surgical procedures.

## Overview

This application addresses a critical challenge in perioperative medicine: efficiently and accurately determining the appropriate preoperative testing and consultations needed for surgical patients. By automating patient analysis based on clinical guidelines, the tool significantly reduces administrative burden, minimizes unnecessary testing, and ensures consistent, evidence-based preoperative care.

## Clinical Problem

Preoperative assessment is a complex process that requires careful evaluation of:
- Patient demographics (age, gender, weight, height)
- Planned surgical procedure and anesthesia type
- Medical history and comorbidities
- Functional status and physical capacity

Traditionally, this process involves manual review of patient charts, consultation with multiple specialists, and time-consuming decision-making about which laboratory studies, diagnostic tests, and imaging studies are necessary. This manual approach can lead to:
- **Inconsistent care**: Different providers may order different tests for similar patients
- **Unnecessary testing**: Over-ordering of tests that don't impact surgical outcomes
- **Missed critical tests**: Under-ordering that could lead to perioperative complications
- **Administrative overhead**: Significant time spent on manual assessment and order entry

## Primary Use Cases

### For Healthcare Providers at the NorthBay Medical Center
- **Anesthesiologists**: Quickly assess patients and generate standardized preoperative orders
- **Surgeons**: Ensure appropriate preoperative workup before scheduling procedures
- **Preoperative Clinic Staff**: Efficiently process patient assessments and coordinate care
- **Nurses**: Complete patient intake and assessment documentation

### For Patients/Caregivers
- **Self-Assessment**: Patients can complete their medical history and functional status assessment
- **Care Coordination**: Caregivers can assist with form completion for elderly or disabled patients
- **Documentation**: Generate printable or downloadable PDF summaries of recommended orders

## Key Features

### Automated Patient Analysis

The application uses evidence-based algorithms to analyze patient data and automatically determine appropriate preoperative orders based on:
- **Age-based protocols**: Different testing requirements for pediatric, adult, and geriatric patients
- **Surgery-specific requirements**: Tailored recommendations based on procedure type (cardiac, orthopedic, abdominal, thoracic, neurological, etc.)
- **Anesthesia considerations**: Adjustments based on general anesthesia vs. regional/local anesthesia
- **Comorbidity assessment**: Automatic inclusion of additional tests based on medical conditions (diabetes, heart disease, COPD, kidney disease, liver disease, bleeding disorders, etc.)

### Structured Preoperative Order Generation

The application generates comprehensive, organized summaries of recommended preoperative orders across multiple categories:

#### Laboratory Studies
- **Complete Blood Count (CBC)**: Standard for all surgical procedures
- **Basic Metabolic Panel (BMP)**: Standard metabolic screening
- **Comprehensive Metabolic Panel (CMP)**: For patients ≥50 years, diabetes, or kidney disease
- **PT/PTT/INR**: For bleeding disorders, cardiac, or neurological surgeries
- **Type and Screen**: For procedures with significant blood loss risk
- **HbA1c**: For diabetic patients
- **Liver Function Tests**: For patients with liver disease

#### Diagnostic Studies
- **ECG (Electrocardiogram)**: For patients ≥40 years, heart disease, or hypertension
- **Echocardiogram**: For cardiac conditions or cardiac surgery
- **Pulmonary Function Tests**: For COPD patients

#### Imaging Studies
- **Chest X-ray**: For patients ≥60 years, COPD, thoracic, or cardiac surgery
- **Site-specific X-rays**: For orthopedic procedures

#### Additional Recommendations
- **Specialist Consultations**: Cardiology, Pulmonology, Nephrology, Endocrinology as indicated
- **Medication Management**: Review and optimization recommendations
- **Preoperative Instructions**: Fasting guidelines, medication holds, and preparation instructions

## How It Reduces Preoperative Overhead

### 1. **Time Savings**
- **Automated Analysis**: Eliminates manual calculation and decision-making time
- **Instant Recommendations**: Generates complete order sets in seconds
- **Standardized Process**: Reduces time spent on repetitive assessment tasks

### 2. **Consistency and Quality**
- **Evidence-Based Guidelines**: Ensures all recommendations follow current clinical guidelines
- **Standardized Care**: Reduces variation between providers
- **Comprehensive Coverage**: Minimizes risk of missing critical preoperative tests

### 3. **Administrative Efficiency**
- **Digital Documentation**: Eliminates paper-based forms and manual data entry
- **Export Capabilities**: PDF download and print functionality for easy integration into EMR systems
- **Structured Output**: Formatted summaries ready for clinical documentation

### 4. **Cost Reduction**
- **Reduced Unnecessary Testing**: Only orders tests that are clinically indicated
- **Prevented Complications**: Early identification of risk factors reduces perioperative complications
- **Streamlined Workflow**: Reduces administrative costs associated with manual processing

## Technical Details

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS with custom NorthBay Health design system
- **PDF Generation**: html2pdf.js for client-side PDF creation
- **Responsive Design**: Mobile-friendly interface for use on tablets and smartphones

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers for point-of-care use

## Usage

1. **Enter Patient Information**: Complete the patient demographics section
2. **Select Surgery Details**: Choose the planned procedure type and anesthesia method
3. **Review Medical History**: Check all applicable medical conditions
4. **Assess Functional Status**: Complete the functional capacity evaluation
5. **Generate Recommendations**: Click "Generate Preoperative Orders" to receive automated recommendations
6. **Review and Export**: Review the recommendations and download as PDF or print for clinical documentation

## Output Format

The application generates a professional, formatted document that includes:
- **Header**: NorthBay Health branding and document title
- **Patient Information**: Complete demographic and surgical details
- **Recommended Orders**: Organized by category (Laboratory, Diagnostic, Imaging, Consultations, Medications, Instructions)
- **Footer**: Generation date and copyright information

The output is optimized for:
- **Single-page printing**: All content fits on one standard page
- **PDF download**: High-quality PDF suitable for EMR integration
- **Clinical documentation**: Professional formatting for medical records




**Note**: This application is a clinical decision support tool. All recommendations should be reviewed by qualified healthcare providers and adjusted based on individual patient circumstances and institutional protocols.
