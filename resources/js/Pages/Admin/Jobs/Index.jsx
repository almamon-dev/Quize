import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Activity,
    Users,
    Briefcase,
    MapPin,
    DollarSign,
    GraduationCap,
    Clock,
    Building2
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ jobs, departments }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this job posting?")) {
            router.delete(route("admin.jobs.destroy", id));
        }
    };

    // Stats Calculation
    const stats = useMemo(() => {
        const total = jobs.length;
        const active = jobs.filter(j => j.status === 'active').length;
        const totalApplications = jobs.reduce((acc, j) => acc + (j.applications_count || 0), 0);
        const fullTime = jobs.filter(j => j.type === 'full_time').length;

        return { total, active, totalApplications, fullTime };
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "all" || job.status === statusFilter;
            const matchesDept = departmentFilter === "all" || job.department === departmentFilter;
            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [jobs, searchQuery, statusFilter, departmentFilter]);

    return (
        <AdminLayout>
            <Head title="Manage Jobs" />

            <div className="space-y-6 max-w-8xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Job Postings</h1>
                        <p className="text-sm text-gray-500 font-medium">Manage your company vacancies and hiring pipeline</p>
                    </div>
                    <Link
                        href={route("admin.jobs.create")}
                        className="inline-flex items-center px-6 py-2.5 bg-[#4F46E5] text-white font-bold rounded-sm hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                        Create Job
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<Briefcase className="w-5 h-5" />} 
                        label="Total Postings" 
                        value={stats.total} 
                        color="bg-blue-50 text-blue-600" 
                    />
                    <StatCard 
                        icon={<Activity className="w-5 h-5" />} 
                        label="Active Jobs" 
                        value={stats.active} 
                        color="bg-emerald-50 text-emerald-600" 
                    />
                    <StatCard 
                        icon={<Users className="w-5 h-5" />} 
                        label="Total Applicants" 
                        value={stats.totalApplications} 
                        color="bg-purple-50 text-purple-600" 
                    />
                    <StatCard 
                        icon={<Clock className="w-5 h-5" />} 
                        label="Full-time" 
                        value={stats.fullTime} 
                        color="bg-amber-50 text-amber-600" 
                    />
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-3 sm:p-4 rounded-sm border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search jobs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-gray-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-gray-50/30"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select 
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="px-4 py-2 border-gray-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-gray-50/30 min-w-[140px] h-auto">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select 
                            value={departmentFilter}
                            onValueChange={setDepartmentFilter}
                        >
                            <SelectTrigger className="px-4 py-2 border-gray-100 rounded-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-gray-50/30 min-w-[180px] h-auto">
                                <SelectValue placeholder="Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Departments</SelectItem>
                                {departments?.map(dept => (
                                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            handleDelete={handleDelete} 
                        />
                    ))}

                    {filteredJobs.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-sm border-2 border-dashed border-gray-100">
                            <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No job postings found</h3>
                            <p className="text-gray-500 mt-2 font-medium max-w-sm mx-auto">
                                We couldn't find any job postings matching your current search or filter.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDepartmentFilter("all"); }}
                                className="mt-6 text-indigo-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md group">
        <div className={`w-12 h-12 flex items-center justify-center rounded-sm transition-transform group-hover:scale-110 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const JobCard = ({ job, handleDelete }) => {
    const isActive = job.status === "active";
    
    return (
        <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
            <div className="p-6 sm:p-7 flex-1">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 rounded-sm flex items-center justify-center border border-indigo-100/50">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                        {isActive ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Published
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Link
                            href={route("admin.quizzes.create", { job_id: job.id })}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm"
                            title="Create Quiz"
                        >
                            <GraduationCap className="w-4 h-4" />
                        </Link>
                        <Link
                            href={route("admin.jobs.edit", job.id)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                    {job.title}
                </h3>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        {job.department}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.city}, {job.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        USD {parseFloat(job.salary_from).toLocaleString()} - {parseFloat(job.salary_to).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 capitalize">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {job.type ? job.type.replace("_", " ") : "Full-time"}
                    </div>
                </div>

                <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Users className="w-4 h-4 text-gray-400" />
                        {job.applications_count || 0} applicants
                    </div>
                    <Link
                        href={route("admin.jobs.show", job.id)}
                        className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                    >
                        Manage Job
                    </Link>
                </div>
            </div>
        </div>
    );
};
