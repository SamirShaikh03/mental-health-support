# 🧠 StudentMind Connect

**A Comprehensive Digital Mental Health Support Platform for Students**

StudentMind Connect is a modern, React-based web application designed to provide accessible mental health support, resources, and tools specifically tailored for students. The platform offers AI-powered chat support, mental health resources, mood tracking, and a safe space for students to access professional mental health services.

---

## 🌟 Features

### Core Features
- **🤖 AI-Powered Chat Support**: 24/7 intelligent chatbot for immediate mental health assistance
- **📚 Mental Health Resources**: Curated library of resources with India-first prioritization
- **🔒 Secure Authentication**: User login/logout with protected routes
- **👤 User Profiles**: Personalized user dashboard and profile management
- **📱 Responsive Design**: Mobile-friendly interface for accessibility anywhere

### Advanced Features
- **📊 Mood Tracking**: Monitor emotional well-being with detailed analytics
- **📝 Personal Journal**: Secure, private journaling with guided prompts
- **🧘 Mental Health Exercises**: Guided meditation and breathing exercises
- **👥 Peer Support**: Connect with other students in a safe environment
- **📅 Appointment Booking**: Schedule sessions with mental health professionals
- **🚨 Emergency Resources**: Quick access to crisis helplines and emergency support
- **📋 Mental Health Screening**: Professional screening tools and assessments
- **⚡ Admin Dashboard**: Administrative panel with analytics and user management

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mental-health-support.git
   cd mental-health-support
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

---

## 🏗️ Project Structure

```
mental-health-support/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Main navigation component
│   │   ├── Navbar_clean.js      # Clean prototype navbar
│   │   └── Footer.jsx           # Footer component
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Home_clean.js        # Clean prototype homepage
│   │   ├── Chat.jsx             # AI chat interface
│   │   ├── Resources.jsx        # Mental health resources
│   │   ├── Login.jsx            # Authentication
│   │   ├── Profile.jsx          # User profile
│   │   ├── Dashboard.jsx        # User dashboard
│   │   ├── MoodTracker.jsx      # Mood tracking tools
│   │   ├── Journal.jsx          # Personal journaling
│   │   ├── Exercises.jsx        # Mental health exercises
│   │   ├── PeerSupport.jsx      # Peer support platform
│   │   ├── Appointments.jsx     # Booking system
│   │   ├── Emergency.jsx        # Crisis resources
│   │   ├── ScreeningTest.jsx    # Mental health assessments
│   │   └── AdminDashboard.jsx   # Admin panel
│   ├── App.js                   # Main application component
│   ├── App_clean.js             # Clean prototype version
│   ├── styles.css               # Main styling
│   ├── styles_clean.css         # Clean prototype styling
│   └── index.js                 # Entry point
├── package.json
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern React with hooks and latest features
- **React Router DOM 7.8.2** - Client-side routing and navigation
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **FontAwesome** - Professional icon library
- **CSS3** - Custom styling with responsive design

### Additional Libraries
- **Axios** - HTTP client for API requests
- **React Modal** - Modal components for dialogs
- **React Calendar** - Calendar components for appointments
- **Date-fns** - Date manipulation and formatting

### Development Tools
- **Create React App** - Build toolchain and development server
- **React Testing Library** - Component testing utilities
- **Jest** - JavaScript testing framework

---

## 🎨 Design Versions

The project includes two design versions:

### 1. **Full-Featured Version** (Default)
- Rich animations and visual effects
- Advanced UI components
- Comprehensive feature set
- Uses: `App.js`, `Home.jsx`, `Navbar.jsx`, `styles.css`

### 2. **Clean Prototype Version**
- Minimal, professional design
- Fast loading without animations
- Essential features only
- Uses: `App_clean.js`, `Home_clean.js`, `Navbar_clean.js`, `styles_clean.css`

To switch to the clean version, update `src/index.js`:
```javascript
import App from './App_clean';  // Instead of './App'
```

---

## 🌍 Mental Health Resources

The platform prioritizes **India-specific mental health resources** including:

- **National Helplines**: KIRAN Mental Health Helpline (1800-599-0019)
- **Regional Services**: State-specific mental health programs
- **Educational Resources**: India-focused mental health awareness content
- **Professional Networks**: Certified Indian mental health professionals
- **Cultural Sensitivity**: Resources adapted for Indian cultural context

---

## 📱 Key Features Overview

### Authentication & Security
- Secure user registration and login
- Protected routes for authenticated users
- Session management with localStorage
- Logout functionality with route protection

### Mental Health Tools
- **AI Chat**: Conversational AI for immediate support
- **Resource Library**: Searchable mental health resources
- **Mood Tracking**: Visual mood analytics and trends
- **Journaling**: Private, secure digital journaling
- **Exercises**: Guided mental wellness activities

### Professional Services
- **Appointment Booking**: Schedule with licensed professionals
- **Screening Tests**: Validated mental health assessments
- **Emergency Support**: 24/7 crisis intervention resources
- **Peer Support**: Moderated student community platform

---

## 🚀 Development

### Available Scripts

- `npm start` - Run development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

### Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **Styling**: Follow BEM methodology for CSS classes
3. **State Management**: Use React hooks for local state
4. **Routing**: Implement protected routes for authenticated content
5. **Accessibility**: Ensure WCAG 2.1 compliance for all components

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_ANALYTICS_ID=your_analytics_id
```

### Customization
- **Colors**: Update CSS variables in `styles.css`
- **Branding**: Modify logo and brand name in components
- **Content**: Update mental health resources in `Resources.jsx`

---

## 🤝 Contributing

We welcome contributions to improve mental health support for students!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow React best practices
- Write clear, commented code
- Test your changes thoroughly
- Update documentation as needed
- Respect user privacy and security

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Resources

### Mental Health Crisis Resources
- **Emergency**: Call 112 (India) or your local emergency number
- **KIRAN Helpline**: 1800-599-0019 (24/7 support)
- **Vandrevala Foundation**: 1860-2662-345
- **iCall**: 022-2556-3291

### Technical Support
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check the wiki for detailed guides
- **Community**: Join our Discord server for discussions

---

## 🙏 Acknowledgments

- Mental health professionals who guided the development
- Student communities who provided feedback and testing
- Open source libraries that made this project possible
- Organizations promoting mental health awareness in education

---

**⚠️ Disclaimer**: This application is designed to provide support and resources but is not a substitute for professional mental health treatment. If you're experiencing a mental health crisis, please contact emergency services or a qualified mental health professional immediately.

---

*Made with ❤️ for student mental health and well-being*