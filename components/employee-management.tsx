"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Plus, Edit, FileText } from "lucide-react"
import { Users } from "lucide-react"
import { mockEmployees, mockTimeLogs } from "@/app/page"
import { EmployeeEditForm } from "@/components/employee-edit-form"
import { ContractUploadForm } from "@/components/contract-upload-form"
import { TimeLogForm } from "@/components/time-log-form"
import { calculateLeaveBalance } from "@/app/page"

export function EmployeeManagement() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showContractForm, setShowContractForm] = useState(false)
  const [showTimeLogForm, setShowTimeLogForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterProject, setFilterProject] = useState("all")
  const [filterEmploymentType, setFilterEmploymentType] = useState("all")

  // Get unique projects for filter
  const allProjects = [...new Set(employees.flatMap((emp) => emp.projects))]

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || employee.role === filterRole
    const matchesProject = filterProject === "all" || employee.projects.includes(filterProject)
    const matchesEmploymentType = filterEmploymentType === "all" || employee.employmentType === filterEmploymentType

    return matchesSearch && matchesRole && matchesProject && matchesEmploymentType
  })

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

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowEditForm(true)
  }

  const handleContractUpload = (employee) => {
    setSelectedEmployee(employee)
    setShowContractForm(true)
  }

  const calculateEmploymentDuration = (contractDate: string) => {
    const start = new Date(contractDate)
    const now = new Date()
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    return months
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-muted-foreground">Manage employee information, contracts, and project assignments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {allProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select value={filterEmploymentType} onValueChange={setFilterEmploymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterRole("all")
                  setFilterProject("all")
                  setFilterEmploymentType("all")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Employees ({filteredEmployees.length})
          </CardTitle>
          <CardDescription>Manage employee details, contracts, and project assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Contract Period</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Employment Type</TableHead>
                <TableHead>Leave Balance / Hours</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => {
                const startDate = employee.employmentType === "Part-time" ? employee.startDate : employee.contractDate
                const contractStart = new Date(employee.contractDate)
                const contractEnd = new Date(employee.contractEndDate)
                const employmentMonths = calculateEmploymentDuration(employee.contractDate)

                // Calculate leave balance for full-time employees only
                const usedDays = 0 // In real app, get from leave requests
                const balance =
                  employee.employmentType === "Full-time"
                    ? calculateLeaveBalance(
                        employee.contractDate,
                        employee.contractEndDate,
                        usedDays,
                        employee.leaveExtension,
                      )
                    : null

                // Calculate total hours for part-time employees
                const totalHours =
                  employee.employmentType === "Part-time"
                    ? mockTimeLogs
                        .filter((log) => log.employeeId === employee.id && log.status === "approved")
                        .reduce((total, log) => total + log.hours, 0)
                    : 0

                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.role === "Engineer" ? "default" : "secondary"}>{employee.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.projects.map((project) => (
                          <Badge key={project} className={getProjectColor(project)}>
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{contractStart.toLocaleDateString()}</div>
                        <div className="text-muted-foreground">to {contractEnd.toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{employmentMonths} months</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(employmentMonths / 12)}y {employmentMonths % 12}m
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.employmentType === "Full-time"
                            ? "default"
                            : employee.employmentType === "Part-time"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {employee.employmentType}
                      </Badge>
                      {employee.employmentType === "Part-time" && employee.hourlyRate && (
                        <div className="text-xs text-muted-foreground mt-1">${employee.hourlyRate}/hr</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.employmentType === "Full-time" && balance ? (
                        <div className="text-sm">
                          <div className="font-medium">{balance.available} days</div>
                          <div className="text-xs text-muted-foreground">
                            {balance.earned} earned • {balance.used} used
                          </div>
                        </div>
                      ) : employee.employmentType === "Part-time" ? (
                        <div className="text-sm">
                          <div className="font-medium">{totalHours} hours</div>
                          <div className="text-xs text-muted-foreground">
                            This month:{" "}
                            {mockTimeLogs
                              .filter(
                                (log) =>
                                  log.employeeId === employee.id &&
                                  log.status === "approved" &&
                                  new Date(log.date).getMonth() === new Date().getMonth(),
                              )
                              .reduce((total, log) => total + log.hours, 0)}{" "}
                            hrs
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">N/A</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{employee.bankAccount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditEmployee(employee)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {employee.employmentType === "Full-time" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContractUpload(employee)}
                            className="h-8 w-8 p-0"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                        {employee.employmentType === "Part-time" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setShowTimeLogForm(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
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

      {/* Forms */}
      {showEditForm && selectedEmployee && (
        <EmployeeEditForm
          employee={selectedEmployee}
          onClose={() => {
            setShowEditForm(false)
            setSelectedEmployee(null)
          }}
          onSave={(updatedEmployee) => {
            setEmployees((prev) => prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
            setShowEditForm(false)
            setSelectedEmployee(null)
          }}
        />
      )}

      {showContractForm && selectedEmployee && (
        <ContractUploadForm
          employee={selectedEmployee}
          onClose={() => {
            setShowContractForm(false)
            setSelectedEmployee(null)
          }}
          onSave={(updatedEmployee) => {
            setEmployees((prev) => prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
            setShowContractForm(false)
            setSelectedEmployee(null)
          }}
        />
      )}

      {showTimeLogForm && selectedEmployee && (
        <TimeLogForm
          employeeId={selectedEmployee.id}
          onClose={() => {
            setShowTimeLogForm(false)
            setSelectedEmployee(null)
          }}
        />
      )}
    </div>
  )
}
