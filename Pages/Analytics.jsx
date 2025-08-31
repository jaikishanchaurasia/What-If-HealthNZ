
import React, { useState, useEffect, useCallback } from "react";
import { Dataset } from "@/entities/Dataset";
import { motion, AnimatePresence } from "framer-motion";

import ScenarioSelector from "../components/analytics/ScenarioSelector";
import SliderCard from "../components/analytics/SliderCard";
import ResultsCard from "../components/analytics/ResultsCard";

export default function AnalyticsPage() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [sliderValue, setSliderValue] = useState([0]);
  const [datasets, setDatasets] = useState([]);
  const [calculations, setCalculations] = useState(null);

  const getScenarioData = useCallback(() => {
    const defaults = {
      DNA: { total_volume: 200000, cost_per_unit: 83.33, clinician_hours_per_unit: 0.33335 },
      ASH: { total_volume: 10000, cost_per_unit: 1072, clinician_hours_per_unit: 1.675 },
      NZePS: { total_volume: 1000000, cost_per_unit: 13.33, clinician_hours_per_unit: 0.1667 }
    };

    const dataset = datasets.find(d => d.type === selectedScenario);
    return dataset || defaults[selectedScenario] || defaults.DNA;
  }, [datasets, selectedScenario]);

  const calculateResults = useCallback(() => {
    if (!selectedScenario || sliderValue[0] === 0) return;
    
    const scenarioData = getScenarioData();
    const improvement = sliderValue[0] / 100;
    
    const currentCost = scenarioData.total_volume * scenarioData.cost_per_unit;
    const potentialSavings = currentCost * improvement;
    const unitsSaved = scenarioData.total_volume * improvement;
    const hoursReclaimed = unitsSaved * scenarioData.clinician_hours_per_unit;

    setCalculations({
      estimatedSavings: potentialSavings,
      unitsSaved: unitsSaved,
      hoursReclaimed: hoursReclaimed,
      percentage: sliderValue[0],
      scenario: selectedScenario
    });
  }, [selectedScenario, sliderValue, getScenarioData]);

  useEffect(() => {
    loadDatasets();
  }, []);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const loadDatasets = async () => {
    const data = await Dataset.list();
    setDatasets(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What-If Health Analytics
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore the potential impact of healthcare improvements across New Zealand's health system
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Scenario Selection */}
          <ScenarioSelector 
            selectedScenario={selectedScenario}
            onScenarioSelect={setSelectedScenario}
          />

          {/* Step 2: Slider Card */}
          <AnimatePresence mode="wait">
            {selectedScenario && (
              <SliderCard
                selectedScenario={selectedScenario}
                sliderValue={sliderValue}
                onSliderChange={setSliderValue}
              />
            )}
          </AnimatePresence>

          {/* Step 3: Results and Recommendations */}
          <AnimatePresence mode="wait">
            {calculations && sliderValue[0] > 0 && (
              <ResultsCard calculations={calculations} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
