-- ExpenseFlow Database Quick Setup Script
-- This script creates the database and runs the initial schema

-- Create database (uncomment for MySQL)
-- CREATE DATABASE IF NOT EXISTS expenseflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE expenseflow;

-- Create database (uncomment for PostgreSQL)
-- CREATE DATABASE expenseflow;
-- \c expenseflow;

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =============================================
-- CORE SYSTEM TABLES
-- =============================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    logo_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Employee', 'Director', 'Finance') NOT NULL,
    manager_id VARCHAR(36),
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(50),
    employee_id VARCHAR(50),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    profile_image_url VARCHAR(500),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Expense categories table
CREATE TABLE IF NOT EXISTS expense_categories (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    type ENUM('sequential', 'conditional', 'hybrid', 'threshold') NOT NULL,
    threshold DECIMAL(10,2),
    config JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Workflow stages table
CREATE TABLE IF NOT EXISTS workflow_stages (
    id VARCHAR(36) PRIMARY KEY,
    workflow_id VARCHAR(36) NOT NULL,
    stage_order INTEGER NOT NULL,
    approver_id VARCHAR(36) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(workflow_id, stage_order)
);

-- Workflow conditions table
CREATE TABLE IF NOT EXISTS workflow_conditions (
    id VARCHAR(36) PRIMARY KEY,
    workflow_id VARCHAR(36) NOT NULL,
    condition_type ENUM('percentage', 'keyApprover', 'anyApprover', 'amount') NOT NULL,
    condition_value VARCHAR(255) NOT NULL,
    approver_id VARCHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category_id VARCHAR(36) NOT NULL,
    workflow_id VARCHAR(36),
    date DATE NOT NULL,
    status ENUM('draft', 'pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    current_approval_stage INTEGER DEFAULT 0,
    submitted_at DATETIME,
    approved_at DATETIME,
    rejected_at DATETIME,
    rejection_reason TEXT,
    final_approval_condition JSON,
    auto_approved BOOLEAN DEFAULT FALSE,
    exchange_rate DECIMAL(10,4),
    total_amount_usd DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE SET NULL
);

-- Expense receipts table
CREATE TABLE IF NOT EXISTS expense_receipts (
    id VARCHAR(36) PRIMARY KEY,
    expense_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    ocr_data JSON,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);

-- Expense approval history table
CREATE TABLE IF NOT EXISTS expense_approval_history (
    id VARCHAR(36) PRIMARY KEY,
    expense_id VARCHAR(36) NOT NULL,
    approver_id VARCHAR(36) NOT NULL,
    action ENUM('approve', 'reject', 'forward', 'return') NOT NULL,
    comment TEXT,
    stage_order INTEGER,
    condition_met VARCHAR(255),
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('expense_submitted', 'expense_approved', 'expense_rejected', 'expense_forwarded', 'system_alert') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    portal ENUM('Admin', 'Manager', 'Employee', 'Director', 'Finance', 'System') NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36),
    level ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    message TEXT NOT NULL,
    context JSON,
    stack_trace TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE(company_id, setting_key)
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Expense reports table
CREATE TABLE IF NOT EXISTS expense_reports (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_type ENUM('monthly', 'quarterly', 'yearly', 'custom') NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    filters JSON,
    status ENUM('pending', 'generating', 'completed', 'failed') DEFAULT 'pending',
    file_path VARCHAR(500),
    generated_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dashboard widgets table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    widget_type VARCHAR(100) NOT NULL,
    widget_config JSON NOT NULL,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 4,
    height INTEGER DEFAULT 3,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- CREATE INDEXES
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON users(manager_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_submitted_at ON expenses(submitted_at);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_company_id ON workflows(company_id);
CREATE INDEX IF NOT EXISTS idx_workflows_category_id ON workflows(category_id);
CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(type);
CREATE INDEX IF NOT EXISTS idx_workflows_is_active ON workflows(is_active);

-- Approval history indexes
CREATE INDEX IF NOT EXISTS idx_approval_history_expense_id ON expense_approval_history(expense_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_approver_id ON expense_approval_history(approver_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_processed_at ON expense_approval_history(processed_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- =============================================
-- CREATE VIEWS
-- =============================================

-- User details with manager information
CREATE VIEW IF NOT EXISTS user_details AS
SELECT 
    u.id,
    u.company_id,
    u.name,
    u.email,
    u.username,
    u.role,
    u.department,
    u.position,
    u.phone,
    u.employee_id,
    u.status,
    u.profile_image_url,
    u.last_login,
    u.created_at,
    u.updated_at,
    m.name AS manager_name,
    m.email AS manager_email,
    c.name AS company_name
FROM users u
LEFT JOIN users m ON u.manager_id = m.id
LEFT JOIN companies c ON u.company_id = c.id;

-- Expense details with category and employee information
CREATE VIEW IF NOT EXISTS expense_details AS
SELECT 
    e.id,
    e.company_id,
    e.employee_id,
    e.title,
    e.description,
    e.amount,
    e.currency,
    e.date,
    e.status,
    e.current_approval_stage,
    e.submitted_at,
    e.approved_at,
    e.rejected_at,
    e.rejection_reason,
    e.auto_approved,
    e.created_at,
    e.updated_at,
    ec.name AS category_name,
    ec.icon AS category_icon,
    ec.color AS category_color,
    u.name AS employee_name,
    u.email AS employee_email,
    w.name AS workflow_name,
    w.type AS workflow_type
FROM expenses e
LEFT JOIN expense_categories ec ON e.category_id = ec.id
LEFT JOIN users u ON e.employee_id = u.id
LEFT JOIN workflows w ON e.workflow_id = w.id;

-- Pending approvals view
CREATE VIEW IF NOT EXISTS pending_approvals AS
SELECT 
    e.id AS expense_id,
    e.title,
    e.amount,
    e.currency,
    e.date,
    e.current_approval_stage,
    e.created_at,
    u.name AS employee_name,
    u.email AS employee_email,
    ec.name AS category_name,
    w.name AS workflow_name,
    w.type AS workflow_type,
    approver.name AS current_approver_name,
    approver.email AS current_approver_email
FROM expenses e
JOIN users u ON e.employee_id = u.id
JOIN expense_categories ec ON e.category_id = ec.id
LEFT JOIN workflows w ON e.workflow_id = w.id
LEFT JOIN workflow_stages ws ON w.id = ws.workflow_id AND ws.stage_order = e.current_approval_stage
LEFT JOIN users approver ON ws.approver_id = approver.id
WHERE e.status = 'pending';

-- Expense statistics view
CREATE VIEW IF NOT EXISTS expense_statistics AS
SELECT 
    e.company_id,
    e.employee_id,
    u.name AS employee_name,
    COUNT(*) AS total_expenses,
    SUM(CASE WHEN e.status = 'pending' THEN 1 ELSE 0 END) AS pending_expenses,
    SUM(CASE WHEN e.status = 'approved' THEN 1 ELSE 0 END) AS approved_expenses,
    SUM(CASE WHEN e.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_expenses,
    SUM(CASE WHEN e.status = 'approved' THEN e.amount ELSE 0 END) AS approved_amount,
    SUM(e.amount) AS total_amount,
    AVG(e.amount) AS average_amount,
    MIN(e.date) AS first_expense_date,
    MAX(e.date) AS last_expense_date
FROM expenses e
JOIN users u ON e.employee_id = u.id
GROUP BY e.company_id, e.employee_id, u.name;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

SELECT 'ExpenseFlow database setup completed successfully!' AS status;
