"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react"
import { mockLeaveRequests, mockEmployees } from "@/app/page"

interface LeaveCalendarProps {
  employeeId?: number
  onRequestLeave?: (date: string) => void
  isAdminView?: boolean
}

export function LeaveCalendar({ employeeId, onRequestLeave, isAdminView = false }: LeaveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Filter leave requests based on view
  const leaveRequests = employeeId
    ? mockLeaveRequests.filter((req) => req.employeeId === employeeId)
    : mockLeaveRequests

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Check if a date has leave requests
  const getLeaveForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    return leaveRequests.filter((request) => {
      const startDate = new Date(request.startDate)
      const endDate = new Date(request.endDate)
      const checkDate = new Date(dateStr)

      return checkDate >= startDate && checkDate <= endDate
    })
  }

  // Get leave requests for selected date details
  const getSelectedDateLeaves = () => {
    if (!selectedDate) return []

    return leaveRequests.filter((request) => {
      const startDate = new Date(request.startDate)
      const endDate = new Date(request.endDate)
      const checkDate = new Date(selectedDate)

      return checkDate >= startDate && checkDate <= endDate
    })
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // Check if date is in the past
  const isPastDate = (day: number) => {
    const today = new Date()
    const checkDate = new Date(currentYear, currentMonth, day)
    return checkDate < today
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
  }

  const handleRequestLeave = () => {
    if (selectedDate && onRequestLeave) {
      onRequestLeave(selectedDate)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Leave Calendar
              </CardTitle>
              <CardDescription>
                {isAdminView ? "View all employee leave requests" : "View your leave schedule"}
              </CardDescription>
            </div>
            <Button onClick={goToToday} variant="outline" size="sm">
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button onClick={goToPreviousMonth} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <Button onClick={goToNextMonth} variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2 h-20"></div>
              }

              const dayLeaves = getLeaveForDate(day)
              const hasLeave = dayLeaves.length > 0
              const isSelected =
                selectedDate ===
                `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    p-2 h-20 border rounded cursor-pointer transition-colors relative
                    ${isSelected ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}
                    ${isToday(day) ? "bg-blue-50 border-blue-300" : ""}
                    ${isPastDate(day) ? "opacity-60" : ""}
                  `}
                >
                  <div className="text-sm font-medium">{day}</div>

                  {/* Leave indicators */}
                  {hasLeave && (
                    <div className="mt-1 space-y-1">
                      {dayLeaves.slice(0, 2).map((leave, idx) => {
                        const employee = mockEmployees.find((emp) => emp.id === leave.employeeId)
                        return (
                          <div
                            key={idx}
                            className={`w-full h-1.5 rounded ${getStatusColor(leave.status)}`}
                            title={`${employee?.name}: ${leave.reason} (${leave.status})`}
                          />
                        )
                      })}
                      {dayLeaves.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayLeaves.length - 2} more</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Rejected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardDescription>Leave requests for this date</CardDescription>
              </div>
              {!isAdminView && onRequestLeave && !isPastDate(new Date(selectedDate).getDate()) && (
                <Button onClick={handleRequestLeave} size="sm" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Request Leave
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {getSelectedDateLeaves().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leave requests for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getSelectedDateLeaves().map((leave) => {
                  const employee = mockEmployees.find((emp) => emp.id === leave.employeeId)
                  const startDate = new Date(leave.startDate).toLocaleDateString()
                  const endDate = new Date(leave.endDate).toLocaleDateString()

                  return (
                    <div key={leave.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isAdminView && <span className="font-medium">{employee?.name}</span>}
                          <Badge
                            variant={
                              leave.status === "approved"
                                ? "default"
                                : leave.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {leave.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {leave.days} day{leave.days !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>Period:</strong> {startDate} - {endDate}
                        </div>
                        <div>
                          <strong>Reason:</strong> {leave.reason}
                        </div>
                        {isAdminView && (
                          <div>
                            <strong>Employee:</strong> {employee?.name} ({employee?.role})
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
