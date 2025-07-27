import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, MessageCircle, PlusSquare, User, Menu } from "lucide-react";
import { useState } from "react";
import ModalPortal from "../ModalPortal"; 
import CreatePostModal from '../CreatePost/CreatePostModal';
import SearchSidebar from './SearchSidebar';

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Home", path: "/feed", icon: <Home size={20} /> },
    { label: "Search", icon: <Search size={20} />, onClick: () => setShowSearch(true) },
    { label: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
    { label: "Create", icon: <PlusSquare size={20} />, onClick: openCreatePost },
    { label: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  return (
    <div className="w-[225px] hidden md:flex flex-col justify-between pt-6 p-4 border-r-2 bg-white sticky top-0 h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-6">Instagram</h1>
        <nav className="space-y-2 text-gray-800 text-md">
          {navItems.map((item) => {
            const isActive = item.path && pathname.startsWith(item.path);
            return item.onClick ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`flex items-center gap-4 px-4 py-2 rounded transition duration-150 active:scale-95 w-full text-left ${
                  isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-2 rounded transition duration-150 active:scale-95 ${
                  isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu Icon and Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-200 w-full"
        >
          <Menu size={20} />
          <span>Menu</span>
        </button>

        {showDropdown && (
          <div className="absolute bottom-12 left-4 bg-white border shadow rounded w-40 z-50">
            <button
              onClick={() => {
                navigate("/editprofile/profiles");
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Modal or Pop-up */}
      {isCreatePostOpen && (
        <ModalPortal>
          <CreatePostModal onClose={closeCreatePost} />
        </ModalPortal>
      )}

      {showSearch && (
      <SearchSidebar
        visible={showSearch}
        onClose={() => setShowSearch(false)}
      />
    )}
    </div>
  );
};

export default Sidebar;
