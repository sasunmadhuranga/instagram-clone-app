import { Link, Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  const { pathname } = useLocation();
  const navItems = [
    { label: "👨‍💼 Profiles", path: "/editprofile/profiles" },
    { label: "🛡️ Password", path: "/editprofile/password" },
    { label: "📝 Personal details", path: "/editprofile/personal" },
  ];

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="flex w-full max-w-5xl bg-white">
        <div className="min-w-[250px] h-full border-r border-gray-300 p-6 pt-10">
          <h1 className="text-3xl font-mono font-bold mb-6 text-center">
            Accounts Center
          </h1>
          <nav className="space-y-2 text-gray-800 text-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded transition active:scale-95 ${
                  pathname === item.path
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-6 pt-10">
          <ToastContainer position="top-right" autoClose={3000} />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
