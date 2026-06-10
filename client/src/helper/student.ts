import { encryptData } from "@/utils/crypto";
import { FormErrors } from "@/types/student";
import { StudentData } from "@/types/student";
export function validateStudentForm(data: StudentData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }
  if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  if (!data.gender.trim()) errors.gender = "Gender is required";
  if (!data.address.trim()) errors.address = "Address is required";
  if (!data.courseEnrolled.trim())
    errors.courseEnrolled = "Course enrolled is required";
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
export function encryptStudentPayload(data: StudentData) {
  return {
    fullName: encryptData(data.fullName),
    email: encryptData(data.email),
    phoneNumber: encryptData(data.phoneNumber),
    dateOfBirth: encryptData(data.dateOfBirth),
    gender: encryptData(data.gender),
    address: encryptData(data.address),
    courseEnrolled: encryptData(data.courseEnrolled),
    password: encryptData(data.password),
  };
}
