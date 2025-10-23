// PWA Installation Handler
let deferredPrompt;
let installButton;

// Check if already installed
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// Show update notification
function showUpdateNotification() {
  if (confirm('🎉 New version available! Reload to update?')) {
    window.location.reload();
  }
}

// Create install button dynamically
function createInstallButton() {
  if (isAppInstalled() || installButton) return;

  installButton = document.createElement('button');
  installButton.className = 'pwa-install-button';
  installButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Install App</span>
  `;
  
  installButton.addEventListener('click', installApp);
  document.body.appendChild(installButton);
}

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  createInstallButton();
});

// Install the app
async function installApp() {
  if (!deferredPrompt) {
    console.log('❌ Install prompt not available');
    return;
  }

  // Show install prompt
  deferredPrompt.prompt();
  
  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`👉 User response: ${outcome}`);
  
  if (outcome === 'accepted') {
    console.log('✅ App installed successfully!');
    if (installButton) {
      installButton.remove();
      installButton = null;
    }
  }
  
  deferredPrompt = null;
}

// Handle successful installation
window.addEventListener('appinstalled', () => {
  console.log('🎉 App installed successfully!');
  if (installButton) {
    installButton.remove();
    installButton = null;
  }
  
  // Show thank you message
  showToast('🎉 App installed! Find TechStore on your home screen!', 'success');
});

// Check if running as installed app
if (isAppInstalled()) {
  console.log('📱 Running as installed app');
  document.documentElement.classList.add('pwa-installed');
}

// Show iOS install instructions
function showIOSInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isInStandaloneMode = window.navigator.standalone;
  
  if (isIOS && !isInStandaloneMode) {
    const banner = document.createElement('div');
    banner.className = 'ios-install-banner';
    banner.innerHTML = `
      <div class="ios-banner-content">
        <button class="ios-banner-close" onclick="this.parentElement.parentElement.remove()">×</button>
        <h4>📱 Install TechStore App</h4>
        <p>Tap <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4v12M7 11l5 5 5-5"/></svg> then "Add to Home Screen"</p>
      </div>
    `;
    document.body.appendChild(banner);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (banner.parentElement) {
        banner.remove();
      }
    }, 10000);
  }
}

// Show iOS instructions on page load
window.addEventListener('load', () => {
  setTimeout(showIOSInstructions, 2000);
});

// Helper function for toast notifications
function showToast(message, type = 'info') {
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
  } else {
    console.log(`[Toast] ${message}`);
  }
}

// Export for use in other scripts
window.PWA = {
  install: installApp,
  isInstalled: isAppInstalled
};
