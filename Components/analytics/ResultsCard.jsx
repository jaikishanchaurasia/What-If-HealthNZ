import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { DollarSign, Calendar, Clock, TrendingUp, Target, Lightbulb, Users, Settings, Zap } from "lucide-react";

const getRecommendations = (scenario) => {
  const baseRecommendations = {
    DNA: [
      {
        title: "SMS Reminder System",
        impact: 85,
        effort: 30,
        description: "Implement automated SMS reminders 24-48 hours before appointments",
        icon: Settings,
        category: "Technology"
      },
      {
        title: "Flexible Booking Platform", 
        impact: 70,
        effort: 50,
        description: "Online booking system with easy rescheduling options",
        icon: Zap,
        category: "Digital"
      },
      {
        title: "Patient Education Program",
        impact: 60,
        effort: 40,
        description: "Educational campaigns about appointment importance",
        icon: Users,
        category: "Education"
      }
    ],
    ASH: [
      {
        title: "Primary Care Integration",
        impact: 90,
        effort: 70,
        description: "Enhanced primary care access and follow-up systems",
        icon: Users,
        category: "Care Model"
      },
      {
        title: "Chronic Disease Management",
        impact: 80,
        effort: 60,
        description: "Proactive monitoring and management programs",
        icon: Target,
        category: "Clinical"
      },
      {
        title: "Community Health Hubs",
        impact: 75,
        effort: 80,
        description: "Local health centers for preventive care",
        icon: Settings,
        category: "Infrastructure"
      }
    ],
    NZePS: [
      {
        title: "Provider Training Program",
        impact: 85,
        effort: 40,
        description: "Comprehensive e-prescription training for healthcare providers",
        icon: Users,
        category: "Training"
      },
      {
        title: "System Integration",
        impact: 90,
        effort: 60,
        description: "Seamless integration with existing practice management systems",
        icon: Zap,
        category: "Technology"
      },
      {
        title: "Patient Portal Development",
        impact: 70,
        effort: 50,
        description: "Patient-facing portal for prescription management",
        icon: Settings,
        category: "Digital"
      }
    ]
  };

  const recs = baseRecommendations[scenario] || [];
  return recs.sort((a, b) => (b.impact / b.effort) - (a.impact / a.effort));
};

export default function ResultsCard({ calculations }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-NZ').format(Math.round(num));
  };

  const getUnitLabel = () => {
    switch (calculations.scenario) {
      case 'DNA': return 'appointments';
      case 'ASH': return 'admissions';
      case 'NZePS': return 'prescriptions';
      default: return 'units';
    }
  };

  const recommendations = getRecommendations(calculations.scenario);

  const getImpactColor = (impact) => {
    if (impact >= 80) return "text-green-600 bg-green-50";
    if (impact >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getEffortColor = (effort) => {
    if (effort <= 40) return "text-green-600";
    if (effort <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const results = [
    {
      title: "Estimated NZD Savings",
      value: formatCurrency(calculations.estimatedSavings),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: `${calculations.percentage}% improvement`
    },
    {
      title: `${getUnitLabel().charAt(0).toUpperCase() + getUnitLabel().slice(1)} Saved`,
      value: formatNumber(calculations.unitsSaved),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: `${formatNumber(calculations.unitsSaved)} ${getUnitLabel()} annually`
    },
    {
      title: "Clinician Hours Reclaimed",
      value: formatNumber(calculations.hoursReclaimed),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: `${Math.round(calculations.hoursReclaimed / 40)} weeks equivalent`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">3</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Estimated Impact & Recommendations
          </CardTitle>
          <p className="text-slate-600">
            Projected savings and strategic recommendations for implementation
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Results Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Estimated Savings
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <motion.div
                  key={result.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${result.bgColor}`}>
                        <result.icon className={`w-6 h-6 ${result.color}`} />
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${result.color} mb-2`}>
                      {result.value}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      {result.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {result.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Strategic Recommendations
              <Badge className="ml-2 bg-yellow-100 text-yellow-800">Auto-ranked</Badge>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <rec.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {rec.title}
                        </h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {rec.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-blue-600">#{index + 1}</div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 mb-3">
                    {rec.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Impact</span>
                      <span className={`font-medium px-2 py-1 rounded ${getImpactColor(rec.impact)}`}>
                        {rec.impact}%
                      </span>
                    </div>
                    <Progress value={rec.impact} className="h-1" />
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Effort</span>
                      <span className={`font-medium ${getEffortColor(rec.effort)}`}>
                        {rec.effort}%
                      </span>
                    </div>
                    <Progress value={rec.effort} className="h-1" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900">
                  Estimated ROI Impact
                </span>
              </div>
              <p className="text-blue-800">
                Implementing the top-ranked recommendations could unlock up to{" "}
                <span className="font-bold">
                  {formatCurrency(calculations.estimatedSavings * 1.2)}
                </span>{" "}
                in additional annual savings beyond the {calculations.percentage}% base improvement.
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}