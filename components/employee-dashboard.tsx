"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, TrendingUp, AlertCircle, Receipt, Settings, Plus, List } from "lucide-react"
import {
  mockEmployees,
  mockLeaveRequests,
  calculateLeaveBalance,
  mockExpenseClaims,
  mockScheduleRequests,
} from "@/app/page"
import { ScheduleChangeForm } from "@/components/schedule-change-form"
import { ExpenseClaimForm } from "@/components/expense-claim-form"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { NotificationButton } from "@/components/notification-button"
import { LeaveCalendar } from "@/components/leave-calendar"

interface EmployeeDashboardProps {
  employeeId: number
}

export function EmployeeDashboard({ employeeId }: EmployeeDashboardProps) {
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [selectedLeaveDate, setSelectedLeaveDate] = useState<string | null>(null)

  const employee = mockEmployees.find((emp) => emp.id === employeeId)

  if (!employee) return null

  // Continue with full-time employee dashboard
  const employeeRequests = mockLeaveRequests.filter((req) => req.employeeId === employeeId)
  const employeeExpenses = mockExpenseClaims.filter((claim) => claim.employeeId === employeeId)
  const employeeScheduleRequests = mockScheduleRequests.filter((req) => req.employeeId === employeeId)

  const usedDays = employeeRequests
    .filter((req) => req.status === "approved")
    .reduce((total, req) => total + req.days, 0)

  const balance = calculateLeaveBalance(
    employee.contractDate,
    employee.contractEndDate,
    usedDays,
    employee.leaveExtension,
  )
  const usagePercentage = balance.earned > 0 ? (balance.used / balance.earned) * 100 : 0

  // Calculate months since contract
  const contractDate = new Date(employee.contractDate)
  const now = new Date()
  const monthsSinceContract =
    (now.getFullYear() - contractDate.getFullYear()) * 12 +
    (now.getMonth() - contractDate.getMonth()) +
    (now.getDate() >= contractDate.getDate() ? 1 : 0)

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

  const handleLeaveRequest = (date?: string) => {
    if (date) {
      setSelectedLeaveDate(date)
    }
    setShowLeaveForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Notifications */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Dashboard</h2>
          <p className="text-muted-foreground">Your personal workspace overview</p>
        </div>
        <NotificationButton />
      </div>

      {/* Employee Info & Leave Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                <AvatarFallback>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {employee.name}
            </CardTitle>
            <CardDescription>
              {employee.role} • {employee.projects.length} Project{employee.projects.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{employee.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Bank Account</div>
                <div className="font-medium font-mono">{employee.bankAccount}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Contract Date</div>
                <div className="font-medium">{new Date(employee.contractDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Months Employed</div>
                <div className="font-medium">{monthsSinceContract} months</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
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
            </div>

            {/* Working schedule section */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Working Schedule</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Days:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {employee.baseSchedule.days.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day.slice(0, 3)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Hours:</strong> {employee.baseSchedule.hours}
                </div>
                {employee.scheduleChanges && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                    <strong>Pending Change:</strong> {employee.scheduleChanges.requestedDays.join(", ")}
                    <div className="text-muted-foreground">Status: {employee.scheduleChanges.status}</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Leave Balance
                </CardTitle>
                <CardDescription>Your current leave day allocation</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => handleLeaveRequest()}
                className="flex items-center gap-1"
                disabled={balance.isExpired || balance.available === 0}
              >
                <Plus className="w-4 h-4" />
                Request
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{balance.earned}</div>
                <div className="text-sm text-muted-foreground">Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{balance.used}</div>
                <div className="text-sm text-muted-foreground">Used</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{balance.available}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage</span>
                <span>{usagePercentage.toFixed(0)}%</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>

            {/* Contract and Leave Expiration Info */}
            <div className="mt-4 p-3 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Contract End:</span>
                <span className={balance.isExpired ? "text-destructive font-medium" : ""}>
                  {balance.contractEndDate.toLocaleDateString()}
                </span>
              </div>

              {balance.hasExtension && (
                <div className="flex justify-between text-sm">
                  <span>Leave Extended Until:</span>
                  <span className="text-green-600 font-medium">{balance.effectiveEndDate.toLocaleDateString()}</span>
                </div>
              )}

              {balance.isExpired && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>Leave has expired</span>
                </div>
              )}

              {!balance.isExpired &&
                balance.effectiveEndDate.getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Leave expires soon</span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* My Requests - Combined View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Change Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Schedule Requests
                </CardTitle>
                <CardDescription>Your schedule change requests</CardDescription>
              </div>
              <Button onClick={() => setShowScheduleForm(true)} size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Request
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {employeeScheduleRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No schedule requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employeeScheduleRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Requested Days:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.requestedSchedule.days.map((day) => (
                            <Badge key={day} variant="secondary" className="text-xs">
                              {day.slice(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Reason:</strong> {request.reason}
                      </div>
                      <div>
                        <strong>Effective:</strong> {new Date(request.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Claims */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Expense Claims
                </CardTitle>
                <CardDescription>Your submitted expense claims</CardDescription>
              </div>
              <Button onClick={() => setShowExpenseForm(true)} size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Submit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {employeeExpenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No expense claims</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employeeExpenses.map((claim) => (
                  <div key={claim.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
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
                        <span className="font-medium">
                          ${claim.amount.toFixed(2)} {claim.currency}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(claim.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Category:</strong> {claim.category}
                      </div>
                      <div>
                        <strong>Description:</strong> {claim.description}
                      </div>
                      <div>
                        <strong>Project:</strong>
                        <Badge className={getProjectColor(claim.projectCode)} variant="outline" className="ml-1">
                          {claim.projectCode}
                        </Badge>
                      </div>
                      {claim.status === "rejected" && claim.rejectionReason && (
                        <div className="text-red-600">
                          <strong>Rejection Reason:</strong> {claim.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leave History with Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Leave Management
          </CardTitle>
          <CardDescription>View your leave requests in list or calendar format</CardDescription>
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

            <TabsContent value="list" className="space-y-4">
              {employeeRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No leave requests found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Period</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeRequests.map((request) => {
                      const startDate = new Date(request.startDate).toLocaleDateString()
                      const endDate = new Date(request.endDate).toLocaleDateString()
                      const requestDate = new Date(request.requestDate).toLocaleDateString()

                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="text-sm">
                              {startDate} - {endDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.days} days</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                          <TableCell>{requestDate}</TableCell>
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
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <LeaveCalendar employeeId={employeeId} onRequestLeave={handleLeaveRequest} isAdminView={false} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Forms */}
      {showScheduleForm && <ScheduleChangeForm onClose={() => setShowScheduleForm(false)} employeeId={employeeId} />}
      {showExpenseForm && <ExpenseClaimForm onClose={() => setShowExpenseForm(false)} employeeId={employeeId} />}
      {showLeaveForm && (
        <LeaveRequestForm
          onClose={() => {
            setShowLeaveForm(false)
            setSelectedLeaveDate(null)
          }}
          employeeId={employeeId}
          preselectedDate={selectedLeaveDate}
        />
      )}
    </div>
  )
}
