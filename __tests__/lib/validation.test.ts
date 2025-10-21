import {
  CancelAppointmentSchema,
  CreateAppointmentSchema,
  getAppointmentSchema,
  PatientFormValidation,
  ScheduleAppointmentSchema,
  UserFormValidation,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("UserFormValidation", () => {
    const validUserData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
    };

    test("should validate correct user data", () => {
      const result = UserFormValidation.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    describe("name validation", () => {
      test("should reject names too short", () => {
        const result = UserFormValidation.safeParse({
          ...validUserData,
          name: "A",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Name must be at least 2 characters"
          );
        }
      });

      test("should reject names too long", () => {
        const result = UserFormValidation.safeParse({
          ...validUserData,
          name: "A".repeat(51),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Name must be at most 50 characters"
          );
        }
      });

      test("should accept valid name lengths", () => {
        const shortName = UserFormValidation.safeParse({
          ...validUserData,
          name: "Jo",
        });
        const longName = UserFormValidation.safeParse({
          ...validUserData,
          name: "A".repeat(50),
        });
        expect(shortName.success).toBe(true);
        expect(longName.success).toBe(true);
      });
    });

    describe("email validation", () => {
      test("should reject invalid email formats", () => {
        const invalidEmails = [
          "invalid-email",
          "@example.com",
          "user@",
          "user.example.com",
          "user@domain",
          "",
        ];

        invalidEmails.forEach((email) => {
          const result = UserFormValidation.safeParse({
            ...validUserData,
            email,
          });
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].message).toBe(
              "Invalid email address"
            );
          }
        });
      });

      test("should accept valid email formats", () => {
        const validEmails = [
          "user@example.com",
          "user.name@example.com",
          "user+tag@example.co.uk",
          "user123@test-domain.org",
        ];

        validEmails.forEach((email) => {
          const result = UserFormValidation.safeParse({
            ...validUserData,
            email,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("phone validation", () => {
      test("should reject invalid phone formats", () => {
        const invalidPhones = [
          "1234567890", // Missing +
          "+123", // Too short
          "+1234567890123456", // Too long
          "+abc1234567890", // Contains letters
          "123-456-7890", // Wrong format
          "",
        ];

        invalidPhones.forEach((phone) => {
          const result = UserFormValidation.safeParse({
            ...validUserData,
            phone,
          });
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0].message).toBe("Invalid phone number");
          }
        });
      });

      test("should accept valid phone formats", () => {
        const validPhones = [
          "+1234567890", // 10 digits
          "+123456789012345", // 15 digits
          "+91987654321", // Indian format
          "+447123456789", // UK format
        ];

        validPhones.forEach((phone) => {
          const result = UserFormValidation.safeParse({
            ...validUserData,
            phone,
          });
          expect(result.success).toBe(true);
        });
      });
    });
  });

  describe("PatientFormValidation", () => {
    const validPatientData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      birthDate: new Date("1990-01-01"),
      gender: "Male" as const,
      address: "123 Main Street, City, State",
      occupation: "Software Engineer",
      emergencyContactName: "Jane Doe",
      emergencyContactNumber: "+9876543210",
      primaryPhysician: "Dr. Smith",
      insuranceProvider: "Health Insurance Co",
      insurancePolicyNumber: "HIC123456",
      treatmentConsent: true,
      disclosureConsent: true,
      privacyConsent: true,
    };

    test("should validate correct patient data", () => {
      const result = PatientFormValidation.safeParse(validPatientData);
      expect(result.success).toBe(true);
    });

    describe("gender validation", () => {
      test("should accept valid gender values", () => {
        const genders = ["Male", "Female", "Other"];

        genders.forEach((gender) => {
          const result = PatientFormValidation.safeParse({
            ...validPatientData,
            gender,
          });
          expect(result.success).toBe(true);
        });
      });

      test("should reject invalid gender values", () => {
        const result = PatientFormValidation.safeParse({
          ...validPatientData,
          gender: "Invalid" as any,
        });
        expect(result.success).toBe(false);
      });
    });

    describe("address validation", () => {
      test("should reject addresses too short", () => {
        const result = PatientFormValidation.safeParse({
          ...validPatientData,
          address: "1234",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Address must be at least 5 characters"
          );
        }
      });

      test("should reject addresses too long", () => {
        const result = PatientFormValidation.safeParse({
          ...validPatientData,
          address: "A".repeat(501),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Address must be at most 500 characters"
          );
        }
      });
    });

    describe("consent validation", () => {
      test("should reject when treatment consent is false", () => {
        const result = PatientFormValidation.safeParse({
          ...validPatientData,
          treatmentConsent: false,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "You must consent to treatment in order to proceed"
          );
        }
      });

      test("should reject when disclosure consent is false", () => {
        const result = PatientFormValidation.safeParse({
          ...validPatientData,
          disclosureConsent: false,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "You must consent to disclosure in order to proceed"
          );
        }
      });

      test("should reject when privacy consent is false", () => {
        const result = PatientFormValidation.safeParse({
          ...validPatientData,
          privacyConsent: false,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "You must consent to privacy in order to proceed"
          );
        }
      });
    });

    describe("optional fields", () => {
      test("should accept patient data without optional fields", () => {
        const dataWithoutOptionals = {
          ...validPatientData,
          allergies: undefined,
          currentMedication: undefined,
          familyMedicalHistory: undefined,
          pastMedicalHistory: undefined,
          identificationType: undefined,
          identificationNumber: undefined,
          identificationDocument: undefined,
        };

        const result = PatientFormValidation.safeParse(dataWithoutOptionals);
        expect(result.success).toBe(true);
      });

      test("should accept patient data with optional fields", () => {
        const dataWithOptionals = {
          ...validPatientData,
          allergies: "Peanuts, Shellfish",
          currentMedication: "Aspirin 81mg daily",
          familyMedicalHistory: "Diabetes, Hypertension",
          pastMedicalHistory: "Appendectomy 2015",
          identificationType: "Driver License",
          identificationNumber: "DL123456789",
        };

        const result = PatientFormValidation.safeParse(dataWithOptionals);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Appointment Schemas", () => {
    const validAppointmentData = {
      primaryPhysician: "Dr. Smith",
      schedule: new Date("2024-01-15T10:00:00Z"),
      reason: "Regular checkup",
      note: "Patient requested morning appointment",
    };

    describe("CreateAppointmentSchema", () => {
      test("should validate correct appointment data", () => {
        const result = CreateAppointmentSchema.safeParse(validAppointmentData);
        expect(result.success).toBe(true);
      });

      test("should require reason field", () => {
        const { reason, ...dataWithoutReason } = validAppointmentData;
        const result = CreateAppointmentSchema.safeParse(dataWithoutReason);
        expect(result.success).toBe(false);
      });

      test("should reject reason that is too short", () => {
        const result = CreateAppointmentSchema.safeParse({
          ...validAppointmentData,
          reason: "A",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Reason must be at least 2 characters"
          );
        }
      });

      test("should reject reason that is too long", () => {
        const result = CreateAppointmentSchema.safeParse({
          ...validAppointmentData,
          reason: "A".repeat(501),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Reason must be at most 500 characters"
          );
        }
      });
    });

    describe("ScheduleAppointmentSchema", () => {
      test("should validate correct appointment data", () => {
        const result =
          ScheduleAppointmentSchema.safeParse(validAppointmentData);
        expect(result.success).toBe(true);
      });

      test("should accept appointment without reason (optional)", () => {
        const { reason, ...dataWithoutReason } = validAppointmentData;
        const result = ScheduleAppointmentSchema.safeParse(dataWithoutReason);
        expect(result.success).toBe(true);
      });
    });

    describe("CancelAppointmentSchema", () => {
      test("should validate correct appointment data", () => {
        const dataWithCancellation = {
          ...validAppointmentData,
          cancellationReason: "Patient unavailable",
        };
        const result = CancelAppointmentSchema.safeParse(dataWithCancellation);
        expect(result.success).toBe(true);
      });

      test("should accept appointment without cancellation reason (optional)", () => {
        const result = CancelAppointmentSchema.safeParse(validAppointmentData);
        expect(result.success).toBe(true);
      });
    });

    describe("Common validations across appointment schemas", () => {
      const schemas = [
        { name: "CreateAppointmentSchema", schema: CreateAppointmentSchema },
        {
          name: "ScheduleAppointmentSchema",
          schema: ScheduleAppointmentSchema,
        },
        { name: "CancelAppointmentSchema", schema: CancelAppointmentSchema },
      ];

      schemas.forEach(({ name, schema }) => {
        describe(name, () => {
          test("should require primaryPhysician", () => {
            const { primaryPhysician, ...dataWithoutPhysician } =
              validAppointmentData;
            const result = schema.safeParse(dataWithoutPhysician);
            expect(result.success).toBe(false);
          });

          test("should reject primaryPhysician that is too short", () => {
            const result = schema.safeParse({
              ...validAppointmentData,
              primaryPhysician: "A",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error.issues[0].message).toBe(
                "Select at least one doctor"
              );
            }
          });

          test("should require schedule date", () => {
            const { schedule, ...dataWithoutSchedule } = validAppointmentData;
            const result = schema.safeParse(dataWithoutSchedule);
            expect(result.success).toBe(false);
          });

          test("should accept valid date objects", () => {
            const result = schema.safeParse({
              ...validAppointmentData,
              schedule: new Date(),
            });
            expect(result.success).toBe(true);
          });
        });
      });
    });
  });

  describe("getAppointmentSchema function", () => {
    test('should return CreateAppointmentSchema for "create" type', () => {
      const schema = getAppointmentSchema("create");
      expect(schema).toBe(CreateAppointmentSchema);
    });

    test('should return CancelAppointmentSchema for "cancel" type', () => {
      const schema = getAppointmentSchema("cancel");
      expect(schema).toBe(CancelAppointmentSchema);
    });

    test("should return ScheduleAppointmentSchema for default/unknown types", () => {
      expect(getAppointmentSchema("schedule")).toBe(ScheduleAppointmentSchema);
      expect(getAppointmentSchema("unknown")).toBe(ScheduleAppointmentSchema);
      expect(getAppointmentSchema("")).toBe(ScheduleAppointmentSchema);
    });
  });
});
