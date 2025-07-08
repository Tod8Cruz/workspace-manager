"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Calendar, AlertTriangle, Clock } from "lucide-react"
import { calculateLeaveBalance } from "@/app/page"

interface LeaveExtensionFormProps {
  employee: any
  onClose: () => void
}

export function LeaveExtensionForm({ employee, onClose }: LeaveExtensionFormProps) {
  const [extendedUntil, setExtendedUntil] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate current balance
  const currentBalance = calculateLeaveBalance(
    employee.contractDate,
    employee.contractEndDate,
    0, // We'll assume 0 used for this demo
    employee.leaveExtension,
  )

  const contractEndDate = new Date(employee.contractEndDate)
  const today = new Date()
  const isContractExpired = today > contractEndDate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!extendedUntil || !reason.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would update the employee record
    console.log("Leave extension submitted:", {
      employeeId: employee.id,
      extendedUntil,
      reason,
      approvedBy: "Current Admin",
      approvedDate: new Date().toISOString(),
    })

    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Manage Leave Extension
              </CardTitle>
              <CardDescription>Extend leave availability for {employee.name}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Employee Info */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{employee.name}</span>
              <Badge variant="outline">{employee.department}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Contract Start</div>
                <div>{new Date(employee.contractDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Contract End</div>
                <div className={isContractExpired ? "text-destructive font-medium" : ""}>
                  {contractEndDate.toLocaleDateString()}
                </div>
              </div>
            </div>

            {isContractExpired && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Contract has expired</span>
              </div>
            )}

            {currentBalance.hasExtension && (
              <div className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded text-sm">
                <Clock className="w-4 h-4" />
                <div>
                  <div>Currently extended until: {currentBalance.effectiveEndDate.toLocaleDateString()}</div>
                  <div className="text-xs opacity-75">Reason: {currentBalance.extension?.reason}</div>
                </div>
              </div>
            )}
          </div>

          {/* Current Leave Status */}
          <div className="grid grid-cols-3 gap-4 text-center p-4 bg-muted rounded-lg">
            <div>
              <div className="text-lg font-bold text-green-600">{currentBalance.earned}</div>
              <div className="text-xs text-muted-foreground">Days Earned</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">{currentBalance.used}</div>
              <div className="text-xs text-muted-foreground">Days Used</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${currentBalance.isExpired ? "text-destructive" : "text-blue-600"}`}>
                {currentBalance.available}
              </div>
              <div className="text-xs text-muted-foreground">{currentBalance.isExpired ? "Expired" : "Available"}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extendedUntil">Extend Leave Until</Label>
              <Input
                id="extendedUntil"
                type="date"
                value={extendedUntil}
                onChange={(e) => setExtendedUntil(e.target.value)}
                min={contractEndDate.toISOString().split("T")[0]}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be after the contract end date ({contractEndDate.toLocaleDateString()})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Extension</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Contract renewal under discussion, Project completion, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {extendedUntil && (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <div className="font-medium">Extension Summary:</div>
                <div>Leave will be available until: {new Date(extendedUntil).toLocaleDateString()}</div>
                <div>
                  Additional months:{" "}
                  {Math.ceil(
                    (new Date(extendedUntil).getTime() - contractEndDate.getTime()) / (30 * 24 * 60 * 60 * 1000),
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={!extendedUntil || !reason.trim() || isSubmitting} className="flex-1">
                {isSubmitting ? "Saving..." : currentBalance.hasExtension ? "Update Extension" : "Grant Extension"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
