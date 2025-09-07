import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers,
  faExclamationTriangle,
  faCalendarAlt,
  faComments,
  faUserShield,
  faDownload,
  faFilter,
  faEye,
  faSchool,
  faHeartbeat,
  faArrowTrendUp,
  faArrowTrendDown,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * AdminDashboard Component - Anonymous Data Analytics for Institutional Administrators
 * 
 * This component implements Requirement #5 from the problem statement:
 * "Admin Dashboard: Anonymous data analytics for authorities to recognize trends and plan interventions"
 * 
 * Features:
 * - Anonymous analytics and trends
 * - Mental health screening statistics
 * - Usage patterns and engagement metrics
 * - Crisis alert monitoring
 * - Resource utilization tracking
 * - Departmental insights for planning interventions
 * - Data export for institutional reporting
 */

export default function AdminDashboard({ user }) {
  // State management for admin dashboard data
  const [timeRange, setTimeRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  // Check if user has admin privileges
  const isAdmin = user && (user.role === 'admin' || user.role === 'counselor' || user.role === 'iqac');

  // Load dashboard data when component mounts
  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [timeRange, selectedDepartment, isAdmin]);

  // Function to load analytics data (simulated for demo)
  const loadDashboardData = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockAnalyticsData();
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  };

  // Function to generate mock analytics data
  const generateMockAnalyticsData = () => {
    return {
      // Key Performance Indicators
      kpis: {
        totalStudents: 2847,
        activeUsers: 1256,
        screeningsCompleted: 834,
        appointmentsBooked: 267,
        crisisAlerts: 12,
        forumPosts: 145
      },
      
      // Usage trends over time
      usageTrends: [
        { month: 'Jan', screenings: 65, appointments: 23, forumActivity: 12 },
        { month: 'Feb', screenings: 78, appointments: 31, forumActivity: 18 },
        { month: 'Mar', screenings: 92, appointments: 28, forumActivity: 25 },
        { month: 'Apr', screenings: 108, appointments: 35, forumActivity: 31 },
        { month: 'May', screenings: 134, appointments: 42, forumActivity: 28 },
        { month: 'Jun', screenings: 156, appointments: 38, forumActivity: 35 }
      ],
      
      // Mental health screening results distribution
      screeningResults: [
        { severity: 'Minimal', count: 425, percentage: 51, color: '#10b981' },
        { severity: 'Mild', count: 234, percentage: 28, color: '#f59e0b' },
        { severity: 'Moderate', count: 142, percentage: 17, color: '#f97316' },
        { severity: 'Severe', count: 33, percentage: 4, color: '#ef4444' }
      ],
      
      // Department-wise breakdown
      departmentStats: [
        { department: 'Computer Science', students: 645, screenings: 234, riskLevel: 'Medium' },
        { department: 'Electronics', students: 523, screenings: 187, riskLevel: 'Low' },
        { department: 'Mechanical', students: 434, screenings: 156, riskLevel: 'Medium' },
        { department: 'Civil', students: 387, screenings: 142, riskLevel: 'High' },
        { department: 'MBA', students: 298, screenings: 115, riskLevel: 'Medium' },
        { department: 'Others', students: 560, screenings: 200, riskLevel: 'Low' }
      ],
      
      // Crisis alerts and interventions
      crisisData: [
        { week: 'Week 1', alerts: 2, interventions: 2 },
        { week: 'Week 2', alerts: 3, interventions: 3 },
        { week: 'Week 3', alerts: 1, interventions: 1 },
        { week: 'Week 4', alerts: 6, interventions: 5 }
      ],
      
      // Resource utilization
      resourceUsage: [
        { resource: 'AI Chat Support', usage: 78, trend: 'up' },
        { resource: 'Peer Support Forum', usage: 65, trend: 'up' },
        { resource: 'Educational Videos', usage: 45, trend: 'down' },
        { resource: 'Counseling Appointments', usage: 34, trend: 'up' },
        { resource: 'Crisis Support', usage: 12, trend: 'stable' }
      ]
    };
  };

  // Function to export data for institutional reporting
  const exportData = (format) => {
    const data = {
      generatedAt: new Date().toISOString(),
      timeRange,
      department: selectedDepartment,
      summary: dashboardData.kpis,
      anonymizedData: true
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mental-health-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Function to get risk level color
  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Function to get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return faArrowTrendUp;
      case 'down': return faArrowTrendDown;
      default: return faHeartbeat;
    }
  };

  // Show access denied if user is not an admin
  if (!isAdmin) {
    return (
      <div className="admin-dashboard-page">
        <div className="container">
          <div className="access-denied">
            <FontAwesomeIcon icon={faUserShield} size="3x" />
            <h2>Access Restricted</h2>
            <p>This dashboard is only accessible to authorized personnel:</p>
            <ul>
              <li>Department of Student Welfare</li>
              <li>Internal Quality Assurance Cell (IQAC)</li>
              <li>Campus Counselors</li>
              <li>Institutional Administrators</li>
            </ul>
            <p>Please contact your administrator if you need access to mental health analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon={faChartLine} />
              Mental Health Analytics Dashboard
            </h1>
            <p>Anonymous data insights for institutional planning and intervention</p>
            <div className="admin-info">
              <span><FontAwesomeIcon icon={faUserShield} /> {user.role.toUpperCase()} Access</span>
              <span><FontAwesomeIcon icon={faSchool} /> Institution-wide Analytics</span>
            </div>
          </div>
          
          <div className="dashboard-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-filter"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">Current Semester</option>
              <option value="year">Academic Year</option>
            </select>
            
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="dept-filter"
            >
              <option value="all">All Departments</option>
              <option value="cs">Computer Science</option>
              <option value="ec">Electronics</option>
              <option value="me">Mechanical</option>
              <option value="ce">Civil</option>
              <option value="mba">MBA</option>
            </select>
            
            <button 
              className="btn btn-outline"
              onClick={() => exportData('json')}
            >
              <FontAwesomeIcon icon={faDownload} />
              Export Data
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Key Performance Indicators */}
            <motion.section 
              className="kpi-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2>Key Performance Indicators</h2>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-icon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="kpi-content">
                    <h3>{dashboardData.kpis?.totalStudents?.toLocaleString()}</h3>
                    <p>Total Students</p>
                  </div>
                </div>
                
                <div className="kpi-card">
                  <div className="kpi-icon active">
                    <FontAwesomeIcon icon={faHeartbeat} />
                  </div>
                  <div className="kpi-content">
                    <h3>{dashboardData.kpis?.activeUsers?.toLocaleString()}</h3>
                    <p>Active Platform Users</p>
                  </div>
                </div>
                
                <div className="kpi-card">
                  <div className="kpi-icon screening">
                    <FontAwesomeIcon icon={faEye} />
                  </div>
                  <div className="kpi-content">
                    <h3>{dashboardData.kpis?.screeningsCompleted?.toLocaleString()}</h3>
                    <p>Screenings Completed</p>
                  </div>
                </div>
                
                <div className="kpi-card">
                  <div className="kpi-icon appointments">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div className="kpi-content">
                    <h3>{dashboardData.kpis?.appointmentsBooked?.toLocaleString()}</h3>
                    <p>Appointments Booked</p>
                  </div>
                </div>
                
                <div className="kpi-card">
                  <div className="kpi-icon crisis">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </div>
                  <div className="kpi-content">
                    <h3>{dashboardData.kpis?.crisisAlerts}</h3>
                    <p>Crisis Alerts</p>
                  </div>
                </div>
                
                <div className="kpi-card">
                  <div className="kpi-icon forum">
                    <FontAwesomeIcon icon={faComments} />
                  </div>
                  <div className="kpi-content">
                    <h3>{dashboardData.kpis?.forumPosts}</h3>
                    <p>Forum Posts</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Usage Trends Chart */}
            <motion.section 
              className="trends-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>Platform Usage Trends</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dashboardData.usageTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="screenings" stroke="#3b82f6" name="Mental Health Screenings" />
                    <Line type="monotone" dataKey="appointments" stroke="#10b981" name="Counseling Appointments" />
                    <Line type="monotone" dataKey="forumActivity" stroke="#f59e0b" name="Forum Activity" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.section>

            {/* Mental Health Risk Distribution */}
            <motion.section 
              className="risk-analysis-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2>Mental Health Risk Distribution</h2>
              <div className="analysis-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.screeningResults}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ severity, percentage }) => `${severity} ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {dashboardData.screeningResults?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="risk-summary">
                  <h3>Risk Level Summary</h3>
                  {dashboardData.screeningResults?.map((result, index) => (
                    <div key={index} className="risk-item">
                      <div 
                        className="risk-indicator"
                        style={{ backgroundColor: result.color }}
                      ></div>
                      <span className="risk-label">{result.severity}</span>
                      <span className="risk-count">{result.count} students ({result.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Department-wise Analytics */}
            <motion.section 
              className="department-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2>Department-wise Mental Health Engagement</h2>
              <div className="department-grid">
                {dashboardData.departmentStats?.map((dept, index) => (
                  <motion.div
                    key={index}
                    className="department-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <div className="dept-header">
                      <h3>{dept.department}</h3>
                      <span 
                        className="risk-badge"
                        style={{ backgroundColor: getRiskLevelColor(dept.riskLevel) }}
                      >
                        {dept.riskLevel} Risk
                      </span>
                    </div>
                    <div className="dept-stats">
                      <div className="stat">
                        <span className="stat-number">{dept.students}</span>
                        <span className="stat-label">Students</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{dept.screenings}</span>
                        <span className="stat-label">Screenings</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">
                          {Math.round((dept.screenings / dept.students) * 100)}%
                        </span>
                        <span className="stat-label">Participation</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Resource Utilization */}
            <motion.section 
              className="resources-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2>Resource Utilization Analysis</h2>
              <div className="resources-list">
                {dashboardData.resourceUsage?.map((resource, index) => (
                  <div key={index} className="resource-item">
                    <div className="resource-info">
                      <h4>{resource.resource}</h4>
                      <div className="usage-bar">
                        <div 
                          className="usage-fill"
                          style={{ width: `${resource.usage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="resource-stats">
                      <span className="usage-percent">{resource.usage}%</span>
                      <FontAwesomeIcon 
                        icon={getTrendIcon(resource.trend)} 
                        className={`trend-icon ${resource.trend}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Crisis Monitoring */}
            <motion.section 
              className="crisis-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2>Crisis Alert Monitoring</h2>
              <div className="crisis-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dashboardData.crisisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="alerts" fill="#ef4444" name="Crisis Alerts" />
                      <Bar dataKey="interventions" fill="#10b981" name="Interventions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="crisis-summary">
                  <div className="alert-item important">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <div>
                      <h4>Immediate Attention Required</h4>
                      <p>2 high-risk students need immediate follow-up</p>
                    </div>
                  </div>
                  
                  <div className="alert-item">
                    <FontAwesomeIcon icon={faUserShield} />
                    <div>
                      <h4>Intervention Success Rate</h4>
                      <p>92% of crisis alerts resulted in successful interventions</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Institutional Recommendations */}
            <motion.section 
              className="recommendations-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2>Institutional Recommendations</h2>
              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h3>Increase Counselor Availability</h3>
                  <p>High demand in Civil Engineering department suggests need for dedicated counselor hours.</p>
                </div>
                
                <div className="recommendation-card">
                  <h3>Peer Support Training</h3>
                  <p>Expand peer volunteer program to handle increased forum activity.</p>
                </div>
                
                <div className="recommendation-card">
                  <h3>Awareness Campaigns</h3>
                  <p>40% of students haven't used mental health resources. Consider awareness initiatives.</p>
                </div>
                
                <div className="recommendation-card urgent">
                  <h3>Crisis Response Protocol</h3>
                  <p>Review and strengthen crisis intervention procedures based on recent alerts.</p>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
