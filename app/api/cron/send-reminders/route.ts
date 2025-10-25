import { getPatient, getUser } from "@/lib/actions/patient.actions";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "@/lib/appwrite.config";
import { sendAppointmentReminder } from "@/lib/emailService";
import { Appointment } from "@/types/appwrite.types";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting appointment reminder cron job...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const appointmentsResponse = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.greaterThanEqual("schedule", tomorrow.toISOString()),
        Query.lessThanEqual("schedule", tomorrowEnd.toISOString()),
        Query.equal("status", "scheduled"),
      ]
    );

    const appointments = appointmentsResponse.documents as Appointment[];
    console.log(`Found ${appointments.length} appointments for tomorrow`);

    let successCount = 0;
    let failureCount = 0;

    for (const appointment of appointments) {
      try {
        const patient = await getPatient(appointment.userId);
        const user = await getUser(appointment.userId);

        if (!patient || !user?.email) {
          console.error(
            `Missing patient or email for appointment ${appointment.$id}`
          );
          failureCount++;
          continue;
        }

        const appointmentDate = new Date(appointment.schedule);
        const emailData = {
          patientName: patient.name,
          doctorName: appointment.primaryPhysician,
          appointmentDate: appointmentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appointmentTime: appointmentDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          reason: appointment.reason || "General consultation",
          appointmentId: appointment.$id,
          appointmentDetailsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/patients/${appointment.userId}/appointments`,
        };

        const emailSent = await sendAppointmentReminder(user.email, emailData);

        if (emailSent) {
          console.log(
            `Reminder sent successfully for appointment ${appointment.$id}`
          );
          successCount++;
        } else {
          console.error(
            `Failed to send reminder for appointment ${appointment.$id}`
          );
          failureCount++;
        }
      } catch (error) {
        console.error(
          `Error processing appointment ${appointment.$id}:`,
          error
        );
        failureCount++;
      }
    }

    console.log(
      `Reminder cron job completed. Success: ${successCount}, Failed: ${failureCount}`
    );

    return NextResponse.json({
      success: true,
      totalAppointments: appointments.length,
      successCount,
      failureCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Reminder cron job failed:", error);
    return NextResponse.json(
      {
        error: "Failed to send appointment reminders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
