// StudentRankingPage.tsx - Advanced UI/UX Version
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ChevronDownIcon, MagnifyingGlassIcon as SearchIcon, ArrowDownTrayIcon as DownloadIcon, ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline';

// --- Type Definitions ---
interface Student {
    student_id: string;
    student_name: string;
    photo?: string;
    course_name: string;
    level_name: string;
    overall_percentage: number;
    performance_category: string;
    gpa: number;
    module_completion_rate: number;
    course_rank: number;
    total_students_in_course: number;
    department_rank: number;
    total_students_in_department: number;
    overall_rank: number;
}

interface Summary {
    total_students?: number;
    avg_overall_percentage?: number;
    avg_gpa?: number;
    excellent_count?: number;
}

interface Department {
    id: string;
    name: string;
}

interface Course {
    id: string;
    name: string;
}

interface Filters {
    search_term: string;
    department_id: string;
    course_id: string;
    sort_by: string;
    sort_order: string;
    page: number;
    limit: number;
}

// --- Mock Data Fetching (Replace with actual API calls to your lookups) ---
const fetchDepartments = async (): Promise<Department[]> => [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Electrical Engineering' },
    // ... more
];

const fetchCourses = async (departmentId: string): Promise<Course[]> => {
    // Mock filtering based on departmentId
    if (departmentId === '1') return [
        { id: 'CS101', name: 'Data Structures' },
        { id: 'CS205', name: 'Algorithms' }
    ];
    if (departmentId === '2') return [
        { id: 'EE101', name: 'Circuit Theory' },
        { id: 'EE202', name: 'Digital Logic' }
    ];
    return [];
};
// --------------------------------------------------------------------------

const StudentRankingPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [summary, setSummary] = useState<Summary>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    // Combined and extended filters
    const [filters, setFilters] = useState<Filters>({
        search_term: '', // New: For student name/ID search
        department_id: '',
        course_id: '',
        sort_by: 'overall_rank',
        sort_order: 'asc',
        page: 1,
        limit: 10, // Reduced for better pagination flow
    });

    // Fetches departments and initial rankings on mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const deptData = await fetchDepartments();
                setDepartments(deptData);
                // The main ranking fetch will run via the second useEffect
            } catch (err) {
                console.error("Failed to load initial data:", err);
                setError("Failed to load department data.");
            }
        };
        loadInitialData();
    }, []);

    // Fetches courses whenever department changes
    useEffect(() => {
        const loadCourses = async () => {
            setCourses([]);
            setFilters(prev => ({ ...prev, course_id: '' })); // Reset course when department changes
            if (filters.department_id) {
                try {
                    const courseData = await fetchCourses(filters.department_id);
                    setCourses(courseData);
                } catch (err) {
                    console.error("Failed to load course data:", err);
                }
            }
        };
        loadCourses();
    }, [filters.department_id]);


    // Main API call is memoized to prevent unnecessary re-creation
    const fetchRankings = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const params = new URLSearchParams();
            (Object.entries(filters) as [keyof Filters, Filters[keyof Filters]][]).forEach(([key, value]) => {
                params.append(key, String(value));
            });
            // API endpoint remains the same, ensuring compatibility
            const response = await axios.get(`/api/ranking/overall?${params}`);

            if (response.data.success) {
                setStudents(response.data.students || []);
                setSummary(response.data.summary || {});
            } else {
                 setError(response.data.message || 'An unknown error occurred.');
            }
        } catch (err) {
            console.error('Error fetching rankings:', err);
            setError('Could not connect to the ranking service. Please check your network.');
        } finally {
            setLoading(false);
        }
    }, [filters]); // Re-runs whenever filters object changes

    // Effect to call API on filter change
    useEffect(() => {
        fetchRankings();
    }, [filters, fetchRankings]); // fetchRankings is stable due to useCallback

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => {
            // Reset page on any significant filter change (not just sort/order)
            const resetPage = (key !== 'page' && key !== 'sort_by' && key !== 'sort_order');
            return { 
                ...prev, 
                [key]: value, 
                page: resetPage ? 1 : prev.page 
            };
        });
    }, []);

    // Helper functions (kept simple for brevity)
    const getPerformanceColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-50 text-green-700 ring-green-600/20';
        if (percentage >= 60) return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
        return 'bg-red-50 text-red-700 ring-red-600/20';
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    const totalPages = useMemo(() => {
        return Math.ceil((summary.total_students || 0) / filters.limit);
    }, [summary.total_students, filters.limit]);


    // --- Advanced UI Components ---

    const LoadingState = () => (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-xl animate-pulse">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-600">Loading student rankings...</span>
        </div>
    );

    const ErrorState = ({ message }) => (
        <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p className="font-bold">Data Fetch Error</p>
            <p className="text-sm">{message}</p>
            <button 
                className="mt-3 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 flex items-center mx-auto"
                onClick={fetchRankings}
            >
                <RefreshIcon className="w-4 h-4 mr-2" /> Try Again
            </button>
        </div>
    );
    
    // --- Render Logic ---
    if (error) {
        return <div className="container mx-auto px-4 py-8"><ErrorState message={error} /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">🎓 Student Ranking Dashboard</h1>
                    <p className="text-gray-500 mt-1">Real-time performance metrics and comprehensive ranking.</p>
                </div>
                <button 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={fetchRankings}
                    disabled={loading}
                >
                    <RefreshIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </header>

            {/* Summary Cards (Enhanced Styling) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Summary data mapping for scalability and cleaner rendering */}
                {[
                    { title: "Total Students", value: summary.total_students || 0, color: "text-blue-600", icon: "👥" },
                    { title: "Avg. Performance", value: `${(summary.avg_overall_percentage != null ? parseFloat(String(summary.avg_overall_percentage)).toFixed(1) : '0.0')}%`, color: "text-green-600", icon: "📊" },
                    { title: "Average GPA", value: summary.avg_gpa != null ? parseFloat(String(summary.avg_gpa)).toFixed(2) : '0.00', color: "text-purple-600", icon: "⭐" },
                    { title: "Top Performers", value: summary.excellent_count || 0, color: "text-yellow-600", icon: "🏆" },
                ].map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-100 hover:border-blue-500 transition-colors">
                        <div className="text-sm font-medium text-gray-500">{card.title}</div>
                        <div className={`mt-1 text-3xl font-bold ${card.color}`}>
                            {card.icon} {card.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Filters & Search */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    
                    {/* Search Field (New Feature) */}
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="search_term" className="block text-sm font-semibold text-gray-700 mb-1">Search Student (Name or ID)</label>
                        <div className="relative">
                            <input
                                id="search_term"
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="E.g., John Doe or 12345"
                                value={filters.search_term}
                                onChange={(e) => handleFilterChange('search_term', e.target.value)}
                            />
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Department Filter */}
                    <div>
                        <label htmlFor="department_id" className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <select 
                            id="department_id"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filters.department_id}
                            onChange={(e) => handleFilterChange('department_id', e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course Filter */}
                    <div>
                        <label htmlFor="course_id" className="block text-sm font-semibold text-gray-700 mb-1">Course</label>
                        <select 
                            id="course_id"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filters.course_id}
                            disabled={!filters.department_id || courses.length === 0}
                            onChange={(e) => handleFilterChange('course_id', e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Dropdown (Combined Sort By & Order) */}
                    <div>
                        <label htmlFor="sort_by_full" className="block text-sm font-semibold text-gray-700 mb-1">Sort & Order</label>
                        <select 
                            id="sort_by_full"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            value={`${filters.sort_by}_${filters.sort_order}`}
                            onChange={(e) => {
                                const [sort_by, sort_order] = e.target.value.split('_');
                                handleFilterChange('sort_by', sort_by);
                                handleFilterChange('sort_order', sort_order);
                            }}
                        >
                            <option value="overall_rank_asc">Rank (Low to High)</option>
                            <option value="overall_rank_desc">Rank (High to Low)</option>
                            <option value="overall_percentage_desc">Performance % (High to Low)</option>
                            <option value="overall_percentage_asc">Performance % (Low to High)</option>
                            <option value="gpa_desc">GPA (High to Low)</option>
                            <option value="gpa_asc">GPA (Low to High)</option>
                            <option value="student_name_asc">Name (A-Z)</option>
                            <option value="student_name_desc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Rankings Table */}
            {loading ? <LoadingState /> : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Updated Header for better sorting UX */}
                                {['Rank', 'Student', 'Course & Level', 'Performance', 'GPA', 'Completion', 'Course Rank', 'Dept Rank'].map((header, index) => (
                                    <th 
                                        key={index}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            const sortMap = {
                                                'Rank': 'overall_rank',
                                                'Performance': 'overall_percentage',
                                                'GPA': 'gpa',
                                            };
                                            const newSortBy = sortMap[header] || filters.sort_by;
                                            if (sortMap[header]) {
                                                const newOrder = (filters.sort_by === newSortBy && filters.sort_order === 'desc') ? 'asc' : 'desc';
                                                handleFilterChange('sort_by', newSortBy);
                                                handleFilterChange('sort_order', newOrder);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center">
                                            {header}
                                            {/* Show sort indicator only for sortable columns */}
                                            {header === 'Rank' && filters.sort_by === 'overall_rank' && (
                                                <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform ${filters.sort_order === 'asc' ? 'transform rotate-180' : ''}`} />
                                            )}
                                            {header === 'Performance' && filters.sort_by === 'overall_percentage' && (
                                                <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform ${filters.sort_order === 'asc' ? 'transform rotate-180' : ''}`} />
                                            )}
                                            {header === 'GPA' && filters.sort_by === 'gpa' && (
                                                <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform ${filters.sort_order === 'asc' ? 'transform rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {students.length > 0 ? students.map((student) => (
                                <tr key={student.student_id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-xl font-extrabold text-blue-700">
                                            {getRankBadge(student.overall_rank)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {/* Fallback avatar added */}
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-800 font-bold text-sm">
                                                {student.photo ? (
                                                     <img className="h-full w-full rounded-full object-cover" src={student.photo} alt={student.student_name} />
                                                ) : (
                                                    student.student_name ? student.student_name[0] : 'N/A'
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">{student.student_name}</div>
                                                <div className="text-xs text-gray-500">ID: {student.student_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{student.course_name}</div>
                                        <div className="text-xs text-gray-500">{student.level_name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ring-1 ring-inset ${getPerformanceColor(student.overall_percentage)}`}>
                                            {student.overall_percentage?.toFixed(1) || 'N/A'}%
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">{student.performance_category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-xl font-extrabold text-gray-900">{student.gpa?.toFixed(2) || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                                    style={{ width: `${student.module_completion_rate || 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">{student.module_completion_rate || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-lg text-gray-900">{student.course_rank}</span>
                                        <div className="text-xs text-gray-500">of {student.total_students_in_course}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-lg text-gray-900">{student.department_rank}</span>
                                        <div className="text-xs text-gray-500">of {student.total_students_in_department}</div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No students found matching the current filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Footer: Pagination & Export */}
            <div className="flex justify-between items-center pt-4">
                
                {/* Items per page control */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <label htmlFor="limit_select">Items per page:</label>
                    <select
                        id="limit_select"
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
                        className="border rounded px-2 py-1"
                    >
                        {[10, 20, 50, 100].map(limit => (
                            <option key={limit} value={limit}>{limit}</option>
                        ))}
                    </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                    <button 
                        className="px-4 py-2 border rounded-l-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={filters.page === 1}
                        onClick={() => handleFilterChange('page', filters.page - 1)}
                    >
                        Previous
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                        Page **{filters.page}** of **{totalPages}**
                    </span>
                    <button 
                        className="px-4 py-2 border rounded-r-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={filters.page >= totalPages}
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                    >
                        Next
                    </button>
                </div>

                {/* Export Button */}
                <a
                    href={`/api/ranking/export?format=csv&${(() => {
                        const params = new URLSearchParams();
                        Object.entries(filters).forEach(([key, value]) => {
                            params.append(key, String(value));
                        });
                        return params.toString();
                    })()}`} // Export applies current filters
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    download
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export Current View
                </a>
            </div>
        </div>
    );
};

export default StudentRankingPage;