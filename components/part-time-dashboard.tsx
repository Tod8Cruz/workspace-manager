"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, DollarSign, TrendingUp, Plus, Timer } from "lucide-react"
import { mockEmployees, mockTimeLogs } from "@/app/page"
import { TimeLogForm } from "@/components/time-log-form"
import { formatDate } from "@/lib/utils"

interface PartTimeDashboardProps {
  employeeId: number
}

export function PartTimeDashboard({ employeeId }: PartTimeDashboardProps) {
  const [showTimeLogForm, setShowTimeLogForm] = useState(false)

  const employee = mockEmployees.find((emp) => emp.id === employeeId)
  const employeeTimeLogs = mockTimeLogs.filter((log) => log.employeeId === employeeId)

  if (!employee || employee.employmentType !== "Part-time") return null

  // Calculate time statistics
  const currentWeekLogs = employeeTimeLogs.filter((log) => {
    const logDate = new Date(log.date)
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    return logDate >= weekStart
  })

  const currentMonthLogs = employeeTimeLogs.filter((log) => {
    const logDate = new Date(log.date)
    const now = new Date()
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear()
  })

  const approvedLogs = employeeTimeLogs.filter((log) => log.status === "approved")
  const pendingLogs = employeeTimeLogs.filter((log) => log.status === "submitted")

  const totalHours = approvedLogs.reduce((sum, log) => sum + log.hours, 0)
  const weekHours = currentWeekLogs.reduce((sum, log) => sum + log.hours, 0)
  const monthHours = currentMonthLogs.reduce((sum, log) => sum + log.hours, 0)
  const pendingHours = pendingLogs.reduce((sum, log) => sum + log.hours, 0)

  const totalEarnings = totalHours * employee.hourlyRate
  const weekEarnings = weekHours * employee.hourlyRate
  const monthEarnings = monthHours * employee.hourlyRate
  const pendingEarnings = pendingHours * employee.hourlyRate

  // Calculate months since start
  const startDate = new Date(employee.contractDate)
  const now = new Date()
  const monthsSinceStart =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth()) +
    (now.getDate() >= startDate.getDate() ? 1 : 0)

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Dashboard (Part Timer)</h2>
          <p className="text-muted-foreground">Track your hours and earnings</p>
        </div>
        <Button onClick={() => setShowTimeLogForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Log Time
        </Button>
      </div>

      {/* Employee Info & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                <AvatarFallback>{employee.name.split(" ").map((n) => n[0])}</AvatarFallback>
              </Avatar>
              {employee.name}
            </CardTitle>
            <CardDescription>
              {employee.role} • Part-time • {employee.projects.length} Project
              {employee.projects.length !== 1 ? "s" : ""}
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
                <div className="text-muted-foreground">Contract Start</div>
                <div className="font-medium">{formatDate(employee.contractDate)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Contract End</div>
                <div className="font-medium">{formatDate(employee.contractEndDate)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Hourly Rate</div>
                <div className="font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {employee.hourlyRate}/hour
                </div>
              </div>
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
            </div>

            {/* Working schedule section */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Working Schedule</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Preferred Days:</strong>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Earnings Overview
            </CardTitle>
            <CardDescription>Your time tracking and earnings summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalHours}h</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Week</span>
                <div className="text-right">
                  <div className="font-medium">
                    {weekHours}h • ${weekEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month</span>
                <div className="text-right">
                  <div className="font-medium">
                    {monthHours}h • ${monthEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Approval</span>
                <div className="text-right">
                  <div className="font-medium text-orange-600">
                    {pendingHours}h • ${pendingEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Average hours per week */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Weekly Average</span>
                <span className="text-sm">{(monthHours / 4).toFixed(1)}h/week</span>
              </div>
              <Progress value={(weekHours / 40) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">This week: {weekHours}h of typical 20-40h range</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Time Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Recent Time Logs
              </CardTitle>
              <CardDescription>Your submitted time entries and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowTimeLogForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {employeeTimeLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No time logs found</p>
              <Button onClick={() => setShowTimeLogForm(true)} className="mt-4">
                Log Your First Entry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeTimeLogs
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((log) => {
                    const logDate = formatDate(log.date)
                    const earnings = log.hours * employee.hourlyRate

                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">{logDate}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.startTime} - {log.endTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.hours}h</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProjectColor(log.project)}>{log.project}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm truncate" title={log.description}>
                            {log.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${earnings.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === "approved"
                                ? "default"
                                : log.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Time Log Form */}
      {showTimeLogForm && <TimeLogForm onClose={() => setShowTimeLogForm(false)} employeeId={employeeId} />}
    </div>
  )
}
