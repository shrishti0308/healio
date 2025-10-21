// Shared CSS styles for email templates
export const emailStyles = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8f9fa;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #24AE7C 0%, #0D2A1F 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }

    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .header-subtitle {
      font-size: 16px;
      opacity: 0.9;
    }

    .content {
      padding: 30px 20px;
    }

    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .confirmation-box {
      background-color: #f8f9fa;
      border-left: 4px solid #24AE7C;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .update-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .cancellation-box {
      background-color: #f8d7da;
      border-left: 4px solid #dc3545;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .appointment-details {
      background-color: #ffffff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: #555;
      flex: 1;
    }

    .detail-value {
      flex: 2;
      text-align: right;
      color: #333;
    }

    .highlight {
      color: #24AE7C;
      font-weight: 600;
    }

    .warning {
      color: #856404;
      font-weight: 600;
    }

    .danger {
      color: #721c24;
      font-weight: 600;
    }

    .button {
      display: inline-block;
      background-color: #24AE7C;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }

    .button-secondary {
      background-color: #6c757d;
    }

    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e9ecef;
    }

    .contact-info {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e9ecef;
    }

    .info-box {
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
      border-radius: 5px;
      padding: 15px;
      margin: 20px 0;
    }

    .warning-box {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 5px;
      padding: 15px;
      margin: 20px 0;
    }

    @media (max-width: 600px) {
      .container {
        margin: 10px;
      }

      .header, .content, .footer {
        padding: 20px 15px;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-value {
        text-align: left;
        margin-top: 5px;
      }
    }
  </style>
`;

// Reusable header component
export const emailHeader = (title: string = "Healio") => `
  <div class="header">
    <div class="logo">Healio</div>
    <div class="header-subtitle">Your Healthcare Partner</div>
  </div>
`;

// Reusable appointment details component
export const appointmentDetailsSection = (data: {
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  appointmentId: string;
}) => `
  <div class="appointment-details">
    <h3 style="color: #2c3e50; margin-bottom: 15px;">Appointment Details</h3>

    <div class="detail-row">
      <span class="detail-label">👨‍⚕️ Doctor:</span>
      <span class="detail-value">Dr. ${data.doctorName}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">📅 Date:</span>
      <span class="detail-value">${data.appointmentDate}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">🕒 Time:</span>
      <span class="detail-value">${data.appointmentTime}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">📝 Reason:</span>
      <span class="detail-value">${data.reason}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">🆔 Appointment ID:</span>
      <span class="detail-value">${data.appointmentId}</span>
    </div>
  </div>
`;

// Reusable footer component
export const emailFooter = () => `
  <div class="footer">
    <p>&copy; 2025 Healio. All rights reserved.</p>

    <div class="contact-info">
      <p><strong>Contact Information:</strong></p>
      <p>📞 Phone: +91 98765 43210</p>
      <p>📧 Email: support@healio.com</p>
      <p>🏥 Address: 123 Random Street, Random City, Random State - 123456</p>
    </div>

    <p style="margin-top: 15px; font-size: 12px; color: #888;">
      This is an automated message. Please do not reply to this email.
    </p>

    <div class="warning-box">
      <p style="margin: 0; color: #856404;">
        <strong>You might have received an SMS on your registered number. If not,</strong><br>
        Don't worry—we'll add you to our SMS list soon!
      </p>
    </div>
  </div>
`;

// Base email template structure
export const baseEmailTemplate = (
  content: string,
  title: string = "Healio Healthcare"
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${emailStyles}
  </head>
  <body>
    <div class="container">
      ${emailHeader()}
      <div class="content">
        ${content}
      </div>
      ${emailFooter()}
    </div>
  </body>
  </html>
`;
