-- ExpenseFlow Sample Data
-- Sample data for testing and demonstration purposes

-- =============================================
-- SAMPLE COMPANIES
-- =============================================

INSERT INTO companies (id, name, address, phone, email, currency, timezone, logo_url, created_at, updated_at) VALUES
('comp_001', 'ExpenseFlow Demo Company', '123 Business Street, City, State 12345', '+1 (555) 123-4567', 'info@expenseflow.com', 'USD', 'America/New_York', NULL, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('comp_002', 'TechCorp Solutions', '456 Innovation Drive, Tech City, TC 67890', '+1 (555) 987-6543', 'contact@techcorp.com', 'USD', 'America/Los_Angeles', NULL, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('comp_003', 'Global Enterprises Ltd', '789 Corporate Plaza, Business District, BD 54321', '+1 (555) 456-7890', 'admin@globalenterprises.com', 'EUR', 'Europe/London', NULL, '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE USERS
-- =============================================

INSERT INTO users (id, company_id, name, email, username, password, role, manager_id, department, position, phone, employee_id, status, created_at, updated_at) VALUES
-- ExpenseFlow Demo Company Users
('user_001', 'comp_001', 'John Manager', 'john.manager@expenseflow.com', 'jmanager', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Manager', NULL, 'Operations', 'Operations Manager', '+1 (555) 123-4567', 'EMP001', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_002', 'comp_001', 'Jane Manager', 'jane.manager@expenseflow.com', 'jmanager2', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Manager', NULL, 'Finance', 'Finance Manager', '+1 (555) 123-4568', 'EMP002', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_003', 'comp_001', 'Bob Employee', 'bob.employee@expenseflow.com', 'bemployee', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Employee', 'user_001', 'Operations', 'Operations Specialist', '+1 (555) 123-4569', 'EMP003', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_004', 'comp_001', 'Alice Director', 'alice.director@expenseflow.com', 'adirector', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Director', NULL, 'Executive', 'Director of Operations', '+1 (555) 123-4570', 'EMP004', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_005', 'comp_001', 'Charlie Finance', 'charlie.finance@expenseflow.com', 'cfinance', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Finance', NULL, 'Finance', 'CFO', '+1 (555) 123-4571', 'EMP005', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_006', 'comp_001', 'Admin User', 'admin@expenseflow.com', 'admin', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Admin', NULL, 'IT', 'System Administrator', '+1 (555) 123-4572', 'EMP006', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- TechCorp Solutions Users
('user_007', 'comp_002', 'Sarah Tech', 'sarah.tech@techcorp.com', 'stech', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Manager', NULL, 'Engineering', 'Engineering Manager', '+1 (555) 987-6544', 'EMP007', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_008', 'comp_002', 'Mike Developer', 'mike.dev@techcorp.com', 'mdev', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Employee', 'user_007', 'Engineering', 'Senior Developer', '+1 (555) 987-6545', 'EMP008', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_009', 'comp_002', 'Lisa Designer', 'lisa.design@techcorp.com', 'ldesign', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Employee', 'user_007', 'Design', 'UX Designer', '+1 (555) 987-6546', 'EMP009', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Global Enterprises Users
('user_010', 'comp_003', 'David Global', 'david.global@globalenterprises.com', 'dglobal', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Director', NULL, 'International', 'International Director', '+1 (555) 456-7891', 'EMP010', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_011', 'comp_003', 'Emma Manager', 'emma.manager@globalenterprises.com', 'emanager', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Manager', 'user_010', 'Sales', 'Sales Manager', '+1 (555) 456-7892', 'EMP011', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('user_012', 'comp_003', 'Tom Sales', 'tom.sales@globalenterprises.com', 'tsales', '$2b$10$rQZ8K9vX2mN3pL4qR5sT6u', 'Employee', 'user_011', 'Sales', 'Sales Representative', '+1 (555) 456-7893', 'EMP012', 'active', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE EXPENSE CATEGORIES
-- =============================================

INSERT INTO expense_categories (id, company_id, name, description, icon, color, image_url, is_active, sort_order, created_at, updated_at) VALUES
-- ExpenseFlow Demo Company Categories
('cat_001', 'comp_001', 'Travel', 'Business travel expenses including flights, hotels, and transportation', 'fas fa-plane', '#667eea', NULL, TRUE, 1, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_002', 'comp_001', 'Meals', 'Business meals and entertainment expenses', 'fas fa-utensils', '#f093fb', NULL, TRUE, 2, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_003', 'comp_001', 'Office Supplies', 'Office supplies and stationery', 'fas fa-clipboard', '#4facfe', NULL, TRUE, 3, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_004', 'comp_001', 'IT Equipment', 'Computers, software, and IT equipment', 'fas fa-laptop', '#43e97b', NULL, TRUE, 4, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_005', 'comp_001', 'Miscellaneous', 'Other business expenses', 'fas fa-ellipsis-h', '#fa709a', NULL, TRUE, 5, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_006', 'comp_001', 'Training', 'Professional development and training expenses', 'fas fa-graduation-cap', '#a8edea', NULL, TRUE, 6, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- TechCorp Solutions Categories
('cat_007', 'comp_002', 'Software Licenses', 'Software licenses and subscriptions', 'fas fa-code', '#667eea', NULL, TRUE, 1, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_008', 'comp_002', 'Hardware', 'Computer hardware and equipment', 'fas fa-desktop', '#f093fb', NULL, TRUE, 2, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_009', 'comp_002', 'Conference', 'Conference and event expenses', 'fas fa-calendar-alt', '#4facfe', NULL, TRUE, 3, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Global Enterprises Categories
('cat_010', 'comp_003', 'International Travel', 'International business travel', 'fas fa-globe', '#43e97b', NULL, TRUE, 1, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('cat_011', 'comp_003', 'Client Entertainment', 'Client entertainment and hospitality', 'fas fa-handshake', '#fa709a', NULL, TRUE, 2, '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE WORKFLOWS
-- =============================================

INSERT INTO workflows (id, company_id, name, description, category_id, type, threshold, config, is_active, created_by, created_at, updated_at) VALUES
-- ExpenseFlow Demo Company Workflows
('wf_001', 'comp_001', 'Standard Approval Process', 'Standard sequential approval for most expenses', 'cat_001', 'sequential', NULL, '{"approvers": ["user_001", "user_002"]}', TRUE, 'user_006', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('wf_002', 'comp_001', 'High Value Approval', 'Multi-level approval for high-value expenses', 'cat_004', 'sequential', NULL, '{"approvers": ["user_001", "user_004", "user_005"]}', TRUE, 'user_006', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('wf_003', 'comp_001', 'Team Consensus', 'Percentage-based approval requiring team consensus', 'cat_002', 'conditional', NULL, '{"approvers": ["user_001", "user_002"], "conditions": [{"type": "percentage", "value": "60"}]}', TRUE, 'user_006', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('wf_004', 'comp_001', 'Quick Approval', 'Threshold-based auto-approval for small amounts', 'cat_003', 'threshold', 100.00, '{"approvers": ["user_001"]}', TRUE, 'user_006', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('wf_005', 'comp_001', 'Hybrid Workflow', 'Combination of sequential and conditional approval', 'cat_005', 'hybrid', NULL, '{"sequentialApprovers": ["user_001"], "conditionalApprovers": ["user_002", "user_004"], "conditions": [{"type": "anyApprover", "value": "1"}]}', TRUE, 'user_006', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- TechCorp Solutions Workflows
('wf_006', 'comp_002', 'Engineering Approval', 'Approval process for engineering expenses', 'cat_007', 'sequential', NULL, '{"approvers": ["user_007"]}', TRUE, 'user_007', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('wf_007', 'comp_002', 'Hardware Approval', 'Multi-level approval for hardware purchases', 'cat_008', 'sequential', NULL, '{"approvers": ["user_007", "user_007"]}', TRUE, 'user_007', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Global Enterprises Workflows
('wf_008', 'comp_003', 'International Travel', 'Approval for international travel expenses', 'cat_010', 'sequential', NULL, '{"approvers": ["user_011", "user_010"]}', TRUE, 'user_010', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('wf_009', 'comp_003', 'Client Entertainment', 'Approval for client entertainment expenses', 'cat_011', 'conditional', NULL, '{"approvers": ["user_011"], "conditions": [{"type": "keyApprover", "approverId": "user_010"}]}', TRUE, 'user_010', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE WORKFLOW STAGES
-- =============================================

INSERT INTO workflow_stages (id, workflow_id, stage_order, approver_id, is_required, created_at) VALUES
-- Standard Approval Process (wf_001)
('ws_001', 'wf_001', 1, 'user_001', TRUE, '2024-01-01 00:00:00'),
('ws_002', 'wf_001', 2, 'user_002', TRUE, '2024-01-01 00:00:00'),

-- High Value Approval (wf_002)
('ws_003', 'wf_002', 1, 'user_001', TRUE, '2024-01-01 00:00:00'),
('ws_004', 'wf_002', 2, 'user_004', TRUE, '2024-01-01 00:00:00'),
('ws_005', 'wf_002', 3, 'user_005', TRUE, '2024-01-01 00:00:00'),

-- Engineering Approval (wf_006)
('ws_006', 'wf_006', 1, 'user_007', TRUE, '2024-01-01 00:00:00'),

-- Hardware Approval (wf_007)
('ws_007', 'wf_007', 1, 'user_007', TRUE, '2024-01-01 00:00:00'),

-- International Travel (wf_008)
('ws_008', 'wf_008', 1, 'user_011', TRUE, '2024-01-01 00:00:00'),
('ws_009', 'wf_008', 2, 'user_010', TRUE, '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE WORKFLOW CONDITIONS
-- =============================================

INSERT INTO workflow_conditions (id, workflow_id, condition_type, condition_value, approver_id, created_at) VALUES
-- Team Consensus (wf_003)
('wc_001', 'wf_003', 'percentage', '60', NULL, '2024-01-01 00:00:00'),

-- Client Entertainment (wf_009)
('wc_002', 'wf_009', 'keyApprover', 'true', 'user_010', '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE EXPENSES
-- =============================================

INSERT INTO expenses (id, company_id, employee_id, title, description, amount, currency, category_id, workflow_id, date, status, current_approval_stage, submitted_at, approved_at, rejected_at, rejection_reason, auto_approved, created_at, updated_at) VALUES
-- ExpenseFlow Demo Company Expenses
('exp_001', 'comp_001', 'user_003', 'Business Travel - New York', 'Travel expenses for client meeting in New York', 1250.50, 'USD', 'cat_001', 'wf_001', '2024-01-15', 'pending', 0, '2024-01-15 10:30:00', NULL, NULL, NULL, FALSE, '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
('exp_002', 'comp_001', 'user_003', 'Client Dinner', 'Dinner with potential client', 185.75, 'USD', 'cat_002', 'wf_003', '2024-01-14', 'pending', 0, '2024-01-14 19:45:00', NULL, NULL, NULL, FALSE, '2024-01-14 19:45:00', '2024-01-14 19:45:00'),
('exp_003', 'comp_001', 'user_003', 'Office Supplies', 'Monthly office supplies order', 75.25, 'USD', 'cat_003', 'wf_004', '2024-01-13', 'approved', 0, '2024-01-13 14:20:00', '2024-01-13 14:25:00', NULL, NULL, TRUE, '2024-01-13 14:20:00', '2024-01-13 14:25:00'),
('exp_004', 'comp_001', 'user_003', 'Laptop Purchase', 'New laptop for development work', 2500.00, 'USD', 'cat_004', 'wf_002', '2024-01-12', 'pending', 1, '2024-01-12 09:15:00', NULL, NULL, NULL, FALSE, '2024-01-12 09:15:00', '2024-01-12 09:15:00'),
('exp_005', 'comp_001', 'user_003', 'Training Course', 'Online certification course', 450.00, 'USD', 'cat_006', 'wf_001', '2024-01-11', 'approved', 1, '2024-01-11 16:30:00', '2024-01-11 17:00:00', NULL, NULL, FALSE, '2024-01-11 16:30:00', '2024-01-11 17:00:00'),

-- TechCorp Solutions Expenses
('exp_006', 'comp_002', 'user_008', 'Software License', 'Annual software license renewal', 1200.00, 'USD', 'cat_007', 'wf_006', '2024-01-16', 'pending', 0, '2024-01-16 11:00:00', NULL, NULL, NULL, FALSE, '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
('exp_007', 'comp_002', 'user_009', 'Design Software', 'Adobe Creative Suite subscription', 599.88, 'USD', 'cat_007', 'wf_006', '2024-01-15', 'approved', 0, '2024-01-15 13:45:00', '2024-01-15 14:00:00', NULL, NULL, FALSE, '2024-01-15 13:45:00', '2024-01-15 14:00:00'),

-- Global Enterprises Expenses
('exp_008', 'comp_003', 'user_012', 'International Conference', 'Travel to international conference in London', 3500.00, 'EUR', 'cat_010', 'wf_008', '2024-01-17', 'pending', 0, '2024-01-17 08:30:00', NULL, NULL, NULL, FALSE, '2024-01-17 08:30:00', '2024-01-17 08:30:00'),
('exp_009', 'comp_003', 'user_012', 'Client Lunch', 'Business lunch with international client', 125.50, 'EUR', 'cat_011', 'wf_009', '2024-01-16', 'pending', 0, '2024-01-16 12:15:00', NULL, NULL, NULL, FALSE, '2024-01-16 12:15:00', '2024-01-16 12:15:00');

-- =============================================
-- SAMPLE EXPENSE RECEIPTS
-- =============================================

INSERT INTO expense_receipts (id, expense_id, file_name, file_path, file_size, file_type, upload_date, ocr_data, is_primary) VALUES
('receipt_001', 'exp_001', 'ny_travel_receipt.pdf', '/uploads/receipts/ny_travel_receipt.pdf', 245760, 'application/pdf', '2024-01-15 10:35:00', '{"amount": "1250.50", "merchant": "Delta Airlines", "date": "2024-01-15"}', TRUE),
('receipt_002', 'exp_002', 'restaurant_receipt.jpg', '/uploads/receipts/restaurant_receipt.jpg', 123456, 'image/jpeg', '2024-01-14 19:50:00', '{"amount": "185.75", "merchant": "The Capital Grille", "date": "2024-01-14"}', TRUE),
('receipt_003', 'exp_003', 'office_supplies_receipt.pdf', '/uploads/receipts/office_supplies_receipt.pdf', 98765, 'application/pdf', '2024-01-13 14:25:00', '{"amount": "75.25", "merchant": "Staples", "date": "2024-01-13"}', TRUE),
('receipt_004', 'exp_004', 'laptop_invoice.pdf', '/uploads/receipts/laptop_invoice.pdf', 456789, 'application/pdf', '2024-01-12 09:20:00', '{"amount": "2500.00", "merchant": "Apple Store", "date": "2024-01-12"}', TRUE);

-- =============================================
-- SAMPLE APPROVAL HISTORY
-- =============================================

INSERT INTO expense_approval_history (id, expense_id, approver_id, action, comment, stage_order, condition_met, processed_at) VALUES
-- Approved expenses
('ah_001', 'exp_003', 'user_001', 'approve', 'Auto-approved under threshold', 0, 'threshold', '2024-01-13 14:25:00'),
('ah_002', 'exp_005', 'user_001', 'approve', 'Training expense approved', 0, NULL, '2024-01-11 16:45:00'),
('ah_003', 'exp_005', 'user_002', 'approve', 'Final approval for training', 1, NULL, '2024-01-11 17:00:00'),
('ah_004', 'exp_007', 'user_007', 'approve', 'Software subscription approved', 0, NULL, '2024-01-15 14:00:00');

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO notifications (id, company_id, user_id, type, title, message, data, is_read, created_at) VALUES
-- ExpenseFlow Demo Company Notifications
('notif_001', 'comp_001', 'user_001', 'expense_submitted', 'New Expense Submitted', 'Bob Employee submitted a new expense: Business Travel - New York', '{"expenseId": "exp_001", "amount": 1250.50}', FALSE, '2024-01-15 10:30:00'),
('notif_002', 'comp_001', 'user_003', 'expense_approved', 'Expense Approved', 'Your expense "Training Course" has been approved', '{"expenseId": "exp_005", "amount": 450.00}', FALSE, '2024-01-11 17:00:00'),

-- TechCorp Solutions Notifications
('notif_003', 'comp_002', 'user_007', 'expense_submitted', 'New Expense Submitted', 'Mike Developer submitted a new expense: Software License', '{"expenseId": "exp_006", "amount": 1200.00}', FALSE, '2024-01-16 11:00:00'),

-- Global Enterprises Notifications
('notif_004', 'comp_003', 'user_011', 'expense_submitted', 'New Expense Submitted', 'Tom Sales submitted a new expense: International Conference', '{"expenseId": "exp_008", "amount": 3500.00}', FALSE, '2024-01-17 08:30:00');

-- =============================================
-- SAMPLE AUDIT LOGS
-- =============================================

INSERT INTO audit_logs (id, company_id, user_id, portal, action, description, entity_type, entity_id, old_values, new_values, ip_address, created_at) VALUES
-- ExpenseFlow Demo Company Audit Logs
('audit_001', 'comp_001', 'user_006', 'Admin', 'USER_CREATED', 'Created new user: Bob Employee', 'user', 'user_003', NULL, '{"name": "Bob Employee", "email": "bob.employee@expenseflow.com", "role": "Employee"}', '192.168.1.100', '2024-01-01 00:00:00'),
('audit_002', 'comp_001', 'user_006', 'Admin', 'CATEGORY_CREATED', 'Created new expense category: Travel', 'expense_category', 'cat_001', NULL, '{"name": "Travel", "description": "Business travel expenses"}', '192.168.1.100', '2024-01-01 00:00:00'),
('audit_003', 'comp_001', 'user_006', 'Admin', 'WORKFLOW_CREATED', 'Created new workflow: Standard Approval Process', 'workflow', 'wf_001', NULL, '{"name": "Standard Approval Process", "type": "sequential"}', '192.168.1.100', '2024-01-01 00:00:00'),
('audit_004', 'comp_001', 'user_003', 'Employee', 'EXPENSE_SUBMITTED', 'Submitted expense: Business Travel - New York', 'expense', 'exp_001', NULL, '{"title": "Business Travel - New York", "amount": 1250.50}', '192.168.1.101', '2024-01-15 10:30:00'),
('audit_005', 'comp_001', 'user_001', 'Manager', 'EXPENSE_APPROVED', 'Approved expense: Training Course', 'expense', 'exp_005', '{"status": "pending"}', '{"status": "approved"}', '192.168.1.102', '2024-01-11 16:45:00');

-- =============================================
-- SAMPLE SYSTEM SETTINGS
-- =============================================

INSERT INTO system_settings (id, company_id, setting_key, setting_value, setting_type, description, is_public, created_at, updated_at) VALUES
-- ExpenseFlow Demo Company Settings
('setting_001', 'comp_001', 'auto_approval_threshold', '100', 'number', 'Automatic approval threshold for expenses', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('setting_002', 'comp_001', 'require_receipts', 'true', 'boolean', 'Require receipts for all expenses', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('setting_003', 'comp_001', 'max_expense_amount', '10000', 'number', 'Maximum expense amount allowed', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('setting_004', 'comp_001', 'approval_timeout_days', '7', 'number', 'Days before approval timeout', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('setting_005', 'comp_001', 'notification_email', 'notifications@expenseflow.com', 'string', 'Email for system notifications', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- TechCorp Solutions Settings
('setting_006', 'comp_002', 'auto_approval_threshold', '500', 'number', 'Automatic approval threshold for expenses', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('setting_007', 'comp_002', 'require_receipts', 'true', 'boolean', 'Require receipts for all expenses', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Global Enterprises Settings
('setting_008', 'comp_003', 'auto_approval_threshold', '200', 'number', 'Automatic approval threshold for expenses', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
('setting_009', 'comp_003', 'multi_currency_enabled', 'true', 'boolean', 'Enable multi-currency support', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- =============================================
-- SAMPLE USER SESSIONS
-- =============================================

INSERT INTO user_sessions (id, user_id, session_token, expires_at, ip_address, user_agent, is_active, created_at, last_activity) VALUES
('session_001', 'user_001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', '2024-01-18 10:30:00', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE, '2024-01-17 10:30:00', '2024-01-17 15:45:00'),
('session_002', 'user_003', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', '2024-01-18 11:00:00', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE, '2024-01-17 11:00:00', '2024-01-17 16:20:00'),
('session_003', 'user_006', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', '2024-01-18 09:00:00', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE, '2024-01-17 09:00:00', '2024-01-17 14:30:00');
