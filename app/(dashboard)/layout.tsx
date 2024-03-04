import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <div className=" text-violet-400">
        <Sidebar></Sidebar>
        </div>
      </div>
      <main className="md:pl-72">
        <Navbar></Navbar>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
