import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { TrendingUp, Target } from "lucide-react";

export default function SliderCard({ selectedScenario, sliderValue, onSliderChange }) {
  const getSliderConfig = () => {
    switch (selectedScenario) {
      case 'DNA':
        return { label: 'Reduce missed appointments', unit: '%', max: 100 };
      case 'ASH':
        return { label: 'Reduce avoidable admissions', unit: '%', max: 100 };
      case 'NZePS':
        return { label: 'Increase e‑prescription uptake', unit: 'pp', max: 100 };
      default:
        return { label: 'Improvement', unit: '%', max: 100 };
    }
  };

  const config = getSliderConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">2</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            {config.label}
          </CardTitle>
          <p className="text-slate-600">
            Adjust the slider to see potential impact on New Zealand's health system
          </p>
        </CardHeader>
        
        <CardContent className="pb-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full mb-6">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-6xl font-bold text-blue-600">
                  {sliderValue[0]}
                </span>
                <span className="text-2xl font-semibold text-blue-600">
                  {config.unit}
                </span>
              </div>
            </div>
            
            <div className="px-6">
              <Slider
                value={sliderValue}
                onValueChange={onSliderChange}
                max={config.max}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between text-sm text-slate-500 px-6">
              <span>0{config.unit}</span>
              <span>No Change</span>
              <span>Maximum Impact</span>
              <span>{config.max}{config.unit}</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mx-6">
              <p className="text-sm text-slate-600 text-center">
                <span className="font-semibold">Moving the slider above</span> will calculate 
                the estimated financial and operational impact on New Zealand's healthcare system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}