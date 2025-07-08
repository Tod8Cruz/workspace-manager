"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, User, Briefcase } from "lucide-react"

interface EmployeeEditFormProps {
  employee: any
  onClose: () => void
  onSave: (employee: any) => void
}

const AVAILABLE_PROJECTS = ["KNS", "dispatch", "gsfm", "amass", "enerbuild", "deepskill"]

export function EmployeeEditForm({ employee, onClose, onSave }: EmployeeEditFormProps) {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    bankAccount: employee.bankAccount,
    role: employee.role,
    projects: employee.projects,
    contractDate: employee.contractDate,
    contractEndDate: employee.contractEndDate,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProjectToggle = (project: string) => {
    const currentProjects = formData.projects
    const maxProjects = formData.role === "Product Manager" ? 3 : 1

    if (currentProjects.includes(project)) {
      // Remove project
      setFormData({
        ...formData,
        projects: currentProjects.filter((p) => p !== project),
      })
    } else if (currentProjects.length < maxProjects) {
      // Add project if under limit
      setFormData({
        ...formData,
        projects: [...currentProjects, project],
      })
    }
  }

  const handleRoleChange = (newRole: string) => {
    const maxProjects = newRole === "Product Manager" ? 3 : 1
    let newProjects = formData.projects

    // If switching to Engineer and has more than 1 project, keep only the first one
    if (newRole === "Engineer" && formData.projects.length > 1) {
      newProjects = [formData.projects[0]]
    }

    setFormData({
      ...formData,
      role: newRole,
      projects: newProjects,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.projects.length === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedEmployee = {
      ...employee,
      ...formData,
    }

    onSave(updatedEmployee)
  }

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

  const maxProjects = formData.role === "Product Manager" ? 3 : 1

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Edit Employee
              </CardTitle>
              <CardDescription>Update employee information and project assignments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account Number</Label>
                <Input
                  id="bankAccount"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="Enter bank account number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Engineers can have 1 project, Product Managers can have up to 3 projects
                </p>
              </div>
            </div>

            {/* Project Assignment */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Project Assignment
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Projects ({formData.projects.length}/{maxProjects})
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {formData.projects.map((project) => (
                      <Badge key={project} className={getProjectColor(project)}>
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_PROJECTS.map((project) => (
                    <div key={project} className="flex items-center space-x-2">
                      <Checkbox
                        id={project}
                        checked={formData.projects.includes(project)}
                        onCheckedChange={() => handleProjectToggle(project)}
                        disabled={!formData.projects.includes(project) && formData.projects.length >= maxProjects}
                      />
                      <Label htmlFor={project} className="text-sm font-normal cursor-pointer">
                        {project}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.projects.length >= maxProjects && (
                  <p className="text-xs text-muted-foreground">Maximum projects reached for {formData.role}</p>
                )}
              </div>
            </div>

            {/* Contract Dates */}
            <div className="space-y-4">
              <h4 className="font-medium">Contract Period</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractDate">Contract Start Date</Label>
                  <Input
                    id="contractDate"
                    type="date"
                    value={formData.contractDate}
                    onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractEndDate">Contract End Date</Label>
                  <Input
                    id="contractEndDate"
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                    min={formData.contractDate}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={formData.projects.length === 0 || isSubmitting} className="flex-1">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
