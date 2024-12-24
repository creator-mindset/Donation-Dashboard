// User storage (in real app, this would be a database)
const users = [];
let currentUser = null;

// Auth Form Handlers
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    login(email, password);
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    register(name, email, password, confirmPassword);
});

// Show/Hide Form Handlers
document.getElementById('showRegister').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});

// Login Function
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        showSuccessMessage('Login successful! Welcome back ' + user.name);
        setTimeout(() => {
            document.getElementById('authContainer').classList.add('hidden');
            document.getElementById('appContainer').classList.remove('hidden');
            initializeApp();
        }, 1500);
    } else {
        showErrorMessage('Invalid email or password');
    }
}

// Register Function
function register(name, email, password, confirmPassword) {
    // Validation
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }

    if (users.some(u => u.email === email)) {
        showErrorMessage('Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        name,
        email,
        password,
        referralCode: "REF" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        donations: []
    };

    users.push(newUser);
    showSuccessMessage('Registration successful! Please login');

    // Switch to login form
    setTimeout(() => {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    }, 1500);
}

// Logout Function
function logout() {
    currentUser = null;
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('loginForm').reset();
}

// Show Error Message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Remove any existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // Add new error message
    const activeForm = document.querySelector('.auth-form:not(.hidden)');
    activeForm.appendChild(errorDiv);

    // Remove after 3 seconds
    setTimeout(() => errorDiv.remove(), 3000);
}

// Show Success Message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    // Remove any existing messages
    document.querySelectorAll('.success-message').forEach(el => el.remove());

    // Add new success message
    const activeForm = document.querySelector('.auth-form:not(.hidden)');
    activeForm.appendChild(successDiv);

    // Remove after 3 seconds
    setTimeout(() => successDiv.remove(), 3000);
}

// Initialize App after Login
function initializeApp() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('referralCode').textContent = currentUser.referralCode;
    updateTransactions();
}
// Initialize dashboard
document.getElementById('userName').textContent = user.name;
document.getElementById('referralCode').textContent = user.referralCode;

// Navigation functions
function showDashboard() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('transactions').classList.add('hidden');
    document.querySelector('nav a:first-child').classList.add('active');
    document.querySelector('nav a:last-child').classList.remove('active');
}
// Show Transactions
// Show Transactions
function showTransactions() {
    // Hide the dashboard
    document.getElementById('dashboard').classList.add('hidden');

    // Show the transactions section
    document.getElementById('transactions').classList.remove('hidden');

    // Update the navigation links' active state
    document.querySelector('nav a:first-child').classList.remove('active');
    document.querySelector('nav a:last-child').classList.add('active');

    // Ensure transactions are updated
    if (typeof updateTransactions === 'function') {
        updateTransactions()
            .then(() => console.log('Transactions updated successfully.'))
            .catch(err => console.error('Error updating transactions:', err));
    } else {
        console.error('updateTransactions function is not defined.');
    }
}

// Update Transactions
async function updateTransactions() {
    try {
        const response = await fetch('/api/transactions'); // Replace with your actual API endpoint
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const transactions = await response.json(); // Ensure the API returns a JSON array
        const transactionsContainer = document.getElementById('transactions-list'); // Replace with your actual container ID
        if (!transactionsContainer) {
            console.error('Transactions container not found.');
            return;
        }

        transactionsContainer.innerHTML = ''; // Clear existing data

        // Check if there are transactions to display
        if (transactions.length === 0) {
            transactionsContainer.innerHTML = '<p>No transactions found.</p>';
            return;
        }

        // Populate the transactions
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction');
            transactionItem.innerHTML = `
                <p>Date: ${transaction.date || 'N/A'}</p>
                <p>Amount: ${transaction.amount || 'N/A'}</p>
                <p>Status: ${transaction.status || 'N/A'}</p>
            `;
            transactionsContainer.appendChild(transactionItem);
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        alert('Failed to load transactions. Please try again.');
    }
}



// Copy donation link
function copyDonationLink() {
    const user = { referralCode: "exampleCode" }; // Replace with actual user data
    const donationLink = `https://nayepankh.org/donate/${user.referralCode}`;

    navigator.clipboard.writeText(donationLink)
        .then(() => {
            alert('Donation link copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy the link. Please try again.');
        });
}

// Share on WhatsApp
function shareWhatsApp() {
    const user = { referralCode: "exampleCode" }; // Replace with actual user data
    const donationLink = `https://nayepankh.org/donate/${user.referralCode}`;
    const message = encodeURIComponent(
        `Hi, I am raising funds for NayePankh Foundation. Please support me by donating through this link: ${donationLink} and make a difference!`
    );

    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
}


// Handle preset donation amounts
function initiateDonation(amount) {
    if (confirm(`Proceed with donation of $${amount}?`)) {
        processDonation(amount);
    }
}

// Handle custom donation amount
function initiateCustomDonation() {
    const customAmount = document.getElementById('customAmount').value;
    if (customAmount && customAmount > 0) {
        initiateDonation(parseFloat(customAmount));
    } else {
        alert('Please enter a valid amount');
    }
}

// Process donation (simulation)
function processDonation(amount) {
    user.donations.push({
        date: new Date().toLocaleDateString(),
        donor: "Anonymous Donor",
        amount: amount
    });
    updateTransactions();
    alert('Thank you for your donation!');
    document.getElementById('customAmount').value = '';
}

// Update transactions table
function updateTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';

    user.donations.forEach(donation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donation.date}</td>
            <td>${donation.donor}</td>
            <td>$${donation.amount.toLocaleString()}</td>
        `;
        transactionsList.appendChild(row);
    });

    // Update total donations
    const total = user.donations.reduce((sum, donation) => sum + donation.amount, 0);
    document.getElementById('totalDonations').textContent = total.toLocaleString();
}

// Initialize with sample data
processDonation(100);
processDonation(200);
// Payment simulation functions
function initiateDonation(amount) {
    showPaymentModal(amount);
}

function showPaymentModal(amount) {
    const modalHtml = `
        <div id="paymentModal" class="payment-modal">
            <div class="payment-modal-content">
                <h3>Complete Your Donation of $${amount}</h3>
                <div class="payment-details">
                    <div class="card-input">
                        <label>Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" maxlength="19">
                    </div>
                    <div class="card-row">
                        <div class="expiry-input">
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" maxlength="5">
                        </div>
                        <div class="cvv-input">
                            <label>CVV</label>
                            <input type="text" placeholder="123" maxlength="3">
                        </div>
                    </div>
                    <button onclick="simulatePayment(${amount})" class="payment-button">
                        Complete Donation
                    </button>
                    <button onclick="closePaymentModal()" class="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function simulatePayment(amount) {
    // Show loading state
    const paymentButton = document.querySelector('.payment-button');
    paymentButton.disabled = true;
    paymentButton.textContent = 'Processing...';

    // Simulate payment processing
    setTimeout(() => {
        closePaymentModal();
        showSuccessModal(amount);
        recordDonation(amount);
    }, 1500);
}

function showSuccessModal(amount) {
    const successModal = `
        <div id="successModal" class="success-modal">
            <div class="success-modal-content">
                <div class="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your donation of $${amount} was successful.</p>
                <button onclick="closeSuccessModal()" class="success-button">
                    Continue
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', successModal);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.remove();
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
    }
}

function recordDonation(amount) {
    const donation = {
        date: new Date().toLocaleDateString(),
        donor: currentUser ? currentUser.name : "Anonymous Donor",
        amount: amount,
        transactionId: 'TXN' + Date.now()
    };

    if (currentUser) {
        if (!currentUser.donations) {
            currentUser.donations = [];
        }
        currentUser.donations.push(donation);
    }
    updateTransactions();
}

// Handle custom donation amount
function initiateCustomDonation() {
    const customAmount = document.getElementById('customAmount').value;
    if (customAmount && customAmount > 0) {
        initiateDonation(parseFloat(customAmount));
    } else {
        alert('Please enter a valid amount');
    }
}

// Update transactions table
function simulatePayment(amount) {
    const paymentButton = document.querySelector('.payment-button');
    paymentButton.disabled = true;
    paymentButton.textContent = 'Processing...';

    setTimeout(() => {
        if (currentUser) {
            // Initialize donations array if it doesn't exist
            if (!currentUser.donations) {
                currentUser.donations = [];
            }

            // Add new donation
            const newDonation = {
                date: new Date().toLocaleDateString(),
                donor: currentUser.name,
                amount: amount,
                transactionId: 'TXN' + Date.now()
            };

            currentUser.donations.push(newDonation);

            // Update UI
            updateTransactions();
        }

        closePaymentModal();
        showSuccessModal(amount);
    }, 1500);
}

function updateTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;

    transactionsList.innerHTML = '';

    if (currentUser && currentUser.donations && currentUser.donations.length > 0) {
        currentUser.donations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.date}</td>
                <td>${donation.donor}</td>
                <td>${donation.amount.toLocaleString()}</td>
                <td>${donation.transactionId}</td>
            `;
            transactionsList.appendChild(row);
        });

        // Update total
        const total = currentUser.donations.reduce((sum, donation) => sum + donation.amount, 0);
        const totalElement = document.getElementById('totalDonations');
        if (totalElement) {
            totalElement.textContent = `${total.toLocaleString()}`;
        }
    } else {
        transactionsList.innerHTML = '<tr><td colspan="4">No transactions found</td></tr>';
    }
}
// Update total donations
const total = currentUser.donations.reduce((sum, donation) => sum + donation.amount, 0);
const totalElement = document.getElementById('totalDonations');
if (totalElement) {
    totalElement.textContent = total.toLocaleString();
}

function showTransactions() {
    // Show transactions section
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('transactions').classList.remove('hidden');

    // Update transactions list
    updateTransactionsList();
}

function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) {
        console.error('Transactions container not found');
        return;
    }

    // Clear existing content
    transactionsList.innerHTML = '';

    // Create table structure
    const tableHTML = `
        <table class="w-full">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Donor</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${currentUser && currentUser.donations && currentUser.donations.length > 0 
                    ? currentUser.donations.map(donation => `
                        <tr>
                            <td>${donation.date}</td>
                            <td>${donation.donor}</td>
                            <td>$${donation.amount.toLocaleString()}</td>
                        </tr>
                    `).join('')
                    : '<tr><td colspan="3">No transactions found</td></tr>'
                }
            </tbody>
        </table>
    `;

    transactionsList.innerHTML = tableHTML;
}