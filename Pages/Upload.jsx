import React, { useState, useCallback } from "react";
import { Dataset } from "@/entities/Dataset";
import { ExtractDataFromUploadedFile, UploadFile } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    baseline_value: "",
    cost_per_unit: "",
    total_volume: "",
    clinician_hours_per_unit: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const { file_url } = await UploadFile({ file });
      setUploadedFile({ name: file.name, url: file_url });
      
      // Try to extract data if it's a CSV
      if (file.name.endsWith('.csv')) {
        const result = await ExtractDataFromUploadedFile({
          file_url,
          json_schema: {
            type: "object",
            properties: {
              total_volume: { type: "number" },
              cost_per_unit: { type: "number" },
              baseline_value: { type: "number" },
              clinician_hours_per_unit: { type: "number" }
            }
          }
        });
        
        if (result.status === "success") {
          setExtractedData(result.output);
          setFormData(prev => ({ ...prev, ...result.output }));
        }
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      await Dataset.create({
        ...formData,
        file_url: uploadedFile?.url,
        baseline_value: parseFloat(formData.baseline_value) || 0,
        cost_per_unit: parseFloat(formData.cost_per_unit) || 0,
        total_volume: parseFloat(formData.total_volume) || 0,
        clinician_hours_per_unit: parseFloat(formData.clinician_hours_per_unit) || 0
      });
      
      setSuccess(true);
      setFormData({
        name: "",
        type: "",
        baseline_value: "",
        cost_per_unit: "",
        total_volume: "",
        clinician_hours_per_unit: ""
      });
      setUploadedFile(null);
      setExtractedData(null);
    } catch (err) {
      setError("Failed to save dataset. Please try again.");
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Upload Health Dataset</h1>
          <p className="text-xl text-slate-600">
            Add your data to improve calculation accuracy
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Dataset uploaded successfully! You can now use it in the analytics tool.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Drop your dataset here
                </p>
                <p className="text-slate-500 mb-4">or</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Choose File"}
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                  Supports CSV, Excel files
                </p>
              </div>

              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">{uploadedFile.name}</span>
                  </div>
                  {extractedData && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Data automatically extracted
                    </Badge>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Dataset Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Dataset Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Auckland DNA Data 2024"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Health Metric Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNA">DNA (Did Not Attend)</SelectItem>
                      <SelectItem value="ASH">ASH (Ambulatory Sensitive Hospitalisations)</SelectItem>
                      <SelectItem value="NZePS">NZePS (NZ e-Prescription Service)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total_volume">Total Annual Volume</Label>
                    <Input
                      id="total_volume"
                      type="number"
                      value={formData.total_volume}
                      onChange={(e) => setFormData(prev => ({ ...prev, total_volume: e.target.value }))}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_per_unit">Cost per Unit (NZD)</Label>
                    <Input
                      id="cost_per_unit"
                      type="number"
                      step="0.01"
                      value={formData.cost_per_unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_per_unit: e.target.value }))}
                      placeholder="150.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseline_value">Current Baseline (%)</Label>
                    <Input
                      id="baseline_value"
                      type="number"
                      value={formData.baseline_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, baseline_value: e.target.value }))}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clinician_hours_per_unit">Clinician Hours per Unit</Label>
                    <Input
                      id="clinician_hours_per_unit"
                      type="number"
                      step="0.1"
                      value={formData.clinician_hours_per_unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, clinician_hours_per_unit: e.target.value }))}
                      placeholder="0.5"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing || !formData.name || !formData.type}
                >
                  {isProcessing ? "Saving..." : "Save Dataset"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}