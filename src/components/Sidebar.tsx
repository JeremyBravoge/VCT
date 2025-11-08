// VCT/src/components/Sidebar.tsx
import { SidebarData } from './SidebarData';
import '../App.css';

function Sidebar({ isOpen }: { isOpen: boolean }) {
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
            <li
              key={key}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-colors text-[15px]
                ${
                  window.location.pathname === val.link
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              onClick={() => (window.location.pathname = val.link)}
            >
              <div className="text-lg">{val.icon}</div>
              <span>{val.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
