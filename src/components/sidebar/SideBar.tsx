import "./_.scss";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFlag, FiUsers, FiUser, FiHeadphones } from "react-icons/fi";
import { BsHourglass } from "react-icons/bs";
import { BiPowerOff } from "react-icons/bi";

export const SideBar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Events");
  const navigate = useNavigate();

  const navBarItems = [
    { name: "Events", icon: <FiFlag />, path: "/" },
    { name: "Sessions", icon: <BsHourglass />, path: "/sessions" },
    {
      name: "Judges",
      icon: <FiUsers />,
      path: "/judges",
      children: [
        { name: "Add New Judge", path: "/judges/add" },
        { name: "Assign Judges", path: "/judges/assign" },
      ],
    },
    { name: "Members", icon: <FiUser />, path: "/members" },
    {
      name: "Presenters",
      icon: <FiHeadphones />,
      path: "/presenters",

      children: [
        { name: "Assign Individual", path: "/presenters/individual" },
        { name: "Assign Groups", path: "/presenters/groups" },
      ],
    },
      { name: "Criteria", icon: <FiUser />, path: "/criteria" },
  ];

  return (
    <div id="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <h2>Judgify</h2>
      </div>

      <div className="sidebar-menu">
        <ul>
          <ul>
            {navBarItems.map((item) => (
              <div key={item.name}>
                <li
                  className={activeItem === item.name ? "active" : ""}
                  onClick={() => {
                    setActiveItem(item.name);
                    if (!item.children) {
                      navigate(item.path);
                    }
                  }}
                >
                  <div className="menu-item">
                    <span
                      className={
                        activeItem === item.name ? "active-icon" : "icon"
                      }
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </div>
                </li>

                {item.children && activeItem === item.name && (
                  <ul className="submenu">
                    {item.children.map((subItem) => (
                      <li
                        key={subItem.name}
                        className="submenu-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(subItem.path);
                        }}
                      >
                        {subItem.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </ul>
      </div>
      <div className="sidebar-footer">
        <span className="sidebar-footer-icon">
          <BiPowerOff />
        </span>
        <h2>Logout</h2>
      </div>
    </div>
  );
};
