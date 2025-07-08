"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Calendar, Users, AlertCircle, Clock } from "lucide-react"
import { mockEmployees } from "@/app/page"

interface ScheduleChangeFormProps {
  onClose: () => void
  employeeId: number
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function ScheduleChangeForm({ onClose, employeeId }: ScheduleChangeFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
  const [effectiveDate, setEffectiveDate] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const employee = mockEmployees.find((emp) => emp.id === employeeId)

  if (!employee) return null

  // Get employees working on the same projects
  const projectColleagues = mockEmployees.filter(
    (emp) => emp.id !== employee.id && emp.projects.some((project) => employee.projects.includes(project)),
  )

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

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const hasChanges = () => {
    const currentDays = employee.baseSchedule.days.sort().join(",")
    const newDays = selectedDays.sort().join(",")
    return currentDays !== newDays
  }

  const canSubmit = selectedDays.length > 0 && effectiveDate && reason.trim() && hasChanges()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const scheduleChangeRequest = {
      employeeId,
      currentSchedule: {
        days: employee.baseSchedule.days,
        hours: employee.baseSchedule.hours,
        timezone: employee.baseSchedule.timezone,
      },
      requestedSchedule: {
        days: selectedDays,
        hours: "8:00 AM - 5:00 PM", // Fixed hours
        timezone: "Jakarta Time", // Fixed timezone
      },
      reason,
      effectiveDate,
      requestDate: new Date().toISOString(),
      status: "pending",
    }

    console.log("Schedule change request submitted:", scheduleChangeRequest)

    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Request Schedule Change
              </CardTitle>
              <CardDescription>Submit a request to change your working days</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Schedule Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Current Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Projects</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {employee.projects.map((project) => (
                    <Badge key={project} className={getProjectColor(project)}>
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Role</div>
                <Badge variant={employee.role === "Engineer" ? "default" : "secondary"}>{employee.role}</Badge>
              </div>
              <div>
                <div className="text-muted-foreground">Working Days</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {employee.baseSchedule.days.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Working Hours</div>
                <div className="mt-1">{employee.baseSchedule.hours}</div>
                <div className="text-xs text-muted-foreground">{employee.baseSchedule.timezone}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fixed Schedule Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Standard Working Hours</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Working hours remain fixed at 8:00 AM - 5:00 PM Jakarta Time. You can only change working days.
                  </p>
                </div>
              </div>
            </div>

            {/* Working Days Selection */}
            <div className="space-y-3">
              <Label>New Working Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="text-sm font-normal cursor-pointer">
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Preview New Schedule */}
            {selectedDays.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">New Schedule Preview</h4>
                <div className="text-sm text-green-800 space-y-2">
                  <div>
                    <strong>Working Days:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDays.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Working Hours:</strong> 8:00 AM - 5:00 PM Jakarta Time
                  </div>
                </div>
              </div>
            )}

            {/* Effective Date */}
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Change</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you need to change your working days..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Project Impact Notice */}
            {projectColleagues.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Project Impact</h4>
                  <p className="text-sm text-orange-800 mt-1">
                    Your colleagues working on the same projects ({projectColleagues.map((c) => c.name).join(", ")})
                    will be notified if this change is approved.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {employee.projects.map((project) => (
                      <Badge key={project} className={getProjectColor(project)} variant="outline">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {projectColleagues.length === 0 && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Solo Projects</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    You're currently the only person working on your assigned projects.
                  </p>
                </div>
              </div>
            )}

            {!hasChanges() && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">No changes detected from your current schedule</span>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
