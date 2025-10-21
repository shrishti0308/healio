"use server";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "@/lib/appwrite.config";

import { formatDateTime, parseStringify } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { getPatient, getUser } from "./patient.actions";
import {
  sendAppointmentConfirmation,
  sendAppointmentUpdate,
} from "../emailService";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      {
        ...appointment,
      }
    );

    // Send appointment confirmation email
    if (newAppointment) {
      try {
        const smsMessage = `Hi, it's Healio. Your appointment has been scheduled for ${
          formatDateTime(appointment.schedule).dateTime
        } with Dr. ${
          appointment.primaryPhysician
        }. Please check your email for more details.`;

        // Send SMS notification
        await sendSMSNotification(appointment.userId, smsMessage);

        const patient = await getPatient(appointment.userId);
        const user = await getUser(appointment.userId);

        if (patient && user?.email) {
          const emailData = {
            patientName: patient.name,
            doctorName: appointment.primaryPhysician,
            appointmentDate: formatDateTime(appointment.schedule).dateOnly,
            appointmentTime: formatDateTime(appointment.schedule).timeOnly,
            reason: appointment.reason || "General consultation",
            appointmentId: newAppointment.$id,
            appointmentDetailsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/patients/${appointment.userId}/appointments`,
          };

          // Send email in background (don't wait for it to complete)
          sendAppointmentConfirmation(user.email, emailData).catch((error) => {
            console.error(
              "Failed to send appointment confirmation email:",
              error
            );
          });
        }
      } catch (emailError) {
        console.error(
          "Error preparing appointment confirmation email:",
          emailError
        );
      }
    }

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};

export const getRecentAppointmentLists = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount += 1;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const originalAppointment = await getAppointment(appointmentId);

    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    let actualUpdateType: "scheduled" | "rescheduled" | "cancelled" =
      "scheduled";
    let previousDate: string | undefined;
    let previousTime: string | undefined;

    if (type === "schedule") {
      if (originalAppointment && originalAppointment.schedule) {
        const originalDateTime = new Date(originalAppointment.schedule);
        const newDateTime = new Date(appointment.schedule);

        if (originalDateTime.getTime() !== newDateTime.getTime()) {
          actualUpdateType = "rescheduled";
          previousDate = formatDateTime(originalAppointment.schedule).dateOnly;
          previousTime = formatDateTime(originalAppointment.schedule).timeOnly;
        } else {
          actualUpdateType = "scheduled";
        }
      }
    } else if (type === "cancel") {
      actualUpdateType = "cancelled";
    }

    // Send SMS notification
    const smsMessage = `Hi, it's Healio.
    ${
      actualUpdateType === "scheduled"
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : actualUpdateType === "rescheduled"
        ? `Your appointment has been rescheduled to ${
            formatDateTime(appointment.schedule).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
    }
    . Please check your email for more details.`;

    await sendSMSNotification(userId, smsMessage);

    // Send email notification
    try {
      const patient = await getPatient(userId);
      const user = await getUser(userId);

      if (patient && user?.email) {
        const emailData = {
          patientName: patient.name,
          doctorName: appointment.primaryPhysician,
          appointmentDate: formatDateTime(appointment.schedule).dateOnly,
          appointmentTime: formatDateTime(appointment.schedule).timeOnly,
          reason: appointment.reason || "General consultation",
          appointmentId: updatedAppointment.$id,
          appointmentDetailsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/patients/${userId}/appointments`,
          updateType: actualUpdateType,
          previousDate:
            actualUpdateType === "rescheduled" ? previousDate : undefined,
          previousTime:
            actualUpdateType === "rescheduled" ? previousTime : undefined,
          cancellationReason:
            actualUpdateType === "cancelled"
              ? appointment.cancellationReason
              : undefined,
        };

        // Send email in background
        sendAppointmentUpdate(user.email, emailData).catch((error) => {
          console.error("Failed to send appointment update email:", error);
        });
      }
    } catch (emailError) {
      console.error("Error preparing appointment update email:", emailError);
    }

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while updating an appointment:", error);
  }
};

export const getPatientAppointments = async (userId: string) => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount += 1;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving patient appointments:",
      error
    );
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending SMS notification:", error);
  }
};
