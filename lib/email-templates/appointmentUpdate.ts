import { appointmentDetailsSection, baseEmailTemplate } from "./shared";

interface AppointmentUpdateData {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  appointmentId: string;
  appointmentDetailsUrl: string;
  updateType: "scheduled" | "rescheduled" | "cancelled";
  // For rescheduled appointments
  previousDate?: string;
  previousTime?: string;
  // For cancelled appointments
  cancellationReason?: string;
}

export const appointmentUpdateTemplate = (
  data: AppointmentUpdateData
): string => {
  const getUpdateContent = () => {
    switch (data.updateType) {
      case "scheduled":
        return {
          box: "confirmation-box",
          icon: "✅",
          title: "Appointment Scheduled!",
          message:
            "Your appointment has been confirmed and scheduled by our team.",
          buttonText: "View Appointment Details",
        };
      case "rescheduled":
        return {
          box: "update-box",
          icon: "📅",
          title: "Appointment Rescheduled",
          message:
            "Your appointment has been rescheduled to a new date and time.",
          buttonText: "View Updated Details",
        };
      case "cancelled":
        return {
          box: "cancellation-box",
          icon: "❌",
          title: "Appointment Cancelled",
          message: "Your appointment has been cancelled.",
          buttonText: "Book New Appointment",
        };
      default:
        return {
          box: "update-box",
          icon: "🔄",
          title: "Appointment Updated",
          message: "Your appointment details have been updated.",
          buttonText: "View Details",
        };
    }
  };

  const updateInfo = getUpdateContent();

  const content = `
    <div class="greeting">
      Hello <span class="highlight">${data.patientName}</span>,
    </div>

    <div class="${updateInfo.box}">
      <h2 style="color: ${
        data.updateType === "cancelled"
          ? "#721c24"
          : data.updateType === "rescheduled"
          ? "#856404"
          : "#24AE7C"
      }; margin-bottom: 10px;">
        ${updateInfo.icon} ${updateInfo.title}
      </h2>
      <p>${updateInfo.message}</p>
    </div>

    ${
      data.updateType === "rescheduled" &&
      data.previousDate &&
      data.previousTime
        ? `
      <div class="info-box">
        <h4 style="margin-bottom: 10px; color: #0c5460;">Previous Appointment Details:</h4>
        <p><strong>Previous Date:</strong> ${data.previousDate}</p>
        <p><strong>Previous Time:</strong> ${data.previousTime}</p>
      </div>
    `
        : ""
    }

    ${
      data.updateType !== "cancelled"
        ? `
      <h3 style="color: #2c3e50; margin: 20px 0 10px 0;">
        ${data.updateType === "rescheduled" ? "New " : ""}Appointment Details
      </h3>
      ${appointmentDetailsSection(data)}
    `
        : `
      <div class="appointment-details">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Cancelled Appointment Details</h3>

        <div class="detail-row">
          <span class="detail-label">👨‍⚕️ Doctor:</span>
          <span class="detail-value">Dr. ${data.doctorName}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">📅 Original Date:</span>
          <span class="detail-value">${data.appointmentDate}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">🕒 Original Time:</span>
          <span class="detail-value">${data.appointmentTime}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">🆔 Appointment ID:</span>
          <span class="detail-value">${data.appointmentId}</span>
        </div>

        ${
          data.cancellationReason
            ? `
          <div class="detail-row">
            <span class="detail-label">📝 Cancellation Reason:</span>
            <span class="detail-value">${data.cancellationReason}</span>
          </div>
        `
            : ""
        }
      </div>
    `
    }

    ${
      data.updateType === "cancelled"
        ? `
      <div class="info-box">
        <p style="margin: 0; color: #0c5460;">
          <strong>Need a new appointment?</strong><br>
          We're here to help you reschedule. Please contact us or book online at your convenience.
        </p>
      </div>
    `
        : `
      <p style="margin: 20px 0; color: #555;">
        Please arrive <strong>15 minutes early</strong> for your appointment. Don't forget to bring:
      </p>

      <ul style="margin-left: 20px; color: #555;">
        <li>Valid photo ID</li>
        <li>Insurance card (if applicable)</li>
        <li>List of current medications</li>
        <li>Any relevant medical records</li>
      </ul>
    `
    }

    <center>
      <a href="${data.appointmentDetailsUrl}" class="button">${
    updateInfo.buttonText
  }</a>
    </center>

    <div class="warning-box">
      <p style="margin: 0; color: #856404;">
        <strong>Questions or concerns?</strong><br>
        Please don't hesitate to contact our support team. We're here to help!
      </p>
    </div>
  `;

  const emailTitle = `Appointment ${
    data.updateType === "scheduled"
      ? "Confirmed"
      : data.updateType === "rescheduled"
      ? "Rescheduled"
      : "Cancelled"
  } - Healio`;

  return baseEmailTemplate(content, emailTitle);
};

export type { AppointmentUpdateData };
