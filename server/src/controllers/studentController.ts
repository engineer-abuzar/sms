import { Request, Response } from "express";
import { Student } from "../models/Student";
import { encryptData, decryptData } from "../utils/crypto";

const STUDENT_FIELDS = [
  "fullName",
  "email",
  "phoneNumber",
  "dateOfBirth",
  "gender",
  "address",
  "courseEnrolled",
  "password",
] as const;

type StudentField = (typeof STUDENT_FIELDS)[number];
type EncryptedStudentPayload = Record<StudentField, string>;

function applyBackendEncryption(
  data: EncryptedStudentPayload
): EncryptedStudentPayload {
  const encrypted: Partial<EncryptedStudentPayload> = {};
  for (const field of STUDENT_FIELDS) {
    encrypted[field] = encryptData(data[field]);
  }
  return encrypted as EncryptedStudentPayload;
}

function removeBackendEncryption(
  data: EncryptedStudentPayload
): EncryptedStudentPayload {
  const decrypted: Partial<EncryptedStudentPayload> = {};
  for (const field of STUDENT_FIELDS) {
    decrypted[field] = decryptData(data[field]);
  }
  return decrypted as EncryptedStudentPayload;
}

export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const frontendEncrypted = req.body as EncryptedStudentPayload;

    for (const field of STUDENT_FIELDS) {
      if (!frontendEncrypted[field]) {
        res.status(400).json({ message: `${field} is required` });
        return;
      }
    }

    const doubleEncrypted = applyBackendEncryption(frontendEncrypted);
    const student = await Student.create(doubleEncrypted);

    res.status(201).json({
      message: "Student registered successfully",
      id: student._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student", error });
  }
};

export const getStudents = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await Student.find().lean();

    const result = students.map((student) => {
      const encryptedPayload: EncryptedStudentPayload = {
        fullName: student.fullName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        address: student.address,
        courseEnrolled: student.courseEnrolled,
        password: student.password,
      };

      const frontendEncrypted = removeBackendEncryption(encryptedPayload);

      return {
        id: student._id,
        ...frontendEncrypted,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const frontendEncrypted = req.body as EncryptedStudentPayload;

    for (const field of STUDENT_FIELDS) {
      if (!frontendEncrypted[field]) {
        res.status(400).json({ message: `${field} is required` });
        return;
      }
    }

    const doubleEncrypted = applyBackendEncryption(frontendEncrypted);
    const student = await Student.findByIdAndUpdate(id, doubleEncrypted, {
      new: true,
    });

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error });
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error });
  }
};
