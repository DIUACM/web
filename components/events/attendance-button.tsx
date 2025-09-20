"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { Calendar, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { toURL } from "@/lib/api/client";

interface AttendanceButtonProps {
  eventId: number;
  eventTitle: string;
  startingAt: string;
  endingAt: string;
  openForAttendance?: boolean;
  eventLink?: string;
  attendees?: {
    name: string;
    username: string;
    student_id: string;
    department: string;
    profile_picture: string;
    attendance_time: string;
  }[];
  onAttendanceSuccess?: () => void;
}

type AttendanceWindowStatus = "not-started" | "open" | "closed";

function getAttendanceWindowStatus(startingAt: string, endingAt: string): AttendanceWindowStatus {
  const now = new Date();
  const startTime = new Date(startingAt);
  const endTime = new Date(endingAt);
  
  // Attendance window: opens 15 minutes before starting_at and closes 20 minutes after ending_at
  const windowStart = new Date(startTime.getTime() - 15 * 60 * 1000); // 15 minutes before
  const windowEnd = new Date(endTime.getTime() + 20 * 60 * 1000); // 20 minutes after
  
  if (now < windowStart) return "not-started";
  if (now > windowEnd) return "closed";
  return "open";
}

function formatTimeUntil(targetTime: string): string {
  const now = new Date();
  const target = new Date(targetTime);
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) return "now";
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60}min`;
  return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}

export function AttendanceButton({ 
  eventId, 
  eventTitle, 
  startingAt, 
  endingAt, 
  openForAttendance = false,
  eventLink,
  attendees = [],
  onAttendanceSuccess
}: AttendanceButtonProps) {
  const { session } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);

  // Update attendance status when session or attendees change
  useEffect(() => {
    if (session) {
      const userHasAttended = attendees.some(attendee => 
        attendee.username === session.user.username
      );
      setHasAttended(userHasAttended);
    } else {
      setHasAttended(false);
    }
  }, [session, attendees]);

  const windowStatus = getAttendanceWindowStatus(startingAt, endingAt);

  const handleAttendanceClick = () => {
    if (!session) {
      // Redirect to login with current page as redirect URL
      const currentUrl = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (windowStatus !== "open") {
      return; // Button should be disabled anyway
    }

    setIsOpen(true);
  };

  const handleSubmitAttendance = async () => {
    if (!session || !password.trim()) return;

    setIsSubmitting(true);
    try {
      const url = toURL(`/api/events/${eventId}/attend`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          event_password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to mark attendance");
      }

      setHasAttended(true);
      setIsOpen(false);
      setPassword("");
      toast.success("Attendance marked successfully!");
      
      // Notify parent component about successful attendance
      if (onAttendanceSuccess) {
        onAttendanceSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to mark attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonContent = () => {
    if (hasAttended) {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Attendance Marked
        </>
      );
    }

    if (!openForAttendance) {
      return (
        <>
          <Calendar className="h-4 w-4 mr-2" />
          Attendance Not Available
        </>
      );
    }

    switch (windowStatus) {
      case "not-started":
        const startTime = new Date(startingAt);
        const windowStart = new Date(startTime.getTime() - 15 * 60 * 1000);
        return (
          <>
            <Clock className="h-4 w-4 mr-2" />
            Attendance Opens {formatTimeUntil(windowStart.toISOString())}
          </>
        );
      case "open":
        return (
          <>
            <Calendar className="h-4 w-4 mr-2" />
            {session ? "Mark Attendance" : "Login to Mark Attendance"}
          </>
        );
      case "closed":
        return (
          <>
            <Clock className="h-4 w-4 mr-2" />
            Attendance Window Closed
          </>
        );
    }
  };

  const isButtonDisabled = hasAttended || !openForAttendance || (windowStatus !== "open" && !!session);
  const buttonVariant = hasAttended ? "default" : windowStatus === "open" ? "default" : "outline";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {eventLink && (
        <Button asChild variant="outline">
          <a href={eventLink} target="_blank" rel="noopener noreferrer">
            Open Event Link <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={buttonVariant}
            disabled={isButtonDisabled}
            onClick={handleAttendanceClick}
            className={hasAttended ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            {getButtonContent()}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle" className="text-sm font-medium">
                Event
              </Label>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {eventTitle}
              </p>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Event Password
              </Label>
              <Input
                id="password"
                type="text"
                placeholder="Enter event password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting && password.trim()) {
                    handleSubmitAttendance();
                  }
                }}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAttendance}
                disabled={isSubmitting || !password.trim()}
              >
                {isSubmitting ? "Marking..." : "Mark Attendance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}