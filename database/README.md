# ExpenseFlow Database Documentation

This directory contains the complete database schema and sample data for the ExpenseFlow expense management system.

## 📁 File Structure

```
database/
├── schema.sql              # Complete database schema
├── sample_data.sql         # Sample data for testing
├── migrations/             # Database migration files
│   └── 001_initial_schema.sql
├── README.md              # This documentation file
└── setup.sql             # Quick setup script
```

## 🗄️ Database Schema Overview

### Core System Tables

#### `companies`
Stores company information and settings.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: name, address, phone, email, currency, timezone
- **Relationships**: One-to-many with users, categories, workflows

#### `users`
Stores all user accounts (Admin, Manager, Employee, Director, Finance).
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: name, email, role, manager_id, department, status
- **Relationships**: Self-referencing (manager_id), belongs to company

#### `expense_categories`
Stores expense categories with icons and colors.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: name, description, icon, color, image_url
- **Relationships**: Belongs to company, referenced by expenses and workflows

### Workflow System Tables

#### `workflows`
Defines approval workflows for different expense types.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: name, type, threshold, config (JSON)
- **Types**: sequential, conditional, hybrid, threshold

#### `workflow_stages`
Defines sequential approval stages.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: workflow_id, stage_order, approver_id

#### `workflow_conditions`
Defines conditional approval rules.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: workflow_id, condition_type, condition_value

### Expense Management Tables

#### `expenses`
Stores all expense claims.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: title, amount, currency, category_id, status
- **Status Values**: draft, pending, approved, rejected, cancelled

#### `expense_receipts`
Stores receipt files and OCR data.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: expense_id, file_name, file_path, ocr_data (JSON)

#### `expense_approval_history`
Tracks all approval actions and decisions.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: expense_id, approver_id, action, comment

### Notification System Tables

#### `notifications`
Stores system notifications for users.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: user_id, type, title, message, is_read

### Audit and Logging Tables

#### `audit_logs`
Comprehensive audit trail of all system actions.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: user_id, portal, action, description, old_values, new_values

#### `system_logs`
System-level logging for debugging and monitoring.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: level, message, context (JSON), stack_trace

### Configuration Tables

#### `system_settings`
Company-specific system configuration.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: company_id, setting_key, setting_value, setting_type

#### `user_sessions`
Active user sessions for security management.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: user_id, session_token, expires_at, is_active

### Reporting and Analytics Tables

#### `expense_reports`
Generated expense reports and exports.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: user_id, report_name, report_type, filters (JSON)

#### `dashboard_widgets`
User dashboard configuration and layout.
- **Primary Key**: `id` (VARCHAR(36))
- **Key Fields**: user_id, widget_type, widget_config (JSON), position

## 🔧 Database Setup

### Prerequisites
- MySQL 8.0+ or PostgreSQL 12+
- Database user with CREATE privileges

### Quick Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE expenseflow;"

# Run schema
mysql -u root -p expenseflow < database/schema.sql

# Load sample data (optional)
mysql -u root -p expenseflow < database/sample_data.sql
```

### Migration Setup
```bash
# Run initial migration
mysql -u root -p expenseflow < database/migrations/001_initial_schema.sql
```

## 📊 Database Views

### `user_details`
Combines user information with manager and company details.
```sql
SELECT * FROM user_details WHERE company_id = 'comp_001';
```

### `expense_details`
Combines expense information with category, employee, and workflow details.
```sql
SELECT * FROM expense_details WHERE status = 'pending';
```

### `pending_approvals`
Shows all expenses pending approval with current approver information.
```sql
SELECT * FROM pending_approvals WHERE current_approver_email = 'manager@company.com';
```

### `expense_statistics`
Aggregated expense statistics by employee and company.
```sql
SELECT * FROM expense_statistics WHERE company_id = 'comp_001';
```

## 🔍 Key Indexes

### Performance Indexes
- `idx_users_email` - Fast user lookup by email
- `idx_expenses_employee_id` - Fast expense lookup by employee
- `idx_expenses_status` - Fast filtering by expense status
- `idx_audit_logs_created_at` - Fast audit log queries
- `idx_notifications_user_id` - Fast notification queries

### Foreign Key Indexes
- All foreign key relationships are properly indexed
- Cascade deletes configured for data integrity
- Set NULL for optional relationships

## 🔒 Security Features

### Data Integrity
- Foreign key constraints with appropriate CASCADE/SET NULL rules
- Unique constraints on emails, usernames, and session tokens
- Check constraints for enum values and data validation

### Audit Trail
- Complete audit logging of all user actions
- Before/after value tracking for changes
- IP address and user agent logging

### Session Management
- Secure session tokens with expiration
- Session activity tracking
- Automatic cleanup of expired sessions

## 📈 Performance Considerations

### Indexing Strategy
- Primary keys on all tables for fast lookups
- Foreign key indexes for join performance
- Composite indexes for common query patterns
- Partial indexes for filtered queries

### Query Optimization
- Views for common complex queries
- JSON columns for flexible configuration
- Proper data types for efficient storage

### Scalability
- UUID primary keys for distributed systems
- JSON columns for flexible schema evolution
- Partitioning-ready date columns

## 🔄 Workflow Types

### Sequential Workflows
- Linear approval chain with defined stages
- Each stage must be completed before next
- Suitable for high-value or complex approvals

### Conditional Workflows
- Rule-based approval logic
- Percentage-based approvals (e.g., 60% of approvers)
- Key approver requirements (e.g., CFO approval)
- Any approver requirements (e.g., any 2 approvers)

### Hybrid Workflows
- Combination of sequential and conditional logic
- Complex approval scenarios
- Multiple approval paths

### Threshold Workflows
- Auto-approve expenses under defined threshold
- Route high-value expenses to conditional workflows
- Configurable threshold limits per company

## 📱 API Integration Points

### RESTful Endpoints
- `/api/users` - User management
- `/api/expenses` - Expense operations
- `/api/workflows` - Workflow configuration
- `/api/notifications` - Notification management
- `/api/audit` - Audit log access

### Webhook Support
- Expense status changes
- Workflow stage completions
- System alerts and notifications

## 🧪 Sample Data

The `sample_data.sql` file includes:
- 3 sample companies with different configurations
- 12 sample users across all roles
- 11 expense categories with icons and colors
- 9 sample workflows demonstrating all types
- 9 sample expenses in various states
- Complete approval history and notifications
- System settings and configuration examples

## 🔧 Maintenance

### Regular Maintenance Tasks
- Clean up expired sessions
- Archive old audit logs
- Optimize database indexes
- Backup critical data

### Monitoring Queries
```sql
-- Check system health
SELECT COUNT(*) as total_users FROM users WHERE status = 'active';
SELECT COUNT(*) as pending_expenses FROM expenses WHERE status = 'pending';
SELECT COUNT(*) as active_sessions FROM user_sessions WHERE is_active = TRUE;

-- Performance monitoring
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Slow_queries';
```

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.vertabelo.com/blog/database-design-best-practices/)
- [JSON in MySQL](https://dev.mysql.com/doc/refman/8.0/en/json.html)

---

**Note**: This database schema is designed to support the full ExpenseFlow system with scalability, security, and performance in mind. Regular backups and monitoring are recommended for production deployments.
