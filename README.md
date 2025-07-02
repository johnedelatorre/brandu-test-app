# BrandU Dashboard

A modern, fully functional analytics dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Features automated actionable insights, data visualization with D3.js, and CSV data import capabilities.

## 🚀 Features

- **Modern UI/UX**: Sleek and responsive design using Tailwind CSS with purple color scheme
- **Data Visualization**: Interactive charts built with D3.js
- **CSV Import**: Drag-and-drop CSV file upload with data preview
- **Data Table**: Advanced table with sorting, filtering, and pagination
- **Automated Insights**: AI-powered actionable insights and recommendations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Database Integration**: SQLite database with Drizzle ORM
- **Real-time Analytics**: Live metrics and performance indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Tailwind UI components
- **Charts**: D3.js for custom data visualization
- **Database**: SQLite with Drizzle ORM
- **Icons**: Lucide React
- **Fonts**: Roboto
- **State Management**: React Hooks, Zustand
- **File Upload**: React Dropzone, PapaParse for CSV parsing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brandu-test-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Primary**: Purple 700 (#7c3aed)
- **Secondary**: Light purple variations
- **Background**: Gray 50 (#f9fafb)
- **Text**: Gray 900 (#111827)

### Typography
- **Font Family**: Roboto
- **Weights**: 300, 400, 500, 700

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Primary (purple) and secondary (light purple) variants
- **Badges**: Color-coded for different states (success, warning, error, info)

## 📊 Dashboard Features

### 1. Main Dashboard
- **Metrics Cards**: Key performance indicators with change indicators
- **Revenue Chart**: D3.js line chart with area fill
- **Insights Panel**: Automated insights with filtering
- **Data Table**: Interactive table with CSV import

### 2. Analytics Page
- Multiple chart views for different metrics
- Comparative analysis tools
- Trend identification

### 3. Insights Page
- Detailed insights with severity levels
- Filtering by insight type (trend, anomaly, recommendation)
- Actionable recommendations

### 4. Data Management
- CSV file upload with drag-and-drop
- Data preview and validation
- Advanced table with sorting and filtering

### 5. User Management
- User account management
- Role-based access control
- Activity tracking

### 6. Settings
- Notification preferences
- Theme customization
- Database management
- Data export/import

## 📁 Project Structure

```
brandu-test-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard home
│   ├── analytics/         # Analytics page
│   ├── insights/          # Insights page
│   ├── data/              # Data management
│   ├── users/             # User management
│   └── settings/          # Settings page
├── components/            # React components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── MetricCard.tsx     # KPI cards
│   ├── D3Chart.tsx        # D3.js charts
│   ├── DataTable.tsx      # Data table
│   ├── CSVUpload.tsx      # CSV upload
│   └── InsightsPanel.tsx  # Insights display
├── lib/                   # Utilities and database
│   ├── db/               # Database schema and connection
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=./lib/db/database.sqlite

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Purple color palette
- Roboto font family
- Custom animations and utilities
- Form and typography plugins

## 📈 Data Import

### CSV Format
The dashboard accepts CSV files with the following structure:

```csv
name,sales,revenue,date,category
Product A,12500,125000,2024-01-10,Electronics
Product B,8900,89000,2024-01-09,Clothing
```

### Supported Data Types
- **String**: Product names, categories
- **Number**: Sales, revenue, quantities
- **Date**: ISO format (YYYY-MM-DD)
- **Currency**: Automatically formatted
- **Percentage**: Decimal values (0.045 = 4.5%)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔍 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open database studio
- `npm run db:generate` - Generate database migrations

### Database Management
```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:push

# Open database studio
npm run db:studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🎯 Roadmap

- [ ] Dark mode support
- [ ] Real-time data updates
- [ ] Advanced analytics
- [ ] Export functionality
- [ ] User authentication
- [ ] API endpoints
- [ ] Mobile app
- [ ] Advanced insights AI

---

Built with ❤️ using Next.js, React, and TypeScript
