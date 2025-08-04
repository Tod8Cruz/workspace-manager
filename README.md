# Workspace Manager

A comprehensive employee and employer management system built with Next.js, TypeScript, and Neon Database.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ardelia-8387s-projects/v0-leave-system-idea)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/egxJJsexfSx)

## 🚀 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employee records
- **Employer Management**: Manage employer information and company details
- **Leave Request System**: Submit, track, and approve leave requests
- **Time Tracking**: Clock in/out and track work hours
- **Expense Claims**: Submit and manage expense reimbursements
- **Contract Management**: Track employment contracts and terms
- **Notification System**: Real-time notifications for various events

### Database Features
- **Neon PostgreSQL Database**: Serverless PostgreSQL with automatic scaling
- **Type-safe Database Operations**: Using Drizzle ORM
- **Real-time Data Sync**: Immediate updates across the application
- **Comprehensive Schema**: Well-structured database design

### User Interface
- **Modern UI**: Built with shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Theme support with next-themes
- **Interactive Dashboards**: Real-time data visualization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workspace-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Neon database URL:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   pnpm db:generate
   
   # Apply migrations to your database
   pnpm db:migrate
   
   # Seed the database with sample data
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- A Neon account (sign up at [neon.tech](https://neon.tech))

### Step-by-step Database Setup

1. **Create a Neon Database**
   - Go to [neon.tech](https://neon.tech) and sign up/login
   - Create a new project
   - Choose a region close to your users
   - Copy your connection string

2. **Configure Environment Variables**
   - Create a `.env.local` file in the root directory
   - Add your Neon database connection string:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **Run Database Migrations**
   ```bash
   pnpm db:generate  # Generate migration files
   pnpm db:migrate   # Apply migrations to database
   ```

4. **Seed Sample Data**
   ```bash
   pnpm db:seed      # Populate with sample data
   ```

For detailed database setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md).

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migration files
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm db:seed` - Seed database with sample data

## 🏗️ Project Structure

```
workspace-manager/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── employers/     # Employer API endpoints
│   │   └── employees/     # Employee API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── employer-management.tsx
│   ├── employee-management.tsx
│   └── ...
├── hooks/                # Custom React hooks
│   └── use-employers.ts
├── lib/                  # Utility libraries
│   ├── db.ts            # Database configuration
│   ├── db-utils.ts      # Database utility functions
│   ├── schema.ts        # Database schema
│   └── utils.ts         # General utilities
├── scripts/             # Database scripts
│   └── seed.ts          # Database seeding script
├── drizzle/             # Generated migration files
├── drizzle.config.ts    # Drizzle configuration
└── package.json         # Dependencies and scripts
```

## 🔌 API Endpoints

### Employers
- `GET /api/employers` - Get all employers
- `POST /api/employers` - Create a new employer
- `GET /api/employers/[id]` - Get a specific employer
- `PUT /api/employers/[id]` - Update an employer
- `DELETE /api/employers/[id]` - Delete an employer

### Employees
- `GET /api/employees` - Get all employees with employer info
- `POST /api/employees` - Create a new employee

## 🎯 Usage

### Employer Management
1. Navigate to the "Employer Management" tab
2. View all employers in a comprehensive table
3. Add new employers using the "Add Employer" button
4. Edit existing employers by clicking the edit icon
5. Delete employers with confirmation dialog

### Employee Management
1. Navigate to the "Employee Management" tab
2. Manage employee records and information
3. Track employee performance and status

### Leave Requests
1. Submit leave requests through the dashboard
2. Track request status and approvals
3. View leave history and balances

### Time Tracking
1. Clock in and out through the interface
2. View time logs and reports
3. Track work hours and productivity

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key (for future auth implementation)
- `NEXTAUTH_URL` - NextAuth URL (for future auth implementation)

### Database Configuration
The database is configured using Drizzle ORM with the following features:
- Type-safe database operations
- Automatic migration generation
- Connection pooling
- Real-time data synchronization

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Make sure to set the following environment variables in your production environment:
- `DATABASE_URL` - Your production Neon database URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database-related issues
2. Review the troubleshooting section in the documentation
3. Open an issue on GitHub with detailed information

## 🔮 Roadmap

- [ ] Authentication and authorization system
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Integration with payroll systems
- [ ] Advanced notification system
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Bulk operations for data management
- [ ] API rate limiting and security
- [ ] Automated backups and data recovery

---

**Built with ❤️ using Next.js, TypeScript, and Neon Database**