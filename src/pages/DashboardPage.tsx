import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Building2,
    Plus,
    Link2,
    Users,
    DollarSign,
    ShoppingBag,
    TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Mock API function
const fetchDashboardData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
        stats: [
            { label: 'Total Users', value: '1,234', change: '+12%', icon: <Users size={20} /> },
            { label: 'Revenue', value: '$45,678', change: '+8%', icon: <DollarSign size={20} /> },
            { label: 'Orders', value: '567', change: '+23%', icon: <ShoppingBag size={20} /> },
            { label: 'Conversion', value: '3.2%', change: '+5%', icon: <TrendingUp size={20} /> },
        ],
        recentActivity: [
            { id: 1, action: 'New user registered', time: '2 min ago' },
            { id: 2, action: 'Order #1234 completed', time: '15 min ago' },
            { id: 3, action: 'Payment received', time: '1 hour ago' },
        ],
    };
};

export function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData,
    });

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, {user?.name || 'User'}!</p>
                </div>
            </div>

            {/* Quick Actions */}
            <section className="quick-actions">
                <Link to="/tenants" className="quick-action-card">
                    <div className="quick-action-icon">
                        <Building2 size={24} />
                    </div>
                    <div className="quick-action-content">
                        <h3>Manage Tenants</h3>
                        <p>View and manage tenant organizations</p>
                    </div>
                </Link>
                <Link to="/tenants/create" className="quick-action-card">
                    <div className="quick-action-icon">
                        <Plus size={24} />
                    </div>
                    <div className="quick-action-content">
                        <h3>Add Tenant</h3>
                        <p>Create a new tenant</p>
                    </div>
                </Link>
                <Link to="/tenants/mapping" className="quick-action-card">
                    <div className="quick-action-icon">
                        <Link2 size={24} />
                    </div>
                    <div className="quick-action-content">
                        <h3>Mappings</h3>
                        <p>Manage resource mappings</p>
                    </div>
                </Link>
            </section>

            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <>
                    <section className="stats-grid">
                        {data?.stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-card-header">
                                    <h3>{stat.label}</h3>
                                    <div className="stat-icon">{stat.icon}</div>
                                </div>
                                <p className="stat-value">{stat.value}</p>
                                <span className="stat-change positive">{stat.change}</span>
                            </div>
                        ))}
                    </section>

                    <section className="activity-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            {data?.recentActivity.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-dot"></div>
                                    <div className="activity-content">
                                        <p>{activity.action}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
