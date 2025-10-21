import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
  StatusIcon,
} from "@/constants/index";

describe("Constants", () => {
  describe("GenderOptions", () => {
    test("should contain exactly three gender options", () => {
      expect(GenderOptions).toHaveLength(3);
    });

    test("should contain Male, Female, and Other options", () => {
      expect(GenderOptions).toEqual(["Male", "Female", "Other"]);
    });

    test("should contain only string values", () => {
      GenderOptions.forEach((option) => {
        expect(typeof option).toBe("string");
      });
    });

    test("should not contain empty strings", () => {
      GenderOptions.forEach((option) => {
        expect(option.trim()).not.toBe("");
      });
    });
  });

  describe("PatientFormDefaultValues", () => {
    test("should have all required string fields initialized as empty strings", () => {
      const stringFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "occupation",
        "emergencyContactName",
        "emergencyContactNumber",
        "primaryPhysician",
        "insuranceProvider",
        "insurancePolicyNumber",
        "allergies",
        "currentMedication",
        "familyMedicalHistory",
        "pastMedicalHistory",
        "identificationNumber",
      ];

      stringFields.forEach((field) => {
        expect(
          PatientFormDefaultValues[
            field as keyof typeof PatientFormDefaultValues
          ]
        ).toBe("");
      });
    });

    test("should have birthDate as a Date object", () => {
      expect(PatientFormDefaultValues.birthDate).toBeInstanceOf(Date);
    });

    test("should have gender defaulted to Male", () => {
      expect(PatientFormDefaultValues.gender).toBe("Male");
    });

    test("should have identificationType defaulted to Birth Certificate", () => {
      expect(PatientFormDefaultValues.identificationType).toBe(
        "Birth Certificate"
      );
    });

    test("should have identificationDocument as empty array", () => {
      expect(PatientFormDefaultValues.identificationDocument).toEqual([]);
      expect(
        Array.isArray(PatientFormDefaultValues.identificationDocument)
      ).toBe(true);
    });

    test("should have all consent fields defaulted to false", () => {
      expect(PatientFormDefaultValues.treatmentConsent).toBe(false);
      expect(PatientFormDefaultValues.disclosureConsent).toBe(false);
      expect(PatientFormDefaultValues.privacyConsent).toBe(false);
    });

    test("should have valid birth date within reasonable range", () => {
      const now = Date.now();
      const birthDate = PatientFormDefaultValues.birthDate.getTime();

      // Birth date should be within a day of current time (accounting for timezone differences)
      const timeDifference = Math.abs(now - birthDate);
      const oneDayInMs = 24 * 60 * 60 * 1000;

      expect(timeDifference).toBeLessThanOrEqual(oneDayInMs);
    });

    test("should contain all expected properties", () => {
      const expectedProperties = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "birthDate",
        "gender",
        "address",
        "occupation",
        "emergencyContactName",
        "emergencyContactNumber",
        "primaryPhysician",
        "insuranceProvider",
        "insurancePolicyNumber",
        "allergies",
        "currentMedication",
        "familyMedicalHistory",
        "pastMedicalHistory",
        "identificationType",
        "identificationNumber",
        "identificationDocument",
        "treatmentConsent",
        "disclosureConsent",
        "privacyConsent",
      ];

      expectedProperties.forEach((property) => {
        expect(PatientFormDefaultValues).toHaveProperty(property);
      });
    });
  });

  describe("IdentificationTypes", () => {
    test("should contain 11 identification types", () => {
      expect(IdentificationTypes).toHaveLength(11);
    });

    test("should contain expected identification types", () => {
      const expectedTypes = [
        "Birth Certificate",
        "Driver's License",
        "Medical Insurance Card/Policy",
        "Military ID Card",
        "National Identity Card",
        "Passport",
        "Resident Alien Card (Green Card)",
        "Social Security Card",
        "State ID Card",
        "Student ID Card",
        "Voter ID Card",
      ];

      expect(IdentificationTypes).toEqual(expectedTypes);
    });

    test("should not contain duplicate identification types", () => {
      const uniqueTypes = [...new Set(IdentificationTypes)];
      expect(uniqueTypes).toHaveLength(IdentificationTypes.length);
    });

    test("should contain only non-empty string values", () => {
      IdentificationTypes.forEach((type) => {
        expect(typeof type).toBe("string");
        expect(type.trim()).not.toBe("");
      });
    });

    test("should have Birth Certificate as first option", () => {
      expect(IdentificationTypes[0]).toBe("Birth Certificate");
    });
  });

  describe("Doctors", () => {
    test("should contain 9 doctors", () => {
      expect(Doctors).toHaveLength(9);
    });

    test("should have valid structure for each doctor", () => {
      Doctors.forEach((doctor) => {
        expect(doctor).toHaveProperty("image");
        expect(doctor).toHaveProperty("name");
        expect(typeof doctor.image).toBe("string");
        expect(typeof doctor.name).toBe("string");
      });
    });

    test("should have unique doctor names", () => {
      const names = Doctors.map((doctor) => doctor.name);
      const uniqueNames = [...new Set(names)];
      expect(uniqueNames).toHaveLength(names.length);
    });

    test("should have valid image paths", () => {
      Doctors.forEach((doctor) => {
        expect(doctor.image).toMatch(/^\/assets\/images\/dr-.*\.png$/);
      });
    });

    test("should have non-empty names", () => {
      Doctors.forEach((doctor) => {
        expect(doctor.name.trim()).not.toBe("");
      });
    });

    test("should include expected doctors", () => {
      const expectedNames = [
        "John Green",
        "Leila Cameron",
        "David Livingston",
        "Evan Peter",
        "Jane Powell",
        "Alex Ramirez",
        "Jasmine Lee",
        "Alyana Cruz",
        "Hardik Sharma",
      ];

      const doctorNames = Doctors.map((doctor) => doctor.name);
      expect(doctorNames).toEqual(expectedNames);
    });

    test("should have consistent image naming convention", () => {
      Doctors.forEach((doctor) => {
        const nameSlug = doctor.name.toLowerCase().split(" ")[1];
        expect(doctor.image).toContain(`dr-${nameSlug}`);
      });
    });
  });

  describe("StatusIcon", () => {
    test("should contain exactly three status types", () => {
      const statusKeys = Object.keys(StatusIcon);
      expect(statusKeys).toHaveLength(3);
    });

    test("should contain scheduled, pending, and cancelled statuses", () => {
      expect(StatusIcon).toHaveProperty("scheduled");
      expect(StatusIcon).toHaveProperty("pending");
      expect(StatusIcon).toHaveProperty("cancelled");
    });

    test("should have valid icon paths", () => {
      Object.values(StatusIcon).forEach((iconPath) => {
        expect(iconPath).toMatch(/^\/assets\/icons\/.*\.svg$/);
      });
    });

    test("should map to expected icon files", () => {
      expect(StatusIcon.scheduled).toBe("/assets/icons/check.svg");
      expect(StatusIcon.pending).toBe("/assets/icons/pending.svg");
      expect(StatusIcon.cancelled).toBe("/assets/icons/cancelled.svg");
    });

    test("should have only string values", () => {
      Object.values(StatusIcon).forEach((iconPath) => {
        expect(typeof iconPath).toBe("string");
      });
    });

    test("should not have empty icon paths", () => {
      Object.values(StatusIcon).forEach((iconPath) => {
        expect(iconPath.trim()).not.toBe("");
      });
    });
  });
});
