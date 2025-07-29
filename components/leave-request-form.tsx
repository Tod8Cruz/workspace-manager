"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, AlertCircle } from "lucide-react"
import { mockEmployees, calculateLeaveBalance, mockLeaveRequests } from "@/app/page"
import { formatDate } from "@/lib/utils"

interface LeaveRequestFormProps {
  onClose: () => void
  employeeId: number
  preselectedDate?: string | null
}

export function LeaveRequestForm({ onClose, employeeId, preselectedDate }: LeaveRequestFormProps) {
  const [startDate, setStartDate] = useState(preselectedDate || "")
  const [endDate, setEndDate] = useState(preselectedDate || "")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const employee = mockEmployees.find((emp) => emp.id === employeeId)

  if (!employee) return null

  const usedDays = mockLeaveRequests
    .filter((req) => req.employeeId === employeeId && req.status === "approved")
    .reduce((total, req) => total + req.days, 0)

  const balance = calculateLeaveBalance(
    employee.contractDate,
    employee.contractEndDate,
    usedDays,
    employee.leaveExtension,
  )

  // Calculate requested days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const requestedDays = calculateDays()
  const canSubmit = startDate && endDate && reason.trim() && requestedDays <= balance.available && !balance.isExpired

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would submit to your API here
    console.log("Leave request submitted:", {
      employeeId,
      startDate,
      endDate,
      days: requestedDays,
      reason,
    })

    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Request Leave
              </CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Leave Balance Info */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Available Leave Days</span>
              <Badge variant={balance.isExpired ? "destructive" : balance.available > 5 ? "default" : "destructive"}>
                {balance.available} days
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Earned: {balance.earned} • Used: {balance.used}
            </div>

            {balance.isExpired && (
              <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                <AlertCircle className="w-3 h-3" />
                <span>Leave has expired (Contract ended: {formatDate(balance.contractEndDate)})</span>
              </div>
            )}

            {balance.hasExtension && (
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <span>Extended until: {formatDate(balance.effectiveEndDate)}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  required
                />
              </div>
            </div>

            {requestedDays > 0 && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Requested Days:</span>
                <Badge variant="outline">{requestedDays} days</Badge>
              </div>
            )}

            {balance.isExpired && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Cannot request leave - your leave allocation has expired</span>
              </div>
            )}

            {requestedDays > balance.available && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Insufficient leave balance</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

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
