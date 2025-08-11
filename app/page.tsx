"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, DollarSign, LogOut } from "lucide-react"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { EmployeeManagement } from "@/components/employee-management"
import { PartTimeDashboard } from "@/components/part-time-dashboard"
import { EmployerManagement } from "@/components/employer-management"
import { Button } from "@/components/ui/button"

// Update mockEmployees to include bank account numbers
export const mockEmployees = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    bankAccount: "1234567890", // Add bank account number
    projects: ["KNS"],
    contractDate: "2023-01-15",
    contractEndDate: "2024-12-31",
    role: "Engineer",
    employmentType: "Full-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: null,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    bankAccount: "2345678901", // Add bank account number
    projects: ["dispatch", "gsfm", "amass"],
    contractDate: "2023-03-01",
    contractEndDate: "2024-06-30",
    role: "Product Manager",
    employmentType: "Full-time",
    leaveExtension: {
      extendedUntil: "2024-08-31",
      reason: "Project completion",
      approvedBy: "HR Manager",
      approvedDate: "2024-01-15",
    },
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: null,
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    bankAccount: "3456789012", // Add bank account number
    projects: ["KNS"],
    contractDate: "2022-11-10",
    contractEndDate: "2025-11-10",
    role: "Engineer",
    employmentType: "Full-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: {
      requestedDays: ["Thursday", "Friday", "Saturday", "Sunday"],
      reason: "Personal commitments changed, need weekend work",
      status: "pending",
    },
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    bankAccount: "4567890123", // Add bank account number
    projects: ["enerbuild", "deepskill"],
    contractDate: "2023-06-20",
    contractEndDate: "2024-03-20",
    role: "Product Manager",
    employmentType: "Full-time",
    leaveExtension: {
      extendedUntil: "2024-06-20",
      reason: "Under discussion for renewal",
      approvedBy: "Admin",
      approvedDate: "2024-03-15",
    },
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: null,
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    bankAccount: "5678901234", // Add bank account number
    projects: ["KNS"],
    contractDate: "2023-08-01",
    contractEndDate: "2025-08-01",
    role: "Engineer",
    employmentType: "Full-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: null,
  },
  {
    id: 6,
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    bankAccount: "6789012345", // Add bank account number
    projects: ["amass"],
    contractDate: "2023-04-15",
    contractEndDate: "2024-10-15",
    role: "Engineer",
    employmentType: "Full-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: null,
  },
  {
    id: 7,
    name: "David Kim",
    email: "david.kim@company.com",
    bankAccount: "7890123456", // Add bank account number
    projects: ["enerbuild"],
    contractDate: "2023-02-01",
    contractEndDate: "2024-08-01",
    role: "Product Manager",
    employmentType: "Full-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: {
      requestedDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      reason: "Want to have Mondays off for personal development courses",
      status: "approved",
    },
  },
  {
    id: 8,
    name: "Anna Thompson",
    email: "anna.thompson@company.com",
    bankAccount: "8901234567", // Add bank account number
    projects: ["deepskill"],
    contractDate: "2023-05-10",
    contractEndDate: "2025-05-10",
    role: "Engineer",
    employmentType: "Full-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
      type: "Full-time",
    },
    scheduleChanges: null,
  },
  // Add part-time workers with contract periods
  {
    id: 9,
    name: "James Wilson",
    email: "james.wilson@company.com",
    bankAccount: "9012345678", // Add bank account number
    projects: ["KNS"],
    contractDate: "2023-09-01",
    contractEndDate: "2024-12-31",
    role: "Engineer",
    employmentType: "Part-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "Flexible",
      timezone: "Jakarta Time",
      type: "Part-time",
    },
    scheduleChanges: null,
    hourlyRate: 25, // USD per hour
  },
  {
    id: 10,
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    bankAccount: "0123456789", // Add bank account number
    projects: ["dispatch"],
    contractDate: "2023-10-15",
    contractEndDate: "2024-09-15",
    role: "Designer",
    employmentType: "Part-time",
    leaveExtension: null,
    baseSchedule: {
      days: ["Tuesday", "Thursday"],
      hours: "Flexible",
      timezone: "Jakarta Time",
      type: "Part-time",
    },
    scheduleChanges: null,
    hourlyRate: 30, // USD per hour
  },
  {
    id: 11,
    name: "Robert Brown",
    email: "robert.brown@company.com",
    bankAccount: "1122334455", // Add bank account number
    projects: ["gsfm"],
    contractDate: "2022-12-01",
    contractEndDate: "2023-12-01", // Contract expired
    role: "Engineer",
    employmentType: "Inactive",
    leaveExtension: null,
    baseSchedule: {
      days: [],
      hours: "N/A",
      timezone: "N/A",
      type: "Inactive",
    },
    scheduleChanges: null,
  },
]

// Add more comprehensive time logs for part-time workers
export const mockTimeLogs = [
  // James Wilson (ID: 9) - Current week
  {
    id: 1,
    employeeId: 9,
    date: "2024-03-18",
    startTime: "09:00",
    endTime: "13:00",
    hours: 4,
    description: "Frontend development for KNS dashboard - implemented user authentication flow",
    project: "KNS",
    status: "approved",
    submittedDate: "2024-03-18",
    approvedDate: "2024-03-19",
  },
  {
    id: 2,
    employeeId: 9,
    date: "2024-03-20",
    startTime: "10:00",
    endTime: "15:00",
    hours: 5,
    description: "Bug fixes and testing for login system, code review with team",
    project: "KNS",
    status: "approved",
    submittedDate: "2024-03-20",
    approvedDate: "2024-03-21",
  },
  {
    id: 3,
    employeeId: 9,
    date: "2024-03-22",
    startTime: "08:30",
    endTime: "12:30",
    hours: 4,
    description: "API integration for user profile management",
    project: "KNS",
    status: "submitted",
    submittedDate: "2024-03-22",
  },
  // Previous week
  {
    id: 4,
    employeeId: 9,
    date: "2024-03-11",
    startTime: "09:00",
    endTime: "14:00",
    hours: 5,
    description: "Database schema design and implementation",
    project: "KNS",
    status: "approved",
    submittedDate: "2024-03-11",
    approvedDate: "2024-03-12",
  },
  {
    id: 5,
    employeeId: 9,
    date: "2024-03-13",
    startTime: "10:00",
    endTime: "16:00",
    hours: 6,
    description: "Component development and unit testing",
    project: "KNS",
    status: "approved",
    submittedDate: "2024-03-13",
    approvedDate: "2024-03-14",
  },
  // Maria Garcia (ID: 10) - Current week
  {
    id: 6,
    employeeId: 10,
    date: "2024-03-19",
    startTime: "14:00",
    endTime: "18:00",
    hours: 4,
    description: "UI/UX design for dispatch mobile app - wireframes and mockups",
    project: "dispatch",
    status: "approved",
    submittedDate: "2024-03-19",
    approvedDate: "2024-03-20",
  },
  {
    id: 7,
    employeeId: 10,
    date: "2024-03-21",
    startTime: "09:00",
    endTime: "13:00",
    hours: 4,
    description: "Design system updates and component library maintenance",
    project: "dispatch",
    status: "submitted",
    submittedDate: "2024-03-21",
  },
  // Previous week
  {
    id: 8,
    employeeId: 10,
    date: "2024-03-12",
    startTime: "13:00",
    endTime: "17:00",
    hours: 4,
    description: "User research and persona development",
    project: "dispatch",
    status: "approved",
    submittedDate: "2024-03-12",
    approvedDate: "2024-03-13",
  },
  {
    id: 9,
    employeeId: 10,
    date: "2024-03-14",
    startTime: "10:00",
    endTime: "15:00",
    hours: 5,
    description: "Prototype development and user testing",
    project: "dispatch",
    status: "approved",
    submittedDate: "2024-03-14",
    approvedDate: "2024-03-15",
  },
]

// Updated schedule change requests to reflect new structure
export const mockScheduleRequests = [
  {
    id: 1,
    employeeId: 3,
    currentSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
    },
    requestedSchedule: {
      days: ["Thursday", "Friday", "Saturday", "Sunday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
    },
    reason: "Personal commitments changed, need weekend work",
    status: "pending",
    requestDate: "2024-03-01",
    effectiveDate: "2024-04-01",
  },
  {
    id: 2,
    employeeId: 7,
    currentSchedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
    },
    requestedSchedule: {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      hours: "8:00 AM - 5:00 PM",
      timezone: "Jakarta Time",
    },
    reason: "Want to have Mondays off for personal development courses",
    status: "approved",
    requestDate: "2024-02-15",
    effectiveDate: "2024-03-15",
    approvedBy: "HR Manager",
    approvedDate: "2024-02-20",
  },
]

// Update project notifications to handle multiple projects
export const mockProjectNotifications = [
  {
    id: 1,
    projects: ["enerbuild"], // David's projects affected
    message: "David Kim's working days have been updated. New schedule: Tuesday, Wednesday, Thursday, Friday, Saturday",
    type: "schedule_change",
    employeeId: 7,
    date: "2024-02-20",
    read: false,
  },
]

export const mockLeaveRequests = [
  {
    id: 1,
    employeeId: 1,
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    days: 2,
    reason: "Personal matters",
    status: "approved",
    requestDate: "2024-01-20",
  },
  {
    id: 2,
    employeeId: 2,
    startDate: "2024-03-10",
    endDate: "2024-03-12",
    days: 3,
    reason: "Family vacation",
    status: "pending",
    requestDate: "2024-02-25",
  },
  {
    id: 3,
    employeeId: 1,
    startDate: "2024-04-01",
    endDate: "2024-04-05",
    days: 5,
    reason: "Annual vacation",
    status: "pending",
    requestDate: "2024-03-01",
  },
]

export const mockExpenseClaims = [
  {
    id: 1,
    employeeId: 1,
    amount: 45.5,
    currency: "USD",
    category: "Meals",
    description: "Client lunch meeting",
    date: "2024-03-15",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "pending",
    requestDate: "2024-03-16",
    projectCode: "KNS",
  },
  {
    id: 2,
    employeeId: 2,
    amount: 120.0,
    currency: "USD",
    category: "Transportation",
    description: "Uber to client site",
    date: "2024-03-10",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "approved",
    requestDate: "2024-03-11",
    approvedBy: "Finance Team",
    approvedDate: "2024-03-12",
    projectCode: "dispatch",
  },
  {
    id: 3,
    employeeId: 3,
    amount: 89.99,
    currency: "USD",
    category: "Software",
    description: "Development tools subscription",
    date: "2024-03-08",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "rejected",
    requestDate: "2024-03-09",
    rejectedBy: "Finance Team",
    rejectedDate: "2024-03-10",
    rejectionReason: "Personal use software not covered",
    projectCode: "KNS",
  },
  {
    id: 4,
    employeeId: 1,
    amount: 25.0,
    currency: "USD",
    category: "Office Supplies",
    description: "Notebooks and pens for project planning",
    date: "2024-03-20",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "pending",
    requestDate: "2024-03-21",
    projectCode: "KNS",
  },
]

// Calculate leave balance based on contract date
export function calculateLeaveBalance(
  contractDate: string,
  contractEndDate: string,
  usedDays = 0,
  leaveExtension = null,
) {
  const contract = new Date(contractDate)
  const contractEnd = new Date(contractEndDate)
  const now = new Date()

  // Determine effective end date (contract end or extension)
  const effectiveEndDate = leaveExtension ? new Date(leaveExtension.extendedUntil) : contractEnd

  // Calculate months from contract start to effective end date
  const endDateForCalculation = now < effectiveEndDate ? now : effectiveEndDate

  const monthsDiff =
    (endDateForCalculation.getFullYear() - contract.getFullYear()) * 12 +
    (endDateForCalculation.getMonth() - contract.getMonth()) +
    (endDateForCalculation.getDate() >= contract.getDate() ? 1 : 0)

  const earnedDays = Math.max(0, monthsDiff)

  // If contract has expired and no extension, available days = 0
  const isExpired = now > effectiveEndDate
  const availableDays = isExpired ? 0 : Math.max(0, earnedDays - usedDays)

  return {
    earned: earnedDays,
    used: usedDays,
    available: availableDays,
    isExpired,
    contractEndDate: contractEnd,
    effectiveEndDate,
    hasExtension: !!leaveExtension,
    extension: leaveExtension,
  }
}

export default function WorkSpacePage() {
  const router = useRouter()
  const { user, loading, isAuthenticated, signOut } = useAuth()
  const [showLeaveForm, setShowLeaveForm] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const totalEmployees = mockEmployees.length
  const pendingRequests = mockLeaveRequests.filter((req) => req.status === "pending").length
  const totalLeaveRequests = mockLeaveRequests.length
  const totalExpenseClaims = mockExpenseClaims.length
  const pendingExpenseClaims = mockExpenseClaims.filter((claim) => claim.status === "pending").length
  const pendingScheduleRequests = mockScheduleRequests.filter((req) => req.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WorkSpace Manager</h1>
            <p className="text-gray-600 mt-1">
              Welcome, {user?.firstName} {user?.lastName} ({user?.role})
            </p>
          </div>
          <Button onClick={signOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Leave</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingExpenseClaims}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schedule Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingScheduleRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue={user?.role === 'manager' ? 'admin' : 'employee'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="employee">My Dashboard</TabsTrigger>
            <TabsTrigger value="parttimer">My Dashboard (Part Timer)</TabsTrigger>
            {user?.role === 'manager' && (
              <>
                <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
                <TabsTrigger value="employees">Employee Management</TabsTrigger>
                <TabsTrigger value="employers">Employer Management</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="employee" className="space-y-6">
            <EmployeeDashboard employeeId={1} />
          </TabsContent>

          <TabsContent value="parttimer" className="space-y-6">
            <PartTimeDashboard employeeId={9} />
          </TabsContent>

          {user?.role === 'manager' && (
            <>
              <TabsContent value="admin" className="space-y-6">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="employees" className="space-y-6">
                <EmployeeManagement />
              </TabsContent>

              <TabsContent value="employers" className="space-y-6">
                <EmployerManagement />
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Leave Request Form Modal */}
        {showLeaveForm && <LeaveRequestForm onClose={() => setShowLeaveForm(false)} employeeId={1} />}
      </div>
    </div>
  )
}
