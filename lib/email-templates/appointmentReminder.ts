import { appointmentDetailsSection, baseEmailTemplate } from "./shared";

interface AppointmentReminderData {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  appointmentId: string;
  appointmentDetailsUrl: string;
}

export const appointmentReminderTemplate = (
  data: AppointmentReminderData
): string => {
  const content = `
    <div class="greeting">
      Hello <span class="highlight">${data.patientName}</span>,
    </div>

    <div class="info-box">
      <h2 style="color: #0c5460; margin-bottom: 10px;">🔔 Appointment Reminder</h2>
      <p>This is a friendly reminder about your upcoming appointment tomorrow.</p>
    </div>

    ${appointmentDetailsSection(data)}

    <p style="margin: 20px 0; color: #555;">
      Please arrive <strong>15 minutes early</strong> for your appointment. Don't forget to bring:
    </p>

    <ul style="margin-left: 20px; color: #555;">
      <li>Valid photo ID</li>
      <li>Insurance card (if applicable)</li>
      <li>List of current medications</li>
      <li>Any relevant medical records</li>
    </ul>

    <center>
      <a href="${
        data.appointmentDetailsUrl
      }" class="button">View Appointment Details</a>
    </center>

    <div class="warning-box">
      <p style="margin: 0; color: #856404;">
        <strong>Need to reschedule or cancel?</strong><br>
        Please contact us at least 24 hours in advance to avoid any cancellation fees.
      </p>
    </div>

    <div class="info-box" style="margin-top: 20px;">
      <p style="margin: 0; color: #0c5460;">
        <strong>Pro Tip:</strong> Prepare any questions you'd like to ask Dr. ${data.doctorName} during your visit.
      </p>
    </div>
  `;

  return baseEmailTemplate(content, "Appointment Reminder - Healio");
};

export type { AppointmentReminderData };
