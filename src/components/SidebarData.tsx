import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SchoolIcon from '@mui/icons-material/School';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
export const SidebarData = [
    
            {
        title:"Dashboard",
        icon:<DashboardIcon />,
        link:"/Dashboard"
    },
    {
        title:"Home",
        icon:<HomeIcon />,
        link:"/"
    },
            {
        title:"Admision",
        icon:<PersonAddIcon />,
        link:"/AdmissionsPage"
    },
     {
        title:"Student List",
        icon:<PersonOutlineIcon  />,
        link:"/StudentDetailModal"
    },

        {
        title:"Department",
        icon:<AnalyticsIcon />,
        link:"/departments/management"
    },
    {
        title:"Payments",
        icon:<PaymentIcon />,
        link:"/FinancePage"
    },
        {
        title:"Results",
        icon:<AnalyticsIcon />,
        link:"studentperformance"
    },
        {
        title:"Images",
        icon:<PermMediaIcon />,
        link:"/media"
    },
        {
        title:"Mailbox",
        icon:<TaskAltIcon/>,
        link:"/marks-entry"
    },
    {
        title:"Instructors",
        icon:<SchoolIcon />,
        link:"/trainerspage"
    },
            {
        title:"Notifications",
        icon:<NotificationsIcon />,
        link:"/"
    },
{
        title:"Profile",
        icon:<AccountCircleIcon />,
        link:"/UserManagement"
    },
    
    {
        title:"Settings",
        icon:<SettingsIcon />,
        link:"/settiings"
    },

    
    
]

