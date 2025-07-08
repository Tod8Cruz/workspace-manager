"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Clock, DollarSign } from "lucide-react"
import { mockEmployees } from "@/app/page"

interface TimeLogFormProps {
  onClose: () => void
  employeeId: number
}

export function TimeLogForm({ onClose, employeeId }: TimeLogFormProps) {
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [project, setProject] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const employee = mockEmployees.find((emp) => emp.id === employeeId)

  if (!employee || employee.employmentType !== "Part-time") return null

  const calculateHours = () => {
    if (!startTime || !endTime) return 0
    const start = new Date(`2024-01-01T${startTime}:00`)
    const end = new Date(`2024-01-01T${endTime}:00`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    return Math.max(0, diffHours)
  }

  const hours = calculateHours()
  const estimatedEarnings = hours * (employee.hourlyRate || 0)

  const canSubmit = date && startTime && endTime && project && description.trim() && hours > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const timeLog = {
      employeeId,
      date,
      startTime,
      endTime,
      hours,
      description,
      project,
      status: "submitted",
      submittedDate: new Date().toISOString(),
      estimatedEarnings,
    }

    console.log("Time log submitted:", timeLog)

    setIsSubmitting(false)
    onClose()
  }

  // Get project color for badges
  const getProjectColor = (project: string) => {
    const colors = {
      KNS: "bg-blue-100 text-blue-800",
      dispatch: "bg-green-100 text-green-800",
      gsfm: "bg-purple-100 text-purple-800",
      amass: "bg-orange-100 text-orange-800",
      enerbuild: "bg-red-100 text-red-800",
      deepskill: "bg-indigo-100 text-indigo-800",
    }
    return colors[project] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Log Working Hours
              </CardTitle>
              <CardDescription>Track your time for project work</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Time Log Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Employee</div>
                <div className="font-medium">{employee.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Employment Type</div>
                <Badge variant="secondary">{employee.employmentType}</Badge>
              </div>
              <div>
                <div className="text-muted-foreground">Hourly Rate</div>
                <div className="font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {employee.hourlyRate}/hour
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Work Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  min={startTime}
                  required
                />
              </div>
            </div>

            {/* Hours and Earnings Display */}
            {hours > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{hours.toFixed(1)}</div>
                  <div className="text-sm text-blue-800">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${estimatedEarnings.toFixed(2)}</div>
                  <div className="text-sm text-green-800">Estimated Earnings</div>
                </div>
              </div>
            )}

            {/* Project */}
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {employee.projects.map((proj) => (
                    <SelectItem key={proj} value={proj}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getProjectColor(proj).split(" ")[0]}`} />
                        {proj}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Work Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the work you completed during this time..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Summary */}
            {project && hours > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Time Log Summary</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Time:</strong> {startTime} - {endTime} ({hours.toFixed(1)} hours)
                  </div>
                  <div>
                    <strong>Project:</strong>{" "}
                    <Badge className={getProjectColor(project)} variant="outline">
                      {project}
                    </Badge>
                  </div>
                  <div>
                    <strong>Estimated Earnings:</strong> ${estimatedEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Time Log"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
