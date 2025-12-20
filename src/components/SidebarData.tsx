import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PeopleIcon from '@mui/icons-material/People';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const SidebarData = [

    {
        title:"Dashboard",
        icon:<DashboardIcon />,
        link:"/Dashboard"
    },
    {
        title:"Students",
        icon:<PeopleIcon />,
        subItems: [
            {
                title:"Admission",
                icon:<PersonAddIcon />,
                link:"/AdmissionsPage"
            },
            {
                title:"Enrollment",
                icon:<PersonIcon/>,
                link:"/enrollment"

            },
            {
                title:"Student List",
                icon:<PersonOutlineIcon  />,
                link:"/StudentDetailModal"
            },
            {
                title:"Marks-entry",
                icon:<TaskAltIcon/>,
                link:"/marks-entry"
            }
        ]
    },
    {
        title:"Department",
        icon:<AnalyticsIcon />,
        subItems:[
            {
                title:"Department",
                icon:<AccountTreeIcon/>,
                link:"/departments/management"
            },
            {
                title:"Courses",
                icon:<TripOriginIcon/>,
                link:"/courses"
            },
            {
                title:"Department",
                icon:<TripOriginIcon/>,
                link:"/department"
            },
            {
                title:"Couser Performance",
                icon:<TripOriginIcon/>,
                link:"/courseperformance"
            },
            {
                title:"Level Performance",
                icon:<TripOriginIcon/>,
                link:"/level-performance"
            }
        ]
    },
    {
        title:"Payments",
        icon:<PaymentIcon />,
        link:"/FinancePage"
    },
        {
        title:"Results",
        icon:<AnalyticsIcon />,
        subItems:[
            {
                title:"Performance",
                icon:<AssessmentIcon/>,
                link:"/studentperformance"
            },
            {
                title:"Ranking",
                icon:<SchoolIcon/>,
                link:"/ranking"
            }
        ]
    },
    {
        title:"Report",
        icon:<AssignmentIcon/>,
        link:"/report"
    },
        {
        title:"Media",
        icon:<PermMediaIcon />,
        subItems:[
            {
                title:"Exams",
                icon:<AssignmentIcon/>,
                link:"/exams"
            },
            {
                title:"Graduation Pic",
                icon:<UpgradeIcon/>,
                link:"/graduation"
            }
        ]
    },
        {
        title:"Academics",
        icon:<TaskAltIcon/>,
        link:"/academics"
    },
    {
        title:"Instructors",
        icon:<PersonPinIcon />,
        link:"/trainerspage"
    },
            {
        title:"Notifications",
        icon:<NotificationsIcon />,
        link:"/notification"
    },
{
        title:"Profile",
        icon:<AccountCircleIcon />,
        link:"/UserManagement"
    },

    {
        title:"setting",
        icon:<SettingsIcon />,
        link:"/setting"
    },



]

