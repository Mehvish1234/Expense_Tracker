# ExpenseFlow Admin Portal

A comprehensive expense management system admin portal built with HTML, CSS, and JavaScript. This system provides complete administrative control over expense workflows, user management, and organizational settings.

## Features

### 🔐 Authentication & Security
- Secure admin login with credential validation
- Session management with automatic timeout
- Audit logging for all administrative actions
- Encrypted password storage simulation

### 🏢 Company Setup
- First-time company configuration wizard
- Country and currency selection
- Admin profile setup
- Automatic initialization of default expense categories

### 👥 User Management
- Create and manage users (Employees, Managers, Admins)
- Role-based access control
- Reporting relationship management
- User status management (Active/Inactive)
- **Excel Import**: Bulk import users from Excel files
- **Template Download**: Download sample Excel templates with proper formatting
- **Data Validation**: Comprehensive validation with duplicate checking
- **Manager Assignment**: Automatic manager assignment via email lookup

### 📊 Expense Categories
- Pre-configured default categories (Travel, Meals, Office Supplies, IT Equipment, Miscellaneous)
- Custom category creation with icons and descriptions
- Category editing and deletion
- Visual category management interface
- **Excel Import**: Bulk import categories from Excel files
- **Template Download**: Download sample Excel templates
- **Data Validation**: Real-time validation with error reporting

### 🔄 Workflow Configuration
- **Sequential Workflows**: Multi-stage approval processes
- **Conditional Workflows**: Rule-based approval logic
- **Hybrid Workflows**: Combination of sequential and conditional logic
- **Threshold-based Rules**: Different workflows for different expense amounts
- **Default Workflow**: Fallback for uncategorized expenses

### 📈 Real-time Monitoring
- Live dashboard with key metrics
- Expense trend analysis with interactive charts
- Category breakdown visualization
- Pending approvals tracking
- Approved/rejected claims monitoring

### 🎯 Admin Dashboard
- Overview statistics (Total users, expenses, pending approvals)
- User management interface
- Category management
- Workflow configuration
- Real-time monitoring charts

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Use the default admin credentials:
   - **Email**: admin@expenseflow.com
   - **Password**: admin123

### First-Time Setup
1. Login with admin credentials
2. Complete the company setup wizard:
   - Enter company name
   - Select country
   - Choose default currency
   - Enter your full name
3. The system will automatically initialize with default categories

## System Architecture

### Core Components
- **Authentication System**: Handles login, session management, and security
- **Company Management**: Manages organizational settings and configuration
- **User Management**: Handles user creation, roles, and relationships
- **Category Management**: Manages expense categories and their properties
- **Workflow Engine**: Configures and manages approval workflows
- **Monitoring System**: Provides real-time analytics and reporting
- **Audit System**: Logs all administrative actions for compliance

### Data Storage
- Uses browser localStorage for data persistence
- All data is stored locally in the browser
- Includes backup and restore capabilities
- Audit trail maintenance

## User Roles

### Admin
- Full system access
- User management
- Workflow configuration
- System monitoring
- Company settings

### Manager
- Team expense approval
- Team member management
- Reporting access
- Limited administrative functions

### Employee
- Expense submission
- Personal expense tracking
- Limited system access

## Workflow Types

### Sequential Workflows
- Multi-stage approval process
- Defined order of approvers
- Each stage must be completed before moving to next
- Suitable for high-value or complex approvals

### Conditional Workflows
- Rule-based approval logic
- Amount-based conditions
- Percentage-based approvals
- Category-specific rules
- Flexible approval criteria

### Hybrid Workflows
- Combination of sequential and conditional logic
- Complex approval scenarios
- Multiple approval paths
- Advanced business logic support

## Security Features

### Authentication
- Credential validation
- Session management
- Automatic logout on inactivity
- Secure password handling

### Audit Logging
- All administrative actions logged
- User activity tracking
- System change monitoring
- Compliance reporting

### Data Protection
- Local data encryption simulation
- Secure session handling
- Access control enforcement
- Data integrity checks

## Monitoring & Analytics

### Dashboard Metrics
- Total users count
- Total expenses amount
- Pending approvals count
- Approved claims count

### Visual Analytics
- Expense trends over time
- Category breakdown charts
- Approval workflow bottlenecks
- User activity patterns

### Real-time Updates
- Live data refresh
- Automatic chart updates
- Real-time notifications
- Status change tracking

## Excel Import Features

### User Import from Excel
1. **Navigate to User Management** section
2. **Click "Import Excel"** button
3. **Download Template** (optional) - Get sample Excel file with proper format
4. **Prepare Excel File** with columns:
   - **Name**: Full name of the user
   - **Email**: Email address (must be unique)
   - **Role**: Employee, Manager, or Admin
   - **Manager**: Email of manager (optional)
   - **Password**: Initial password
5. **Upload Excel File** and preview data
6. **Review Validation** - System checks for errors and duplicates
7. **Confirm Import** - Bulk import all valid users

### Category Import from Excel
1. **Navigate to Expense Categories** section
2. **Click "Import Excel"** button
3. **Download Template** (optional) - Get sample Excel file with proper format
4. **Prepare Excel File** with columns:
   - **Name**: Category name
   - **Description**: Category description
   - **Icon**: FontAwesome icon class (e.g., fas fa-plane)
   - **Color**: Hex color code (e.g., #667eea)
5. **Upload Excel File** and preview data
6. **Review Validation** - System checks for errors and duplicates
7. **Confirm Import** - Bulk import all valid categories

### Excel Import Validation
- **Required Field Validation**: Ensures all mandatory fields are present
- **Email Format Validation**: Validates email addresses
- **Role Validation**: Ensures roles are valid (Employee, Manager, Admin)
- **Duplicate Detection**: Prevents duplicate emails/names within file and system
- **Color Format Validation**: Validates hex color codes for categories
- **Manager Lookup**: Automatically finds manager IDs by email
- **Real-time Preview**: Shows data with validation status before import

## Customization

### Adding New Categories
1. Navigate to Expense Categories section
2. Click "Add Category" or "Import Excel"
3. Enter category details or upload Excel file
4. Select appropriate icon and color
5. Save configuration

### Creating Workflows
1. Go to Workflows section
2. Click "Create Workflow"
3. Select workflow type
4. Configure approval rules
5. Set thresholds if needed
6. Save and publish

### User Management
1. Access User Management section
2. Click "Add User" or "Import Excel"
3. Enter user details individually or bulk import
4. Assign role and manager
5. Set initial password
6. Activate user account

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Technical Notes

### Data Persistence
- All data stored in browser localStorage
- Automatic data backup
- Session persistence across browser restarts
- Data export/import capabilities

### Performance
- Optimized for fast loading
- Efficient data handling
- Minimal memory usage
- Responsive design

### Security Considerations
- Password hashing simulation
- Session security
- Input validation
- XSS protection

## Support

For technical support or feature requests, please refer to the system documentation or contact the development team.

## License

This project is proprietary software. All rights reserved.

---

**ExpenseFlow Admin Portal** - Complete expense management system administration interface.
#   E x p e n s e _ T r a c k e r  
 