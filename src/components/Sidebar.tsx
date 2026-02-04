import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Globe,
    MapPin,
    Map,
    LogOut,
    ChevronRight,
    Package,
    Ticket,
    Users
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Sidebar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const displayName = user ? `${user.first_name} ${user.last_name}` : 'User';
    const initials = user ? user.first_name.charAt(0).toUpperCase() : 'U';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon-container">
                        <Building2 size={24} />
                    </div>
                    <span className="logo-text">Offybox</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} className="nav-icon" />
                    <span className="nav-label">Dashboard</span>
                </NavLink>

                <NavLink to="/tenants" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Building2 size={20} className="nav-icon" />
                    <span className="nav-label">Tenants</span>
                </NavLink>

                <NavLink to="/modules" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Package size={20} className="nav-icon" />
                    <span className="nav-label">Modules</span>
                </NavLink>

                <NavLink to="/tickets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Ticket size={20} className="nav-icon" />
                    <span className="nav-label">Tickets</span>
                </NavLink>

                <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} className="nav-icon" />
                    <span className="nav-label">Users</span>
                </NavLink>

                <div className="nav-separator">Locations</div>

                <NavLink to="/countries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Globe size={20} className="nav-icon" />
                    <span className="nav-label">Countries</span>
                </NavLink>

                <NavLink to="/states" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MapPin size={20} className="nav-icon" />
                    <span className="nav-label">States</span>
                </NavLink>

                <NavLink to="/cities" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-icon"><ChevronRight size={16} /></div>
                    <span className="nav-label">Cities</span>
                </NavLink>

                <NavLink to="/areas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Map size={20} className="nav-icon" />
                    <span className="nav-label">Areas</span>
                </NavLink>


            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        {initials}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{displayName}</span>
                        <span className="user-email">{user?.email || ''}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="sidebar-logout">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
