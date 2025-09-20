"use client";

import { useRouter } from "next/navigation";
import { AttendanceButton } from "@/components/events/attendance-button";

interface AttendanceButtonWrapperProps {
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
}

export function AttendanceButtonWrapper(props: AttendanceButtonWrapperProps) {
  const router = useRouter();

  const handleAttendanceSuccess = () => {
    // Refresh the page to get updated attendance data
    router.refresh();
  };

  return (
    <AttendanceButton
      {...props}
      onAttendanceSuccess={handleAttendanceSuccess}
    />
  );
}