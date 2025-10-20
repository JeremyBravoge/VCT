
import { useState, useEffect } from 'react'
import { 
  supabase, 
  getStudents, 
  getAssessments,
  getBranchAnalytics,
  subscribeToStudents, 
  subscribeToBranchData,
  subscribeToAssessments,
  subscribeToAttendance,
  Student, 
  Assessment,
  SystemUser 
} from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// Enhanced Students Hook with Real-time Updates
export const useStudents = (filters?: {
  search?: string
  level?: string
  status?: string
  gender?: string
  limit?: number
  offset?: number
}) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.branch_id) return

    const fetchStudents = async () => {
      try {
        setLoading(true)
        const { data, error } = await getStudents(user.branch_id, filters)
        
        if (error) {
          setError(error.message)
        } else {
          setStudents(data || [])
          setTotal(data?.length || 0)
        }
      } catch (err: any) {
        setError('Failed to fetch students')
        console.error('Error fetching students:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()

    // Set up real-time subscription
    const subscription = subscribeToStudents(user.branch_id, (payload) => {
      console.log('Real-time student update:', payload)
      
      if (payload.eventType === 'INSERT') {
        setStudents(prev => [payload.new, ...prev])
        setTotal(prev => prev + 1)
      } else if (payload.eventType === 'UPDATE') {
        setStudents(prev => prev.map(student => 
          student.id === payload.new.id ? { ...student, ...payload.new } : student
        ))
      } else if (payload.eventType === 'DELETE') {
        setStudents(prev => prev.filter(student => student.id !== payload.old.id))
        setTotal(prev => prev - 1)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.branch_id, filters?.search, filters?.level, filters?.status, filters?.gender])

  const refetch = async () => {
    if (user?.branch_id) {
      const { data } = await getStudents(user.branch_id, filters)
      setStudents(data || [])
      setTotal(data?.length || 0)
    }
  }

  return { students, loading, error, total, refetch }
}

// Enhanced Assessments Hook with Real-time Updates
export const useAssessments = (filters?: {
  teacher_id?: string
  class_id?: string
  subject_id?: string
  assessment_type?: string
  date_from?: string
  date_to?: string
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.branch_id) return

    const fetchAssessments = async () => {
      try {
        setLoading(true)
        const { data, error } = await getAssessments(user.branch_id, filters)
        
        if (error) {
          setError(error.message)
        } else {
          setAssessments(data || [])
        }
      } catch (err: any) {
        setError('Failed to fetch assessments')
        console.error('Error fetching assessments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()

    // Set up real-time subscription
    const subscription = subscribeToAssessments(user.branch_id, (payload) => {
      console.log('Real-time assessment update:', payload)
      
      if (payload.eventType === 'INSERT') {
        setAssessments(prev => [payload.new, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setAssessments(prev => prev.map(assessment => 
          assessment.id === payload.new.id ? { ...assessment, ...payload.new } : assessment
        ))
      } else if (payload.eventType === 'DELETE') {
        setAssessments(prev => prev.filter(assessment => assessment.id !== payload.old.id))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.branch_id, filters])

  const refetch = async () => {
    if (user?.branch_id) {
      const { data } = await getAssessments(user.branch_id, filters)
      setAssessments(data || [])
    }
  }

  return { assessments, loading, error, refetch }
}

// Enhanced Analytics Hook with Real-time Updates
export const useBranchAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.branch_id) return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const { data, error } = await getBranchAnalytics(user.branch_id)
        
        if (error) {
          setError(error.message)
        } else {
          setAnalytics(data)
        }
      } catch (err: any) {
        setError('Failed to fetch analytics')
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Set up real-time subscription for data changes
    const subscription = subscribeToBranchData(user.branch_id, (payload) => {
      console.log('Real-time analytics update:', payload)
      // Refresh analytics when underlying data changes
      setTimeout(fetchAnalytics, 1000) // Debounce analytics refresh
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.branch_id])

  const refetch = async () => {
    if (user?.branch_id) {
      const { data } = await getBranchAnalytics(user.branch_id)
      setAnalytics(data)
    }
  }

  return { analytics, loading, error, refetch }
}

// Branches Hook
export const useBranches = () => {
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('branches')
          .select(`
            *,
            students:students(count),
            teachers:teachers(count)
          `)
          .order('name')

        if (error) {
          setError(error.message)
        } else {
          setBranches(data || [])
        }
      } catch (err: any) {
        setError('Failed to fetch branches')
        console.error('Error fetching branches:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  return { branches, loading, error }
}

// CBC Levels Hook
export const useCBCLevels = () => {
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('cbc_levels')
          .select(`
            *,
            students:students(count),
            subjects:subjects(count)
          `)
          .order('level_number')

        if (error) {
          setError(error.message)
        } else {
          setLevels(data || [])
        }
      } catch (err: any) {
        setError('Failed to fetch CBC levels')
        console.error('Error fetching CBC levels:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  return { levels, loading, error }
}

// Real-time Attendance Hook
export const useAttendance = (dateRange?: { from: string; to: string }) => {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.branch_id) return

    const fetchAttendance = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('attendance')
          .select(`
            *,
            students!student_id (
              full_name,
              admission_number,
              branch_id
            ),
            classes!class_id (name)
          `)
          .eq('students.branch_id', user.branch_id)

        if (dateRange?.from) {
          query = query.gte('attendance_date', dateRange.from)
        }

        if (dateRange?.to) {
          query = query.lte('attendance_date', dateRange.to)
        }

        const { data, error } = await query.order('attendance_date', { ascending: false })

        if (error) {
          setError(error.message)
        } else {
          setAttendance(data || [])
        }
      } catch (err: any) {
        setError('Failed to fetch attendance')
        console.error('Error fetching attendance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()

    // Set up real-time subscription
    const subscription = subscribeToAttendance(user.branch_id, (payload) => {
      console.log('Real-time attendance update:', payload)
      
      if (payload.eventType === 'INSERT') {
        setAttendance(prev => [payload.new, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setAttendance(prev => prev.map(record => 
          record.id === payload.new.id ? { ...record, ...payload.new } : record
        ))
      } else if (payload.eventType === 'DELETE') {
        setAttendance(prev => prev.filter(record => record.id !== payload.old.id))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.branch_id, dateRange])

  const refetch = async () => {
    if (user?.branch_id) {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students!student_id (
            full_name,
            admission_number,
            branch_id
          ),
          classes!class_id (name)
        `)
        .eq('students.branch_id', user.branch_id)

      if (dateRange?.from) {
        query = query.gte('attendance_date', dateRange.from)
      }

      if (dateRange?.to) {
        query = query.lte('attendance_date', dateRange.to)
      }

      const { data } = await query.order('attendance_date', { ascending: false })
      setAttendance(data || [])
    }
  }

  return { attendance, loading, error, refetch }
}

// Permission Hook
export const usePermissions = () => {
  const { user } = useAuth()

  const hasPermission = (action: string, resource: string): boolean => {
    if (!user) return false

    // Permission matrix based on user roles
    const permissions = {
      'super_admin': ['*'],
      'branch_admin': ['students:*', 'teachers:*', 'assessments:*', 'reports:*', 'fees:*', 'users:*'],
      'teacher': ['students:read', 'assessments:*', 'attendance:*', 'reports:read'],
      'accountant': ['students:read', 'fees:*', 'reports:read'],
      'clerk': ['students:*', 'attendance:read', 'reports:read']
    }

    const userPermissions = permissions[user.role] || []
    
    return userPermissions.includes('*') || 
           userPermissions.includes(`${resource}:*`) || 
           userPermissions.includes(`${resource}:${action}`)
  }

  const canRead = (resource: string) => hasPermission('read', resource)
  const canWrite = (resource: string) => hasPermission('write', resource)
  const canDelete = (resource: string) => hasPermission('delete', resource)

  return {
    hasPermission,
    canRead,
    canWrite,
    canDelete,
    userRole: user?.role,
    isSuperAdmin: user?.role === 'super_admin',
    isBranchAdmin: user?.role === 'branch_admin',
    isTeacher: user?.role === 'teacher',
    isAccountant: user?.role === 'accountant',
    isClerk: user?.role === 'clerk'
  }
}
