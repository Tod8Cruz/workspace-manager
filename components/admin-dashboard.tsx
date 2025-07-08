"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Calendar, Receipt, Eye, List } from "lucide-react"
import {
  mockEmployees,
  mockLeaveRequests,
  mockScheduleRequests,
  mockProjectNotifications,
  mockExpenseClaims,
} from "@/app/page"
import { LeaveExtensionForm } from "@/components/leave-extension-form"
import { ExpenseDetailModal } from "@/components/expense-detail-modal"
import { LeaveCalendar } from "@/components/leave-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminDashboard() {
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests)
  const [scheduleRequests, setScheduleRequests] = useState(mockScheduleRequests)
  const [projectNotifications, setProjectNotifications] = useState(mockProjectNotifications)
  const [showExtensionForm, setShowExtensionForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [expenseClaims, setExpenseClaims] = useState(mockExpenseClaims)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [showExpenseDetail, setShowExpenseDetail] = useState(false)

  const handleApproveRequest = (requestId: number) => {
    setLeaveRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" } : req)))
  }

  const handleRejectRequest = (requestId: number) => {
    setLeaveRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))
  }

  const handleApproveScheduleRequest = (requestId: number) => {
    const request = scheduleRequests.find((req) => req.id === requestId)
    if (!request) return

    setScheduleRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: "approved", approvedBy: "Admin", approvedDate: new Date().toISOString() }
          : req,
      ),
    )

    const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
    if (!employee) return

    const newNotification = {
      id: Date.now(),
      projects: employee.projects,
      message: `${employee.name}'s working days have been updated. New schedule: ${request.requestedSchedule.days.join(", ")}`,
      type: "schedule_change",
      employeeId: employee.id,
      date: new Date().toISOString(),
      read: false,
    }

    setProjectNotifications((prev) => [...prev, newNotification])
  }

  const handleRejectScheduleRequest = (requestId: number) => {
    setScheduleRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: "rejected", rejectedBy: "Admin", rejectedDate: new Date().toISOString() }
          : req,
      ),
    )
  }

  const handleApproveExpense = (expenseId: number) => {
    setExpenseClaims((prev) =>
      prev.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              status: "approved",
              approvedBy: "Finance Team",
              approvedDate: new Date().toISOString(),
            }
          : expense,
      ),
    )
  }

  const handleRejectExpense = (expenseId: number, reason: string) => {
    setExpenseClaims((prev) =>
      prev.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              status: "rejected",
              rejectedBy: "Finance Team",
              rejectedDate: new Date().toISOString(),
              rejectionReason: reason,
            }
          : expense,
      ),
    )
  }

  const getUsedDays = (employeeId: number) => {
    return leaveRequests
      .filter((req) => req.employeeId === employeeId && req.status === "approved")
      .reduce((total, req) => total + req.days, 0)
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

  return (
    <div className="space-y-6">
      {/* Pending Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Leave Requests
          </CardTitle>
          <CardDescription>Review and approve employee leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Leave Period</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => {
                    const employee = mockEmployees.find((emp) => emp.id === request.employeeId)
                    const startDate = new Date(request.startDate).toLocaleDateString()
                    const endDate = new Date(request.endDate).toLocaleDateString()

                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback>
                                {employee?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{employee?.name}</div>
                              <div className="text-sm text-muted-foreground">{employee?.role}</div>
                              <div className="text-xs text-muted-foreground font-mono">{employee?.bankAccount}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProjectColor(employee?.project)}>{employee?.project}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {startDate} - {endDate}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.days} days</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectRequest(request.id)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="calendar">
              <LeaveCalendar isAdminView={true} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Schedule Change Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Change Requests
          </CardTitle>
          <CardDescription>Review and approve employee schedule change requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Current Schedule</TableHead>
                <TableHead>Requested Schedule</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleRequests.map((request) => {
                const employee = mockEmployees.find((emp) => emp.id === request.employeeId)

                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>
                            {employee?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee?.name}</div>
                          <div className="text-sm text-muted-foreground">{employee?.role}</div>
                          <div className="text-xs text-muted-foreground font-mono">{employee?.bankAccount}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee?.projects.map((project) => (
                          <Badge key={project} className={getProjectColor(project)}>
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {request.currentSchedule.days.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{request.currentSchedule.hours}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {request.requestedSchedule.days.map((day) => (
                          <Badge key={day} variant="secondary" className="text-xs">
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{request.requestedSchedule.hours}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate">{request.reason}</div>
                    </TableCell>
                    <TableCell>{new Date(request.effectiveDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveScheduleRequest(request.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectScheduleRequest(request.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Claims */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Expense Claims
          </CardTitle>
          <CardDescription>Review and approve employee expense claims</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseClaims.map((claim) => {
                const employee = mockEmployees.find((emp) => emp.id === claim.employeeId)

                return (
                  <TableRow key={claim.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                          <AvatarFallback>
                            {employee?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee?.name}</div>
                          <Badge className={getProjectColor(claim.projectCode)} variant="outline">
                            {claim.projectCode}
                          </Badge>
                          <div className="text-xs text-muted-foreground font-mono">{employee?.bankAccount}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${claim.amount.toFixed(2)} {claim.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(claim.category)}>{claim.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{claim.description}</div>
                    </TableCell>
                    <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          claim.status === "approved"
                            ? "default"
                            : claim.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedExpense(claim)
                            setShowExpenseDetail(true)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {claim.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleApproveExpense(claim.id)} className="h-8 w-8 p-0">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectExpense(claim.id, "Requires additional documentation")}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Detail Modal */}
      {showExpenseDetail && selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          onClose={() => {
            setShowExpenseDetail(false)
            setSelectedExpense(null)
          }}
          onApprove={() => {
            handleApproveExpense(selectedExpense.id)
            setShowExpenseDetail(false)
            setSelectedExpense(null)
          }}
          onReject={(reason) => {
            handleRejectExpense(selectedExpense.id, reason)
            setShowExpenseDetail(false)
            setSelectedExpense(null)
          }}
        />
      )}

      {/* Extension form */}
      {showExtensionForm && selectedEmployee && (
        <LeaveExtensionForm
          employee={selectedEmployee}
          onClose={() => {
            setShowExtensionForm(false)
            setSelectedEmployee(null)
          }}
        />
      )}
    </div>
  )
}
