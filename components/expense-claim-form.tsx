"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Receipt, Upload, DollarSign } from "lucide-react"
import { mockEmployees } from "@/app/page"

interface ExpenseClaimFormProps {
  onClose: () => void
  employeeId: number
}

const EXPENSE_CATEGORIES = [
  { value: "Meals", label: "Meals & Entertainment" },
  { value: "Transportation", label: "Transportation" },
  { value: "Software", label: "Software & Tools" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Travel", label: "Travel & Accommodation" },
  { value: "Equipment", label: "Equipment & Hardware" },
]

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
]

export function ExpenseClaimForm({ onClose, employeeId }: ExpenseClaimFormProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const employee = mockEmployees.find((emp) => emp.id === employeeId)

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

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
    }
  }

  const canSubmit = amount && currency && category && description.trim() && date && receipt

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const expenseClaim = {
      employeeId,
      amount: Number.parseFloat(amount),
      currency,
      category,
      description,
      date,
      receiptUrl: URL.createObjectURL(receipt!), // In real app, upload to server
      projectCode: employee.project,
      requestDate: new Date().toISOString(),
      status: "pending",
    }

    console.log("Expense claim submitted:", expenseClaim)

    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Submit Expense Claim
              </CardTitle>
              <CardDescription>Claim reimbursement for work-related expenses</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Claim Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Employee</div>
                <div className="font-medium">{employee.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Project</div>
                <Badge className={getProjectColor(employee.project)}>{employee.project}</Badge>
              </div>
              <div>
                <div className="text-muted-foreground">Role</div>
                <Badge variant={employee.role === "Engineer" ? "default" : "secondary"}>{employee.role}</Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expense category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Expense Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the expense (e.g., business purpose, attendees, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="mt-4">
                    <Label htmlFor="receipt" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:text-primary/80">
                        Click to upload receipt
                      </span>
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleReceiptUpload}
                        className="hidden"
                        required
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>
                  {receipt && (
                    <div className="mt-4 p-2 bg-green-50 rounded text-sm text-green-700">✓ {receipt.name} uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            {amount && category && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Claim Summary</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>
                    <strong>Amount:</strong> {currency} {Number.parseFloat(amount || "0").toFixed(2)}
                  </div>
                  <div>
                    <strong>Category:</strong> {EXPENSE_CATEGORIES.find((c) => c.value === category)?.label}
                  </div>
                  <div>
                    <strong>Project:</strong> {employee.project}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
