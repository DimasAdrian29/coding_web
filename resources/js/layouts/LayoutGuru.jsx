import TeacherSidebar from '../components/layout/SidebarGuru';

export default function TeacherLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-display text-slate-900">
            <TeacherSidebar />
            <main className="ml-72 min-h-screen min-w-0 flex-1">{children}</main>
        </div>
    );
}
