// Register Page Logic

// Redirect if already logged in
if (Auth.isAuthenticated()) {
    window.location.href = 'index.html';
}

const form = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validation
    if (!name || !email || !password) {
        toast.error('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        toast.error('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }

    if (!terms) {
        toast.error('Please accept the terms and conditions');
        return;
    }

    // Disable button
    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating Account...';

    try {
        const response = await Auth.register({
            name,
            email,
            password
        });

        if (response.success) {
            toast.success('Account created successfully! Redirecting...');
            setTimeout(() => {
                const redirect = getUrlParam('redirect') || 'index.html';
                window.location.href = redirect;
            }, 1500);
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Failed to create account. Please try again.');
        
        // Re-enable button
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
});

// Real-time validation feedback
document.getElementById('email').addEventListener('blur', (e) => {
    const email = e.target.value.trim();
    if (email && !isValidEmail(email)) {
        e.target.style.borderColor = 'var(--danger)';
    } else {
        e.target.style.borderColor = '';
    }
});

document.getElementById('confirmPassword').addEventListener('input', (e) => {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;
    
    if (confirmPassword && password !== confirmPassword) {
        e.target.style.borderColor = 'var(--danger)';
    } else {
        e.target.style.borderColor = '';
    }
});
