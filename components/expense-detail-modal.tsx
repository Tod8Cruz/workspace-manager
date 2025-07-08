"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Receipt, Check, AlertCircle, Eye } from "lucide-react"
import { mockEmployees } from "@/app/page"

interface ExpenseDetailModalProps {
  expense: any
  onClose: () => void
  onApprove: () => void
  onReject: (reason: string) => void
}

export function ExpenseDetailModal({ expense, onClose, onApprove, onReject }: ExpenseDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  const employee = mockEmployees.find((emp) => emp.id === expense.employeeId)

  if (!employee) return null

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

  const getCategoryColor = (category: string) => {
    const colors = {
      Meals: "bg-orange-100 text-orange-800",
      Transportation: "bg-blue-100 text-blue-800",
      Software: "bg-purple-100 text-purple-800",
      "Office Supplies": "bg-green-100 text-green-800",
      Travel: "bg-red-100 text-red-800",
      Equipment: "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Expense Claim Details
              </CardTitle>
              <CardDescription>Review expense claim information</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee and Status Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-3">Employee Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Name:</strong> {employee.name}
                </div>
                <div>
                  <strong>Role:</strong>{" "}
                  <Badge variant={employee.role === "Engineer" ? "default" : "secondary"}>{employee.role}</Badge>
                </div>
                <div>
                  <strong>Project:</strong>{" "}
                  <Badge className={getProjectColor(employee.project)}>{employee.project}</Badge>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-3">Claim Status</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant={
                      expense.status === "approved"
                        ? "default"
                        : expense.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {expense.status}
                  </Badge>
                </div>
                <div>
                  <strong>Submitted:</strong> {new Date(expense.requestDate).toLocaleDateString()}
                </div>
                {expense.approvedDate && (
                  <div>
                    <strong>Approved:</strong> {new Date(expense.approvedDate).toLocaleDateString()}
                  </div>
                )}
                {expense.rejectedDate && (
                  <div>
                    <strong>Rejected:</strong> {new Date(expense.rejectedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expense Details */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Expense Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Amount:</strong> {expense.currency} {expense.amount.toFixed(2)}
              </div>
              <div>
                <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Category:</strong>{" "}
                <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
              </div>
              <div>
                <strong>Project Code:</strong> {expense.projectCode}
              </div>
            </div>
            <div className="mt-3">
              <strong>Description:</strong>
              <p className="mt-1 text-muted-foreground">{expense.description}</p>
            </div>
          </div>

          {/* Receipt */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Receipt</h4>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-white rounded border flex items-center justify-center">
                <img
                  src={expense.receiptUrl || "/placeholder.svg"}
                  alt="Receipt"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling.style.display = "flex"
                  }}
                />
                <div className="hidden items-center justify-center text-muted-foreground">
                  <Receipt className="w-8 h-8" />
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Eye className="w-4 h-4" />
                  View Receipt
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Click to view full receipt</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {expense.status === "rejected" && expense.rejectionReason && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Rejection Reason</h4>
                  <p className="text-sm text-red-800 mt-1">{expense.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {expense.status === "pending" && (
            <div className="space-y-4">
              {!showRejectForm ? (
                <div className="flex gap-2">
                  <Button onClick={onApprove} className="flex-1 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Approve Claim
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject Claim
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Please provide a reason for rejecting this claim..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectForm(false)
                        setRejectionReason("")
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                      className="flex-1"
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {expense.status !== "pending" && (
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
