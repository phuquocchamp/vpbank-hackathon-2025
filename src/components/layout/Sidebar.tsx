import { Link, useLocation } from 'react-router-dom';
import { CLIENT_ROUTES, ADMIN_ROUTES } from '../../config/routes';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: CLIENT_ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { path: CLIENT_ROUTES.CONVERSATION, label: 'Conversations', icon: '💬' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">VPBank</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;