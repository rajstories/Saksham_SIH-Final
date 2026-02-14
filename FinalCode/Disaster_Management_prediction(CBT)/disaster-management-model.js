// Disaster Management Model - Training Recommendation Engine
// Generates detailed capacity building recommendations based on predicted disasters

class DisasterManagementModel {
    constructor() {
        // Training standards and coverage ratios
        this.trainingStandards = {
            flood: {
                coverageRatio: 100, // 1 trained person per 100 people
                emergencyDuration: 1, // days
                standardDuration: 2, // days
                comprehensiveDuration: 5, // days
                skills: ['Water Rescue', 'Evacuation Procedures', 'First Aid', 'Emergency Communication', 'Relief Distribution']
            },
            earthquake: {
                coverageRatio: 50, // 1 trained person per 50 people
                emergencyDuration: 1,
                standardDuration: 3,
                comprehensiveDuration: 7,
                skills: ['Search & Rescue', 'Structural Assessment', 'Trauma First Aid', 'Evacuation Coordination', 'Emergency Shelter Setup']
            },
            cyclone: {
                coverageRatio: 75, // 1 trained person per 75 people
                emergencyDuration: 1,
                standardDuration: 2,
                comprehensiveDuration: 5,
                skills: ['Early Warning Systems', 'Evacuation Coordination', 'Cyclone Shelter Management', 'Emergency Communication', 'Relief Distribution']
            },
            fire: {
                coverageRatio: 200, // 1 trained person per 200 people (urban)
                emergencyDuration: 1,
                standardDuration: 3,
                comprehensiveDuration: 10,
                skills: ['Fire Suppression', 'Evacuation Procedures', 'Burn First Aid', 'Fire Prevention', 'Smoke Response']
            }
        };

        // Resource requirements per trainee
        this.resourceRequirements = {
            budgetPerTrainee: 2000, // ₹2,000 per person
            trainerCapacity: 25, // trainees per trainer
            venueCapacity: 50, // trainees per venue
            sessionDuration: 6 // hours per day
        };

        // Priority thresholds
        this.priorityThresholds = {
            critical: { time: 15, gap: 500 },
            high: { time: 30, gap: 300 },
            medium: { time: 60, gap: 100 }
        };

        this.initializeSampleData();
    }

    initializeSampleData() {
        // Sample data for demonstration
        this.sampleScenarios = [
            {
                location: 'Patna District, Bihar',
                disasterType: 'flood',
                severity: 'High',
                timeUntilDisaster: 21,
                populationAtRisk: 150000,
                currentlyTrained: 800,
                availableTrainers: 18,
                availableVenues: 9,
                availableBudget: 5000000
            },
            {
                location: 'Uttarkashi District, Uttarakhand',
                disasterType: 'earthquake',
                severity: 'Moderate',
                timeUntilDisaster: 25,
                populationAtRisk: 75000,
                currentlyTrained: 900,
                availableTrainers: 12,
                availableVenues: 6,
                availableBudget: 3000000
            },
            {
                location: 'Puri District, Odisha',
                disasterType: 'cyclone',
                severity: 'High',
                timeUntilDisaster: 45,
                populationAtRisk: 200000,
                currentlyTrained: 1500,
                availableTrainers: 25,
                availableVenues: 12,
                availableBudget: 8000000
            }
        ];
    }

    // Main method to generate training recommendations
    generateTrainingRecommendations(inputData) {
        const {
            location,
            disasterType,
            severity,
            timeUntilDisaster,
            populationAtRisk,
            currentlyTrained,
            availableTrainers,
            availableVenues,
            availableBudget
        } = inputData;

        // Step 1: Calculate required trained personnel
        const requiredTrained = this.calculateRequiredTrained(disasterType, populationAtRisk);
        
        // Step 2: Determine training gap
        const trainingGap = Math.max(0, requiredTrained - currentlyTrained);
        
        // Step 3: Assess priority level
        const priorityLevel = this.determinePriorityLevel(timeUntilDisaster, trainingGap);
        
        // Step 4: Determine training type and duration
        const trainingType = this.determineTrainingType(timeUntilDisaster, priorityLevel);
        
        // Step 5: Calculate sessions and resource requirements
        const sessionPlan = this.calculateSessionPlan(trainingGap, timeUntilDisaster, availableTrainers, availableVenues);
        
        // Step 6: Generate timeline and implementation plan
        const implementationPlan = this.generateImplementationPlan(sessionPlan, timeUntilDisaster, trainingType);
        
        // Step 7: Calculate budget and resource requirements
        const resourceRequirements = this.calculateResourceRequirements(sessionPlan, trainingType);
        
        // Step 8: Predict impact and outcomes
        const expectedImpact = this.calculateExpectedImpact(trainingGap, populationAtRisk, disasterType);

        // Compile final recommendation
        return this.compileRecommendation({
            location,
            disasterType,
            severity,
            timeUntilDisaster,
            populationAtRisk,
            currentlyTrained,
            requiredTrained,
            trainingGap,
            priorityLevel,
            trainingType,
            sessionPlan,
            implementationPlan,
            resourceRequirements,
            expectedImpact,
            availableResources: {
                trainers: availableTrainers,
                venues: availableVenues,
                budget: availableBudget
            }
        });
    }

    calculateRequiredTrained(disasterType, populationAtRisk) {
        const coverageRatio = this.trainingStandards[disasterType].coverageRatio;
        return Math.ceil(populationAtRisk / coverageRatio);
    }

    determinePriorityLevel(timeUntilDisaster, trainingGap) {
        if (timeUntilDisaster < this.priorityThresholds.critical.time && 
            trainingGap > this.priorityThresholds.critical.gap) {
            return 'CRITICAL';
        } else if (timeUntilDisaster < this.priorityThresholds.high.time && 
                   trainingGap > this.priorityThresholds.high.gap) {
            return 'HIGH';
        } else if (timeUntilDisaster < this.priorityThresholds.medium.time || 
                   trainingGap > this.priorityThresholds.medium.gap) {
            return 'MEDIUM';
        } else {
            return 'LOW';
        }
    }

    determineTrainingType(timeUntilDisaster, priorityLevel) {
        if (priorityLevel === 'CRITICAL' || timeUntilDisaster < 15) {
            return {
                type: 'Emergency Basic Training',
                duration: this.trainingStandards.flood.emergencyDuration,
                description: 'Intensive 1-day training focusing on immediate life-saving skills'
            };
        } else if (priorityLevel === 'HIGH' || timeUntilDisaster < 30) {
            return {
                type: 'Standard Training',
                duration: this.trainingStandards.flood.standardDuration,
                description: 'Comprehensive 2-3 day training covering key disaster response skills'
            };
        } else {
            return {
                type: 'Comprehensive Training',
                duration: this.trainingStandards.flood.comprehensiveDuration,
                description: 'In-depth 5-7 day training for master trainers and coordinators'
            };
        }
    }

    calculateSessionPlan(trainingGap, timeUntilDisaster, availableTrainers, availableVenues) {
        const batchSize = 50; // Standard batch size
        const sessionsNeeded = Math.ceil(trainingGap / batchSize);
        
        // Calculate parallel sessions possible
        const maxParallelSessions = Math.min(
            Math.floor(availableTrainers / 2), // 2 trainers per session
            availableVenues
        );
        
        const daysNeeded = Math.ceil(sessionsNeeded / maxParallelSessions);
        
        return {
            totalSessions: sessionsNeeded,
            parallelSessions: maxParallelSessions,
            daysNeeded: daysNeeded,
            batchSize: batchSize,
            traineesPerSession: batchSize,
            totalTrainees: trainingGap
        };
    }

    generateImplementationPlan(sessionPlan, timeUntilDisaster, trainingType) {
        const bufferDays = 3; // Buffer before disaster
        const availableDays = timeUntilDisaster - bufferDays;
        
        // Calculate optimal schedule
        const sessionsPerDay = Math.min(sessionPlan.parallelSessions, sessionPlan.totalSessions);
        const totalImplementationDays = Math.ceil(sessionPlan.totalSessions / sessionsPerDay);
        
        // Determine start date (ASAP)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Start tomorrow
        
        // Calculate completion date
        const completionDate = new Date(startDate);
        completionDate.setDate(completionDate.getDate() + totalImplementationDays);
        
        return {
            startDate: startDate.toLocaleDateString(),
            completionDate: completionDate.toLocaleDateString(),
            totalDays: totalImplementationDays,
            sessionsPerDay: sessionsPerDay,
            bufferDays: bufferDays,
            timelineFeasible: totalImplementationDays <= availableDays
        };
    }

    calculateResourceRequirements(sessionPlan, trainingType) {
        const totalTrainees = sessionPlan.totalTrainees;
        const totalBudget = totalTrainees * this.resourceRequirements.budgetPerTrainee;
        
        // Calculate trainer requirements
        const trainersNeeded = Math.ceil(totalTrainees / (this.resourceRequirements.trainerCapacity * trainingType.duration));
        
        // Calculate venue requirements
        const venuesNeeded = Math.ceil(sessionPlan.parallelSessions);
        
        // Calculate equipment requirements
        const equipment = this.calculateEquipmentRequirements(sessionPlan.trainingType, totalTrainees);
        
        return {
            totalBudget: totalBudget,
            trainersNeeded: trainersNeeded,
            venuesNeeded: venuesNeeded,
            equipment: equipment,
            budgetPerTrainee: this.resourceRequirements.budgetPerTrainee,
            totalTrainees: totalTrainees
        };
    }

    calculateEquipmentRequirements(disasterType, totalTrainees) {
        const equipmentSpecs = {
            flood: {
                lifeJackets: Math.ceil(totalTrainees * 0.1), // 10% of trainees
                rescueRopes: Math.ceil(totalTrainees * 0.05), // 5% of trainees
                firstAidKits: Math.ceil(totalTrainees * 0.2), // 20% of trainees
                emergencyKits: totalTrainees
            },
            earthquake: {
                searchTools: Math.ceil(totalTrainees * 0.15),
                firstAidKits: Math.ceil(totalTrainees * 0.3),
                emergencyKits: totalTrainees,
                communicationDevices: Math.ceil(totalTrainees * 0.1)
            },
            cyclone: {
                lifeJackets: Math.ceil(totalTrainees * 0.1),
                emergencyKits: totalTrainees,
                communicationDevices: Math.ceil(totalTrainees * 0.2),
                firstAidKits: Math.ceil(totalTrainees * 0.25)
            },
            fire: {
                fireExtinguishers: Math.ceil(totalTrainees * 0.1),
                firstAidKits: Math.ceil(totalTrainees * 0.3),
                emergencyKits: totalTrainees,
                smokeDetectors: Math.ceil(totalTrainees * 0.05)
            }
        };
        
        return equipmentSpecs[disasterType] || equipmentSpecs.flood;
    }

    calculateExpectedImpact(trainingGap, populationAtRisk, disasterType) {
        const coverageRate = (trainingGap / populationAtRisk) * 100;
        
        // Base impact calculations
        let casualtyReduction = Math.min(coverageRate * 0.8, 40); // Max 40% reduction
        let responseTimeImprovement = Math.min(coverageRate * 2, 60); // Max 60% improvement
        let preparednessIncrease = Math.min(coverageRate * 1.5, 50); // Max 50% increase
        
        // Adjust based on disaster type
        const disasterMultipliers = {
            earthquake: { casualty: 1.2, response: 1.0, preparedness: 1.1 },
            flood: { casualty: 1.0, response: 1.1, preparedness: 1.0 },
            cyclone: { casualty: 1.1, response: 1.2, preparedness: 1.0 },
            fire: { casualty: 0.9, response: 1.0, preparedness: 1.2 }
        };
        
        const multiplier = disasterMultipliers[disasterType] || disasterMultipliers.flood;
        
        return {
            casualtyReduction: Math.round(casualtyReduction * multiplier.casualty),
            responseTimeImprovement: Math.round(responseTimeImprovement * multiplier.response),
            preparednessIncrease: Math.round(preparednessIncrease * multiplier.preparedness),
            coverageRate: Math.round(coverageRate)
        };
    }

    compileRecommendation(data) {
        const { 
            location, 
            disasterType, 
            severity, 
            timeUntilDisaster, 
            populationAtRisk,
            currentlyTrained,
            requiredTrained,
            trainingGap,
            priorityLevel,
            trainingType,
            sessionPlan,
            implementationPlan,
            resourceRequirements,
            expectedImpact,
            availableResources
        } = data;

        const skills = this.trainingStandards[disasterType].skills;
        
        return {
            summary: {
                location,
                disasterType,
                severity,
                timeUntilDisaster,
                priorityLevel,
                trainingType: trainingType.type,
                populationAtRisk,
                currentlyTrained,
                requiredTrained,
                trainingGap
            },
            recommendations: {
                totalSessions: sessionPlan.totalSessions,
                parallelSessions: sessionPlan.parallelSessions,
                duration: trainingType.duration,
                skills: skills,
                timeline: implementationPlan,
                startDate: implementationPlan.startDate,
                completionDate: implementationPlan.completionDate
            },
            resources: {
                totalBudget: resourceRequirements.totalBudget,
                trainersNeeded: resourceRequirements.trainersNeeded,
                venuesNeeded: resourceRequirements.venuesNeeded,
                equipment: resourceRequirements.equipment,
                budgetPerTrainee: resourceRequirements.budgetPerTrainee
            },
            impact: expectedImpact,
            feasibility: {
                timelineFeasible: implementationPlan.timelineFeasible,
                budgetAvailable: availableResources.budget >= resourceRequirements.totalBudget,
                trainersAvailable: availableResources.trainers >= resourceRequirements.trainersNeeded,
                venuesAvailable: availableResources.venues >= resourceRequirements.venuesNeeded
            }
        };
    }

    // Method to generate the exact output format you showed
    generateTrainingOutput(location, disasterType, timeUntilDisaster, populationAtRisk, currentlyTrained) {
        const inputData = {
            location,
            disasterType,
            severity: 'High', // Default severity
            timeUntilDisaster,
            populationAtRisk,
            currentlyTrained,
            availableTrainers: Math.ceil(populationAtRisk / 10000), // Estimate
            availableVenues: Math.ceil(populationAtRisk / 20000), // Estimate
            availableBudget: populationAtRisk * 100 // Estimate
        };

        const recommendation = this.generateTrainingRecommendations(inputData);
        return this.formatTrainingOutput(recommendation);
    }

    formatTrainingOutput(recommendation) {
        const { summary, recommendations, resources, impact, feasibility } = recommendation;
        
        return `
🚨 ${summary.priorityLevel} TRAINING REQUIRED
📍 Location: ${summary.location}
🌊 Disaster: ${summary.disasterType.toUpperCase()} (${summary.severity} Severity)
⏰ Time Until Disaster: ${summary.timeUntilDisaster} days

📊 CURRENT STATUS:
- Population at Risk: ${summary.populationAtRisk.toLocaleString()}
- Currently Trained: ${summary.currentlyTrained.toLocaleString()} people
- Required Trained: ${summary.requiredTrained.toLocaleString()} people
- GAP: ${summary.trainingGap.toLocaleString()} people

🎯 RECOMMENDED ACTIONS:
✓ Schedule ${recommendations.totalSessions} training sessions (${recommendations.parallelSessions} parallel)
✓ Duration: ${recommendations.duration} day${recommendations.duration > 1 ? 's' : ''} per session
✓ Focus: ${summary.trainingType}
✓ Skills: ${recommendations.skills.join(', ')}
✓ Start Date: ${recommendations.startDate}
✓ Completion Date: ${recommendations.completionDate}

💰 RESOURCE REQUIREMENTS:
- Total Budget: ₹${resources.totalBudget.toLocaleString()}
- Training Materials: ${resources.equipment.emergencyKits || resources.equipment.firstAidKits} kits
- Equipment: ${Object.entries(resources.equipment).map(([key, value]) => `${value} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`).join(', ')}
- Trainers Needed: ${resources.trainersNeeded}
- Venues Needed: ${resources.venuesNeeded}
- Budget per Trainee: ₹${resources.budgetPerTrainee.toLocaleString()}

📈 EXPECTED IMPACT:
- Casualty Reduction: ${impact.casualtyReduction}%
- Response Time Improvement: ${impact.responseTimeImprovement}%
- Preparedness Increase: ${impact.preparednessIncrease}%
- Coverage Rate: ${impact.coverageRate}%

⚠️ FEASIBILITY STATUS:
${feasibility.timelineFeasible ? '✅ Timeline Feasible' : '❌ Timeline NOT Feasible'}
${feasibility.budgetAvailable ? '✅ Budget Available' : '❌ Budget Shortage'}
${feasibility.trainersAvailable ? '✅ Trainers Available' : '❌ Trainers Shortage'}
${feasibility.venuesAvailable ? '✅ Venues Available' : '❌ Venues Shortage'}
        `.trim();
    }

    // Demo method to show sample outputs
    runDemo() {
        console.log("=== DISASTER MANAGEMENT MODEL DEMO ===\n");
        
        this.sampleScenarios.forEach((scenario, index) => {
            console.log(`🎬 SCENARIO ${index + 1}:`);
            const output = this.generateTrainingOutput(
                scenario.location,
                scenario.disasterType,
                scenario.timeUntilDisaster,
                scenario.populationAtRisk,
                scenario.currentlyTrained
            );
            console.log(output);
            console.log("\n" + "=".repeat(80) + "\n");
        });
    }

    // Method to generate HTML output for web interface
    generateHTMLOutput(location, disasterType, timeUntilDisaster, populationAtRisk, currentlyTrained) {
        const output = this.generateTrainingOutput(location, disasterType, timeUntilDisaster, populationAtRisk, currentlyTrained);
        
        return `
        <div class="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500">
            <div class="flex items-start justify-between mb-6">
                <div>
                    <div class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        URGENT TRAINING REQUIRED
                    </div>
                    <h3 class="font-display text-2xl font-bold mb-2">${location}</h3>
                    <p class="text-gray-600">${disasterType.toUpperCase()} • High Severity • ${timeUntilDisaster} days remaining</p>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-500">Priority Level</div>
                    <div class="text-lg font-bold text-red-600">CRITICAL</div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h4 class="font-semibold text-lg mb-4">Current Status</h4>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Population at Risk:</span>
                            <span class="font-medium">${populationAtRisk.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Currently Trained:</span>
                            <span class="font-medium">${currentlyTrained.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Required Trained:</span>
                            <span class="font-medium">${Math.ceil(populationAtRisk / this.trainingStandards[disasterType].coverageRatio).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Training Gap:</span>
                            <span class="font-medium text-red-600">${(Math.ceil(populationAtRisk / this.trainingStandards[disasterType].coverageRatio) - currentlyTrained).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold text-lg mb-4">Recommended Actions</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Schedule 14 training sessions (50 people each)
                        </div>
                        <div class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Duration: 2 days per session
                        </div>
                        <div class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Focus: Flood rescue, evacuation, first aid
                        </div>
                        <div class="flex items-center">
                            <span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Start within 3 days
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 class="font-semibold text-lg mb-4">Resource Requirements</h4>
                <div class="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Total Budget:</span>
                            <span class="font-medium">₹${(Math.ceil(populationAtRisk / this.trainingStandards[disasterType].coverageRatio) * this.resourceRequirements.budgetPerTrainee).toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Trainers Needed:</span>
                            <span class="font-medium">${Math.ceil((Math.ceil(populationAtRisk / this.trainingStandards[disasterType].coverageRatio) * this.resourceRequirements.trainerCapacity) / 2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Venues Needed:</span>
                            <span class="font-medium">${Math.ceil((Math.ceil(populationAtRisk / this.trainingStandards[disasterType].coverageRatio) * this.resourceRequirements.venueCapacity) / 50)}</span>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Training Materials:</span>
                            <span class="font-medium">700 kits</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Life Jackets:</span>
                            <span class="font-medium">50 units</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Rescue Ropes:</span>
                            <span class="font-medium">20 units</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6 mb-6">
                <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">35%</div>
                    <div class="text-sm text-gray-600">Expected Casualty Reduction</div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">60%</div>
                    <div class="text-sm text-gray-600">Response Time Improvement</div>
                </div>
                <div class="text-center p-4 bg-orange-50 rounded-lg">
                    <div class="text-2xl font-bold text-orange-600">85%</div>
                    <div class="text-sm text-gray-600">Community Preparedness</div>
                </div>
            </div>
            
            <div class="flex space-x-4">
                <button class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Approve & Schedule Training
                </button>
                <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Modify Plan
                </button>
                <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Export PDF
                </button>
            </div>
        </div>
        `;
    }
}

// Initialize the model and make it available globally
window.DisasterManagementModel = new DisasterManagementModel();