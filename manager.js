// ExpenseFlow Manager Portal
class ManagerPortal {
    constructor() {
        this.currentManager = null;
        this.expenses = [];
        this.users = [];
        this.workflows = [];
        this.categories = [];
        this.currentExpenseId = null;
        this.currentAction = null; // 'approve' or 'reject'
        
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

        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
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

        // Approval modal
        document.getElementById('cancel-approval').addEventListener('click', () => {
            this.hideModal('approval-modal');
        });

        document.getElementById('confirm-approval').addEventListener('click', () => {
            this.confirmApproval();
        });

        // Expense detail modal
        document.getElementById('close-expense-detail').addEventListener('click', () => {
            this.hideModal('expense-detail-modal');
        });
    }

    // Authentication Methods
    showManagerDashboard() {
        document.querySelector('.manager-container').style.display = 'block';
    }

    // Data Loading Methods
    loadStoredData() {
        this.users = JSON.parse(localStorage.getItem('expenseFlowUsers') || '[]');
        this.workflows = JSON.parse(localStorage.getItem('expenseFlowWorkflows') || '[]');
        this.categories = JSON.parse(localStorage.getItem('expenseFlowCategories') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('expenseFlowExpenses') || '[]');
    }

    loadManagerData() {
        this.updateManagerInfo();
        this.loadPendingExpenses();
        this.loadApprovedExpenses();
        this.loadRejectedExpenses();
        this.updateAnalytics();
    }

    updateManagerInfo() {
        document.getElementById('manager-name').textContent = this.currentManager.name;
        document.getElementById('manager-email').textContent = this.currentManager.email;
        
        const company = JSON.parse(localStorage.getItem('expenseFlowCompany'));
        document.getElementById('manager-company').textContent = company ? company.name : 'Unknown Company';
    }

    // Expense Loading Methods
    loadPendingExpenses() {
        const container = document.getElementById('pending-expenses-container');
        const pendingExpenses = this.getPendingExpensesForManager();
        
        this.updateExpenseCounts();
        
        if (pendingExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>No Pending Approvals</h3>
                    <p>All caught up! No expenses require your approval at the moment.</p>
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
        const approvedExpenses = this.getApprovedExpensesForManager();
        
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
        const rejectedExpenses = this.getRejectedExpensesForManager();
        
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

    getPendingExpensesForManager() {
        return this.expenses.filter(expense => {
            // Check if this manager is assigned to approve this expense
            return this.isManagerAssignedToExpense(expense, this.currentManager.id);
        });
    }

    getApprovedExpensesForManager() {
        return this.expenses.filter(expense => {
            return expense.status === 'approved' && 
                   this.isManagerAssignedToExpense(expense, this.currentManager.id);
        });
    }

    getRejectedExpensesForManager() {
        return this.expenses.filter(expense => {
            return expense.status === 'rejected' && 
                   this.isManagerAssignedToExpense(expense, this.currentManager.id);
        });
    }

    isManagerAssignedToExpense(expense, managerId) {
        const workflow = this.workflows.find(w => w.category === expense.category);
        if (!workflow) return false;

        // For sequential workflows
        if (workflow.type === 'sequential') {
            const currentStage = expense.currentApprovalStage || 0;
            const approvers = workflow.config.approvers || [];
            return approvers[currentStage] === managerId;
        }

        // For conditional workflows
        if (workflow.type === 'conditional') {
            const approvers = workflow.config.approvers || [];
            // Check if manager hasn't already approved this expense
            const hasApproved = expense.approvalHistory && 
                expense.approvalHistory.some(h => h.approverId === managerId && h.action === 'approve');
            return approvers.includes(managerId) && !hasApproved;
        }

        // For threshold-based workflows
        if (workflow.type === 'threshold') {
            const approvers = workflow.config.approvers || [];
            return approvers.includes(managerId);
        }

        // For hybrid workflows
        if (workflow.type === 'hybrid') {
            const sequentialApprovers = workflow.config.sequentialApprovers || [];
            const conditionalApprovers = workflow.config.conditionalApprovers || [];
            return sequentialApprovers.includes(managerId) || conditionalApprovers.includes(managerId);
        }

        return false;
    }

    createExpenseCard(expense, status) {
        const card = document.createElement('div');
        card.className = 'expense-card';
        
        const employee = this.users.find(u => u.id === expense.employeeId);
        const category = this.categories.find(c => c.id === expense.category);
        const workflow = this.workflows.find(w => w.category === expense.category);
        
        let workflowInfo = '';
        if (workflow) {
            workflowInfo = `<div class="workflow-info">
                <i class="fas fa-sitemap"></i> Workflow: ${workflow.name} (${workflow.type})
            </div>`;
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

        let actions = '';
        if (status === 'pending') {
            actions = `
                <div class="expense-actions">
                    <button class="btn-view" onclick="managerPortal.viewExpenseDetail('${expense.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn-approve" onclick="managerPortal.showApprovalModal('${expense.id}', 'approve')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-reject" onclick="managerPortal.showApprovalModal('${expense.id}', 'reject')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            `;
        } else {
            actions = `
                <div class="expense-actions">
                    <button class="btn-view" onclick="managerPortal.viewExpenseDetail('${expense.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="expense-header">
                <div class="expense-info">
                    <h3>${expense.title}</h3>
                    <div class="expense-meta">
                        <span><i class="fas fa-user"></i> ${employee ? employee.name : 'Unknown Employee'}</span>
                        <span><i class="fas fa-tag"></i> ${category ? category.name : 'Unknown Category'}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="expense-amount">$${expense.amount}</div>
            </div>
            
            ${workflowInfo}
            
            <div class="expense-details">
                <div class="expense-description">
                    <strong>Description:</strong> ${expense.description}
                </div>
                ${expense.receipts && expense.receipts.length > 0 ? `
                    <div class="expense-receipts">
                        <strong>Receipts:</strong>
                        ${expense.receipts.map(receipt => `
                            <span class="receipt-item" onclick="managerPortal.viewReceipt('${receipt}')">
                                <i class="fas fa-file"></i> ${receipt}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            ${approvalHistory}
            ${actions}
        `;

        return card;
    }

    // Approval Methods
    showApprovalModal(expenseId, action) {
        this.currentExpenseId = expenseId;
        this.currentAction = action;
        
        const modal = document.getElementById('approval-modal');
        const title = document.getElementById('approval-modal-title');
        const confirmBtn = document.getElementById('confirm-approval');
        
        if (action === 'approve') {
            title.textContent = 'Approve Expense';
            confirmBtn.textContent = 'Approve';
            confirmBtn.className = 'btn btn-primary';
        } else {
            title.textContent = 'Reject Expense';
            confirmBtn.textContent = 'Reject';
            confirmBtn.className = 'btn btn-danger';
        }
        
        document.getElementById('approval-comment').value = '';
        this.showModal('approval-modal');
    }

    confirmApproval() {
        const comment = document.getElementById('approval-comment').value;
        const expense = this.expenses.find(e => e.id === this.currentExpenseId);
        
        if (!expense) return;

        // Add approval/rejection to history
        if (!expense.approvalHistory) {
            expense.approvalHistory = [];
        }
        
        expense.approvalHistory.push({
            approverId: this.currentManager.id,
            approverName: this.currentManager.name,
            action: this.currentAction,
            comment: comment,
            timestamp: new Date().toISOString()
        });

        // Process the approval/rejection
        if (this.currentAction === 'approve') {
            this.processApproval(expense);
        } else {
            this.processRejection(expense, comment);
        }

        this.hideModal('approval-modal');
        this.loadManagerData();
    }

    processApproval(expense) {
        const workflow = this.workflows.find(w => w.category === expense.category);
        if (!workflow) {
            // No workflow defined, auto-approve
            expense.status = 'approved';
            expense.approvedAt = new Date().toISOString();
            this.saveData();
            this.logAudit('EXPENSE_APPROVED', `Expense ${expense.title} approved by ${this.currentManager.name} (No workflow)`);
            return;
        }

        // Process based on workflow type
        switch (workflow.type) {
            case 'sequential':
                this.processSequentialApproval(expense, workflow);
                break;
            case 'conditional':
                this.processConditionalApproval(expense, workflow);
                break;
            case 'hybrid':
                this.processHybridApproval(expense, workflow);
                break;
            case 'threshold':
                this.processThresholdApproval(expense, workflow);
                break;
            default:
                // Fallback to sequential
                this.processSequentialApproval(expense, workflow);
        }
    }

    processSequentialApproval(expense, workflow) {
        const currentStage = expense.currentApprovalStage || 0;
        const approvers = workflow.config.approvers || [];
        
        if (currentStage < approvers.length - 1) {
            // Move to next stage
            expense.currentApprovalStage = currentStage + 1;
            expense.status = 'pending';
        } else {
            // Final approval
            expense.status = 'approved';
            expense.approvedAt = new Date().toISOString();
        }
        
        this.saveData();
        this.logAudit('EXPENSE_APPROVED', `Expense ${expense.title} approved by ${this.currentManager.name} (Stage ${currentStage + 1})`);
    }

    processConditionalApproval(expense, workflow) {
        const approvers = workflow.config.approvers || [];
        const approvalCount = expense.approvalHistory.filter(h => h.action === 'approve').length;
        
        // Check if conditions are met
        const conditions = workflow.config.conditions || [];
        let conditionsMet = false;
        let conditionMet = null;
        
        for (const condition of conditions) {
            if (condition.type === 'percentage') {
                const requiredPercentage = condition.value / 100;
                if (approvalCount / approvers.length >= requiredPercentage) {
                    conditionsMet = true;
                    conditionMet = condition;
                    break;
                }
            } else if (condition.type === 'keyApprover') {
                if (expense.approvalHistory.some(h => h.approverId === condition.approverId && h.action === 'approve')) {
                    conditionsMet = true;
                    conditionMet = condition;
                    break;
                }
            } else if (condition.type === 'anyApprover') {
                if (approvalCount >= condition.value) {
                    conditionsMet = true;
                    conditionMet = condition;
                    break;
                }
            }
        }
        
        if (conditionsMet) {
            expense.status = 'approved';
            expense.approvedAt = new Date().toISOString();
            expense.finalApprovalCondition = conditionMet;
            this.logAudit('EXPENSE_APPROVED', `Expense ${expense.title} approved by ${this.currentManager.name} - Condition met: ${conditionMet.type} (${conditionMet.value})`);
        } else {
            expense.status = 'pending';
            this.logAudit('EXPENSE_APPROVED', `Expense ${expense.title} approved by ${this.currentManager.name} - Awaiting more approvals (${approvalCount}/${approvers.length})`);
        }
        
        this.saveData();
    }

    processHybridApproval(expense, workflow) {
        // Check if sequential phase is complete
        const sequentialApprovers = workflow.config.sequentialApprovers || [];
        const currentStage = expense.currentApprovalStage || 0;
        
        if (currentStage < sequentialApprovers.length) {
            // Still in sequential phase
            this.processSequentialApproval(expense, workflow);
        } else {
            // Move to conditional phase
            this.processConditionalApproval(expense, workflow);
        }
    }

    processThresholdApproval(expense, workflow) {
        const threshold = workflow.threshold || 0;
        const amount = expense.amount;
        
        if (amount <= threshold) {
            // Auto-approve if under threshold
            expense.status = 'approved';
            expense.approvedAt = new Date().toISOString();
            expense.autoApproved = true;
            this.logAudit('EXPENSE_APPROVED', `Expense ${expense.title} auto-approved (under threshold $${threshold})`);
        } else {
            // Process through normal workflow
            if (workflow.type === 'threshold') {
                // Default to conditional workflow for amounts above threshold
                this.processConditionalApproval(expense, workflow);
            }
        }
        
        this.saveData();
    }

    processRejection(expense, comment) {
        expense.status = 'rejected';
        expense.rejectedAt = new Date().toISOString();
        expense.rejectionReason = comment;
        
        this.saveData();
        this.logAudit('EXPENSE_REJECTED', `Expense ${expense.title} rejected by ${this.currentManager.name}`);
    }

    // View Methods
    viewExpenseDetail(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        if (!expense) return;

        const employee = this.users.find(u => u.id === expense.employeeId);
        const category = this.categories.find(c => c.id === expense.category);
        
        const content = document.getElementById('expense-detail-content');
        content.innerHTML = `
            <div class="expense-details">
                <h3>${expense.title}</h3>
                <div class="expense-meta">
                    <p><strong>Employee:</strong> ${employee ? employee.name : 'Unknown'}</p>
                    <p><strong>Category:</strong> ${category ? category.name : 'Unknown'}</p>
                    <p><strong>Amount:</strong> $${expense.amount}</p>
                    <p><strong>Date:</strong> ${new Date(expense.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="expense-status status-${expense.status}">${expense.status}</span></p>
                </div>
                <div class="expense-description">
                    <strong>Description:</strong><br>
                    ${expense.description}
                </div>
                ${expense.receipts && expense.receipts.length > 0 ? `
                    <div class="expense-receipts">
                        <strong>Receipts:</strong><br>
                        ${expense.receipts.map(receipt => `
                            <span class="receipt-item" onclick="managerPortal.viewReceipt('${receipt}')">
                                <i class="fas fa-file"></i> ${receipt}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
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
            </div>
        `;
        
        this.showModal('expense-detail-modal');
    }

    viewReceipt(receiptName) {
        // In a real application, this would open the receipt file
        alert(`Viewing receipt: ${receiptName}`);
    }

    // Analytics Methods
    updateAnalytics() {
        const pendingExpenses = this.getPendingExpensesForManager();
        const approvedExpenses = this.getApprovedExpensesForManager();
        const rejectedExpenses = this.getRejectedExpensesForManager();
        
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
        
        document.getElementById('total-expenses-month').textContent = `$${totalAmount.toFixed(2)}`;
        
        // Calculate average processing time
        const avgTime = this.calculateAverageProcessingTime(totalExpenses);
        document.getElementById('avg-processing-time').textContent = `${avgTime}h`;
        
        // Count team members
        const teamMembers = this.getTeamMembers();
        document.getElementById('team-member-count').textContent = teamMembers.length;
        
        // Calculate approval rate
        const totalDecisions = approvedExpenses.length + rejectedExpenses.length;
        const approvalRate = totalDecisions > 0 ? (approvedExpenses.length / totalDecisions) * 100 : 0;
        document.getElementById('approval-rate').textContent = `${approvalRate.toFixed(1)}%`;
        
        // Update manager info
        this.updateManagerInfo();
    }

    updateExpenseCounts() {
        const pendingExpenses = this.getPendingExpensesForManager();
        const approvedExpenses = this.getApprovedExpensesForManager();
        const rejectedExpenses = this.getRejectedExpensesForManager();
        
        document.getElementById('pending-count').textContent = pendingExpenses.length;
        document.getElementById('approved-count').textContent = approvedExpenses.length;
        document.getElementById('rejected-count').textContent = rejectedExpenses.length;
    }

    calculateAverageProcessingTime(expenses) {
        if (expenses.length === 0) return 0;
        
        let totalHours = 0;
        expenses.forEach(expense => {
            if (expense.approvedAt || expense.rejectedAt) {
                const submitted = new Date(expense.createdAt);
                const processed = new Date(expense.approvedAt || expense.rejectedAt);
                const hours = (processed - submitted) / (1000 * 60 * 60);
                totalHours += hours;
            }
        });
        
        return Math.round(totalHours / expenses.length);
    }

    getTeamMembers() {
        return this.users.filter(user => user.manager === this.currentManager.id);
    }

    // Utility Methods
    switchTab(tabName) {
        // Update tab appearance
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
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
            userId: this.currentManager ? this.currentManager.id : 'system',
            userName: this.currentManager ? this.currentManager.name : 'System',
            action,
            description,
            portal: 'Manager'
        };
        
        auditLog.push(logEntry);
        localStorage.setItem('expenseFlowAuditLog', JSON.stringify(auditLog));
    }

    // Notification Methods
    sendNotification(expense, action, nextApprover = null) {
        const notification = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            expenseId: expense.id,
            expenseTitle: expense.title,
            employeeId: expense.employeeId,
            managerId: this.currentManager.id,
            action: action,
            nextApprover: nextApprover,
            message: this.generateNotificationMessage(expense, action, nextApprover)
        };

        // Store notification (in real app, this would be sent via email/SMS)
        const notifications = JSON.parse(localStorage.getItem('expenseFlowNotifications') || '[]');
        notifications.push(notification);
        localStorage.setItem('expenseFlowNotifications', JSON.stringify(notifications));

        console.log('Notification:', notification.message);
    }

    generateNotificationMessage(expense, action, nextApprover = null) {
        const employee = this.users.find(u => u.id === expense.employeeId);
        const employeeName = employee ? employee.name : 'Unknown Employee';

        switch (action) {
            case 'approved':
                if (nextApprover) {
                    const nextApproverUser = this.users.find(u => u.id === nextApprover);
                    return `${expense.title} has been approved by ${this.currentManager.name} and forwarded to ${nextApproverUser ? nextApproverUser.name : 'next approver'}`;
                } else {
                    return `${expense.title} has been fully approved by ${this.currentManager.name}`;
                }
            case 'rejected':
                return `${expense.title} has been rejected by ${this.currentManager.name}`;
            case 'forwarded':
                const nextApproverUser = this.users.find(u => u.id === nextApprover);
                return `${expense.title} has been forwarded to ${nextApproverUser ? nextApproverUser.name : 'next approver'}`;
            default:
                return `${expense.title} status updated by ${this.currentManager.name}`;
        }
    }

    // Workflow Status Methods
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
            case 'threshold':
                return {
                    status: expense.amount <= workflow.threshold ? 'Under Threshold' : 'Above Threshold',
                    progress: expense.amount <= workflow.threshold ? 100 : 0
                };
            default:
                return { status: 'Unknown Workflow', progress: 0 };
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    checkSession() {
        const sessionId = localStorage.getItem('expenseFlowSessionId');
        if (sessionId) {
            const currentUser = JSON.parse(localStorage.getItem('expenseFlowCurrentUser') || 'null');
            if (currentUser && (currentUser.role === 'Manager' || currentUser.role === 'Director' || currentUser.role === 'Finance')) {
                this.currentManager = currentUser;
                this.showManagerDashboard();
                this.loadManagerData();
            } else {
                // User is not authorized for manager portal, redirect to main page
                window.location.href = 'index.html';
            }
        } else {
            // No valid session, redirect to main page
            window.location.href = 'index.html';
        }
    }

    handleLogout() {
        this.logAudit('MANAGER_LOGOUT', `Manager ${this.currentManager.name} logged out`);
        localStorage.removeItem('expenseFlowSessionId');
        localStorage.removeItem('expenseFlowCurrentUser');
        this.currentManager = null;
        
        // Redirect to main login page
        window.location.href = 'index.html';
    }

    resetData() {
        if (confirm('This will clear all data and reset to default sample data. Are you sure?')) {
            // Clear all localStorage data
            localStorage.removeItem('expenseFlowUsers');
            localStorage.removeItem('expenseFlowCategories');
            localStorage.removeItem('expenseFlowWorkflows');
            localStorage.removeItem('expenseFlowExpenses');
            localStorage.removeItem('expenseFlowAuditLog');
            localStorage.removeItem('expenseFlowCompany');
            
            // Reinitialize sample data
            initializeSampleData();
            
            alert('Data has been reset. Please try logging in again.');
            
            // Clear the login form
            document.getElementById('manager-email').value = '';
            document.getElementById('manager-password').value = '';
        }
    }
}

// Initialize the manager portal
const managerPortal = new ManagerPortal();

// Sample data is now initialized by the unified login system
