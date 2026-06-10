import { LoginForm } from "@/components/LoginForm";
import { StudentForm } from "@/components/StudentForm";
import { StudentList } from "@/components/StudentList";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-2xl font-bold text-center">
          Student Registration CRUD
        </h1>

        <div className="flex justify-center">
          <LoginForm />
        </div>

        <StudentForm />
        <StudentList />
      </div>
    </div>
  );
}
