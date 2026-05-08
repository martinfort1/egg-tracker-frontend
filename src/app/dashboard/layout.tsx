import Sidebar from "@/components/sidebar"
import ProtectedRoute from "@/components/protected-route"
import Footer from "@/components/footer"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="md:ml-64">
                <Sidebar />

                <main className="flex-1 md:mt-0 mt-8 mb-16 p-4 md:p-10 bg-gray-50 min-h-screen w-full">
                    {children}
                </main>
                <Footer/>
            </div>
        </ProtectedRoute>
    )
}