// ExpenseFlow Admin System
class ExpenseFlowAdmin {
    constructor() {
        this.currentUser = null;
        this.company = null;
        this.users = [];
        this.categories = [];
        this.workflows = [];
        this.expenses = [];
        this.sessionId = null;
        this.auditLog = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredData();
        this.checkSession();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Company setup form
        document.getElementById('company-setup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCompanySetup();
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // User management
        document.getElementById('add-user-btn').addEventListener('click', () => {
            this.showModal('add-user-modal');
        });

        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddUser();
        });

        // Category management
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.showModal('add-category-modal');
        });

        document.getElementById('add-category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCategory();
        });

        // Edit category form
        document.getElementById('edit-category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditCategory();
        });

        document.getElementById('cancel-edit-category').addEventListener('click', () => {
            this.hideModal('edit-category-modal');
        });

        // Workflow management
        document.getElementById('add-workflow-btn').addEventListener('click', () => {
            this.showModal('workflow-modal');
        });

        document.getElementById('workflow-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddWorkflow();
        });

        // Excel import functionality
        document.getElementById('import-users-btn').addEventListener('click', () => {
            this.showModal('import-users-modal');
        });

        document.getElementById('import-categories-btn').addEventListener('click', () => {
            this.showModal('import-categories-modal');
        });

        // User Excel import
        document.getElementById('user-excel-file').addEventListener('change', (e) => {
            this.handleUserExcelUpload(e);
        });

        document.getElementById('confirm-user-import').addEventListener('click', () => {
            this.confirmUserImport();
        });

        document.getElementById('cancel-user-import').addEventListener('click', () => {
            this.cancelUserImport();
        });

        document.getElementById('download-user-template').addEventListener('click', () => {
            this.downloadUserTemplate();
        });

        // Category Excel import
        document.getElementById('category-excel-file').addEventListener('change', (e) => {
            this.handleCategoryExcelUpload(e);
        });

        document.getElementById('confirm-category-import').addEventListener('click', () => {
            this.confirmCategoryImport();
        });

        document.getElementById('cancel-category-import').addEventListener('click', () => {
            this.cancelCategoryImport();
        });

        document.getElementById('download-category-template').addEventListener('click', () => {
            this.downloadCategoryTemplate();
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

        // Cancel buttons
        document.getElementById('cancel-user').addEventListener('click', () => {
            this.hideModal('add-user-modal');
        });

        document.getElementById('cancel-category').addEventListener('click', () => {
            this.hideModal('add-category-modal');
        });

        document.getElementById('cancel-workflow').addEventListener('click', () => {
            this.hideModal('workflow-modal');
        });

        // Workflow type change
        document.getElementById('workflow-type').addEventListener('change', (e) => {
            this.updateWorkflowConfig(e.target.value);
        });
    }

    // Authentication Methods
    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            // Simulate authentication
            const user = await this.authenticateUser(email, password);
            
            if (!user) {
                this.showError(errorDiv, 'Invalid credentials or account inactive');
                return;
            }

            this.currentUser = user;
            this.sessionId = this.generateSessionId();
            this.logAudit('LOGIN', `User ${user.name} logged in`);

            // Check if this is first login
            if (this.isFirstLogin()) {
                this.showPage('company-setup-page');
            } else {
                this.showPage('admin-dashboard');
                this.loadDashboard();
            }

        } catch (error) {
            this.showError(errorDiv, 'Login failed. Please try again.');
        }
    }

    async authenticateUser(email, password) {
        // Simulate encrypted password check
        const storedUsers = JSON.parse(localStorage.getItem('expenseFlowUsers') || '[]');
        const user = storedUsers.find(u => 
            (u.email === email || u.username === email) && 
            this.verifyPassword(password, u.password)
        );
        
        return user && user.status === 'active' ? user : null;
    }

    verifyPassword(password, hashedPassword) {
        // Simulate password verification (in real app, use proper hashing)
        return btoa(password) === hashedPassword;
    }

    hashPassword(password) {
        // Simulate password hashing (in real app, use proper hashing like bcrypt)
        return btoa(password);
    }

    isFirstLogin() {
        return !localStorage.getItem('expenseFlowCompany');
    }

    // Company Setup Methods
    async handleCompanySetup() {
        const formData = new FormData(document.getElementById('company-setup-form'));
        const companyData = {
            name: formData.get('companyName'),
            country: formData.get('country'),
            currency: formData.get('currency'),
            adminName: formData.get('adminName'),
            setupDate: new Date().toISOString()
        };

        // Save company data
        localStorage.setItem('expenseFlowCompany', JSON.stringify(companyData));
        
        // Update current user
        this.currentUser.name = companyData.adminName;
        this.updateUser(this.currentUser);

        this.company = companyData;
        this.logAudit('COMPANY_SETUP', `Company ${companyData.name} setup completed`);

        // Initialize default categories
        this.initializeDefaultCategories();

        this.showPage('admin-dashboard');
        this.loadDashboard();
    }

    initializeDefaultCategories() {
        const defaultCategories = [
            { id: this.generateId(), name: 'Travel', description: 'Business travel expenses', icon: 'fas fa-plane', color: '#667eea' },
            { id: this.generateId(), name: 'Meals & Entertainment', description: 'Client meals and entertainment', icon: 'fas fa-utensils', color: '#f093fb' },
            { id: this.generateId(), name: 'Office Supplies', description: 'Office equipment and supplies', icon: 'fas fa-clipboard', color: '#4facfe' },
            { id: this.generateId(), name: 'IT Equipment', description: 'Technology and software', icon: 'fas fa-laptop', color: '#43e97b' },
            { id: this.generateId(), name: 'Miscellaneous', description: 'Other business expenses', icon: 'fas fa-question', color: '#ffa726' }
        ];

        this.categories = defaultCategories;
        this.saveData();
    }

    // Dashboard Methods
    loadDashboard() {
        this.updateStats();
        this.loadUsers();
        this.loadCategories();
        this.loadWorkflows();
        this.updateCompanyDisplay();
        this.initializeCharts();
    }

    updateStats() {
        const totalUsers = this.users.length;
        const totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const pendingApprovals = this.expenses.filter(exp => exp.status === 'pending').length;
        const approvedClaims = this.expenses.filter(exp => exp.status === 'approved').length;

        document.getElementById('total-users').textContent = totalUsers;
        document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('pending-approvals').textContent = pendingApprovals;
        document.getElementById('approved-claims').textContent = approvedClaims;
    }

    updateCompanyDisplay() {
        if (this.company) {
            document.getElementById('company-display-name').textContent = this.company.name;
            document.getElementById('admin-display-name').textContent = this.currentUser.name;
        }
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Load section-specific data
        if (sectionName === 'users') {
            this.loadUsers();
        } else if (sectionName === 'categories') {
            this.loadCategories();
        } else if (sectionName === 'workflows') {
            this.loadWorkflows();
        } else if (sectionName === 'monitoring') {
            this.initializeCharts();
        }
    }

    // User Management Methods
    loadUsers() {
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>${user.manager ? this.getUserNameById(user.manager) : 'N/A'}</td>
                <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="adminSystem.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="adminSystem.deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    handleAddUser() {
        const formData = new FormData(document.getElementById('add-user-form'));
        const userData = {
            id: this.generateId(),
            name: formData.get('name'),
            email: formData.get('email'),
            role: formData.get('role'),
            manager: formData.get('manager') || null,
            password: this.hashPassword(formData.get('password')),
            status: 'active',
            createdAt: new Date().toISOString()
        };

        this.users.push(userData);
        this.saveData();
        this.loadUsers();
        this.updateStats();
        this.hideModal('add-user-modal');
        this.logAudit('USER_CREATED', `User ${userData.name} created with role ${userData.role}`);

        // Reset form
        document.getElementById('add-user-form').reset();
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            // Populate form and show modal
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-manager').value = user.manager || '';
            this.showModal('add-user-modal');
        }
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            const user = this.users.find(u => u.id === userId);
            this.users = this.users.filter(u => u.id !== userId);
            this.saveData();
            this.loadUsers();
            this.updateStats();
            this.logAudit('USER_DELETED', `User ${user.name} deleted`);
        }
    }

    getUserNameById(userId) {
        const user = this.users.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    }

    // Category Management Methods
    loadCategories() {
        const grid = document.getElementById('categories-grid');
        grid.innerHTML = '';

        this.categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            
            // Create icon display
            let iconDisplay = '';
            if (category.imageUrl) {
                iconDisplay = `<img src="${category.imageUrl}" alt="${category.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;">`;
            } else {
                iconDisplay = `<div style="width: 50px; height: 50px; background: ${category.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;"><i class="fas fa-question"></i></div>`;
            }
            
            card.innerHTML = `
                <div class="category-header">
                    <div class="category-icon" style="background: ${category.color}">
                        ${iconDisplay}
                    </div>
                    <div class="category-info">
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn btn-secondary" onclick="adminSystem.editCategory('${category.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="adminSystem.deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    handleAddCategory() {
        const formData = new FormData(document.getElementById('add-category-form'));
        const imageFile = formData.get('image');
        
        const categoryData = {
            id: this.generateId(),
            name: formData.get('name'),
            description: formData.get('description'),
            color: formData.get('color') || this.getRandomColor(),
            icon: null,
            imageUrl: null,
            createdAt: new Date().toISOString()
        };

        // Handle image upload
        if (imageFile && imageFile.size > 0) {
            this.uploadCategoryImage(imageFile, categoryData.id).then(imageUrl => {
                categoryData.imageUrl = imageUrl;
                this.categories.push(categoryData);
                this.saveData();
                this.loadCategories();
                this.hideModal('add-category-modal');
                this.logAudit('CATEGORY_CREATED', `Category ${categoryData.name} created with image`);
            });
        } else {
            this.categories.push(categoryData);
            this.saveData();
            this.loadCategories();
            this.hideModal('add-category-modal');
            this.logAudit('CATEGORY_CREATED', `Category ${categoryData.name} created`);
        }

        // Reset form
        document.getElementById('add-category-form').reset();
    }

    handleEditCategory() {
        const formData = new FormData(document.getElementById('edit-category-form'));
        const categoryId = formData.get('id');
        const imageFile = formData.get('image');
        
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;

        // Update category data
        category.name = formData.get('name');
        category.description = formData.get('description');
        category.color = formData.get('color');

        // Handle new image upload
        if (imageFile && imageFile.size > 0) {
            this.uploadCategoryImage(imageFile, categoryId).then(imageUrl => {
                category.imageUrl = imageUrl;
                this.saveData();
                this.loadCategories();
                this.hideModal('edit-category-modal');
                this.logAudit('CATEGORY_UPDATED', `Category ${category.name} updated with new image`);
            });
        } else {
            this.saveData();
            this.loadCategories();
            this.hideModal('edit-category-modal');
            this.logAudit('CATEGORY_UPDATED', `Category ${category.name} updated`);
        }
    }

    editCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            // Populate edit form
            document.getElementById('edit-category-id').value = category.id;
            document.getElementById('edit-category-name').value = category.name;
            document.getElementById('edit-category-description').value = category.description;
            document.getElementById('edit-category-color').value = category.color;
            
            // Show current icon if exists
            const previewDiv = document.getElementById('current-icon-preview');
            if (category.imageUrl) {
                previewDiv.innerHTML = `
                    <p>Current Icon:</p>
                    <img src="${category.imageUrl}" alt="Current icon">
                `;
            } else {
                previewDiv.innerHTML = '<p>No icon currently set</p>';
            }
            
            this.showModal('edit-category-modal');
        }
    }

    deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category?')) {
            const category = this.categories.find(c => c.id === categoryId);
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.saveData();
            this.loadCategories();
            this.logAudit('CATEGORY_DELETED', `Category ${category.name} deleted`);
        }
    }

    // Workflow Management Methods
    loadWorkflows() {
        const container = document.getElementById('workflows-container');
        container.innerHTML = '';

        this.workflows.forEach(workflow => {
            const card = document.createElement('div');
            card.className = 'workflow-card';
            card.innerHTML = `
                <div class="workflow-header">
                    <div class="workflow-info">
                        <h3>${workflow.name}</h3>
                        <p>Category: ${this.getCategoryName(workflow.category)} | Type: ${workflow.type}</p>
                        ${workflow.threshold ? `<p>Threshold: $${workflow.threshold}</p>` : ''}
                    </div>
                    <div class="workflow-actions">
                        <button class="btn btn-secondary" onclick="adminSystem.editWorkflow('${workflow.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="adminSystem.deleteWorkflow('${workflow.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    handleAddWorkflow() {
        const formData = new FormData(document.getElementById('workflow-form'));
        const workflowData = {
            id: this.generateId(),
            name: formData.get('name'),
            category: formData.get('category'),
            type: formData.get('type'),
            threshold: formData.get('threshold') || null,
            config: this.getWorkflowConfig(),
            createdAt: new Date().toISOString()
        };

        this.workflows.push(workflowData);
        this.saveData();
        this.loadWorkflows();
        this.hideModal('workflow-modal');
        this.logAudit('WORKFLOW_CREATED', `Workflow ${workflowData.name} created`);

        // Reset form
        document.getElementById('workflow-form').reset();
    }

    updateWorkflowConfig(type) {
        const configDiv = document.getElementById('workflow-config');
        configDiv.innerHTML = '';

        if (type === 'sequential') {
            configDiv.innerHTML = `
                <div class="form-group">
                    <label>Approval Stages</label>
                    <div id="approval-stages">
                        <div class="stage-item">
                            <select name="approver1">
                                <option value="">Select Approver</option>
                                ${this.getManagerOptions()}
                            </select>
                            <button type="button" onclick="adminSystem.removeStage(this)">Remove</button>
                        </div>
                    </div>
                    <button type="button" onclick="adminSystem.addStage()">Add Stage</button>
                </div>
            `;
        } else if (type === 'conditional') {
            configDiv.innerHTML = `
                <div class="form-group">
                    <label>Conditional Rules</label>
                    <div class="rule-item">
                        <select name="condition">
                            <option value="amount">Amount-based</option>
                            <option value="percentage">Percentage-based</option>
                            <option value="category">Category-based</option>
                        </select>
                        <input type="text" name="value" placeholder="Value">
                        <select name="approver">
                            <option value="">Select Approver</option>
                            ${this.getManagerOptions()}
                        </select>
                    </div>
                </div>
            `;
        }
    }

    getWorkflowConfig() {
        // Return workflow configuration based on form data
        return {};
    }

    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }

    getManagerOptions() {
        return this.users
            .filter(user => user.role === 'Manager' || user.role === 'Admin')
            .map(user => `<option value="${user.id}">${user.name}</option>`)
            .join('');
    }

    // Chart Methods
    initializeCharts() {
        this.createExpenseTrendsChart();
        this.createCategoryBreakdownChart();
    }

    createExpenseTrendsChart() {
        const ctx = document.getElementById('expense-trends-chart');
        if (!ctx) return;

        const data = this.getExpenseTrendsData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Expenses',
                    data: data.values,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createCategoryBreakdownChart() {
        const ctx = document.getElementById('category-breakdown-chart');
        if (!ctx) return;

        const data = this.getCategoryBreakdownData();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#4facfe',
                        '#43e97b',
                        '#ffa726'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    getExpenseTrendsData() {
        // Generate sample data for the last 7 days
        const labels = [];
        const values = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString());
            values.push(Math.floor(Math.random() * 1000) + 100);
        }
        
        return { labels, values };
    }

    getCategoryBreakdownData() {
        const labels = this.categories.map(cat => cat.name);
        const values = labels.map(() => Math.floor(Math.random() * 500) + 50);
        
        return { labels, values };
    }

    // Utility Methods
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
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

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getRandomColor() {
        const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#ffa726', '#e74c3c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Data Management
    loadStoredData() {
        this.company = JSON.parse(localStorage.getItem('expenseFlowCompany') || 'null');
        this.users = JSON.parse(localStorage.getItem('expenseFlowUsers') || '[]');
        this.categories = JSON.parse(localStorage.getItem('expenseFlowCategories') || '[]');
        this.workflows = JSON.parse(localStorage.getItem('expenseFlowWorkflows') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('expenseFlowExpenses') || '[]');
        this.auditLog = JSON.parse(localStorage.getItem('expenseFlowAuditLog') || '[]');
    }

    saveData() {
        localStorage.setItem('expenseFlowUsers', JSON.stringify(this.users));
        localStorage.setItem('expenseFlowCategories', JSON.stringify(this.categories));
        localStorage.setItem('expenseFlowWorkflows', JSON.stringify(this.workflows));
        localStorage.setItem('expenseFlowExpenses', JSON.stringify(this.expenses));
        localStorage.setItem('expenseFlowAuditLog', JSON.stringify(this.auditLog));
    }

    checkSession() {
        const sessionId = localStorage.getItem('expenseFlowSessionId');
        if (sessionId) {
            this.sessionId = sessionId;
            this.currentUser = JSON.parse(localStorage.getItem('expenseFlowCurrentUser') || 'null');
            if (this.currentUser) {
                this.showPage('admin-dashboard');
                this.loadDashboard();
            }
        }
    }

    handleLogout() {
        this.logAudit('LOGOUT', `User ${this.currentUser.name} logged out`);
        localStorage.removeItem('expenseFlowSessionId');
        localStorage.removeItem('expenseFlowCurrentUser');
        this.currentUser = null;
        this.sessionId = null;
        this.showPage('login-page');
    }

    logAudit(action, description) {
        const logEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            userId: this.currentUser ? this.currentUser.id : 'system',
            action,
            description,
            sessionId: this.sessionId
        };
        
        this.auditLog.push(logEntry);
        this.saveData();
    }

    updateUser(user) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        } else {
            this.users.push(user);
        }
        this.saveData();
    }

    // Excel Import Methods
    handleUserExcelUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                this.userImportData = jsonData;
                this.validateUserData(jsonData);
                this.showUserImportPreview(jsonData);
            } catch (error) {
                this.showImportError('Error reading Excel file: ' + error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    handleCategoryExcelUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                this.categoryImportData = jsonData;
                this.validateCategoryData(jsonData);
                this.showCategoryImportPreview(jsonData);
            } catch (error) {
                this.showImportError('Error reading Excel file: ' + error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    validateUserData(data) {
        const requiredFields = ['Name', 'Email', 'Role', 'Password'];
        const validRoles = ['Employee', 'Manager', 'Admin', 'Director', 'Finance'];
        const errors = [];

        data.forEach((row, index) => {
            const rowNum = index + 2; // Excel row number (accounting for header)

            // Check required fields
            requiredFields.forEach(field => {
                if (!row[field] || row[field].toString().trim() === '') {
                    errors.push(`Row ${rowNum}: ${field} is required`);
                }
            });

            // Validate email format
            if (row.Email && !this.isValidEmail(row.Email)) {
                errors.push(`Row ${rowNum}: Invalid email format`);
            }

            // Validate role
            if (row.Role && !validRoles.includes(row.Role)) {
                errors.push(`Row ${rowNum}: Role must be Employee, Manager, Admin, Director, or Finance`);
            }

            // Check for duplicate emails
            const duplicateEmails = data.filter((r, i) => r.Email === row.Email && i !== index);
            if (duplicateEmails.length > 0) {
                errors.push(`Row ${rowNum}: Duplicate email address`);
            }

            // Check if email already exists in system
            if (row.Email && this.users.find(u => u.email === row.Email)) {
                errors.push(`Row ${rowNum}: Email already exists in system`);
            }
        });

        this.userValidationErrors = errors;
        return errors.length === 0;
    }

    validateCategoryData(data) {
        const requiredFields = ['Name', 'Description'];
        const errors = [];

        data.forEach((row, index) => {
            const rowNum = index + 2; // Excel row number (accounting for header)

            // Check required fields
            requiredFields.forEach(field => {
                if (!row[field] || row[field].toString().trim() === '') {
                    errors.push(`Row ${rowNum}: ${field} is required`);
                }
            });

            // Check for duplicate names
            const duplicateNames = data.filter((r, i) => r.Name === row.Name && i !== index);
            if (duplicateNames.length > 0) {
                errors.push(`Row ${rowNum}: Duplicate category name`);
            }

            // Check if category already exists in system
            if (row.Name && this.categories.find(c => c.name === row.Name)) {
                errors.push(`Row ${rowNum}: Category already exists in system`);
            }

            // Validate color format if provided
            if (row.Color && !this.isValidHexColor(row.Color)) {
                errors.push(`Row ${rowNum}: Invalid color format (use hex like #667eea)`);
            }
        });

        this.categoryValidationErrors = errors;
        return errors.length === 0;
    }

    showUserImportPreview(data) {
        const previewDiv = document.getElementById('user-import-preview');
        const table = document.getElementById('user-preview-table');
        
        // Clear previous content
        table.innerHTML = '';

        // Create header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
        `;
        table.appendChild(headerRow);

        // Add data rows
        data.forEach((row, index) => {
            const dataRow = document.createElement('tr');
            const isValid = this.userValidationErrors.filter(error => error.includes(`Row ${index + 2}`)).length === 0;
            dataRow.className = isValid ? 'valid-row' : 'invalid-row';
            
            dataRow.innerHTML = `
                <td>${row.Name || ''}</td>
                <td>${row.Email || ''}</td>
                <td>${row.Role || ''}</td>
                <td>${isValid ? 'Valid' : 'Invalid'}</td>
            `;
            table.appendChild(dataRow);
        });

        // Show validation errors if any
        if (this.userValidationErrors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'import-status error';
            errorDiv.innerHTML = `
                <strong>Validation Errors:</strong><br>
                ${this.userValidationErrors.join('<br>')}
            `;
            previewDiv.appendChild(errorDiv);
        } else {
            const successDiv = document.createElement('div');
            successDiv.className = 'import-status success';
            successDiv.textContent = `All ${data.length} records are valid and ready to import.`;
            previewDiv.appendChild(successDiv);
        }

        previewDiv.style.display = 'block';
    }

    showCategoryImportPreview(data) {
        const previewDiv = document.getElementById('category-import-preview');
        const table = document.getElementById('category-preview-table');
        
        // Clear previous content
        table.innerHTML = '';

        // Create header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Name</th>
            <th>Description</th>
            <th>Color</th>
            <th>Status</th>
        `;
        table.appendChild(headerRow);

        // Add data rows
        data.forEach((row, index) => {
            const dataRow = document.createElement('tr');
            const isValid = this.categoryValidationErrors.filter(error => error.includes(`Row ${index + 2}`)).length === 0;
            dataRow.className = isValid ? 'valid-row' : 'invalid-row';
            
            dataRow.innerHTML = `
                <td>${row.Name || ''}</td>
                <td>${row.Description || ''}</td>
                <td style="background-color: ${row.Color || '#667eea'}; color: white; padding: 5px; border-radius: 3px;">${row.Color || '#667eea'}</td>
                <td>${isValid ? 'Valid' : 'Invalid'}</td>
            `;
            table.appendChild(dataRow);
        });

        // Show validation errors if any
        if (this.categoryValidationErrors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'import-status error';
            errorDiv.innerHTML = `
                <strong>Validation Errors:</strong><br>
                ${this.categoryValidationErrors.join('<br>')}
            `;
            previewDiv.appendChild(errorDiv);
        } else {
            const successDiv = document.createElement('div');
            successDiv.className = 'import-status success';
            successDiv.textContent = `All ${data.length} records are valid and ready to import. Icons can be added after import using the edit function.`;
            previewDiv.appendChild(successDiv);
        }

        previewDiv.style.display = 'block';
    }

    confirmUserImport() {
        if (this.userValidationErrors.length > 0) {
            this.showImportError('Please fix validation errors before importing.');
            return;
        }

        let importedCount = 0;
        this.userImportData.forEach(row => {
            const userData = {
                id: this.generateId(),
                name: row.Name,
                email: row.Email,
                role: row.Role,
                manager: null,
                password: this.hashPassword(row.Password),
                status: 'active',
                createdAt: new Date().toISOString()
            };

            this.users.push(userData);
            importedCount++;
        });

        this.saveData();
        this.loadUsers();
        this.updateStats();
        this.hideModal('import-users-modal');
        this.logAudit('BULK_USER_IMPORT', `${importedCount} users imported from Excel`);
        
        this.showImportSuccess(`Successfully imported ${importedCount} users.`);
    }

    confirmCategoryImport() {
        if (this.categoryValidationErrors.length > 0) {
            this.showImportError('Please fix validation errors before importing.');
            return;
        }

        let importedCount = 0;
        this.categoryImportData.forEach(row => {
            const categoryData = {
                id: this.generateId(),
                name: row.Name,
                description: row.Description,
                color: row.Color || this.getRandomColor(),
                imageUrl: null,
                createdAt: new Date().toISOString()
            };

            this.categories.push(categoryData);
            importedCount++;
        });

        this.saveData();
        this.loadCategories();
        this.hideModal('import-categories-modal');
        this.logAudit('BULK_CATEGORY_IMPORT', `${importedCount} categories imported from Excel`);
        
        this.showImportSuccess(`Successfully imported ${importedCount} categories. Icons can be added using the edit function.`);
    }

    cancelUserImport() {
        this.userImportData = null;
        this.userValidationErrors = [];
        document.getElementById('user-excel-file').value = '';
        document.getElementById('user-import-preview').style.display = 'none';
        this.hideModal('import-users-modal');
    }

    cancelCategoryImport() {
        this.categoryImportData = null;
        this.categoryValidationErrors = [];
        document.getElementById('category-excel-file').value = '';
        document.getElementById('category-import-preview').style.display = 'none';
        this.hideModal('import-categories-modal');
    }

    downloadUserTemplate() {
        const templateData = [
            {
                'Name': 'John Doe',
                'Email': 'john.doe@company.com',
                'Role': 'Employee',
                'Password': 'tempPassword123'
            },
            {
                'Name': 'Jane Smith',
                'Email': 'jane.smith@company.com',
                'Role': 'Manager',
                'Password': 'tempPassword123'
            },
            {
                'Name': 'Bob Johnson',
                'Email': 'bob.johnson@company.com',
                'Role': 'Director',
                'Password': 'tempPassword123'
            },
            {
                'Name': 'Alice Brown',
                'Email': 'alice.brown@company.com',
                'Role': 'Finance',
                'Password': 'tempPassword123'
            }
        ];

        this.downloadExcel(templateData, 'User_Import_Template.xlsx');
    }

    downloadCategoryTemplate() {
        const templateData = [
            {
                'Name': 'Travel',
                'Description': 'Business travel expenses',
                'Color': '#667eea'
            },
            {
                'Name': 'Meals',
                'Description': 'Client meals and entertainment',
                'Color': '#f093fb'
            }
        ];

        this.downloadExcel(templateData, 'Category_Import_Template.xlsx');
    }

    downloadExcel(data, filename) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, filename);
    }

    // Utility methods for validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidHexColor(color) {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color);
    }

    getUserIdByEmail(email) {
        const user = this.users.find(u => u.email === email);
        return user ? user.id : null;
    }

    showImportError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.import-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'import-error-message import-status error';
            document.querySelector('.modal-form').appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    showImportSuccess(message) {
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'import-status success';
        successDiv.textContent = message;
        successDiv.style.position = 'fixed';
        successDiv.style.top = '20px';
        successDiv.style.right = '20px';
        successDiv.style.zIndex = '9999';
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Image upload functionality
    uploadCategoryImage(file, categoryId) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // In a real application, you would upload to a server
                // For this demo, we'll use the data URL
                const imageUrl = e.target.result;
                resolve(imageUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Initialize the admin system
const adminSystem = new ExpenseFlowAdmin();

// Add some sample data for demonstration
if (!localStorage.getItem('expenseFlowUsers') || JSON.parse(localStorage.getItem('expenseFlowUsers')).length === 0) {
    const sampleUsers = [
        {
            id: 'admin_001',
            name: 'Admin User',
            email: 'admin@expenseflow.com',
            role: 'Admin',
            manager: null,
            password: btoa('admin123'), // In real app, use proper hashing
            status: 'active',
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('expenseFlowUsers', JSON.stringify(sampleUsers));
}
