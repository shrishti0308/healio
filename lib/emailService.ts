"use server";

import {
  AppointmentConfirmationData,
  appointmentConfirmationTemplate,
} from "./email-templates/appointmentConfirmation";
import {
  AppointmentUpdateData,
  appointmentUpdateTemplate,
} from "./email-templates/appointmentUpdate";
import { transporter, verifyEmailConnection } from "./email.config";

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const isConfigured = await verifyEmailConnection();
    if (!isConfigured) {
      console.error("Email service is not configured properly");
      return false;
    }

    const mailOptions = {
      from: {
        name: "Healio Healthcare",
        address: process.env.EMAIL_FROM!,
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

// Appointment Confirmation Email
export const sendAppointmentConfirmation = async (
  to: string,
  data: AppointmentConfirmationData
): Promise<boolean> => {
  const subject = `Appointment Confirmed - ${data.appointmentDate} with Dr. ${data.doctorName}`;
  const html = appointmentConfirmationTemplate(data);

  return await sendEmail({
    to,
    subject,
    html,
    text: `Hello ${data.patientName}, your appointment with Dr. ${data.doctorName} has been confirmed for ${data.appointmentDate} at ${data.appointmentTime}. Appointment ID: ${data.appointmentId}`,
  });
};

// Appointment Update Email (Schedule/Reschedule/Cancel)
export const sendAppointmentUpdate = async (
  to: string,
  data: AppointmentUpdateData
): Promise<boolean> => {
  const getSubject = () => {
    switch (data.updateType) {
      case "scheduled":
        return `Appointment Scheduled - ${data.appointmentDate} with Dr. ${data.doctorName}`;
      case "rescheduled":
        return `Appointment Rescheduled - ${data.appointmentDate} with Dr. ${data.doctorName}`;
      case "cancelled":
        return `Appointment Cancelled - Dr. ${data.doctorName}`;
      default:
        return `Appointment Updated - Dr. ${data.doctorName}`;
    }
  };

  const getTextContent = () => {
    switch (data.updateType) {
      case "scheduled":
        return `Hello ${data.patientName}, your appointment with Dr. ${data.doctorName} has been scheduled for ${data.appointmentDate} at ${data.appointmentTime}. Appointment ID: ${data.appointmentId}`;
      case "rescheduled":
        return `Hello ${data.patientName}, your appointment with Dr. ${data.doctorName} has been rescheduled to ${data.appointmentDate} at ${data.appointmentTime}. Appointment ID: ${data.appointmentId}`;
      case "cancelled":
        return `Hello ${data.patientName}, your appointment with Dr. ${data.doctorName} scheduled for ${data.appointmentDate} has been cancelled. Appointment ID: ${data.appointmentId}`;
      default:
        return `Hello ${data.patientName}, your appointment details have been updated. Appointment ID: ${data.appointmentId}`;
    }
  };

  const subject = getSubject();
  const html = appointmentUpdateTemplate(data);
  const text = getTextContent();

  return await sendEmail({
    to,
    subject,
    html,
    text,
  });
};

// Generic email method for future templates
export const sendCustomEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> => {
  return await sendEmail({
    to,
    subject,
    html: htmlContent,
    text: textContent,
  });
};
