import {
  cn,
  convertFileToUrl,
  decryptKey,
  encryptKey,
  formatDateTime,
  parseStringify,
} from "@/lib/utils";

describe("Utils Functions", () => {
  describe("cn function", () => {
    test("should merge classes correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    test("should handle conditional classes", () => {
      expect(cn("base-class", true && "conditional-class")).toBe(
        "base-class conditional-class"
      );
      expect(cn("base-class", false && "conditional-class")).toBe("base-class");
    });

    test("should override conflicting Tailwind classes", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    test("should handle empty inputs", () => {
      expect(cn()).toBe("");
      expect(cn("")).toBe("");
    });

    test("should handle undefined and null values", () => {
      expect(cn("base", undefined, null, "end")).toBe("base end");
    });
  });

  describe("parseStringify function", () => {
    test("should stringify and parse objects correctly", () => {
      const obj = { name: "John", age: 30 };
      const result = parseStringify(obj);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be a new object
    });

    test("should handle arrays", () => {
      const arr = [1, 2, 3, { nested: true }];
      const result = parseStringify(arr);
      expect(result).toEqual(arr);
      expect(result).not.toBe(arr);
    });

    test("should handle primitives", () => {
      expect(parseStringify("string")).toBe("string");
      expect(parseStringify(123)).toBe(123);
      expect(parseStringify(true)).toBe(true);
      expect(parseStringify(null)).toBe(null);
    });

    test("should remove functions and undefined values", () => {
      const obj = {
        name: "John",
        fn: () => {},
        undefinedValue: undefined,
        age: 30,
      };
      const result = parseStringify(obj);
      expect(result).toEqual({ name: "John", age: 30 });
      expect(result.fn).toBeUndefined();
      expect(result.undefinedValue).toBeUndefined();
    });

    test("should handle dates by converting to strings", () => {
      const date = new Date("2023-01-01");
      const obj = { date };
      const result = parseStringify(obj);
      expect(typeof result.date).toBe("string");
      expect(result.date).toBe(date.toISOString());
    });
  });

  describe("convertFileToUrl function", () => {
    beforeEach(() => {
      global.URL.createObjectURL = jest.fn(() => "mocked-url");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should convert file to URL", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const result = convertFileToUrl(file);

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
      expect(result).toBe("mocked-url");
    });

    test("should handle different file types", () => {
      const imageFile = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const result = convertFileToUrl(imageFile);

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(imageFile);
      expect(result).toBe("mocked-url");
    });
  });

  describe("formatDateTime function", () => {
    const mockDate = new Date("2023-10-15T14:30:00Z");

    test("should format date and time correctly", () => {
      const result = formatDateTime(mockDate, "UTC");

      expect(result).toHaveProperty("dateTime");
      expect(result).toHaveProperty("dateDay");
      expect(result).toHaveProperty("dateOnly");
      expect(result).toHaveProperty("timeOnly");

      expect(typeof result.dateTime).toBe("string");
      expect(typeof result.dateDay).toBe("string");
      expect(typeof result.dateOnly).toBe("string");
      expect(typeof result.timeOnly).toBe("string");
    });

    test("should handle string dates", () => {
      const dateString = "2023-10-15T14:30:00Z";
      const result = formatDateTime(dateString, "UTC");

      expect(result).toHaveProperty("dateTime");
      expect(result).toHaveProperty("dateDay");
      expect(result).toHaveProperty("dateOnly");
      expect(result).toHaveProperty("timeOnly");
    });

    test("should use default timezone when not provided", () => {
      const result = formatDateTime(mockDate);

      expect(result).toHaveProperty("dateTime");
      expect(result).toHaveProperty("dateDay");
      expect(result).toHaveProperty("dateOnly");
      expect(result).toHaveProperty("timeOnly");
    });

    test("should handle different timezones", () => {
      const utcResult = formatDateTime(mockDate, "UTC");
      const pstResult = formatDateTime(mockDate, "America/Los_Angeles");

      // Results should be different due to timezone
      expect(utcResult.timeOnly).not.toBe(pstResult.timeOnly);
    });
  });

  describe("encryptKey function", () => {
    test("should encrypt passkey using base64", () => {
      const passkey = "mySecretKey123";
      const encrypted = encryptKey(passkey);

      expect(encrypted).toBe(btoa(passkey));
      expect(encrypted).not.toBe(passkey);
    });

    test("should handle empty string", () => {
      const encrypted = encryptKey("");
      expect(encrypted).toBe(btoa(""));
    });

    test("should handle special characters", () => {
      const passkey = "test@#$%^&*()_+";
      const encrypted = encryptKey(passkey);
      expect(encrypted).toBe(btoa(passkey));
    });
  });

  describe("decryptKey function", () => {
    test("should decrypt base64 encoded key", () => {
      const originalKey = "mySecretKey123";
      const encrypted = btoa(originalKey);
      const decrypted = decryptKey(encrypted);

      expect(decrypted).toBe(originalKey);
    });

    test("should handle empty string", () => {
      const encrypted = btoa("");
      const decrypted = decryptKey(encrypted);
      expect(decrypted).toBe("");
    });

    test("should handle special characters", () => {
      const originalKey = "test@#$%^&*()_+";
      const encrypted = btoa(originalKey);
      const decrypted = decryptKey(encrypted);

      expect(decrypted).toBe(originalKey);
    });

    test("should work with encryptKey function (round trip)", () => {
      const originalKey = "testPasskey123";
      const encrypted = encryptKey(originalKey);
      const decrypted = decryptKey(encrypted);

      expect(decrypted).toBe(originalKey);
    });
  });
});
