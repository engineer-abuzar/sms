import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { decryptData } from "@/utils/crypto";
import { StudentForm,  } from "@/components/StudentForm";
import type { StudentData } from "@/types/student";

interface EncryptedStudent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

interface DecryptedStudent {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
}

async function fetchStudents(): Promise<EncryptedStudent[]> {
  const response = await fetch("/api/students");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch students");
  }
  return response.json();
}

async function deleteStudent(id: string) {
  const response = await fetch(`/api/student/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete student");
  }
  return response.json();
}

function decryptStudent(student: EncryptedStudent): DecryptedStudent {
  return {
    id: student.id,
    fullName: decryptData(student.fullName),
    email: decryptData(student.email),
    phoneNumber: decryptData(student.phoneNumber),
    dateOfBirth: decryptData(student.dateOfBirth),
    gender: decryptData(student.gender),
    address: decryptData(student.address),
    courseEnrolled: decryptData(student.courseEnrolled),
  };
}

export function StudentList() {
  const queryClient = useQueryClient();
  const [editingStudent, setEditingStudent] = useState<{
    id: string;
    data: StudentData;
  } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const students = data?.map(decryptStudent) ?? [];

  const handleEdit = (student: EncryptedStudent) => {
    setEditingStudent({
      id: student.id,
      data: {
        fullName: decryptData(student.fullName),
        email: decryptData(student.email),
        phoneNumber: decryptData(student.phoneNumber),
        dateOfBirth: decryptData(student.dateOfBirth),
        gender: decryptData(student.gender),
        address: decryptData(student.address),
        courseEnrolled: decryptData(student.courseEnrolled),
        password: decryptData(student.password),
      },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {error && (
            <p className="text-sm text-destructive">
              {(error as Error).message}
            </p>
          )}
          {!isLoading && !error && students.length === 0 && (
            <p className="text-sm text-muted-foreground">No students found.</p>
          )}
          {students.length > 0 && (
            <div className="space-y-4">
              {students.map((student) => {
                const encrypted = data!.find((s) => s.id === student.id)!;
                return (
                  <div
                    key={student.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="grid gap-1 sm:grid-cols-2">
                      <p>
                        <span className="font-medium">Full Name:</span>{" "}
                        {student.fullName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {student.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone Number:</span>{" "}
                        {student.phoneNumber}
                      </p>
                      <p>
                        <span className="font-medium">Date of Birth:</span>{" "}
                        {student.dateOfBirth}
                      </p>
                      <p>
                        <span className="font-medium">Gender:</span>{" "}
                        {student.gender}
                      </p>
                      <p>
                        <span className="font-medium">Course Enrolled:</span>{" "}
                        {student.courseEnrolled}
                      </p>
                      <p className="sm:col-span-2">
                        <span className="font-medium">Address:</span>{" "}
                        {student.address}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(encrypted)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={editingStudent !== null}
        onOpenChange={(open) => !open && setEditingStudent(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <StudentForm
              mode="edit"
              studentId={editingStudent.id}
              initialData={editingStudent.data}
              onSuccess={() => setEditingStudent(null)}
              onCancel={() => setEditingStudent(null)}
              hideCard
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
