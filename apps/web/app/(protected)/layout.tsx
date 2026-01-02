import AuthGuard from '@/components/AuthGuard'
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-[#f7f9ff] to-[#edf1f9]">
        <CollapsibleSidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 w-full px-6 lg:px-12 xl:px-16 py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
