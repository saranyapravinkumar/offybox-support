import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Bell, Search, LogOut } from 'lucide-react';

export function Header() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const displayName = user ? `${user.first_name} ${user.last_name}` : 'Admin';
    const initials = user ? user.first_name.charAt(0).toUpperCase() : 'A';

    return (
        <header className="app-header">
            <div className="header-left">
                <span className="header-brand">Offybox</span>
                <div className="header-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="header-right">
                <button className="header-icon-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="header-user">
                    <div className="user-text">
                        <span className="user-name">{displayName}</span>
                        <span className="user-role">Super Admin</span>
                    </div>
                    <div className="user-avatar-small">
                        {initials}
                    </div>
                </div>
                <button onClick={handleLogout} className="header-logout-btn" title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
