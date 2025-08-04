# Neon Database Setup for Workspace Manager

This guide will help you set up a Neon database for the workspace manager application.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A Neon account (sign up at [neon.tech](https://neon.tech))

## Step 1: Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Choose a region close to your users
4. Note down your connection string (it will look like: `postgresql://username:password@host:port/database`)

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your Neon database connection string:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

Replace the connection string with your actual Neon database URL.

## Step 3: Install Dependencies

The required dependencies are already installed:

```bash
pnpm install
```

## Step 4: Generate Database Schema

Generate the database migration files:

```bash
pnpm db:generate
```

This will create migration files in the `drizzle` directory.

## Step 5: Run Database Migrations

Apply the migrations to your Neon database:

```bash
pnpm db:migrate
```

## Step 6: Verify Setup

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## Database Schema

The application includes the following tables:

### Employers
- `id` - Primary key
- `name` - Employer's name
- `email` - Email address (unique)
- `phone` - Phone number
- `address` - Address
- `companyName` - Company name
- `industry` - Industry
- `employeeCount` - Number of employees
- `isActive` - Active status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Employees
- `id` - Primary key
- `employerId` - Foreign key to employers
- `firstName` - First name
- `lastName` - Last name
- `email` - Email address (unique)
- `phone` - Phone number
- `position` - Job position
- `department` - Department
- `hireDate` - Hire date
- `salary` - Salary amount
- `isActive` - Active status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Time Logs
- `id` - Primary key
- `employeeId` - Foreign key to employees
- `clockIn` - Clock in time
- `clockOut` - Clock out time
- `totalHours` - Total hours worked
- `notes` - Additional notes
- `createdAt` - Creation timestamp

### Leave Requests
- `id` - Primary key
- `employeeId` - Foreign key to employees
- `startDate` - Leave start date
- `endDate` - Leave end date
- `leaveType` - Type of leave (vacation, sick, etc.)
- `reason` - Reason for leave
- `status` - Request status (pending, approved, rejected)
- `approvedBy` - Foreign key to employees (approver)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Expense Claims
- `id` - Primary key
- `employeeId` - Foreign key to employees
- `amount` - Claim amount
- `description` - Expense description
- `category` - Expense category
- `receiptUrl` - Receipt file URL
- `status` - Claim status (pending, approved, rejected)
- `approvedBy` - Foreign key to employees (approver)
- `submittedAt` - Submission timestamp
- `updatedAt` - Last update timestamp

### Contracts
- `id` - Primary key
- `employerId` - Foreign key to employers
- `employeeId` - Foreign key to employees
- `contractType` - Contract type (full-time, part-time, contract)
- `startDate` - Contract start date
- `endDate` - Contract end date
- `salary` - Contract salary
- `terms` - Contract terms
- `status` - Contract status (active, terminated, expired)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Notifications
- `id` - Primary key
- `employeeId` - Foreign key to employees
- `title` - Notification title
- `message` - Notification message
- `type` - Notification type (info, warning, error, success)
- `isRead` - Read status
- `createdAt` - Creation timestamp

## Available Scripts

- `pnpm db:generate` - Generate database migration files
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:studio` - Open Drizzle Studio for database management

## API Endpoints

### Employers
- `GET /api/employers` - Get all employers
- `POST /api/employers` - Create a new employer
- `GET /api/employers/[id]` - Get a specific employer
- `PUT /api/employers/[id]` - Update an employer
- `DELETE /api/employers/[id]` - Delete an employer

### Employees
- `GET /api/employees` - Get all employees with employer info
- `POST /api/employees` - Create a new employee

## Components

The application includes a comprehensive `EmployerManagement` component that provides:

- View all employers in a table format
- Add new employers via a modal form
- Edit existing employers
- Delete employers with confirmation
- Real-time data updates

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Neon database is active
- Ensure your IP is allowed (if using IP restrictions)

### Migration Issues
- Make sure you're running the latest migrations
- Check the console for specific error messages
- Verify your database schema matches the expected structure

### Performance Issues
- Consider adding database indexes for frequently queried fields
- Monitor your Neon database usage and upgrade if needed
- Use connection pooling for production deployments

## Security Considerations

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive configuration
- Consider implementing authentication and authorization
- Regularly update dependencies for security patches

## Next Steps

1. Add authentication and authorization
2. Implement employee management features
3. Add time tracking functionality
4. Create leave request workflows
5. Add expense claim processing
6. Implement notification system
7. Add reporting and analytics
8. Set up automated backups 