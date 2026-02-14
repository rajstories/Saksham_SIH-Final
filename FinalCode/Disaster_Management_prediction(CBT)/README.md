# Disaster Management Prediction & Capacity Building Training (CBT)

## 🎯 Overview

This module provides **AI-powered disaster prediction** and **intelligent capacity building training recommendations** for disaster preparedness. It analyzes real-time data to predict disasters and automatically generates training plans to bridge preparedness gaps.

## 🌟 Key Features

### Disaster Prediction Models
- 🌊 **Flood Detection** - Historical data analysis and weather patterns
- 🏚️ **Earthquake Prediction** - Seismic activity monitoring
- 🔥 **Forest Fire Risk** - Climate and vegetation analysis
- 🌪️ **Cyclone Forecasting** - Meteorological data processing

### Capacity Building Dashboard
- 📊 **Training Gap Analysis** - Identify under-trained populations
- 🎓 **Resource Optimization** - Efficient trainer and venue allocation
- 📈 **Impact Prediction** - Expected casualty reduction metrics
- 🎯 **Priority Alerts** - CRITICAL, HIGH, MEDIUM, LOW classifications

## 📁 Project Structure

```
Disaster_Management_prediction(CBT)/
├── index.html                      # Main disaster demo page
├── capacity-building.html          # Capacity building dashboard
├── disaster-demo.html              # Integrated demo
├── earthquake.html                 # Earthquake-specific model
├── flood.html                      # Flood-specific model
├── forestfire.html                 # Forest fire model
├── main.js                         # Core JavaScript logic
├── disaster-management-model.js    # ML model implementation
├── resources/                      # Images, data, assets
├── CAPACITY_BUILDING_README.md     # Detailed CBT documentation
├── SIH_PRESENTATION_GUIDE.md       # Presentation guidelines
├── design.md                       # Design specifications
├── interaction.md                  # User interaction flows
└── outline.md                      # Project outline
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required (static HTML/JS)

### Installation

1. **Open the project**
   ```bash
   cd Disaster_Management_prediction(CBT)
   ```

2. **Run locally** (using any local server)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Or simply open index.html in browser
   ```

3. **Access the application**
   - Main Demo: `http://localhost:8000/index.html`
   - Capacity Building: `http://localhost:8000/capacity-building.html`

## 💡 Usage

### Disaster Prediction

1. Select disaster type (Flood, Earthquake, Fire)
2. Enter location details
3. Input historical data parameters
4. View prediction results with probability scores

### Capacity Building Training

1. Choose disaster type
2. Enter location and population at risk
3. Specify time available until predicted disaster
4. Input currently trained personnel count
5. Generate training recommendations

**Output includes**:
- Training gap analysis
- Required number of sessions
- Resource requirements (trainers, venues, budget)
- Timeline and implementation plan
- Expected impact metrics

## 📊 Training Logic

### Coverage Ratios
- **Earthquake**: 1 trained person per 50 people
- **Flood**: 1 trained person per 100 people
- **Cyclone**: 1 trained person per 75 people
- **Fire**: 1 trained person per 200 people

### Training Types
- **Emergency Basic** (< 15 days): 1-day intensive sessions
- **Standard Training** (15-30 days): 3-day comprehensive
- **Full Training** (> 30 days): 7-day master trainer program

### Priority Levels
- 🔴 **CRITICAL**: < 15 days AND gap > 500 people
- 🟠 **HIGH**: 15-30 days AND gap > 300 people
- 🟡 **MEDIUM**: > 30 days OR gap 100-300 people
- 🟢 **LOW**: Adequate coverage, routine maintenance

## 🎨 Technology Stack

- **HTML5/CSS3** - Structure and styling
- **JavaScript ES6+** - Core logic and interactions
- **Tailwind CSS** - Utility-first styling
- **ECharts.js** - Interactive data visualization
- **Anime.js** - Smooth animations

## 📈 Key Metrics Tracked

### Input Metrics
- Coverage Rate: (Current Trained / Required) × 100
- Training Recency: Days since last training
- Resource Availability: Trainers + Venues + Equipment scores
- Disaster Urgency: Days until predicted disaster

### Output Metrics
- Training Gap: Required - Currently Trained
- Sessions Needed: Training Gap ÷ Batch Size
- Feasibility Score: (Available Resources / Required) × 100
- Expected Impact: Predicted casualty reduction percentage

## 🔧 Configuration

No configuration files needed. All logic is embedded in JavaScript files.

### Customization
Edit `disaster-management-model.js` to customize:
- Risk scoring algorithms
- Coverage ratios per disaster type
- Resource allocation logic
- Priority level thresholds

## 📱 Mobile Responsiveness

Fully responsive design with:
- Touch-friendly controls
- Optimized layouts for all screen sizes
- Swipe gestures for chart interactions
- Progressive enhancement

## 🎯 Use Cases

### Government Officials
- Emergency response planning
- Resource allocation decisions
- Performance monitoring across regions
- Budget planning for training programs

### Disaster Management Teams
- Quick training deployment
- Optimal trainer scheduling
- Progress tracking
- Impact assessment

### Training Coordinators
- Schedule management
- Quality assurance
- Comprehensive reporting
- Best practice identification

## 📚 Documentation

- `CAPACITY_BUILDING_README.md` - Detailed feature documentation
- `SIH_PRESENTATION_GUIDE.md` - Presentation guidelines for SIH
- `design.md` - UI/UX design specifications
- `interaction.md` - User interaction flows
- `outline.md` - Project architecture outline

## 🚀 Future Enhancements

- Real-time data integration from meteorological APIs
- Machine learning model improvements
- Mobile app version
- Integration with government databases
- Virtual reality training modules
- Predictive analytics dashboard

## 📞 Support

For issues or questions:
- Check existing documentation files
- Review code comments in `main.js` and `disaster-management-model.js`

---

**Part of SAKSHAM - SIH 2025 Project**
