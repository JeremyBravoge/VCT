import { SidebarData } from './SidebarData';
import '../App.css';

function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`Sidebar ${isOpen ? "block" : "hidden"} md:block`}>
      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <li
            className="row"
            key={key}
            id={window.location.pathname === val.link ? 'active' : ''}
            onClick={() => (window.location.pathname = val.link)}
          >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
