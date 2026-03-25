import Sidebar from "@/components/sidebar"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex">
            <Sidebar />

            <main className="flex-1 md:mt-0 mt-16 p-4 md:p-10 bg-gray-50 min-h-screen w-full">
                {children}
            </main>
        </div>
    )
}