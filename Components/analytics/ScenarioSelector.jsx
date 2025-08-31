import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { UserX, Building2, Pill, ArrowRight } from "lucide-react";

const scenarios = [
  {
    id: "DNA",
    title: "DNA",
    subtitle: "Did Not Attend",
    description: "Reduce missed appointments across primary care",
    icon: UserX,
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "ASH",
    title: "ASH",
    subtitle: "Ambulatory Sensitive Hospitalisations",
    description: "Prevent avoidable hospital admissions",
    icon: Building2,
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    id: "NZePS",
    title: "NZePS",
    subtitle: "NZ e-Prescription Service",
    description: "Increase electronic prescription uptake",
    icon: Pill,
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  }
];

export default function ScenarioSelector({ selectedScenario, onScenarioSelect }) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-blue-600">1</span>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900">
          Choose Your Health Scenario
        </CardTitle>
        <p className="text-slate-600">
          Select a health metric to analyze potential improvements and savings
        </p>
      </CardHeader>
      
      <CardContent className="pb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 rounded-xl p-6 text-center ${
                  selectedScenario === scenario.id
                    ? `${scenario.borderColor} ${scenario.bgColor} shadow-lg`
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
                onClick={() => onScenarioSelect(scenario.id)}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${scenario.color} flex items-center justify-center shadow-lg`}>
                  <scenario.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {scenario.title}
                  </h3>
                  <Badge variant="outline" className="text-xs font-medium">
                    {scenario.subtitle}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {scenario.description}
                </p>
                
                {selectedScenario === scenario.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center justify-center gap-2"
                  >
                    <Badge className={`${scenario.color} text-white`}>
                      Selected
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}