// dashboard/page.tsx or wherever student lands
import StudentProjectsStatus from "../components/projects/MySubmissions";

export default function StudentDashboard() {
    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-4">Welcome Student</h1> */}
            <StudentProjectsStatus />
        </div>
    );
}
