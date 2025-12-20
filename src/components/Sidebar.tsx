// VCT/src/components/Sidebar.tsx
import { useState } from 'react';
import { SidebarData } from './SidebarData';
import '../App.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <div
      className={`Sidebar flex flex-col h-screen bg-gray-900 text-gray-100 transition-all duration-300 ${
        isOpen ? 'block' : 'hidden'
      } md:flex`}
      style={{ overflowY: 'auto' }}
    >
      {/* === Header === */}
      <div className="px-5 py-3 border-b border-gray-700 text-lg font-semibold tracking-tight text-gray-100">
        COHAT COLLEGE
      </div>

      {/* === Sidebar Menu === */}
      <div className="flex-1 px-3 py-3">
        <ul className="space-y-1">
          {SidebarData.map((val, key) => (
            <li key={key}>
              {val.subItems ? (
                <>
                  <div
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-colors text-[15px] ${
                      openDropdown === val.title
                        ? 'bg-gray-800 text-white'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                    onClick={() => toggleDropdown(val.title)}
                  >
                    <div className="text-lg">{val.icon}</div>
                    <span>{val.title}</span>
                    <div className="ml-auto">
                      {openDropdown === val.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                  </div>
                  {openDropdown === val.title && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {val.subItems.map((subItem, subKey) => (
                        <li
                          key={subKey}
                          className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors text-[14px] ${
                            window.location.pathname === subItem.link
                              ? 'bg-gray-700 text-white'
                              : 'hover:bg-gray-700 text-gray-300'
                          }`}
                          onClick={() => (window.location.pathname = subItem.link)}
                        >
                          <div className="text-lg">{subItem.icon}</div>
                          <span>{subItem.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-colors text-[15px] ${
                    window.location.pathname === val.link
                      ? 'bg-gray-800 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                  onClick={() => (window.location.pathname = val.link)}
                >
                  <div className="text-lg">{val.icon}</div>
                  <span>{val.title}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
