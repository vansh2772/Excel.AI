# 🚀 Excel.AI Platform

A cutting-edge, AI-powered Excel and CSV analytics platform that transforms raw data into actionable insights through intelligent visualizations and natural language interactions.


## ✨ Key Features

### 🤖 AI-Powered Analytics
- **Intelligent Chat Assistant**: Upload files and get instant insights through natural language
- **Smart Chart Recommendations**: AI suggests the best visualization based on your data
- **Automated Data Analysis**: Generate comprehensive insights automatically
- **Contextual Assistance**: Get help specific to your dataset

### 📊 Advanced Visualizations
- **2D Charts**: Bar, Line, Pie, Scatter, Area charts with Chart.js
- **3D Visualizations**: Interactive 3D bar charts and scatter plots with Three.js
- **Real-time Rendering**: Smooth, responsive chart updates
- **Export Options**: Download charts as PNG or PDF

### 📁 Robust Data Processing
- **Multi-format Support**: Excel (.xlsx, .xls) and CSV files
- **Large Dataset Handling**: Up to 100MB files, 100K rows
- **Smart Data Detection**: Automatic type inference and validation
- **Statistical Analysis**: Mean, median, mode, standard deviation, and more

### 🔐 Enterprise-Ready Security
- **Multi-auth Support**: Email/password and Google OAuth
- **Role-based Access**: User and Admin roles with different permissions
- **Data Validation**: Comprehensive input sanitization and validation
- **Secure File Processing**: Safe handling of uploaded files

### 📈 Professional Features
- **Analysis History**: Track and revisit previous analyses
- **Admin Dashboard**: User management and platform analytics
- **Data Export**: CSV export with custom formatting
- **Responsive Design**: Perfect on desktop, tablet, and mobile

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vite** - Lightning-fast build tool and development server

### Data & Visualization
- **Chart.js** - Powerful 2D charting library
- **Three.js** - 3D graphics and interactive visualizations
- **Papa Parse** - Fast CSV parsing with error handling
- **SheetJS (xlsx)** - Excel file processing and manipulation

### AI & Services
- **Google Generative AI** - Advanced AI insights with Gemini model
- **Google OAuth** - Secure authentication integration
- **React Hot Toast** - Beautiful notification system

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing and optimization

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 18+** and npm
- **Google Cloud Console** account (for OAuth and AI features)

### 1. Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd excel-analytics-platform

# Install dependencies
npm install
```
### 2. .env set

// Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=..... .... ..... ....

// Google AI Configuration  
VITE_GOOGLE_AI_API_KEY=..... .... ..... ....


### 3. Google Services Setup

#### Google OAuth Configuration
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API** or **Google Identity API**
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add these **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://localhost:5173
   http://localhost:5174
   https://localhost:5174
   https://yourdomain.com (for production)
   ```
7. Copy the Client ID (ends with `.googleusercontent.com`)

#### Google AI Setup (Optional but Recommended)
1. In Google Cloud Console, enable **Generative AI API**
2. Create an **API key** in Credentials
3. Copy the API key for enhanced AI features

### 4. Environment Variables
Update your `.env` file:
```env
# Required for Google OAuth
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com

# Optional for enhanced AI features
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Future features
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
```

### 5. Launch Application
```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 📁 Project Architecture

```
src/
├── components/              # React components
│   ├── auth/               # Authentication (Login, Register, OAuth)
│   ├── charts/             # Visualization components
│   │   ├── AdvancedChartSelector.tsx
│   │   ├── AdvancedDataVisualization.tsx
│   │   ├── Chart3D.tsx
│   │   └── SmartChartRecommendations.tsx
│   ├── chat/               # AI chat assistant
│   │   ├── ChatBot.tsx
│   │   └── ChatBotToggle.tsx
│   ├── admin/              # Admin dashboard
│   ├── history/            # Analysis history
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx    # Theme management
├── hooks/                  # Custom React hooks
│   └── useDataStore.ts     # Data management
├── pages/                  # Page components
│   ├── AuthPage.tsx        # Login/Register page
│   └── Dashboard.tsx       # Main dashboard
├── services/               # External integrations
│   ├── aiService.ts        # Google AI integration
│   └── googleAuth.ts       # OAuth service
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
│   ├── dataProcessing.ts   # Data analysis utilities
│   ├── fileProcessing.ts   # File handling
│   └── chartExport.ts      # Export functionality
└── main.tsx               # Application entry point
```

## 🎯 Core Features Deep Dive

### AI-Powered Data Analysis
The platform leverages Google's Gemini AI model to provide:
- **Automated Insights**: Comprehensive data analysis with key findings
- **Smart Recommendations**: Chart type suggestions based on data characteristics
- **Natural Language Queries**: Ask questions about your data in plain English
- **Contextual Help**: Assistance tailored to your specific dataset

### Advanced Visualization Engine
- **Chart.js Integration**: Professional 2D charts with animations
- **Three.js 3D Graphics**: Interactive 3D visualizations with orbit controls
- **Responsive Design**: Charts adapt to all screen sizes
- **Export Capabilities**: High-quality PNG and PDF downloads

### Robust Data Processing
- **Multi-format Support**: Excel and CSV with automatic format detection
- **Data Validation**: Comprehensive error checking and user feedback
- **Statistical Analysis**: Complete statistical summaries for numeric data
- **Performance Optimized**: Handles large datasets efficiently

### Enterprise Security
- **Authentication**: Multiple auth methods with secure token management
- **Data Protection**: Input validation and XSS prevention
- **Role Management**: Admin and user roles with appropriate permissions
- **Secure File Handling**: Safe processing of uploaded files

## 🔧 Configuration Options

### File Upload Limits
```typescript
// Configurable in utils/fileProcessing.ts
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_ROWS = 100000;
const MAX_COLUMNS = 100;
const SUPPORTED_FORMATS = ['.xlsx', '.xls', '.csv'];
```

### Chart Configuration
```typescript
// Customizable color schemes
const colorSchemes = [
  { name: 'Blue', colors: ['#3B82F6', '#1E40AF', '#60A5FA'] },
  { name: 'Green', colors: ['#10B981', '#047857', '#34D399'] },
  // Add custom schemes
];
```

### AI Service Configuration
```typescript
// Fallback responses when AI is not configured
const ENABLE_AI_FALLBACKS = true;
const AI_TIMEOUT = 10000; // 10 seconds
```

## 🚀 Deployment Guide

### Build for Production
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Netlify
1. **Connect Repository**: Link your Git repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add your environment variables in Netlify dashboard
4. **Domain Configuration**: Update Google OAuth origins with your domain

### Deploy to Vercel
1. **Import Project**: Connect your repository to Vercel
2. **Environment Variables**: Add variables in project settings
3. **Automatic Deployment**: Deploys on every push to main branch

### Deploy to Custom Server
```bash
# Build the project
npm run build

# Serve the dist folder with any static file server
# Example with serve:
npx serve dist -p 3000
```

## 🧪 Development Workflow

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Component Architecture**: Modular, reusable components
- **Error Boundaries**: Graceful error handling
- **Performance**: Optimized rendering and data processing

### Testing Strategy
```bash
# Add testing framework (recommended)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

## 🔍 Troubleshooting Guide

### Common Issues & Solutions

#### Google OAuth Problems
```
Error: "NetworkError: Error retrieving a token"
```
**Solutions:**
- Verify Client ID format (must end with `.googleusercontent.com`)
- Check authorized JavaScript origins in Google Cloud Console
- Ensure both `http://` and `https://` localhost URLs are added
- Clear browser cache and cookies

#### File Upload Issues
```
Error: "File processing failed"
```
**Solutions:**
- Check file size (max 100MB)
- Verify file format (.xlsx, .xls, .csv only)
- Ensure file is not corrupted
- Check for special characters in column names

#### AI Features Not Working
```
Error: "AI service not configured"
```
**Solutions:**
- Add `VITE_GOOGLE_AI_API_KEY` to `.env` file
- Verify API key is valid and has proper permissions
- Check Google Cloud Console billing and quotas
- Fallback responses will work without AI configuration

#### 3D Charts Not Rendering
```
Error: "WebGL not supported"
```
**Solutions:**
- Enable WebGL in browser settings
- Update graphics drivers
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Fallback to 2D charts automatically provided

### Performance Optimization
- **Large Files**: Process in chunks for better performance
- **Memory Management**: Clear data when switching datasets
- **Chart Rendering**: Limit data points for smooth animations
- **Caching**: Browser caching for static assets

## 📊 Usage Examples

### Basic Data Analysis
1. **Upload File**: Drag and drop Excel/CSV file
2. **Review Overview**: Check data statistics and quality
3. **Create Visualization**: Select chart type and axes
4. **Get AI Insights**: Use chat assistant for analysis
5. **Export Results**: Download charts and data

### Advanced Features
```typescript
// Custom chart configuration
const chartConfig = {
  type: '3d-bar',
  xAxis: 'Category',
  yAxis: 'Sales',
  title: 'Sales by Category',
  colors: ['#3B82F6', '#10B981', '#F59E0B']
};

// AI-powered insights
const insights = await aiService.generateInsights(dataContext);

// Export functionality
await exportChartAsPDF(chartRef.current, 'Sales Analysis');
```

## 🔮 Roadmap & Future Features

### Planned Enhancements
- **Real-time Collaboration**: Multi-user editing and sharing
- **Advanced Analytics**: Machine learning insights and predictions
- **Database Connectivity**: Direct connection to SQL databases
- **API Integration**: RESTful API for external applications
- **Mobile App**: Native iOS and Android applications
- **Advanced Export**: PowerPoint and Word document generation

### Community Features
- **Template Gallery**: Pre-built analysis templates
- **Plugin System**: Custom chart types and data sources
- **Sharing Platform**: Public dashboard sharing
- **Educational Content**: Tutorials and best practices

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
```bash
# Fork the repository
git clone https://github.com/yourusername/excel-analytics-platform.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Create Pull Request
```

### Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow existing code style
- Write clear commit messages

## 📄 License


## 🙏 Acknowledgments

- **Google Cloud Platform** - AI and authentication services
- **Chart.js Community** - Excellent charting library
- **Three.js Team** - Amazing 3D graphics framework
- **React Team** - Powerful UI framework
- **Tailwind CSS** - Beautiful utility-first CSS

## 📞 Support & Contact


Linkdein: https://www.linkedin.com/in/vansh-khandelwal-122205324/


**Built with ❤️ using React, TypeScript, and cutting-edge web technologies.**

*Transform your data into insights with Excel.AI Platform - where artificial intelligence meets data visualization.*