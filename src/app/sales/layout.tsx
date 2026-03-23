import Sidebar from "@/components/sidebar"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex">
            <Sidebar />

            <main className="flex-1 p-10 bg-gray-50 min-h-screen">
                {children}
            </main>
        </div>
    )
}