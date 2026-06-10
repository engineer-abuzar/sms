import { validateStudentForm } from "@/helper/student";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { encryptStudentPayload } from "@/helper/student";
import { FormErrors } from "@/types/student";
import { StudentData } from "@/types/student";
import { StudentFormProps } from "@/types/student";
const emptyForm: StudentData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  courseEnrolled: "",
  password: "",
};




async function registerStudent(data: StudentData) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encryptStudentPayload(data)),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register student");
  }
  return response.json();
}

async function updateStudentApi(id: string, data: StudentData) {
  const response = await fetch(`/api/student/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encryptStudentPayload(data)),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update student");
  }
  return response.json();
}



export function StudentForm({
  mode = "create",
  studentId,
  initialData,
  onSuccess,
  onCancel,
  hideCard = false,
}: StudentFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<StudentData>(
    initialData || emptyForm
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setFormData(emptyForm);
      setErrors({});
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: StudentData) => updateStudentApi(studentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onSuccess?.();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (mode === "edit" && studentId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  const formContent = (
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            />
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseEnrolled">Course Enrolled</Label>
            <Input
              id="courseEnrolled"
              value={formData.courseEnrolled}
              onChange={(e) =>
                setFormData({ ...formData, courseEnrolled: e.target.value })
              }
            />
            {errors.courseEnrolled && (
              <p className="text-sm text-destructive">
                {errors.courseEnrolled}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : mode === "edit"
                  ? "Update Student"
                  : "Register Student"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          {createMutation.isSuccess && mode === "create" && (
            <p className="text-sm text-green-600 sm:col-span-2">
              Student registered successfully!
            </p>
          )}
          {mutationError && (
            <p className="text-sm text-destructive sm:col-span-2">
              {mutationError.message}
            </p>
          )}
        </form>
  );

  if (hideCard) {
    return formContent;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Student" : "Student Registration"}
        </CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
