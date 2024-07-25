import Sidebar from "./_components/Sidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Sidebar />
      {children}
    </main>
  );
}