"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, FileText, Upload, Download, Calendar } from "lucide-react"

interface ContractUploadFormProps {
  employee: any
  onClose: () => void
  onSave: (employee: any) => void
}

export function ContractUploadForm({ employee, onClose, onSave }: ContractUploadFormProps) {
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [newEndDate, setNewEndDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setContractFile(file)
    }
  }

  const calculateNewEmploymentMonths = () => {
    if (!newEndDate) return 0
    const start = new Date(employee.contractDate)
    const end = new Date(newEndDate)
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contractFile || !newEndDate) return

    setIsSubmitting(true)

    // Simulate API call for file upload
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const updatedEmployee = {
      ...employee,
      contractEndDate: newEndDate,
      contractPdf: URL.createObjectURL(contractFile), // In real app, this would be a server URL
      contractUpdatedDate: new Date().toISOString(),
    }

    onSave(updatedEmployee)
  }

  const downloadCurrentContract = () => {
    // In a real app, this would download the actual contract PDF
    console.log("Downloading contract for", employee.name)
  }

  const currentEndDate = new Date(employee.contractEndDate)
  const newEndDateObj = newEndDate ? new Date(newEndDate) : null
  const isExtension = newEndDateObj && newEndDateObj > currentEndDate

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contract Management
              </CardTitle>
              <CardDescription>Upload new contract and update employment terms for {employee.name}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Contract Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Current Contract</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Contract Period</div>
                <div>
                  {new Date(employee.contractDate).toLocaleDateString()} - {currentEndDate.toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Employment Duration</div>
                <div>
                  {Math.floor(
                    (new Date().getTime() - new Date(employee.contractDate).getTime()) / (1000 * 60 * 60 * 24 * 30),
                  )}{" "}
                  months
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCurrentContract}
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                Download Current Contract
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Contract Upload */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload New Contract
              </h4>

              <div className="space-y-2">
                <Label htmlFor="contract">Contract PDF</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div className="mt-4">
                      <Label htmlFor="contract" className="cursor-pointer">
                        <span className="text-sm font-medium text-primary hover:text-primary/80">
                          Click to upload contract
                        </span>
                        <Input
                          id="contract"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          required
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">PDF files only, up to 10MB</p>
                    </div>
                    {contractFile && (
                      <div className="mt-4 p-2 bg-green-50 rounded text-sm text-green-700">
                        ✓ {contractFile.name} uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* New Contract End Date */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Contract Terms
              </h4>

              <div className="space-y-2">
                <Label htmlFor="newEndDate">New Contract End Date</Label>
                <Input
                  id="newEndDate"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {newEndDate && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Contract Update Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>
                      <strong>Current End Date:</strong> {currentEndDate.toLocaleDateString()}
                    </div>
                    <div>
                      <strong>New End Date:</strong> {new Date(newEndDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Total Employment Duration:</strong> {calculateNewEmploymentMonths()} months
                    </div>
                    <div>
                      <Badge variant={isExtension ? "default" : "secondary"}>
                        {isExtension ? "Contract Extension" : "Contract Update"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Uploading a new contract will automatically update the employee's employment duration</li>
                <li>• Leave balance calculations will be recalculated based on the new contract period</li>
                <li>• The previous contract will be archived and remain accessible</li>
                <li>• Employee will be notified of the contract update</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={!contractFile || !newEndDate || isSubmitting} className="flex-1">
                {isSubmitting ? "Uploading..." : "Upload Contract & Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
