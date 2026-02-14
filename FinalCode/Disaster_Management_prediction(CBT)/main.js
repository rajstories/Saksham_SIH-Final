// Natural Disaster Prediction System - Main JavaScript
// Interactive functionality for SIH jury presentation

// Global variables
let currentPage = '';
let earthquakeData = [];
let floodDetectionResults = [];
let forestFireRisk = 0;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
    setupAnimations();
    
    // Page-specific initializations
    const page = getCurrentPage();
    switch(page) {
        case 'index':
            initializeHomePage();
            break;
        case 'earthquake':
            initializeEarthquakePage();
            break;
        case 'flood':
            initializeFloodPage();
            break;
        case 'forestfire':
            initializeForestFirePage();
            break;
    }
});

// Utility Functions
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('earthquake')) return 'earthquake';
    if (path.includes('flood')) return 'flood';
    if (path.includes('forestfire')) return 'forestfire';
    return 'index';
}

function initializeApp() {
    console.log('Natural Disaster Prediction System Initialized');
    currentPage = getCurrentPage();
    
    // Initialize particle background
    if (typeof p5 !== 'undefined') {
        initParticleBackground();
    }
}

// Navigation System
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Smooth scroll for anchor links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Animation System
function setupAnimations() {
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize text animations
    if (typeof anime !== 'undefined') {
        animateHeroText();
    }
}

function animateHeroText() {
    anime({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 300
    });
    
    anime({
        targets: '.hero-subtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 600
    });
    
    anime({
        targets: '.hero-cta',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 900
    });
}

// Particle Background System
function initParticleBackground() {
    const sketch = (p) => {
        let particles = [];
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particle-background');
            canvas.style('position', 'fixed');
            canvas.style('top', '0');
            canvas.style('left', '0');
            canvas.style('z-index', '-1');
            
            // Create particles
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(p));
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
        
        class Particle {
            constructor(p) {
                this.p = p;
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.vx = p.random(-0.5, 0.5);
                this.vy = p.random(-0.5, 0.5);
                this.size = p.random(2, 6);
                this.opacity = p.random(0.1, 0.3);
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Wrap around edges
                if (this.x < 0) this.x = this.p.width;
                if (this.x > this.p.width) this.x = 0;
                if (this.y < 0) this.y = this.p.height;
                if (this.y > this.p.height) this.y = 0;
            }
            
            draw() {
                this.p.fill(30, 58, 138, this.opacity * 255);
                this.p.noStroke();
                this.p.ellipse(this.x, this.y, this.size);
            }
        }
    };
    
    new p5(sketch);
}

// Earthquake Page Functions
function initializeEarthquakePage() {
    console.log('Initializing Earthquake Prediction Page');
    
    // Initialize map
    initializeEarthquakeMap();
    
    // Setup parameter inputs
    setupEarthquakeInputs();
    
    // Load historical data
    loadEarthquakeData();
    
    // Initialize prediction chart
    initializePredictionChart();
}

function initializeEarthquakeMap() {
    // Create a simple interactive map using Leaflet or similar
    const mapContainer = document.getElementById('earthquake-map');
    if (!mapContainer) return;
    
    // Mock map implementation
    mapContainer.innerHTML = `
        <div class="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p class="text-gray-600">Hindu Kush Region</p>
                    <p class="text-sm text-gray-500">Interactive Map Loading...</p>
                </div>
            </div>
            <!-- Mock earthquake markers -->
            <div class="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div class="absolute top-3/4 left-1/4 w-4 h-4 bg-red-600 rounded-full animate-bounce"></div>
        </div>
    `;
}

function setupEarthquakeInputs() {
    const inputs = document.querySelectorAll('.earthquake-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateEarthquakePrediction();
        });
    });
}

function updateEarthquakePrediction() {
    // Mock prediction calculation
    const magnitude = document.getElementById('magnitude')?.value || 5.0;
    const depth = document.getElementById('depth')?.value || 10;
    const gap = document.getElementById('gap')?.value || 180;
    
    // Simple risk calculation
    const risk = Math.min((magnitude * 20 + depth * 0.5 + gap * 0.1) / 100, 1);
    
    updateRiskDisplay(risk, 'earthquake-risk');
}

function loadEarthquakeData() {
    // Mock historical data
    earthquakeData = [
        { date: '2023-01-15', magnitude: 5.2, depth: 15, location: 'Hindu Kush' },
        { date: '2023-02-20', magnitude: 4.8, depth: 8, location: 'Hindu Kush' },
        { date: '2023-03-10', magnitude: 6.1, depth: 25, location: 'Hindu Kush' }
    ];
    
    updateEarthquakeHistory();
}

function updateEarthquakeHistory() {
    const container = document.getElementById('earthquake-history');
    if (!container) return;
    
    container.innerHTML = earthquakeData.map(quake => `
        <div class="bg-white p-4 rounded-lg shadow-sm border">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold text-gray-800">${quake.location}</h4>
                    <p class="text-sm text-gray-600">${quake.date}</p>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-orange-600">${quake.magnitude}</div>
                    <div class="text-xs text-gray-500">Magnitude</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Flood Page Functions
function initializeFloodPage() {
    console.log('Initializing Flood Detection Page');
    
    setupImageUpload();
    initializeCNNVisualization();
    loadFloodExamples();
}

function setupImageUpload() {
    const uploadArea = document.getElementById('image-upload-area');
    const fileInput = document.getElementById('flood-image-input');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('border-blue-500');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('border-blue-500');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('border-blue-500');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        displayUploadedImage(e.target.result);
        simulateFloodDetection(e.target.result);
    };
    reader.readAsDataURL(file);
}

function displayUploadedImage(imageSrc) {
    const container = document.getElementById('uploaded-image-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="relative">
            <img src="${imageSrc}" alt="Uploaded image" class="w-full h-64 object-cover rounded-lg">
            <div class="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                <div class="bg-white px-4 py-2 rounded-full">
                    <span class="text-sm font-medium">Analyzing...</span>
                </div>
            </div>
        </div>
    `;
}

function simulateFloodDetection(imageSrc) {
    // Mock CNN processing
    setTimeout(() => {
        const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
        const isFlood = confidence > 0.75;
        
        displayFloodResults(isFlood, confidence);
        updateCNNVisualization();
    }, 2000);
}

function displayFloodResults(isFlood, confidence) {
    const container = document.getElementById('flood-results');
    if (!container) return;
    
    const riskLevel = isFlood ? 'High Risk' : 'Low Risk';
    const riskColor = isFlood ? 'text-red-600' : 'text-green-600';
    const bgColor = isFlood ? 'bg-red-50' : 'bg-green-50';
    
    container.innerHTML = `
        <div class="${bgColor} p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Detection Results</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="font-medium">Risk Level:</span>
                    <span class="${riskColor} font-bold">${riskLevel}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-medium">Confidence:</span>
                    <span class="font-bold">${(confidence * 100).toFixed(1)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" style="width: ${confidence * 100}%"></div>
                </div>
            </div>
        </div>
    `;
}

function initializeCNNVisualization() {
    const container = document.getElementById('cnn-visualization');
    if (!container) return;
    
    // Mock CNN layers
    container.innerHTML = `
        <div class="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-center">
                <div class="w-full h-20 bg-blue-200 rounded mb-2 flex items-center justify-center">
                    <span class="text-xs">Input Layer</span>
                </div>
                <p class="text-xs text-gray-600">Image Input</p>
            </div>
            <div class="text-center">
                <div class="w-full h-20 bg-green-200 rounded mb-2 flex items-center justify-center">
                    <span class="text-xs">Conv Layer</span>
                </div>
                <p class="text-xs text-gray-600">Feature Extraction</p>
            </div>
            <div class="text-center">
                <div class="w-full h-20 bg-yellow-200 rounded mb-2 flex items-center justify-center">
                    <span class="text-xs">Pooling Layer</span>
                </div>
                <p class="text-xs text-gray-600">Dimension Reduction</p>
            </div>
            <div class="text-center">
                <div class="w-full h-20 bg-red-200 rounded mb-2 flex items-center justify-center">
                    <span class="text-xs">Output Layer</span>
                </div>
                <p class="text-xs text-gray-600">Classification</p>
            </div>
        </div>
    `;
}

// Forest Fire Page Functions
function initializeForestFirePage() {
    console.log('Initializing Forest Fire Prediction Page');
    
    setupForestFireSliders();
    initializeForestScene();
    updateForestFirePrediction();
}

function setupForestFireSliders() {
    const sliders = document.querySelectorAll('.forest-fire-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateForestFirePrediction();
            updateForestScene();
        });
    });
}

function updateForestFirePrediction() {
    const temperature = document.getElementById('temperature')?.value || 25;
    const humidity = document.getElementById('humidity')?.value || 60;
    const oxygen = document.getElementById('oxygen')?.value || 21;
    
    // Simple risk calculation
    const tempRisk = (temperature - 20) / 30; // 0-1 based on 20-50°C
    const humidityRisk = 1 - (humidity / 100); // Inverse relationship
    const oxygenRisk = (oxygen - 15) / 10; // 0-1 based on 15-25%
    
    const risk = Math.min((tempRisk * 0.4 + humidityRisk * 0.3 + oxygenRisk * 0.3), 1);
    
    updateRiskDisplay(risk, 'forest-fire-risk');
    updateAlertSystem(risk);
}

function updateRiskDisplay(risk, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const percentage = (risk * 100).toFixed(1);
    const riskLevel = risk < 0.3 ? 'Low Risk' : risk < 0.7 ? 'Medium Risk' : 'High Risk';
    const riskColor = risk < 0.3 ? 'text-green-600' : risk < 0.7 ? 'text-yellow-600' : 'text-red-600';
    const bgColor = risk < 0.3 ? 'bg-green-50' : risk < 0.7 ? 'bg-yellow-50' : 'bg-red-50';
    
    container.innerHTML = `
        <div class="${bgColor} p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Risk Assessment</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="font-medium">Risk Level:</span>
                    <span class="${riskColor} font-bold">${riskLevel}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="font-medium">Probability:</span>
                    <span class="font-bold">${percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
                </div>
            </div>
        </div>
    `;
}

function updateAlertSystem(risk) {
    const alertContainer = document.getElementById('alert-system');
    if (!alertContainer) return;
    
    let alertLevel = '';
    let alertColor = '';
    let alertMessage = '';
    
    if (risk < 0.3) {
        alertLevel = 'Normal';
        alertColor = 'bg-green-500';
        alertMessage = 'Conditions are normal. No fire risk detected.';
    } else if (risk < 0.7) {
        alertLevel = 'Caution';
        alertColor = 'bg-yellow-500';
        alertMessage = 'Moderate fire risk. Monitor conditions closely.';
    } else {
        alertLevel = 'Warning';
        alertColor = 'bg-red-500';
        alertMessage = 'High fire risk! Immediate action required.';
    }
    
    alertContainer.innerHTML = `
        <div class="${alertColor} text-white p-4 rounded-lg">
            <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                <div>
                    <h4 class="font-semibold">${alertLevel} Alert</h4>
                    <p class="text-sm opacity-90">${alertMessage}</p>
                </div>
            </div>
        </div>
    `;
}

function initializeForestScene() {
    const scene = document.getElementById('forest-scene');
    if (!scene) return;
    
    scene.innerHTML = `
        <div class="relative h-64 bg-gradient-to-b from-blue-200 to-green-200 rounded-lg overflow-hidden">
            <div class="absolute inset-0 flex items-end justify-center space-x-4 pb-8">
                <div class="tree w-8 h-16 bg-green-600 rounded-t-full"></div>
                <div class="tree w-12 h-20 bg-green-700 rounded-t-full"></div>
                <div class="tree w-6 h-12 bg-green-600 rounded-t-full"></div>
                <div class="tree w-10 h-18 bg-green-700 rounded-t-full"></div>
                <div class="tree w-8 h-16 bg-green-600 rounded-t-full"></div>
            </div>
            <div class="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                Forest Status: Normal
            </div>
        </div>
    `;
}

function updateForestScene() {
    const risk = forestFireRisk;
    const scene = document.querySelector('#forest-scene .relative');
    const statusText = document.querySelector('#forest-scene .bg-white');
    
    if (!scene || !statusText) return;
    
    let bgGradient = 'from-blue-200 to-green-200';
    let status = 'Normal';
    let treeOpacity = 'opacity-100';
    
    if (risk > 0.7) {
        bgGradient = 'from-orange-300 to-red-400';
        status = 'High Risk - Fire Danger';
        treeOpacity = 'opacity-60';
    } else if (risk > 0.3) {
        bgGradient = 'from-yellow-200 to-orange-300';
        status = 'Moderate Risk';
        treeOpacity = 'opacity-80';
    }
    
    scene.className = `relative h-64 bg-gradient-to-b ${bgGradient} rounded-lg overflow-hidden`;
    statusText.textContent = `Forest Status: ${status}`;
    
    const trees = scene.querySelectorAll('.tree');
    trees.forEach(tree => {
        tree.className = `tree w-${tree.className.match(/w-(\d+)/)[1]} h-${tree.className.match(/h-(\d+)/)[1]} ${risk > 0.7 ? 'bg-red-600' : risk > 0.3 ? 'bg-orange-600' : 'bg-green-600'} rounded-t-full ${treeOpacity}`;
    });
}

// Chart Initialization
function initializePredictionChart() {
    const chartContainer = document.getElementById('prediction-chart');
    if (!chartContainer || typeof echarts === 'undefined') return;
    
    const chart = echarts.init(chartContainer);
    
    const option = {
        title: {
            text: 'Prediction Accuracy Over Time',
            left: 'center',
            textStyle: {
                color: '#1e3a8a',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [{
            name: 'Accuracy',
            type: 'line',
            data: [85, 87, 89, 92, 94, 96],
            smooth: true,
            lineStyle: {
                color: '#1e3a8a',
                width: 3
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(30, 58, 138, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(30, 58, 138, 0.1)'
                    }]
                }
            }
        }]
    };
    
    chart.setOption(option);
    
    // Responsive chart
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Home Page Functions
function initializeHomePage() {
    console.log('Initializing Home Page');
    
    setupModelCards();
    initializeFeatureCarousel();
    setupScrollAnimations();
}

function setupModelCards() {
    const cards = document.querySelectorAll('.model-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

function initializeFeatureCarousel() {
    const carousel = document.querySelector('.feature-carousel');
    if (!carousel || typeof Splide === 'undefined') return;
    
    new Splide(carousel, {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 3000,
        breakpoints: {
            768: {
                perPage: 1
            }
        }
    }).mount();
}

function setupScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 800,
                    easing: 'easeOutExpo',
                    delay: anime.stagger(100)
                });
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutExpo'
    });
    
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInExpo',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

// Export functions for global access
window.NaturalDisasterApp = {
    initializeApp,
    showNotification,
    updateEarthquakePrediction,
    updateForestFirePrediction
};