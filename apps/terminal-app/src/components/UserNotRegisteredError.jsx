import { AlertCircle } from "lucide-react";

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          משתמש לא רשום
        </h1>
        <p className="text-gray-600">
          נראה שאתה לא רשום במערכת. אנא פנה למנהל המערכת.
        </p>
      </div>
    </div>
  );
}