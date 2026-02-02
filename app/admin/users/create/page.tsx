import Link from "next/link";
import CreateUserForm from "./_components/CreateUserForm";

export default function CreateUserPage() {
    return (
        <div>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block">
                ← Back to Users
            </Link>
            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New User</h1>
                <CreateUserForm />
            </div>
        </div>
    );
}
