"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, X } from "lucide-react"
import { mockProjectNotifications } from "@/app/page"

export function NotificationButton() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockProjectNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
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

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotifications(true)}
          className="flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Project Notifications
                  </CardTitle>
                  <CardDescription>Recent updates and schedule changes affecting your projects</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        !notification.read ? "bg-blue-50 border border-blue-200" : "bg-muted"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Bell className={`w-4 h-4 mt-1 ${!notification.read ? "text-blue-500" : "text-gray-400"}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {notification.projects.map((project) => (
                            <Badge key={project} className={getProjectColor(project)} variant="outline">
                              {project}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm">{notification.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.date).toLocaleDateString()} • Project notification
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
