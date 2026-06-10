
export interface StudentData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  courseEnrolled?: string;
  password?: string;
}
export interface StudentFormProps {
  mode?: "create" | "edit";
  studentId?: string;
  initialData?: StudentData;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideCard?: boolean;
}