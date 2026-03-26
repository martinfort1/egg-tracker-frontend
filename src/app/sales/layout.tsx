import ProtectedRoute from "@/components/protected-route"
import Sidebar from "@/components/sidebar"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>    
            <div className="flex">
                <Sidebar />

                <main className="flex-1 md:mt-0 mt-8 md:ml-64 p-4 md:p-10 bg-gray-50 min-h-screen w-full">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}