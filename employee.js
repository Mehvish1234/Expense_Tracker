// ExpenseFlow Employee Portal
class EmployeePortal {
    constructor() {
        this.currentEmployee = null;
        this.expenses = [];
        this.users = [];
        this.workflows = [];
        this.categories = [];
        this.currentExpenseId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredData();
        this.checkSession();
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Action buttons
        document.getElementById('submit-expense-btn').addEventListener('click', () => {
            this.showSubmitExpenseModal();
        });

        document.getElementById('upload-receipt-btn').addEventListener('click', () => {
            this.showSubmitExpenseModal();
        });

        // Refresh buttons
        document.getElementById('refresh-pending').addEventListener('click', () => {
            this.loadPendingExpenses();
        });

        document.getElementById('refresh-approved').addEventListener('click', () => {
            this.loadApprovedExpenses();
        });

        document.getElementById('refresh-rejected').addEventListener('click', () => {
            this.loadRejectedExpenses();
        });

        // Filter controls
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Modal close handlers
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.hideModal(e.target.closest('.modal').id);
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Submit expense form
        document.getElementById('submit-expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmitExpense();
        });

        // Cancel buttons
        document.getElementById('cancel-submit').addEventListener('click', () => {
            this.hideModal('submit-expense-modal');
        });

        // File upload
        const fileUploadArea = document.getElementById('receipt-upload-area');
        const fileInput = document.getElementById('receipt-file');

        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Set default date to today
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    }

    // Authentication Methods
    checkSession() {
        const sessionId = localStorage.getItem('expenseFlowSessionId');
        if (sessionId) {
            const currentUser = JSON.parse(localStorage.getItem('expenseFlowCurrentUser') || 'null');
            if (currentUser && currentUser.role === 'Employee') {
                this.currentEmployee = currentUser;
                this.showEmployeeDashboard();
                this.loadEmployeeData();
            } else {
                // User is not an employee, redirect to main page
                window.location.href = 'index.html';
            }
        } else {
            // No valid session, redirect to main page
            window.location.href = 'index.html';
        }
    }

    showEmployeeDashboard() {
        document.querySelector('.employee-container').style.display = 'block';
    }

    handleLogout() {
        this.logAudit('EMPLOYEE_LOGOUT', `Employee ${this.currentEmployee.name} logged out`);
        localStorage.removeItem('expenseFlowSessionId');
        localStorage.removeItem('expenseFlowCurrentUser');
        this.currentEmployee = null;
        
        // Redirect to main login page
        window.location.href = 'index.html';
    }

    // Data Loading Methods
    loadStoredData() {
        this.users = JSON.parse(localStorage.getItem('expenseFlowUsers') || '[]');
        this.workflows = JSON.parse(localStorage.getItem('expenseFlowWorkflows') || '[]');
        this.categories = JSON.parse(localStorage.getItem('expenseFlowCategories') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('expenseFlowExpenses') || '[]');
    }

    loadEmployeeData() {
        this.updateEmployeeInfo();
        this.populateCategories();
        this.loadPendingExpenses();
        this.loadApprovedExpenses();
        this.loadRejectedExpenses();
        this.updateAnalytics();
        this.loadNotifications();
    }

    updateEmployeeInfo() {
        document.getElementById('employee-name').textContent = this.currentEmployee.name;
        document.getElementById('employee-email').textContent = this.currentEmployee.email;
        
        const company = JSON.parse(localStorage.getItem('expenseFlowCompany'));
        document.getElementById('employee-company').textContent = company ? company.name : 'Unknown Company';
    }

    populateCategories() {
        const categorySelect = document.getElementById('expense-category');
        const filterCategorySelect = document.getElementById('filter-category');
        
        // Clear existing options
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        filterCategorySelect.innerHTML = '<option value="">All Categories</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
            
            const filterOption = document.createElement('option');
            filterOption.value = category.id;
            filterOption.textContent = category.name;
            filterCategorySelect.appendChild(filterOption);
        });
    }

    // Expense Loading Methods
    loadPendingExpenses() {
        const container = document.getElementById('pending-expenses-container');
        const pendingExpenses = this.getPendingExpensesForEmployee();
        
        this.updateExpenseCounts();
        
        if (pendingExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <h3>No Pending Expenses</h3>
                    <p>All your expense claims have been processed!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        pendingExpenses.forEach(expense => {
            container.appendChild(this.createExpenseCard(expense, 'pending'));
        });
    }

    loadApprovedExpenses() {
        const container = document.getElementById('approved-expenses-container');
        const approvedExpenses = this.getApprovedExpensesForEmployee();
        
        if (approvedExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>No Approved Expenses</h3>
                    <p>No expenses have been approved yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        approvedExpenses.forEach(expense => {
            container.appendChild(this.createExpenseCard(expense, 'approved'));
        });
    }

    loadRejectedExpenses() {
        const container = document.getElementById('rejected-expenses-container');
        const rejectedExpenses = this.getRejectedExpensesForEmployee();
        
        if (rejectedExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-times-circle"></i>
                    <h3>No Rejected Expenses</h3>
                    <p>No expenses have been rejected yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        rejectedExpenses.forEach(expense => {
            container.appendChild(this.createExpenseCard(expense, 'rejected'));
        });
    }

    getPendingExpensesForEmployee() {
        return this.expenses.filter(expense => 
            expense.employeeId === this.currentEmployee.id && expense.status === 'pending'
        );
    }

    getApprovedExpensesForEmployee() {
        return this.expenses.filter(expense => 
            expense.employeeId === this.currentEmployee.id && expense.status === 'approved'
        );
    }

    getRejectedExpensesForEmployee() {
        return this.expenses.filter(expense => 
            expense.employeeId === this.currentEmployee.id && expense.status === 'rejected'
        );
    }

    createExpenseCard(expense, status) {
        const card = document.createElement('div');
        card.className = `expense-card ${status}`;
        
        const category = this.categories.find(c => c.id === expense.category);
        const workflow = this.workflows.find(w => w.category === expense.category);
        
        let workflowInfo = '';
        if (workflow) {
            const workflowStatus = this.getWorkflowStatus(expense);
            workflowInfo = `<div class="workflow-info">
                <i class="fas fa-sitemap"></i> Workflow: ${workflow.name} - ${workflowStatus.status}
            </div>`;
        }

        let statusTracker = '';
        if (expense.status === 'pending') {
            statusTracker = this.createStatusTracker(expense);
        }

        let approvalHistory = '';
        if (expense.approvalHistory && expense.approvalHistory.length > 0) {
            approvalHistory = `
                <div class="approval-history">
                    <strong>Approval History:</strong>
                    ${expense.approvalHistory.map(history => `
                        <div class="history-item">
                            <span>${history.action} by ${this.getUserNameById(history.approverId)}</span>
                            <span>${new Date(history.timestamp).toLocaleDateString()}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let rejectionReason = '';
        if (expense.status === 'rejected' && expense.rejectionReason) {
            rejectionReason = `
                <div class="approval-history" style="background: #f8d7da; border-left: 4px solid #dc3545;">
                    <strong>Rejection Reason:</strong>
                    <p style="margin: 5px 0 0 0; color: #721c24;">${expense.rejectionReason}</p>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="expense-header">
                <div class="expense-info">
                    <h4>${expense.title}</h4>
                    <div class="expense-meta">
                        <span><i class="fas fa-tag"></i> ${category ? category.name : 'Unknown Category'}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(expense.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(expense.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="expense-amount">$${expense.amount}</div>
            </div>
            
            ${workflowInfo}
            ${statusTracker}
            
            <div class="expense-details">
                <div class="expense-description">
                    <strong>Description:</strong> ${expense.description}
                </div>
                ${expense.receipts && expense.receipts.length > 0 ? `
                    <div class="expense-receipts">
                        <strong>Receipts:</strong>
                        ${expense.receipts.map(receipt => `
                            <span class="receipt-item" onclick="employeePortal.viewReceipt('${receipt}')">
                                <i class="fas fa-file"></i> ${receipt}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            ${approvalHistory}
            ${rejectionReason}
            
            <div class="expense-actions">
                <button class="btn-view" onclick="employeePortal.viewExpenseDetail('${expense.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        `;

        return card;
    }

    createStatusTracker(expense) {
        const workflow = this.workflows.find(w => w.category === expense.category);
        if (!workflow) return '';

        const currentStage = expense.currentApprovalStage || 0;
        const approvers = workflow.config.approvers || [];
        
        let statusSteps = '';
        if (workflow.type === 'sequential') {
            statusSteps = approvers.map((approverId, index) => {
                const approver = this.users.find(u => u.id === approverId);
                const isCompleted = index < currentStage;
                const isCurrent = index === currentStage;
                
                return `
                    <div class="status-step ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}">
                        <i class="fas fa-${isCompleted ? 'check' : isCurrent ? 'clock' : 'circle'}"></i>
                        ${approver ? approver.name : 'Unknown'}
                    </div>
                `;
            }).join('');
        } else if (workflow.type === 'conditional') {
            const approvalCount = expense.approvalHistory ? 
                expense.approvalHistory.filter(h => h.action === 'approve').length : 0;
            statusSteps = `
                <div class="status-step ${approvalCount > 0 ? 'completed' : 'current'}">
                    <i class="fas fa-users"></i>
                    ${approvalCount} of ${approvers.length} approved
                </div>
            `;
        }

        return `
            <div class="status-tracker">
                <h4><i class="fas fa-route"></i> Approval Status</h4>
                <div class="status-steps">
                    ${statusSteps}
                </div>
            </div>
        `;
    }

    getWorkflowStatus(expense) {
        const workflow = this.workflows.find(w => w.category === expense.category);
        if (!workflow) return { status: 'No Workflow', progress: 0 };

        const approvalHistory = expense.approvalHistory || [];
        const approvalCount = approvalHistory.filter(h => h.action === 'approve').length;

        switch (workflow.type) {
            case 'sequential':
                const currentStage = expense.currentApprovalStage || 0;
                const totalStages = workflow.config.approvers.length;
                return {
                    status: `Stage ${currentStage + 1} of ${totalStages}`,
                    progress: ((currentStage + 1) / totalStages) * 100
                };
            case 'conditional':
                const totalApprovers = workflow.config.approvers.length;
                return {
                    status: `${approvalCount} of ${totalApprovers} approved`,
                    progress: (approvalCount / totalApprovers) * 100
                };
            default:
                return { status: 'Unknown Workflow', progress: 0 };
        }
    }

    // Modal Methods
    showSubmitExpenseModal() {
        this.hideModal('submit-expense-modal');
        document.getElementById('submit-expense-modal').classList.add('active');
        
        // Reset form
        document.getElementById('submit-expense-form').reset();
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('ocr-preview').style.display = 'none';
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // File Upload and OCR Simulation
    handleFileUpload(file) {
        console.log('File uploaded:', file.name);
        
        // Simulate OCR processing
        this.simulateOCRProcessing(file);
    }

    simulateOCRProcessing(file) {
        // Show loading state
        const uploadArea = document.getElementById('receipt-upload-area');
        uploadArea.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>Processing receipt with OCR...</p>
        `;

        // Simulate processing delay
        setTimeout(() => {
            // Generate mock OCR data
            const ocrData = this.generateMockOCRData(file);
            
            // Update upload area
            uploadArea.innerHTML = `
                <i class="fas fa-file-image"></i>
                <p>File: ${file.name}</p>
                <p>Click to upload different file</p>
            `;

            // Show OCR preview
            this.showOCRPreview(ocrData);
            
        }, 2000);
    }

    generateMockOCRData(file) {
        // Generate realistic mock data based on file type
        const mockData = {
            amount: (Math.random() * 500 + 10).toFixed(2),
            merchant: this.getRandomMerchant(),
            date: this.getRandomDate(),
            category: this.getRandomCategory()
        };

        return mockData;
    }

    getRandomMerchant() {
        const merchants = [
            'Starbucks Coffee', 'McDonald\'s', 'Uber', 'Lyft', 'Amazon', 
            'Shell Gas Station', 'Walmart', 'Target', 'Office Depot',
            'Delta Airlines', 'Hilton Hotel', 'Marriott', 'Subway'
        ];
        return merchants[Math.floor(Math.random() * merchants.length)];
    }

    getRandomDate() {
        const today = new Date();
        const randomDays = Math.floor(Math.random() * 30);
        const randomDate = new Date(today.getTime() - randomDays * 24 * 60 * 60 * 1000);
        return randomDate.toISOString().split('T')[0];
    }

    getRandomCategory() {
        if (this.categories.length > 0) {
            const randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)];
            return randomCategory.id;
        }
        return '';
    }

    showOCRPreview(ocrData) {
        const preview = document.getElementById('ocr-preview');
        const amountField = document.getElementById('ocr-amount');
        const merchantField = document.getElementById('ocr-merchant');
        const dateField = document.getElementById('ocr-date');
        const categoryField = document.getElementById('ocr-category');

        amountField.textContent = `$${ocrData.amount}`;
        merchantField.textContent = ocrData.merchant;
        dateField.textContent = new Date(ocrData.date).toLocaleDateString();
        
        const category = this.categories.find(c => c.id === ocrData.category);
        categoryField.textContent = category ? category.name : 'Unknown';

        // Auto-fill form fields
        document.getElementById('expense-amount').value = ocrData.amount;
        document.getElementById('expense-date').value = ocrData.date;
        document.getElementById('expense-category').value = ocrData.category;
        
        // Suggest title based on merchant
        if (ocrData.merchant) {
            document.getElementById('expense-title').value = `${ocrData.merchant} Expense`;
        }

        preview.style.display = 'block';
    }

    // Expense Submission
    handleSubmitExpense() {
        const formData = new FormData(document.getElementById('submit-expense-form'));
        const fileInput = document.getElementById('receipt-file');
        
        const expenseData = {
            id: this.generateId(),
            employeeId: this.currentEmployee.id,
            title: formData.get('title'),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            currency: formData.get('currency'),
            category: formData.get('category'),
            date: formData.get('date'),
            status: 'pending',
            currentApprovalStage: 0,
            createdAt: new Date().toISOString(),
            receipts: []
        };

        // Handle receipt file
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileName = `${expenseData.id}_receipt_${Date.now()}.${file.name.split('.').pop()}`;
            expenseData.receipts = [fileName];
            
            // In a real app, you would upload the file to a server
            console.log('Receipt file:', fileName);
        }

        // Add to expenses
        this.expenses.push(expenseData);
        this.saveData();

        // Log the submission
        this.logAudit('EXPENSE_SUBMITTED', `Employee ${this.currentEmployee.name} submitted expense: ${expenseData.title}`);

        // Send notification to manager
        this.sendNotification(expenseData, 'submitted');

        // Close modal and refresh data
        this.hideModal('submit-expense-modal');
        this.loadEmployeeData();

        // Show success message
        this.showSuccessMessage('Expense submitted successfully!');
    }

    // View Methods
    viewExpenseDetail(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        const category = this.categories.find(c => c.id === expense.category);
        const workflow = this.workflows.find(w => w.category === expense.category);
        
        const content = document.getElementById('expense-detail-content');
        content.innerHTML = `
            <div class="expense-details">
                <h3>${expense.title}</h3>
                <div class="expense-meta">
                    <p><strong>Category:</strong> ${category ? category.name : 'Unknown'}</p>
                    <p><strong>Amount:</strong> $${expense.amount}</p>
                    <p><strong>Currency:</strong> ${expense.currency}</p>
                    <p><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="expense-status status-${expense.status}">${expense.status}</span></p>
                    <p><strong>Submitted:</strong> ${new Date(expense.createdAt).toLocaleString()}</p>
                </div>
                <div class="expense-description">
                    <strong>Description:</strong><br>
                    ${expense.description}
                </div>
                ${expense.receipts && expense.receipts.length > 0 ? `
                    <div class="expense-receipts">
                        <strong>Receipts:</strong><br>
                        ${expense.receipts.map(receipt => `
                            <span class="receipt-item" onclick="employeePortal.viewReceipt('${receipt}')">
                                <i class="fas fa-file"></i> ${receipt}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                ${workflow ? `
                    <div class="workflow-info">
                        <strong>Workflow:</strong> ${workflow.name} (${workflow.type})
                    </div>
                ` : ''}
                ${this.createStatusTracker(expense)}
                ${expense.approvalHistory && expense.approvalHistory.length > 0 ? `
                    <div class="approval-history">
                        <strong>Approval History:</strong>
                        ${expense.approvalHistory.map(history => `
                            <div class="history-item">
                                <span><strong>${history.action}</strong> by ${history.approverName}</span>
                                <span>${new Date(history.timestamp).toLocaleString()}</span>
                                ${history.comment ? `<div style="margin-top: 5px; font-style: italic;">"${history.comment}"</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${expense.status === 'rejected' && expense.rejectionReason ? `
                    <div class="approval-history" style="background: #f8d7da; border-left: 4px solid #dc3545;">
                        <strong>Rejection Reason:</strong>
                        <p style="margin: 5px 0 0 0; color: #721c24;">${expense.rejectionReason}</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        this.showModal('expense-detail-modal');
    }

    viewReceipt(receiptName) {
        // In a real application, this would open the receipt file
        alert(`Viewing receipt: ${receiptName}`);
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    // Analytics Methods
    updateAnalytics() {
        const pendingExpenses = this.getPendingExpensesForEmployee();
        const approvedExpenses = this.getApprovedExpensesForEmployee();
        const rejectedExpenses = this.getRejectedExpensesForEmployee();
        
        // Update counts in header
        document.getElementById('pending-count').textContent = pendingExpenses.length;
        document.getElementById('approved-count').textContent = approvedExpenses.length;
        document.getElementById('rejected-count').textContent = rejectedExpenses.length;
        
        // Update count badges
        document.getElementById('pending-count-badge').textContent = pendingExpenses.length;
        document.getElementById('approved-count-badge').textContent = approvedExpenses.length;
        document.getElementById('rejected-count-badge').textContent = rejectedExpenses.length;
        
        // Calculate analytics
        const totalExpenses = approvedExpenses.concat(rejectedExpenses);
        const totalAmount = totalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const avgAmount = totalExpenses.length > 0 ? totalAmount / totalExpenses.length : 0;
        const totalReceipts = this.expenses.filter(exp => 
            exp.employeeId === this.currentEmployee.id && exp.receipts && exp.receipts.length > 0
        ).length;
        
        document.getElementById('total-expenses-month').textContent = `$${totalAmount.toFixed(2)}`;
        document.getElementById('avg-expense-amount').textContent = `$${avgAmount.toFixed(2)}`;
        document.getElementById('total-receipts').textContent = totalReceipts;
        
        // Calculate approval rate
        const totalDecisions = approvedExpenses.length + rejectedExpenses.length;
        const approvalRate = totalDecisions > 0 ? (approvedExpenses.length / totalDecisions) * 100 : 0;
        document.getElementById('approval-rate').textContent = `${approvalRate.toFixed(1)}%`;
    }

    updateExpenseCounts() {
        const pendingExpenses = this.getPendingExpensesForEmployee();
        const approvedExpenses = this.getApprovedExpensesForEmployee();
        const rejectedExpenses = this.getRejectedExpensesForEmployee();
        
        document.getElementById('pending-count').textContent = pendingExpenses.length;
        document.getElementById('approved-count').textContent = approvedExpenses.length;
        document.getElementById('rejected-count').textContent = rejectedExpenses.length;
    }

    // Filter Methods
    applyFilters() {
        const status = document.getElementById('filter-status').value;
        const category = document.getElementById('filter-category').value;
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;

        // Apply filters to all expense lists
        this.filterExpenses('pending-expenses-container', status, category, dateFrom, dateTo);
        this.filterExpenses('approved-expenses-container', status, category, dateFrom, dateTo);
        this.filterExpenses('rejected-expenses-container', status, category, dateFrom, dateTo);
    }

    filterExpenses(containerId, status, category, dateFrom, dateTo) {
        const container = document.getElementById(containerId);
        const cards = container.querySelectorAll('.expense-card');
        
        cards.forEach(card => {
            const expenseId = card.querySelector('.btn-view').onclick.toString().match(/'([^']+)'/)[1];
            const expense = this.expenses.find(e => e.id === expenseId);
            
            let show = true;
            
            if (status && expense.status !== status) show = false;
            if (category && expense.category !== category) show = false;
            if (dateFrom && new Date(expense.date) < new Date(dateFrom)) show = false;
            if (dateTo && new Date(expense.date) > new Date(dateTo)) show = false;
            
            card.style.display = show ? 'block' : 'none';
        });
    }

    clearFilters() {
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-date-from').value = '';
        document.getElementById('filter-date-to').value = '';
        
        // Reload all expenses
        this.loadEmployeeData();
    }

    // Notification Methods
    loadNotifications() {
        const notifications = JSON.parse(localStorage.getItem('expenseFlowNotifications') || '[]');
        const employeeNotifications = notifications.filter(n => n.employeeId === this.currentEmployee.id);
        
        // Show notification badge if there are unread notifications
        if (employeeNotifications.length > 0) {
            this.showNotificationBadge(employeeNotifications.length);
        }
    }

    showNotificationBadge(count) {
        // In a real app, this would show a notification badge
        console.log(`You have ${count} new notifications`);
    }

    sendNotification(expense, action) {
        const notification = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            expenseId: expense.id,
            expenseTitle: expense.title,
            employeeId: expense.employeeId,
            action: action,
            message: this.generateNotificationMessage(expense, action)
        };

        // Store notification
        const notifications = JSON.parse(localStorage.getItem('expenseFlowNotifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('expenseFlowNotifications', JSON.stringify(notifications));

        console.log('Notification sent:', notification.message);
    }

    generateNotificationMessage(expense, action) {
        switch (action) {
            case 'submitted':
                return `Expense "${expense.title}" has been submitted for approval`;
            case 'approved':
                return `Expense "${expense.title}" has been approved`;
            case 'rejected':
                return `Expense "${expense.title}" has been rejected`;
            default:
                return `Expense "${expense.title}" status updated`;
        }
    }

    // Utility Methods
    showSuccessMessage(message) {
        // In a real app, this would show a toast notification
        alert(message);
    }

    getUserNameById(userId) {
        const user = this.users.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    }

    saveData() {
        localStorage.setItem('expenseFlowExpenses', JSON.stringify(this.expenses));
    }

    logAudit(action, description) {
        const auditLog = JSON.parse(localStorage.getItem('expenseFlowAuditLog') || '[]');
        const logEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            userId: this.currentEmployee ? this.currentEmployee.id : 'system',
            userName: this.currentEmployee ? this.currentEmployee.name : 'System',
            action,
            description,
            portal: 'Employee'
        };
        
        auditLog.push(logEntry);
        localStorage.setItem('expenseFlowAuditLog', JSON.stringify(auditLog));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize the employee portal
const employeePortal = new EmployeePortal();
