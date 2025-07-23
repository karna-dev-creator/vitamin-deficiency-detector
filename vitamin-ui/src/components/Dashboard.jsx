import React, { useEffect,useRef, useState } from 'react';
import {
  Grid, Column, Tile, Button, Header, HeaderName,
  HeaderGlobalBar, HeaderGlobalAction, Loading
} from '@carbon/react';
import {
  UserAvatar, Logout, Rocket, Activity, ChartPie, Download
} from '@carbon/icons-react';
import { motion } from 'framer-motion';
import './Dashboard.css';
import { DocumentPdf } from '@carbon/icons-react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.name || 'User';
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [stats, setStats] = useState({
  images_uploaded: 0,
  reports_downloaded: 0
});


useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user-report-stats?user_id=${user.id}`);
      const data = await res.json();
      console.log("📊 Stats from backend:", data);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };
  fetchStats();
}, [user.id,location.key]);
useEffect(() => {
  const fetchReports = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user-reports?user_id=${user.id}`);
      const data = await response.json();
      console.log("📄 Reports from backend:", data);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  fetchReports();
}, [user.id,location.key]);

  useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 1500);
  return () => clearTimeout(timer);
}, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };
  // Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setShowUserMenu(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loading description="Loading dashboard..." withOverlay={false} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Header aria-label="Vitamin Deficiency Detector">
        <HeaderName href="#" prefix="Vitamin">
          Dashboard
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="User" onClick={() => setShowUserMenu(!showUserMenu)}>
            <UserAvatar size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Logout" onClick={handleLogout}>
            <Logout size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      {showUserMenu && (
        <div className="user-dropdown-container" ref={userMenuRef}>
        <Button kind="ghost" size="sm" className="user-dropdown-btn" onClick={() => {
          setShowUserMenu(false);
          window.location.href = '/profile';
        }}>
          Profile
        </Button>
        {/* <Button kind="ghost" size="sm" className="user-dropdown-btn" onClick={() => {
          setShowUserMenu(false);
          document.getElementById('my-reports')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          My Reports
        </Button> */}
        <Button kind="ghost" size="sm" className="user-dropdown-btn" onClick={() => {
          setShowUserMenu(false);
          alert('Email support@vitadetector.com for help.');
        }}>
          Help & Support
        </Button>
      </div>
      )}
      <div className="dashboard-wrapper">
        {/* ✅ Health Stats Overview */}
        <section className="dashboard-section">
          <Grid fullWidth>
            <Column lg={4} md={4} sm={4}>
              <Tile className="stat-card">
                <p className="stat-number">{stats.images_uploaded}</p>
                <p className="stat-label">Images Uploaded</p>
              </Tile>
            </Column>
            <Column lg={4} md={4} sm={4}>
              <Tile className="stat-card">
                <p className="stat-number">{reports.length}</p>
                <p className="stat-label">Reports Generated</p>
              </Tile>
            </Column>
            <Column lg={4} md={4} sm={4}>
              <Tile className="stat-card">
                <p className="stat-number">{stats.reports_downloaded}</p>
                <p className="stat-label">Reports Downloaded</p>
              </Tile>
            </Column>
          </Grid>
        </section>

        {/* ✅ Greeting */}
        <section className="dashboard-section">
          <Grid fullWidth>
            <Column lg={16} md={8} sm={4} className="dashboard-header">
              <h1>Welcome back, {username} 👋</h1>
              <p>Your health insights are just a click away.</p>
            </Column>
          </Grid>
        </section>

        {/* ✅ Feature Cards */}
        <section className="dashboard-section">
          <Grid fullWidth>
            <Column lg={16} md={8} sm={4}>
              <div className="card-container">
                {[
                  {
                    icon: <Rocket size={24} />,
                    title: 'Start Prediction',
                    desc: 'Upload an image and detect deficiencies.',
                    link: '/predict',
                    kind: 'primary'
                  },
                  {
                    icon: <Activity size={24} />,
                    title: 'Extract Features',
                    desc: 'Segment and prepare your image.',
                    link: '/extract',
                    kind: 'tertiary'
                  },
                  {
                    icon: <UserAvatar size={24} />,
                    title: 'Your Profile',
                    desc: 'Manage your personal health data.',
                    link: '/profile',
                    kind: 'ghost'
                  },
                  {
                    icon: <ChartPie size={24} />,
                    title: 'Insights',
                    desc: 'Explore deficiency symptoms and trends.',
                    link: '/about',
                    kind: 'ghost'
                  }
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <Tile className="dashboard-card">
                      {card.icon}
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                      <Button kind={card.kind} size="sm" href={card.link}>
                        Go
                      </Button>
                    </Tile>
                  </motion.div>
                ))}
              </div>
            </Column>
          </Grid>
        </section>

        {/* ✅ Quick Tools */}
        <section className="dashboard-section">
          <h3>Quick Tools</h3>
          <div className="quick-tools">
            {/* <Button kind="ghost" href="/sample-report.pdf" download>
              <Download size={20} /> Download Report
            </Button> */}
            <Button kind="ghost" onClick={() => alert('Support contacted')}>
              💬 Contact Support
            </Button>
            <Button kind="ghost" href="/about">
              ℹ️ Health Info
            </Button>
          </div>
        </section>
        <section className="dashboard-section">
          <h3>My Reports</h3>
          {reportsLoading ? (
            <Loading description="Loading reports..." small />
          ) : reports.length === 0 ? (
            <p>No reports found yet. Start your first prediction!</p>
          ) : (
            <Grid fullWidth className="reports-grid">
              {reports.map((report, idx) => {
                const normalizePath = (p) => {
                  if (typeof p === 'string') {
                    const relativePath = p.replace(/\\/g, '/').replace(/^.*?static\//, 'static/');
                    return `http://localhost:5000/${relativePath}`;
                  }
                  return '';
                };
                const reportPath = normalizePath(report.report_path);

                return (
                  <Column lg={4} md={4} sm={4} key={idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Tile className="report-card no-image">
                        <h4 className="report-title">🧾 Report #{idx + 1}</h4>
                        <p><strong>Deficiency:</strong> {report?.deficiency?.trim() || 'N/A'}</p>
                        <p><strong>Date:</strong> {
                          report?.created_at
                            ? new Date(report.created_at).toLocaleString()
                            : 'N/A'
                        }</p>
                        <Button
                          kind="ghost"
                          href={reportPath}
                          download
                          size="sm"
                          className="report-download"
                        >
                          <DocumentPdf size={16} /> Download Report
                        </Button>
                      </Tile>
                    </motion.div>
                  </Column>
                );
              })}
            </Grid>
          )}
        </section>
      </div>
    </>
  );
};
export default Dashboard;