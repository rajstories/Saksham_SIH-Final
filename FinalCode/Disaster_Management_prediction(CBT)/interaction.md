# Natural Disaster Prediction System - Interaction Design

## Project Overview
A comprehensive AI-powered natural disaster prediction system with three main interactive components for SIH jury presentation.

## Interactive Components

### 1. Earthquake Prediction Model
**Location**: earthquake.html
**Interaction**: 
- Interactive map showing Hindu Kush Mountain region with seismic activity markers
- Input panel for seismic parameters (magnitude, depth, location, gap, rms)
- Real-time prediction display with probability visualization
- Historical earthquake data visualization with timeline slider
- Risk assessment dashboard with color-coded danger levels

**User Flow**:
1. User views interactive map with historical earthquake data
2. User can click on any earthquake marker to see details
3. User inputs seismic parameters in the prediction panel
4. System shows prediction results with visual probability indicators
5. User can explore different scenarios by adjusting parameters

### 2. Flood Detection System
**Location**: flood.html
**Interaction**:
- Image upload interface for flood detection
- Real-time image analysis with CNN model simulation
- Before/after image comparison slider
- Confidence score visualization with animated progress bars
- Gallery of flood detection examples with results

**User Flow**:
1. User uploads or selects an image for flood detection
2. System processes image with animated CNN visualization
3. Results show with confidence percentage and risk level
4. User can compare with other images in the gallery
5. Interactive explanation of CNN layers and detection process

### 3. Forest Fire Prediction System
**Location**: forestfire.html
**Interaction**:
- Environmental parameter input sliders (Temperature, Humidity, Oxygen)
- Real-time probability calculation and visualization
- Interactive forest scene that changes based on risk level
- Alert system with different warning levels
- Historical fire incident data with location mapping

**User Flow**:
1. User adjusts environmental parameters using sliders
2. Forest scene visually changes to reflect fire risk (green to red)
3. Probability meter shows real-time calculation
4. Alert system activates based on risk threshold
5. User can save scenarios and compare different conditions

## Navigation System
- Fixed navigation bar with smooth scrolling
- Active page highlighting
- Mobile-responsive hamburger menu
- Quick access to all prediction models

## Data Visualization Features
- Interactive charts using ECharts.js
- Real-time data updates
- Animated transitions between states
- Responsive design for different screen sizes
- Color-coded risk levels (Green: Safe, Yellow: Caution, Red: Danger)

## Technical Implementation
- Frontend: HTML5, CSS3 (Tailwind), JavaScript (Vanilla)
- Animation: Anime.js for smooth transitions
- Data Visualization: ECharts.js for charts and graphs
- Visual Effects: p5.js for creative coding elements
- Responsive Design: Mobile-first approach
- Performance: Optimized loading and smooth interactions