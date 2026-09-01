// Twiga Soko Yetu Modern Application Engine

// Translations Dictionary
const translations = {
  en: {
    brandName: "ShambaVest",
    brandSubtitle: "Agri-Wealth & Yield Investment Portal",
    tabLogin: "Login",
    tabRegister: "Register",
    mobileLabel: "Phone Number",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    referralCodeLabel: "Referral Code",
    btnRegister: "Register",
    btnLogin: "Login",
    alreadyHaveAccount: "I already have an account",
    needAccount: "Don't have an account? Register",
    recharge: "Recharge",
    withdraw: "Withdraw",
    service: "Service",
    channel: "Channel",
    producePackages: "Produce Yield Packages"
  },
  am: {
    brandName: "ሻምባቬስት",
    brandSubtitle: "የእርሻ ሃብት እና የምርት ኢንቨስትመንት",
    tabLogin: "ግቡ",
    tabRegister: "ይምዝገቡ",
    mobileLabel: "የስልክ ቁጥር",
    passwordLabel: "የይለፍ ቃል",
    confirmPasswordLabel: "የይለፍ ቃሉን ያረጋግጡ",
    referralCodeLabel: "የግብዣ ኮድ",
    btnRegister: "መለያ ፍጠር",
    btnLogin: "ግቡ",
    alreadyHaveAccount: "ቀደም ሲል መለያ አለኝ",
    needAccount: "መለያ የለዎትም? ይመዝገቡ",
    recharge: "ገንዘብ አስገባ",
    withdraw: "ገንዘብ አውጣ",
    service: "ድጋፍ",
    channel: "ቴሌግራም ቻናል",
    producePackages: "የምርት ኢንቨስትመንት ፓኬጆች"
  },
  om: {
    brandName: "ShambaVest",
    brandSubtitle: "Portal Qabeenya Qonnaa fi Investimentii",
    tabLogin: "Seenaa",
    tabRegister: "Galmaa'a",
    mobileLabel: "Lakk. Bilbilaa",
    passwordLabel: "Jecha Seensaa",
    confirmPasswordLabel: "Jecha Seensaa Mirkaneessi",
    referralCodeLabel: "Koodii Affeerraa",
    btnRegister: "Galmaa'i",
    btnLogin: "Seenii",
    alreadyHaveAccount: "Akaawunti qaba",
    needAccount: "Akaawunti hin qabduu? Galmaa'a",
    recharge: "Kaffaltii Galchi",
    withdraw: "Baasii Goodhi",
    service: "Deeggersa",
    channel: "Chanaalii Telegram",
    producePackages: "Paakeejii Oomisha"
  }
};

// Firebase Initialization - New Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs8ObQU_-2Mpo_61i_CPM1XwXkZeJMxw8",
  authDomain: "shambavest-new.firebaseapp.com",
  databaseURL: "https://shambavest-new-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shambavest-new",
  storageBucket: "shambavest-new.firebasestorage.app",
  messagingSenderId: "66680195408",
  appId: "1:66680195408:web:8e319ecab8b90419988455"
};

let db = null;
let firebaseInitError = null;

if (typeof firebase !== 'undefined') {
  try {
    // Clear any existing Firebase apps to force reinitialization
    if (firebase.apps.length > 0) {
      console.log('Clearing existing Firebase app instance');
      firebase.apps.forEach(app => app.delete());
    }
    
    console.log('Initializing Firebase with new project:', firebaseConfig.projectId);
    console.log('Firebase database URL:', firebaseConfig.databaseURL);
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    db = firebase.database();
    console.log('Firebase database connected');
    
    // Test Firebase connection
    testFirebaseConnection();
  } catch (error) {
    firebaseInitError = error;
    console.error('Firebase initialization error:', error);
    showToast('Firebase connection failed. Using local storage only.', true);
  }
} else {
  firebaseInitError = 'Firebase SDK not loaded';
  console.error('Firebase SDK not loaded - check CDN scripts');
  showToast('Firebase not available. Using local storage only.', true);
}

// Simple Firebase connection test
async function testFirebaseConnection() {
  if (!db) {
    console.log('Firebase db is null, skipping test');
    return;
  }
  
  try {
    console.log('=== Starting Firebase Connection Test ===');
    console.log('Testing Firebase connection with simple read...');
    
    const testRef = db.ref('.info/connected');
    const snapshot = await testRef.once('value');
    console.log('Firebase connection test result:', snapshot.val());
    
    if (snapshot.val() === false) {
      console.warn('Firebase reports not connected - database may not exist or have permission issues');
      console.log('Attempting alternative connection test...');
      
      // Try to read from the actual database path
      const altTestRef = db.ref('shambavest_state');
      try {
        const altSnapshot = await altTestRef.once('value');
        console.log('Alternative test successful - data exists:', altSnapshot.exists());
      } catch (altError) {
        console.error('Alternative test failed:', altError.message);
        console.error('This suggests the Firebase database may not exist or has restrictive rules');
      }
      return;
    }
    
    // Test write operation
    console.log('Testing Firebase write operation...');
    const testWriteRef = db.ref('test_connection');
    await testWriteRef.set({ timestamp: Date.now(), status: 'working', project: 'shambavest-new' });
    console.log('Firebase write test successful');
    
    // Test read operation
    console.log('Testing Firebase read operation...');
    const readSnapshot = await testWriteRef.once('value');
    console.log('Firebase read test result:', readSnapshot.val());
    
    console.log('✓ Firebase connection is working properly');
    console.log('=== Firebase Connection Test Completed ===');
  } catch (error) {
    console.error('✗ Firebase connection test failed:', error);
    console.error('Error details:', error.message, error.code);
    console.log('=== Firebase Connection Test Failed ===');
  }
}

// Call the test after a short delay to ensure Firebase is ready
setTimeout(() => {
  console.log('Running delayed Firebase connection test...');
  testFirebaseConnection();
}, 2000);


// Global State Handler
class AppState {
  constructor() {
    this._isApplyingFirebaseUpdate = false;
    this.currentLang = localStorage.getItem('twiga_lang') || 'en';
    this.activeTab = 'auth'; // auth, home, recharge, income, team, share, profile
    this.authMode = 'register'; // login or register
    
    // Directory of Registered Users
    const savedUsers = JSON.parse(localStorage.getItem('twiga_registered_users') || '{}');
    this.registeredUsers = savedUsers;

    // Logged in User Session
    const savedSession = JSON.parse(localStorage.getItem('twiga_user_session') || 'null');
    this.currentUser = savedSession;

    // Draft User credentials for auto-fill on login
    const savedDraft = JSON.parse(localStorage.getItem('twiga_draft_user') || 'null');
    this.draftUser = savedDraft;

    this.selectedProduct = null;
    this.rechargeAmount = 3770;
    
    // Carousel State
    this.carouselIndex = 0;
    this.carouselTimer = null;

    // Admin State & Queues (Matching Screenshots 1-5)
    this.isAdminMode = false;
    this.adminActiveTab = 'deposit';
    this.adminPassword = localStorage.getItem('twiga_admin_password') || 'admin123';

    if (!localStorage.getItem('twiga_admin_wiped_v1')) {
      localStorage.removeItem('twiga_admin_deposits');
      localStorage.removeItem('twiga_admin_withdrawals');
      localStorage.removeItem('twiga_admin_users_list');
      localStorage.setItem('twiga_admin_wiped_v1', 'true');
    }

    const savedDeposits = JSON.parse(localStorage.getItem('twiga_admin_deposits') || 'null');
    this.adminDeposits = savedDeposits || [];

    const savedWithdrawals = JSON.parse(localStorage.getItem('twiga_admin_withdrawals') || 'null');
    this.adminWithdrawals = savedWithdrawals || [];

    const savedAdminUsers = JSON.parse(localStorage.getItem('twiga_admin_users_list') || 'null');
    this.adminUsersList = savedAdminUsers || [];
    
    // Sync adminUsersList with registeredUsers from Firebase
    this.syncAdminUsersListFromRegisteredUsers();

    if (!localStorage.getItem('twiga_admin_vip_v3')) {
      localStorage.removeItem('twiga_admin_vip_plans');
      localStorage.setItem('twiga_admin_vip_v3', 'true');
    }

    const savedVipPlans = JSON.parse(localStorage.getItem('twiga_admin_vip_plans') || 'null');
    this.adminVipPlans = savedVipPlans || [
      { name: 'VIP 1', price: '600.00 ETB', daily: '70.00 ETB', duration: '160 Days', status: 'active' },
      { name: 'VIP 2', price: '1,800.00 ETB', daily: '230.00 ETB', duration: '150 Days', status: 'active' },
      { name: 'VIP 3', price: '3,800.00 ETB', daily: '520.00 ETB', duration: '140 Days', status: 'active' },
      { name: 'VIP 4', price: '7,800.00 ETB', daily: '1,200.00 ETB', duration: '130 Days', status: 'coming_soon' },
      { name: 'VIP 5', price: '12,800.00 ETB', daily: '2,300.00 ETB', duration: '120 Days', status: 'coming_soon' },
      { name: 'VIP 6', price: '21,800.00 ETB', daily: '4,600.00 ETB', duration: '110 Days', status: 'coming_soon' },
      { name: 'VIP 7', price: '37,700.00 ETB', daily: '10,000.00 ETB', duration: '100 Days', status: 'coming_soon' },
      { name: 'VIP 8', price: '77,000.00 ETB', daily: '29,000.00 ETB', duration: '90 Days', status: 'coming_soon' },
      { name: 'VIP 9', price: '137,000.00 ETB', daily: '65,000.00 ETB', duration: '80 Days', status: 'coming_soon' },
      { name: 'VIP 10', price: '217,000.00 ETB', daily: '130,000.00 ETB', duration: '70 Days', status: 'coming_soon' }
    ];
  }

  save() {
    localStorage.setItem('twiga_lang', this.currentLang);
    localStorage.setItem('twiga_registered_users', JSON.stringify(this.registeredUsers));
    localStorage.setItem('twiga_user_session', JSON.stringify(this.currentUser));
    localStorage.setItem('twiga_draft_user', JSON.stringify(this.draftUser));
    localStorage.setItem('twiga_admin_deposits', JSON.stringify(this.adminDeposits));
    localStorage.setItem('twiga_admin_withdrawals', JSON.stringify(this.adminWithdrawals));
    localStorage.setItem('twiga_admin_users_list', JSON.stringify(this.adminUsersList));
    localStorage.setItem('twiga_admin_vip_plans', JSON.stringify(this.adminVipPlans));
    localStorage.setItem('twiga_admin_password', this.adminPassword);

    if (db && !this._isApplyingFirebaseUpdate) {
      db.ref('shambavest_state').set({
        registeredUsers: this.registeredUsers,
        adminDeposits: this.adminDeposits,
        adminWithdrawals: this.adminWithdrawals,
        adminUsersList: this.adminUsersList,
        adminVipPlans: this.adminVipPlans,
        adminPassword: this.adminPassword
      });
    }
  }

  saveLocalOnly() {
    this._isApplyingFirebaseUpdate = true;
    this.save();
    this._isApplyingFirebaseUpdate = false;
  }

  syncAdminUsersListFromRegisteredUsers() {
    // Rebuild adminUsersList from registeredUsers to ensure only real users are shown
    this.adminUsersList = [];
    
    for (const phone in this.registeredUsers) {
      const user = this.registeredUsers[phone];
      const joinedStr = user.registeredAt ? user.registeredAt.replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      this.adminUsersList.push({
        phone: user.mobile,
        balance: `${user.balance.toFixed(2)} ETB`,
        rawBalance: user.balance,
        role: 'User',
        bank: 'N/A',
        ac: 'N/A',
        joined: joinedStr
      });
    }
    
    // Sort by joined date (newest first)
    this.adminUsersList.sort((a, b) => new Date(b.joined) - new Date(a.joined));
    
    console.log(`Synced adminUsersList with ${this.adminUsersList.length} real users from registeredUsers`);
  }

  t(key) {
    return translations[this.currentLang][key] || translations['en'][key] || key;
  }
}

const state = new AppState();

// DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
  runAppLoadingSequence();
  setupEventListeners();
  applyLanguage();
  renderAppView();
  checkAutoFillLogin();
  checkUrlInviteCode();
  initHeroCarousel();
  checkAdminUrlTrigger();
  initializeDailyIncomeSystem();

  // Attach Firebase Listener for realtime sync
  if (db) {
    db.ref('shambavest_state').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log('Firebase realtime sync received data');
        
        if (data.registeredUsers) {
          state.registeredUsers = data.registeredUsers;
          // Sync adminUsersList from real registeredUsers
          state.syncAdminUsersListFromRegisteredUsers();
        }
        if (data.adminDeposits) state.adminDeposits = data.adminDeposits;
        if (data.adminWithdrawals) state.adminWithdrawals = data.adminWithdrawals;
        if (data.adminVipPlans) state.adminVipPlans = data.adminVipPlans;
        if (data.adminPassword) {
          state.adminPassword = data.adminPassword;
          localStorage.setItem('twiga_admin_password', data.adminPassword);
          console.log('Admin password synced from Firebase');
        }

        // Sync current session memory if logged in
        if (state.currentUser && state.registeredUsers[state.currentUser.mobile]) {
          state.currentUser = state.registeredUsers[state.currentUser.mobile];
        }

        state.saveLocalOnly();
        
        // Re-render UI depending on active tab
        if (state.isAdminMode) {
          if (typeof renderAdminUsersList === 'function') renderAdminUsersList();
          if (typeof renderAdminDeposits === 'function') renderAdminDeposits();
          if (typeof renderAdminWithdrawals === 'function') renderAdminWithdrawals();
          if (typeof updateAdminDashboardStats === 'function') updateAdminDashboardStats();
        } else {
          // Re-render views if they are open
          if (state.activeTab === 'home') renderHomeView();
          if (state.activeTab === 'income') renderIncomeView();
          if (state.activeTab === 'team') renderTeamView();
          if (state.activeTab === 'profile') renderProfileView();
        }
      }
    });
  }
});

// Secret Admin Access via URL or Keyboard Shortcut (Ctrl+Shift+A)
function checkAdminUrlTrigger() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('admin') || window.location.hash.includes('admin')) {
    openAdminPortal();
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      openAdminPortal();
      showToast('Secret Admin Portal Unlocked! 🛡️');
    }
  });
}

// Secret Quintuple Click on Brand Header
let brandClickCount = 0;
let brandClickTimer = null;

function handleBrandHeaderClick() {
  brandClickCount++;
  if (brandClickTimer) clearTimeout(brandClickTimer);

  if (brandClickCount >= 5) {
    brandClickCount = 0;
    openAdminPortal();
    showToast('Secret Admin Mode Granted! 🛡️');
  } else {
    brandClickTimer = setTimeout(() => {
      brandClickCount = 0;
    }, 1500);
  }
}

// App Loading Sequence — splash disabled, show app immediately
function runAppLoadingSequence() {
  const splash = document.getElementById('appLoadingSplash');
  if (splash) splash.style.display = 'none';
}



// Toast Manager (Single Toast Instance - Prevents Overlay Stacking)
function showToast(message, isError = false, duration = 2500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Clear any existing toasts so notifications never stack up over the UI
  container.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : ''}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// Automated Sliding Banner Carousel Logic
function initHeroCarousel() {
  if (state.carouselTimer) clearInterval(state.carouselTimer);

  // Start 4-second sliding interval
  state.carouselTimer = setInterval(() => {
    const totalSlides = 3;
    state.carouselIndex = (state.carouselIndex + 1) % totalSlides;
    updateCarouselPosition();
  }, 4000);
}

function goToCarouselSlide(index) {
  state.carouselIndex = index;
  updateCarouselPosition();
  initHeroCarousel(); // Reset 4-second timer on manual dot click
}

function updateCarouselPosition() {
  const track = document.getElementById('carouselTrack');
  const dots = document.querySelectorAll('.carousel-dot');

  if (track) {
    track.style.transform = `translateX(-${(state.carouselIndex * 100) / 3}%)`;
  }

  if (dots && dots.length > 0) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === state.carouselIndex);
    });
  }
}

// Unique Referral Code Generator
function generateUniqueCodeForPhone(phone) {
  if (!phone) phone = 'user_' + Date.now();
  let hash = 0;
  const str = phone + '_shamba_seed_salt';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
}

// Password Visibility Toggle with Accessible ARIA and Icon Swap
function togglePassVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  if (btnEl) {
    btnEl.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    const svgIcon = btnEl.querySelector('svg');
    if (svgIcon) {
      if (isPassword) {
        // Slashed Eye SVG Icon (Hide password)
        svgIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
      } else {
        // Normal Open Eye SVG Icon (Show password)
        svgIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
      }
    }
  }
}

// Check URL Query Parameter for Referral / Invite Code (?inviteCode=... or ?ref=...)
function checkUrlInviteCode() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('inviteCode') || urlParams.get('ref') || urlParams.get('code');
    if (inviteCode) {
      const regInviteInput = document.getElementById('regInviteCodeInput');
      if (regInviteInput) {
        regInviteInput.value = inviteCode.trim();
        console.log('Pre-filled invite code from URL:', inviteCode);
      }
    }
  } catch (e) {
    console.error('Error reading URL invite code:', e);
  }
}

// Helper to display/clear inline field validation errors
function setFieldError(containerId, errorId, show, errorText) {
  const container = document.getElementById(containerId);
  const errorEl = document.getElementById(errorId);
  if (container) {
    if (show) {
      container.classList.add('input-error');
    } else {
      container.classList.remove('input-error');
    }
  }
  if (errorEl) {
    if (show) {
      if (errorText) errorEl.innerText = errorText;
      errorEl.style.display = 'block';
    } else {
      errorEl.style.display = 'none';
    }
  }
}

// Helper to set Primary Button Loading State
function setButtonLoading(btnId, textSpanId, isLoading, defaultTextKey) {
  const btn = document.getElementById(btnId);
  const textSpan = document.getElementById(textSpanId);
  if (!btn || !textSpan) return;

  if (isLoading) {
    btn.disabled = true;
    textSpan.innerHTML = `<span class="btn-loading-spinner"></span> <span>Loading...</span>`;
  } else {
    btn.disabled = false;
    textSpan.innerText = state.t(defaultTextKey);
  }
}

// Logout Handler
window.handleLogout = function() {
  if (!confirm('Are you sure you want to logout?')) return;
  
  // Clear current user session
  state.currentUser = null;
  state.save();
  
  // Switch to auth tab
  switchTab('auth');
  
  // Clear any stored login credentials
  localStorage.removeItem('shambavest_remembered_phone');
  localStorage.removeItem('shambavest_remembered_pass');
  
  showToast('👋 You have been logged out successfully!');
}

// Event Listeners Setup
function setupEventListeners() {
  // Auth Mode Switcher (Login vs Register)
  const btnAuthLogin = document.getElementById('btnAuthLogin');
  const btnAuthRegister = document.getElementById('btnAuthRegister');
  const switchToLoginLink = document.getElementById('switchToLoginLink');
  const switchToRegisterLink = document.getElementById('switchToRegisterLink');

  if (btnAuthLogin && btnAuthRegister) {
    btnAuthLogin.addEventListener('click', () => setAuthMode('login'));
    btnAuthRegister.addEventListener('click', () => setAuthMode('register'));
  }
  if (switchToLoginLink) switchToLoginLink.addEventListener('click', () => setAuthMode('login'));
  if (switchToRegisterLink) switchToRegisterLink.addEventListener('click', () => setAuthMode('register'));

  // Attach live input listeners to clear validation errors on typing
  ['regMobileInput', 'regPassInput', 'regConfirmPassInput'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        if (id === 'regMobileInput') setFieldError('regMobileContainer', 'regMobileError', false);
        if (id === 'regPassInput') setFieldError('regPassContainer', 'regPassError', false);
        if (id === 'regConfirmPassInput') setFieldError('regConfirmPassContainer', 'regConfirmPassError', false);
      });
    }
  });

  ['loginMobileInput', 'loginPassInput'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        if (id === 'loginMobileInput') setFieldError('loginMobileContainer', 'loginMobileError', false);
        if (id === 'loginPassInput') setFieldError('loginPassContainer', 'loginPassError', false);
      });
    }
  });

  // Registration Form Submission (Unique Phone Check & Auto-Fill Login)
  const regForm = document.getElementById('regForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('=== Registration Started ===');
      
      const mobileVal = document.getElementById('regMobileInput').value.trim();
      const passVal = document.getElementById('regPassInput').value;
      const confirmPassVal = document.getElementById('regConfirmPassInput').value;
      const inviteVal = document.getElementById('regInviteCodeInput').value.trim() || 'f51380e';

      // Clear previous error styles
      setFieldError('regMobileContainer', 'regMobileError', false);
      setFieldError('regPassContainer', 'regPassError', false);
      setFieldError('regConfirmPassContainer', 'regConfirmPassError', false);

      let hasError = false;

      if (!mobileVal || mobileVal.length < 7) {
        setFieldError('regMobileContainer', 'regMobileError', true, 'Please enter a valid phone number.');
        hasError = true;
      }

      if (!passVal || passVal.length < 4) {
        setFieldError('regPassContainer', 'regPassError', true, 'Password must be at least 4 characters.');
        hasError = true;
      }

      if (passVal !== confirmPassVal) {
        setFieldError('regConfirmPassContainer', 'regConfirmPassError', true, 'Passwords do not match.');
        hasError = true;
      }

      if (hasError) return;

      // Enable loading spinner state
      setButtonLoading('regSubmitBtn', 'regSubmitBtnText', true, 'btnRegister');

      const fullMobile = `+251${mobileVal}`;

      // Check global uniqueness on Firebase with new project
      let firebaseUserExists = false;
      
      if (db) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Firebase check timeout after 3s')), 3000);
          });
          
          const firebasePromise = db.ref(`shambavest_state/registeredUsers/${mobileVal}`).once('value');
          const snap = await Promise.race([firebasePromise, timeoutPromise]);
          
          if (snap.exists()) {
            firebaseUserExists = true;
            setFieldError('regMobileContainer', 'regMobileError', true, 'Phone number is already registered.');
            setButtonLoading('regSubmitBtn', 'regSubmitBtnText', false, 'btnRegister');
            showToast('Phone number already exists on this platform!', true);
            return;
          }
        } catch (err) {
          console.log('Firebase check bypassed, using local validation');
        }
      }
      
      // Always run localStorage check as backup
      if (state.registeredUsers[mobileVal] || state.registeredUsers[fullMobile]) {
        setFieldError('regMobileContainer', 'regMobileError', true, 'Phone number is already registered.');
        setButtonLoading('regSubmitBtn', 'regSubmitBtnText', false, 'btnRegister');
        showToast('Phone number already exists!', true);
        return;
      }

      // Find referrers up to 3 levels deep based on inviteVal
      let l1ReferrerPhone = null;
      let l2ReferrerPhone = null;
      let l3ReferrerPhone = null;

      if (inviteVal) {
        const cleanVal = inviteVal.trim();
        for (let uPhone in state.registeredUsers) {
          const u = state.registeredUsers[uPhone];
          if (
            u.inviteCode === cleanVal || 
            u.referralCode === cleanVal || 
            u.mobile === cleanVal || 
            u.fullMobile === cleanVal ||
            (cleanVal.length >= 3 && (u.mobile.includes(cleanVal) || (u.fullMobile && u.fullMobile.includes(cleanVal))))
          ) {
            l1ReferrerPhone = u.mobile;
            l2ReferrerPhone = u.level1Referrer || null;
            l3ReferrerPhone = u.level2Referrer || null;
            break;
          }
        }
      }

      // Create new user object
      const userUniqueCode = generateUniqueCodeForPhone(mobileVal);
      
      const newUser = {
        mobile: mobileVal,
        fullMobile: fullMobile,
        password: passVal,
        inviteCode: userUniqueCode,
        referralCode: userUniqueCode,
        level1Referrer: l1ReferrerPhone,
        level2Referrer: l2ReferrerPhone,
        level3Referrer: l3ReferrerPhone,
        balance: 0.00,
        accumulatedYield: 0.00,
        totalTeamCommission: 0.00,
        teamCommissionBreakdown: { level1: 0, level2: 0, level3: 0 },
        vipLevel: 'VIP 1',
        registeredAt: new Date().toISOString(),
        activePlans: [],
        history: []
      };

      // Save user to directory
      state.registeredUsers[mobileVal] = newUser;
      state.syncAdminUsersListFromRegisteredUsers();
      state.draftUser = { mobile: mobileVal, password: passVal };
      state.save();

      setTimeout(() => {
        setButtonLoading('regSubmitBtn', 'regSubmitBtnText', false, 'btnRegister');
        showToast('Registration successful! Phone number and password auto-filled. Click Login to proceed.');
        setAuthMode('login');
        checkAutoFillLogin();
      }, 400);
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mobileVal = document.getElementById('loginMobileInput').value.trim();
      const passVal = document.getElementById('loginPassInput').value;

      setFieldError('loginMobileContainer', 'loginMobileError', false);
      setFieldError('loginPassContainer', 'loginPassError', false);

      let hasError = false;

      if (!mobileVal) {
        setFieldError('loginMobileContainer', 'loginMobileError', true, 'Please enter your phone number.');
        hasError = true;
      }

      if (!passVal) {
        setFieldError('loginPassContainer', 'loginPassError', true, 'Please enter your password.');
        hasError = true;
      }

      if (hasError) return;

      setButtonLoading('loginSubmitBtn', 'loginSubmitBtnText', true, 'btnLogin');

      // Check credentials in directory
      const existingUser = state.registeredUsers[mobileVal];
      if (!existingUser) {
        setFieldError('loginMobileContainer', 'loginMobileError', true, 'Account not found. Please register first.');
        setButtonLoading('loginSubmitBtn', 'loginSubmitBtnText', false, 'btnLogin');
        showToast('Account not found! Please register first.', true);
        return;
      }

      if (existingUser.password !== passVal) {
        setFieldError('loginPassContainer', 'loginPassError', true, 'Incorrect password. Please try again.');
        setButtonLoading('loginSubmitBtn', 'loginSubmitBtnText', false, 'btnLogin');
        showToast('Incorrect password! Please try again.', true);
        return;
      }

      // Log in user
      state.currentUser = existingUser;
      state.activeTab = 'home';
      state.save();

      recalculateTotalIncome(existingUser);

      setTimeout(() => {
        setButtonLoading('loginSubmitBtn', 'loginSubmitBtnText', false, 'btnLogin');
        renderAppView();
        showToast(`Welcome back, +251 ${mobileVal}!`);
        setTimeout(() => openModal('announcementModal'), 500);
      }, 300);
    });
  }

  // Position active tab underline bar on window resize
  window.addEventListener('resize', () => {
    updateTabUnderlinePosition(state.authMode);
  });
}

// Position active tab underline bar
function updateTabUnderlinePosition(mode) {
  const line = document.getElementById('authTabUnderline');
  const btnAuthLogin = document.getElementById('btnAuthLogin');
  const btnAuthRegister = document.getElementById('btnAuthRegister');

  if (!line || !btnAuthLogin || !btnAuthRegister) return;

  const targetBtn = mode === 'login' ? btnAuthLogin : btnAuthRegister;
  line.style.left = `${targetBtn.offsetLeft}px`;
  line.style.width = `${targetBtn.offsetWidth}px`;
}

// Switch Auth View Mode (Login vs Register)
function setAuthMode(mode) {
  state.authMode = mode;
  const btnAuthLogin = document.getElementById('btnAuthLogin');
  const btnAuthRegister = document.getElementById('btnAuthRegister');
  const regForm = document.getElementById('regForm');
  const loginForm = document.getElementById('loginForm');

  if (mode === 'login') {
    if (btnAuthLogin) {
      btnAuthLogin.classList.add('active');
      btnAuthLogin.setAttribute('aria-selected', 'true');
    }
    if (btnAuthRegister) {
      btnAuthRegister.classList.remove('active');
      btnAuthRegister.setAttribute('aria-selected', 'false');
    }
    if (regForm) regForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
  } else {
    if (btnAuthRegister) {
      btnAuthRegister.classList.add('active');
      btnAuthRegister.setAttribute('aria-selected', 'true');
    }
    if (btnAuthLogin) {
      btnAuthLogin.classList.remove('active');
      btnAuthLogin.setAttribute('aria-selected', 'false');
    }
    if (regForm) regForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
  }

  // Update animated underline position
  setTimeout(() => {
    updateTabUnderlinePosition(mode);
  }, 10);
}

// Check Auto Fill Login Credentials
function checkAutoFillLogin() {
  const loginMobileInput = document.getElementById('loginMobileInput');
  const loginPassInput = document.getElementById('loginPassInput');

  if (state.draftUser) {
    if (loginMobileInput) loginMobileInput.value = state.draftUser.mobile;
    if (loginPassInput) loginPassInput.value = state.draftUser.password;
  }
  
  // Set initial tab underline position
  updateTabUnderlinePosition(state.authMode || 'register');
}

// Language Bottom Sheet Handlers
function openBottomSheet(sheetId) {
  const sheet = document.getElementById(sheetId);
  if (sheet) sheet.classList.add('show');
}

function closeBottomSheet(sheetId) {
  const sheet = document.getElementById(sheetId);
  if (sheet) sheet.classList.remove('show');
}

function selectLanguage(code, label) {
  state.currentLang = code;
  state.save();
  closeBottomSheet('langBottomSheet');
  
  const currentLabelEl = document.getElementById('currentLangLabel');
  if (currentLabelEl) currentLabelEl.innerText = label;

  document.querySelectorAll('.sheet-option-item').forEach(item => {
    item.classList.toggle('active', item.innerText.includes(label.split(' ')[1] || ''));
  });

  applyLanguage();
  renderAppView();
  showToast(`Language set to ${label}`);
}

// Apply Language Labels
function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.innerText = state.t(key);
  });
}

// Switch Navigation Tab
function switchTab(tabName) {
  if (!state.currentUser && tabName !== 'auth') {
    showToast('Please register or log in first!', true);
    state.activeTab = 'auth';
  } else {
    state.activeTab = tabName;
  }
  renderAppView();
}

// Sub-page Navigation Handler (Balance Details, Recharge Records, Withdrawal Records)
function openSubpage(subpageName) {
  if (!state.currentUser) {
    showToast('Please log in first!', true);
    switchTab('auth');
    return;
  }
  state.activeTab = subpageName;
  renderAppView();
}

// Render Main App Views
function renderAppView() {
  document.querySelectorAll('.nav-tab-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === state.activeTab);
  });

  const views = [
    'authView', 'homeView', 'rechargeView', 'withdrawView', 'incomeView', 
    'teamView', 'shareView', 'profileView',
    'balanceDetailsView', 'rechargeRecordsView', 'withdrawalRecordsView',
    'personalInfoView', 'changeEmailView', 'messagesView', 'bindWalletView', 'changePasswordView',
    'noteView'
  ];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) {
      el.style.display = (v === `${state.activeTab}View`) ? 'block' : 'none';
    }
  });

  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) {
    if (state.activeTab === 'auth') {
      navBar.style.display = 'none';
    } else {
      navBar.style.display = 'flex'; // Restore for other tabs
    }
  }

  // Hide top navbar on auth, home, and profile pages, or when unauthenticated
  const topHeader = document.getElementById('topHeader');
  if (topHeader) {
    if (!state.currentUser || state.activeTab === 'auth' || state.activeTab === 'home' || state.activeTab === 'profile') {
      topHeader.style.setProperty('display', 'none', 'important');
    } else {
      topHeader.style.display = 'flex';
    }
  }

  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.scrollTop = 0;

  if (state.activeTab === 'home') {
    updateCarouselPosition();
    renderVipButtons();
    // Show announcement modal every time user visits home page
    setTimeout(() => openModal('homeAnnouncementModal'), 500);
  }
  if (state.activeTab === 'recharge') renderRechargeView();
  if (state.activeTab === 'withdraw') renderWithdrawView();
  if (state.activeTab === 'income') renderIncomeView();
  if (state.activeTab === 'team') renderTeamView();
  if (state.activeTab === 'share') renderShareView();
  if (state.activeTab === 'profile') {
    renderProfileView();
    updateProfileCarouselPosition();
    startProfileCarousel();
  }
  if (state.activeTab === 'balanceDetails') renderBalanceDetailsView();
  if (state.activeTab === 'rechargeRecords') renderRechargeRecordsView();
  if (state.activeTab === 'withdrawalRecords') renderWithdrawalRecordsView();
  if (state.activeTab === 'bindWallet') renderBindWalletView();
  if (state.activeTab === 'withdrawalRecords') renderWithdrawalRecordsView();
}

// Recharge Screen Monetary Amount Selector Handler
function openRechargeScreen() {
  switchTab('recharge');
}

function selectRechargeAmount(amount, element) {
  state.rechargeAmount = amount;

  document.querySelectorAll('.amount-option-btn').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');

  // Fill and focus the custom input field
  const customInput = document.getElementById('rechargeCustomInput');
  if (customInput) {
    customInput.value = amount;
  }

  // Clear any error state
  const errEl = document.getElementById('rechargeAmountError');
  const inputBox = document.getElementById('rechargeInputBox');
  if (errEl) errEl.style.display = 'none';
  if (inputBox) inputBox.classList.remove('input-error');

  // Update Pay button immediately
  const btn = document.getElementById('btnDynamicPay');
  if (btn) {
    btn.innerText = `Pay Br ${amount.toLocaleString()}`;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

// Custom amount input handler (free-type, minimum Br 600)
function handleCustomRechargeInput(val) {
  const amount = parseFloat(val);
  const errEl = document.getElementById('rechargeAmountError');
  const inputBox = document.getElementById('rechargeInputBox');
  const btn = document.getElementById('btnDynamicPay');

  // Deselect all preset buttons when typing custom
  document.querySelectorAll('.amount-option-btn').forEach(b => b.classList.remove('active'));

  // Empty field — reset pay button to default label
  if (!val || val.trim() === '') {
    if (errEl) errEl.style.display = 'none';
    if (inputBox) inputBox.classList.remove('input-error');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.innerText = 'Pay Br —';
    }
    return;
  }

  if (isNaN(amount) || amount < 600) {
    if (errEl) errEl.style.display = 'block';
    if (inputBox) inputBox.classList.add('input-error');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.innerText = 'Minimum Br 600';
    }
    return;
  }

  // Valid amount
  if (errEl) errEl.style.display = 'none';
  if (inputBox) inputBox.classList.remove('input-error');
  state.rechargeAmount = amount;

  // Highlight matching preset button if value matches exactly
  document.querySelectorAll('.amount-option-btn').forEach(b => {
    if (parseInt(b.dataset.amount) === amount) b.classList.add('active');
  });

  if (btn) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerText = `Pay Br ${amount.toLocaleString()}`;
  }
}


function parseNum(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0;
}

// Render dynamic VIP plan buttons based on admin state
function renderVipButtons() {
  document.querySelectorAll('.vip-action-btn').forEach(btn => {
    const index = parseInt(btn.dataset.vipIndex);
    const planState = state.adminVipPlans[index];
    if (!planState) return;

    const priceNum = parseNum(planState.price);
    const dailyNum = parseNum(planState.daily);
    const daysNum = parseNum(planState.duration) || 365;
    const totalNum = dailyNum * daysNum;

    btn.dataset.price = priceNum;
    btn.dataset.daily = dailyNum;
    btn.dataset.days = daysNum;
    btn.dataset.total = totalNum;

    const card = btn.closest('.produce-card-white');
    if (card) {
      const priceEl = card.querySelector('.produce-price-large');
      if (priceEl) priceEl.innerText = `Br${priceNum.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

      const dataCells = card.querySelectorAll('.data-cell-val');
      if (dataCells && dataCells.length >= 3) {
        dataCells[0].innerText = `Br ${dailyNum.toLocaleString()}`;
        dataCells[1].innerText = `${daysNum}`;
        dataCells[2].innerText = `Br ${totalNum.toLocaleString()}`;
      }
    }

    if (planState.status === 'active') {
      btn.style.background = 'var(--color-primary)';
      btn.style.borderColor = 'var(--color-primary)';
      btn.style.color = '#FFFFFF';
      btn.style.cursor = 'pointer';
      btn.innerHTML = `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Buy now`;
      
      const cardImg = card ? card.querySelector('img') : null;
      const imgSrc = cardImg ? cardImg.getAttribute('src') : getPlanImage(planState.name || btn.dataset.planName);

      btn.onclick = () => openPurchaseModal(
        planState.name || btn.dataset.planName, priceNum, totalNum, dailyNum, daysNum, imgSrc
      );
    } else {
      btn.style.background = '#94a3b8';
      btn.style.borderColor = '#94a3b8';
      btn.style.color = 'white';
      btn.style.cursor = 'not-allowed';
      btn.innerHTML = `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Coming soon`;
      btn.onclick = null;
    }
  });
}

function renderRechargeView() {
  if (!state.currentUser) return;
  const valEl = document.getElementById('rechargeBalanceVal');
  if (valEl) valEl.innerText = `Br ${state.currentUser.balance.toFixed(2)}`;
}

// Trigger Payment Gateway Flow (Replaces old cashier modals)
function triggerPayNowNoticeModal() {
  openPaymentLoading();
}

function openPaymentLoading() {
  // Switch to payment loading screen
  document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
  const loadingView = document.getElementById('paymentLoadingView');
  if (loadingView) loadingView.style.display = 'flex';
  
  // Hide bottom nav bar during payment flow
  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) navBar.style.display = 'none';

  setTimeout(() => {
    openPaymentSelection();
  }, 1500);
}

function openPaymentSelection() {
  document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
  const selectView = document.getElementById('paymentSelectView');
  if (selectView) selectView.style.display = 'block';

  const depositAmount = state.rechargeAmount || 970;
  document.getElementById('paymentSelectAmount').innerText = `ETB ${depositAmount.toFixed(2)}`;
}

let paymentTimerInterval = null;

function closePaymentGateway() {
  const gwView = document.getElementById('paymentGatewayView');
  if (gwView) gwView.style.display = 'none';
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);
  
  // Go back to recharge view
  const rechargeView = document.getElementById('rechargeView');
  if (rechargeView) rechargeView.style.display = 'block';
  
  // Show bottom nav
  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) navBar.style.display = 'flex';
}

function openPaymentGateway(method) {
  document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
  const gwView = document.getElementById('paymentGatewayView');
  if (gwView) gwView.style.display = 'block';

  const depositAmount = state.rechargeAmount || 970;
  document.getElementById('gwOrderAmount').innerText = `ETB ${depositAmount.toFixed(2)}`;

  if (method === 'telebirr') {
    document.getElementById('gwLogoTelebirr').style.display = 'block';
    document.getElementById('gwLogoCBE').style.display = 'none';
    document.getElementById('gwChannelName').innerText = 'Telebirr Wallet';
    document.getElementById('gwAccountName').innerText = 'Menkem';
    document.getElementById('gwAccountNumber').innerText = '1000790951488';
  } else {
    document.getElementById('gwLogoTelebirr').style.display = 'none';
    document.getElementById('gwLogoCBE').style.display = 'block';
    document.getElementById('gwChannelName').innerText = 'Commercial Bank of Ethiopia';
    document.getElementById('gwAccountName').innerText = 'Menkem';
    document.getElementById('gwAccountNumber').innerText = '1000790951488';
  }

  // Simple Timer Simulation
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);
  let timeLeft = 29 * 60 + 45; // 29 min 45 sec
  paymentTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) clearInterval(paymentTimerInterval);
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('timerM1').innerText = m[0];
    document.getElementById('timerM2').innerText = m[1];
    document.getElementById('timerS1').innerText = s[0];
    document.getElementById('timerS2').innerText = s[1];
  }, 1000);
}

function finishPaymentSuccess() {
  closeModal('paymentSuccessModal');
  switchTab('home');
}

function submitGatewayPayment() {
  const receiptInput = document.getElementById('gwReceiptInput');
  const receipt = receiptInput ? receiptInput.value : '';

  if (!receipt || receipt.trim() === '') {
    showToast('Please enter or paste the payment receipt / SMS text.', true);
    return;
  }

  const depositAmount = state.rechargeAmount || 970;

  if (!state.currentUser) {
    state.currentUser = {
      mobile: '0900000000',
      fullMobile: '0900000000',
      balance: 0,
      history: [],
      rechargeHistory: []
    };
  }

  const user = state.currentUser;
  const userPhone = user.fullMobile || user.mobile || '0900000000';
  const channelEl = document.getElementById('gwChannelName');
  const channelName = channelEl ? channelEl.innerText : 'Commercial Bank of Ethiopia';
  const bankName = channelName.includes('Telebirr') ? 'Telebirr' : 'CBE';
  const depId = `dep_${Date.now()}`;

  // Push to Admin Deposits queue in REAL-TIME!
  const newDepRequest = {
    id: depId,
    phone: userPhone,
    amount: `${depositAmount.toFixed(2)} ETB`,
    rawAmount: depositAmount,
    bank: bankName,
    txId: receipt.trim(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  if (!state.adminDeposits) state.adminDeposits = [];
  state.adminDeposits.unshift(newDepRequest);

  // Add PENDING deposit to user history
  if (!user.history) user.history = [];
  user.history.unshift({
    id: depId,
    type: `Deposit (${bankName})`,
    amount: depositAmount,
    date: new Date().toLocaleDateString(),
    status: 'PENDING'
  });

  if (state.registeredUsers && user.mobile) {
    state.registeredUsers[user.mobile] = user;
  }
  state.save();

  // Clean up input & timer
  if (receiptInput) receiptInput.value = '';
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);
  
  // Hide payment gateway view
  const gwView = document.getElementById('paymentGatewayView');
  if (gwView) gwView.style.display = 'none';

  // Show bottom nav bar again
  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) navBar.style.display = 'flex';

  // Display prominent success toast message
  showToast(`✅ Payment Submitted Successfully! Deposit of ETB ${depositAmount.toFixed(2)} is pending approval.`, false, 4500);

  // Set modal message and display success modal
  const msgEl = document.getElementById('paymentSuccessModalMsg');
  if (msgEl) {
    msgEl.innerHTML = `Your payment request of <strong style="color:#0F172A;">ETB ${depositAmount.toFixed(2)}</strong> via <strong>${bankName}</strong> has been submitted successfully!<br><br><span style="color:#D97706; font-size:13px; font-weight:700;">Status: PENDING APPROVAL</span>`;
  }
  
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'success',
      title: 'Submission Successful! / ማስረከብ ተሳክቷል!',
      html: `Your payment request of <b>ETB ${depositAmount.toFixed(2)}</b> (${bankName}) has been submitted successfully.<br><br><span style="color:#D97706; font-weight:bold;">Status: Pending Approval</span>`,
      confirmButtonColor: '#10B981',
      confirmButtonText: 'OK / ተረድቻለሁ'
    }).then(() => {
      switchTab('home');
    });
  } else {
    openModal('paymentSuccessModal');
  }
}

// Helper for fallback product images
function getPlanImage(name) {
  if (!name) return 'plan_b.png';
  const n = name.toLowerCase();
  if (n.includes('plan b') || n.includes('vip ii') || n.includes('vip 2')) return 'plan_b.png';
  if (n.includes('tomatoes') || n.includes('vip i') || n.includes('vip 1')) return 'plan_a.png';
  if (n.includes('vip iii') || n.includes('vip 3')) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500';
  if (n.includes('vip iv') || n.includes('vip 4')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500';
  if (n.includes('vip v') || n.includes('vip 5')) return 'plan_e.png';
  if (n.includes('vip vi') || n.includes('vip 6')) return 'plan_f.png';
  if (n.includes('vip vii') || n.includes('vip 7')) return 'plan_g.png';
  if (n.includes('vip viii') || n.includes('vip 8')) return 'plan_h.png';
  if (n.includes('vip ix') || n.includes('vip 9')) return 'plan_j.png';
  if (n.includes('vip x') || n.includes('vip 10')) return 'plan_k.png';
  return 'plan_b.png';
}

// Render Income View Details (With Balance, Total Income, Approved Products & Pending Approvals)
function renderIncomeView() {
  if (!state.currentUser) return;
  const user = state.currentUser;
  const container = document.getElementById('incomeViewContainer');

  if (!container) return;

  const userBalance = parseNum(user.balance || 0);
  const userIncome = parseNum(user.accumulatedYield || 0);
  const activePlans = user.activePlans || [];
  const pendingPlans = user.pendingPlans || [];

  let totalDailyYield = 0;
  activePlans.forEach(plan => {
    totalDailyYield += parseNum(plan.daily || 0);
  });

  const balFormatted = `Br ${userBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  const incFormatted = `Br ${userIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  let html = `
    <div class="income-view-wrapper" style="padding: 16px;">
      
      <!-- Top Hero Summary Card: Balance & Total Income (Reflects Admin Edits & Approved Product Earnings) -->
      <div class="income-hero-summary-card" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border-radius: 16px; padding: 20px; color: #FFF; margin-bottom: 20px; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 14px;">
          <div>
            <div style="font-size: 12px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Current Balance</div>
            <div style="font-size: 24px; font-weight: 800; color: #10B981; margin-top: 2px;" id="incomeCardBalance">${balFormatted}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total Income</div>
            <div style="font-size: 22px; font-weight: 800; color: #F59E0B; margin-top: 2px;" id="incomeCardTotalYield">${incFormatted}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 10px 12px;">
            <div style="font-size: 11px; color: #94A3B8;">Approved Products</div>
            <div style="font-size: 15px; font-weight: 700; color: #FFF; margin-top: 2px;">${activePlans.length} Active</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 10px 12px;">
            <div style="font-size: 11px; color: #94A3B8;">Daily Return</div>
            <div style="font-size: 15px; font-weight: 700; color: #34D399; margin-top: 2px;">+Br ${totalDailyYield.toFixed(2)} / day</div>
          </div>
        </div>

        ${activePlans.length > 0 ? `
          <button type="button" onclick="claimDailyYield()" class="btn-primary-action" style="width: 100%; margin-top: 16px; background: #10B981; color: #FFF; border-radius: 10px; padding: 12px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Claim Daily Income Yield
          </button>
        ` : ''}
      </div>

      <!-- Approved Purchased Products Title -->
      <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1E293B; margin: 0;">Purchased Products (Approved)</h3>
        <span style="font-size: 12px; color: #10B981; font-weight: 700;">${activePlans.length} Running</span>
      </div>
  `;

  if (activePlans.length === 0) {
    html += `
      <div style="background: #FFF; border: 1px dashed #CBD5E1; border-radius: 12px; padding: 24px 16px; text-align: center; margin-bottom: 20px;">
        <div style="font-size: 32px; margin-bottom: 8px;">🌱</div>
        <div style="font-size: 15px; font-weight: 700; color: #334155; margin-bottom: 4px;">No Active Approved Products Yet</div>
        <div style="font-size: 13px; color: #64748B; margin-bottom: 16px;">Buy a VIP plan or complete payment approval to start earning daily income!</div>
        <button type="button" onclick="switchTab('home')" style="background: #10B981; color: #FFF; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 700; font-size: 13px; cursor: pointer;">
          Explore Products
        </button>
      </div>
    `;
  } else {
    html += `
      <div class="income-cards-list" style="margin-bottom: 20px;">
        ${activePlans.map(plan => {
          const imgUrl = plan.image || getPlanImage(plan.name);
          const priceNum = parseNum(plan.price);
          const dailyNum = parseNum(plan.daily);
          const dayNum = parseNum(plan.days || plan.daysLeft || 170);
          const totalProfitNum = parseNum(plan.profit) || (dailyNum * dayNum);

          const priceFormatted = `Br${priceNum.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
          const dailyFormatted = `Br ${dailyNum.toLocaleString()}`;
          const totalProfitFormatted = `Br ${totalProfitNum.toLocaleString()}`;

          return `
            <div class="produce-card-white" style="margin-bottom: 12px;">
              <div class="produce-card-body" style="margin-bottom: 12px;">
                <div class="produce-img-square">
                  <span class="quota-badge-topleft" style="background: #10B981; color: #FFFFFF; font-weight: 700;">Approved</span>
                  <img src="${imgUrl}" alt="${plan.name}" onerror="this.src='plan_b.png'">
                </div>
                <div class="produce-info-right">
                  <div class="produce-title-bold">${plan.name}</div>
                  <div class="produce-price-large">${priceFormatted}</div>
                  <div class="produce-data-grid">
                    <div class="data-cell">
                      <span class="data-cell-label">Daily</span>
                      <span class="data-cell-val" style="color: var(--color-success);">${dailyFormatted}</span>
                    </div>
                    <div class="data-cell">
                      <span class="data-cell-label">Day</span>
                      <span class="data-cell-val">${dayNum}</span>
                    </div>
                    <div class="data-cell">
                      <span class="data-cell-label">Total</span>
                      <span class="data-cell-val">${totalProfitFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="income-status-banner" style="background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; font-weight: 700; font-size: 12.5px; text-align: center; padding: 8px 12px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; gap: 6px;">
                <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24" style="stroke: #059669;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Approved by Admin & Active Daily Yield
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Pending Admin Approval Section (if any product is waiting for payment approval)
  if (pendingPlans.length > 0) {
    html += `
      <div style="margin-top: 20px; margin-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #D97706; margin: 0;">Pending Admin Approval (${pendingPlans.length})</h3>
      </div>
      <div class="pending-cards-list">
        ${pendingPlans.map(plan => `
          <div class="produce-card-white" style="margin-bottom: 12px; border: 1px solid #FCD34D;">
            <div class="produce-card-body" style="margin-bottom: 12px;">
              <div class="produce-img-square">
                <span class="quota-badge-topleft" style="background: #F59E0B; color: #FFF; font-weight: 700;">Pending</span>
                <img src="${plan.image || getPlanImage(plan.name)}" alt="${plan.name}">
              </div>
              <div class="produce-info-right">
                <div class="produce-title-bold">${plan.name}</div>
                <div class="produce-price-large">Br ${parseNum(plan.price).toFixed(2)}</div>
                <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Daily Yield: <strong style="color:#10B981;">Br ${parseNum(plan.daily)}</strong></div>
              </div>
            </div>
            <div class="income-status-banner" style="background: #FEF3C7; border: 1px solid #FDE68A; color: #B45309; font-weight: 700; font-size: 12.5px; text-align: center; padding: 8px 12px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
              Admin Approval
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// Claim Daily Yield Handler
function claimDailyYield() {
  if (!state.currentUser) return;
  const user = state.currentUser;

  let totalClaim = 0;
  if (user.activePlans && user.activePlans.length > 0) {
    user.activePlans.forEach(p => {
      totalClaim += parseFloat(p.daily);
    });
  } else {
    totalClaim = 50.00;
  }

  user.balance += totalClaim;
  user.accumulatedYield += totalClaim;
  user.history.unshift({
    type: 'Daily Yield Claim',
    amount: totalClaim,
    date: new Date().toLocaleDateString(),
    status: 'COMPLETED'
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  renderIncomeView();
  showToast(`Successfully claimed Br ${totalClaim.toFixed(2)} daily yield to balance! 🎉`);
}

// Render Profile View Details (Matching Image 2 Reference)
function renderProfileView() {
  if (!state.currentUser) {
    // Default preview values when logged out
    const phoneEl = document.getElementById('profilePhone');
    const badgeEl = document.getElementById('profileIdBadge');
    const vipEl = document.getElementById('profileVipTag');
    const balSummaryEl = document.getElementById('profileSummaryBalance');
    const incomeSummaryEl = document.getElementById('profileSummaryTotalIncome');

    if (phoneEl) phoneEl.innerText = '251966053779';
    if (badgeEl) badgeEl.innerText = '12194';
    if (vipEl) vipEl.innerText = 'VIP0';
    if (balSummaryEl) balSummaryEl.innerText = '0';
    if (incomeSummaryEl) incomeSummaryEl.innerText = '0';
    return;
  }
  const user = state.currentUser;

  const phoneEl = document.getElementById('profilePhone');
  const badgeEl = document.getElementById('profileIdBadge');
  const vipEl = document.getElementById('profileVipTag');
  const balSummaryEl = document.getElementById('profileSummaryBalance');
  const incomeSummaryEl = document.getElementById('profileSummaryTotalIncome');

  if (phoneEl) phoneEl.innerText = user.fullMobile || `251${user.mobile}`;
  if (badgeEl) badgeEl.innerText = user.inviteCode || '12194';
  if (vipEl) vipEl.innerText = user.vipLevel || 'VIP0';
  if (balSummaryEl) balSummaryEl.innerText = user.balance > 0 ? `Br ${user.balance.toFixed(0)}` : '0';
  if (incomeSummaryEl) incomeSummaryEl.innerText = user.accumulatedYield > 0 ? `Br ${user.accumulatedYield.toFixed(0)}` : '0';

  // Start profile page carousel auto-slide
  startProfileCarousel();
}

// Render Balance Details Subpage View (Image 3 Reference)
function renderBalanceDetailsView() {
  if (!state.currentUser) return;
  const user = state.currentUser;

  const balEl = document.getElementById('balanceDetailsVal');
  if (balEl) balEl.innerText = `Br ${user.balance.toFixed(2)}`;

  const balCard = document.querySelector('#balanceDetailsView .balance-green-card');
  const tabsContainer = document.querySelector('#balanceDetailsView .balance-tabs-container');
  const recordsContainer = document.getElementById('balanceRecordsContainer');

  if (!user.activePlans || user.activePlans.length === 0) {
    if (balCard) balCard.style.display = 'none';
    if (tabsContainer) tabsContainer.style.display = 'none';
    if (recordsContainer) {
      recordsContainer.innerHTML = `
        <div class="empty-state-no-data" style="margin-top: 50px;">
          <div class="empty-state-watermark">NO ACTIVE PLANS</div>
          <div style="text-align:center; color:var(--color-text-secondary); font-size:13px; margin-top:10px;">
            You have not bought any VIP plans yet.
          </div>
        </div>
      `;
    }
  } else {
    if (balCard) balCard.style.display = 'block';
    if (tabsContainer) tabsContainer.style.display = 'flex';
    switchBalanceTab('my');
  }
}

function switchBalanceTab(tabType) {
  const btnMy = document.getElementById('btnTabMyIncome');
  const btnSub = document.getElementById('btnTabSubIncome');
  const container = document.getElementById('balanceRecordsContainer');

  if (btnMy && btnSub) {
    btnMy.classList.toggle('active', tabType === 'my');
    btnSub.classList.toggle('active', tabType === 'subordinate');
  }

  if (!container) return;
  if (!state.currentUser) return;

  const user = state.currentUser;
  if (tabType === 'subordinate') {
    container.innerHTML = `
      <div class="empty-state-no-data">
        <div class="empty-state-watermark">NO DATA</div>
      </div>
    `;
  } else {
    if (!user.history || user.history.length === 0) {
      container.innerHTML = `
        <div class="empty-state-no-data">
          <div class="empty-state-watermark">NO DATA</div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="records-list-container">
          ${user.history.map(item => `
            <div class="record-card-item">
              <div class="record-logo-badge">
                <svg viewBox="0 0 40 40" width="24" height="24" fill="none">
                  <path d="M12 28V15C12 11.686 14.686 9 18 9C21.314 9 24 11.686 24 15V18C24 18.552 23.552 19 23 19H20C18.895 19 18 19.895 18 21V28" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="15.5" cy="6" r="1.8" fill="#10B981"/>
                  <circle cx="20.5" cy="6" r="1.8" fill="#10B981"/>
                </svg>
              </div>
              <div class="record-info-main">
                <div class="record-title-row">
                  <span class="record-type-name">${item.type}</span>
                  <span class="record-amount-green" style="color: ${item.amount >= 0 ? '#10B981' : '#DC2626'}">
                    ${item.amount >= 0 ? '+' : ''}${item.amount.toFixed(2)}
                  </span>
                </div>
                <div class="record-sub-row">
                  <span class="record-status-completed">${item.status || 'COMPLETED'}</span>
                  <span class="record-timestamp">${item.date}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
}

// Render Recharge Records Subpage View (Image 4 & 5 Reference)
function renderRechargeRecordsView() {
  const container = document.getElementById('rechargeRecordsListContainer');
  if (!container) return;

  if (!state.currentUser) return;
  const user = state.currentUser;

  const deposits = (user.history || []).filter(h => h.type.includes('Deposit') || h.type.includes('Recharge'));

  if (deposits.length === 0) {
    container.innerHTML = `
      <div class="record-card-item">
        <div class="record-logo-badge">
          <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
            <path d="M12 28V15C12 11.686 14.686 9 18 9C21.314 9 24 11.686 24 15V18C24 18.552 23.552 19 23 19H20C18.895 19 18 19.895 18 21V28" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="15.5" cy="6" r="1.8" fill="#10B981"/>
            <circle cx="20.5" cy="6" r="1.8" fill="#10B981"/>
          </svg>
        </div>
        <div class="record-info-main">
          <div class="record-title-row">
            <span class="record-type-name">Recharge</span>
            <span class="record-amount-green">+970</span>
          </div>
          <div class="record-sub-row">
            <span class="record-status-pending">Pending Payment</span>
            <span class="record-timestamp">19-08-2026 07:24:38</span>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = deposits.map(item => `
      <div class="record-card-item">
        <div class="record-logo-badge">
          <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
            <path d="M12 28V15C12 11.686 14.686 9 18 9C21.314 9 24 11.686 24 15V18C24 18.552 23.552 19 23 19H20C18.895 19 18 19.895 18 21V28" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="15.5" cy="6" r="1.8" fill="#10B981"/>
            <circle cx="20.5" cy="6" r="1.8" fill="#10B981"/>
          </svg>
        </div>
        <div class="record-info-main">
          <div class="record-title-row">
            <span class="record-type-name">Recharge</span>
            <span class="record-amount-green">+${item.amount}</span>
          </div>
          <div class="record-sub-row">
            <span class="${item.status === 'PENDING' ? 'record-status-pending' : 'record-status-completed'}">${item.status || 'COMPLETED'}</span>
            <span class="record-timestamp">${item.date}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Render Withdrawal Records Subpage View
function renderWithdrawalRecordsView() {
  const container = document.getElementById('withdrawalRecordsListContainer');
  if (!container) return;

  if (!state.currentUser) return;
  const user = state.currentUser;

  const withdrawals = (user.history || []).filter(h => h.type.includes('Withdrawal'));

  if (withdrawals.length === 0) {
    container.innerHTML = `
      <div class="empty-state-no-data">
        <div class="empty-state-watermark">NO DATA</div>
      </div>
    `;
  } else {
    container.innerHTML = withdrawals.map(item => `
      <div class="record-card-item">
        <div class="record-info-main">
          <div class="record-title-row">
            <span class="record-type-name">Withdrawal</span>
            <span style="font-family:var(--font-family); font-weight:800; color:#DC2626;">-${Math.abs(item.amount)}</span>
          </div>
          <div class="record-sub-row">
            <span class="record-status-pending">${item.status || 'PENDING'}</span>
            <span class="record-timestamp">${item.date}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// APK Download Notification Toast Handler (Image 1 Reference)
function triggerApkDownload() {
  const banner = document.getElementById('downloadNotificationBanner');
  const subText = document.getElementById('downloadToastSub');
  
  if (!banner) return;

  banner.style.display = 'flex';
  if (subText) subText.innerText = 'See notification for download status';

  showToast('Starting application download...');

  // Animate status update
  let percent = 0;
  const timer = setInterval(() => {
    percent += 20;
    if (subText) subText.innerText = `Downloading... ${percent}% complete`;
    
    if (percent >= 100) {
      clearInterval(timer);
      if (subText) subText.innerText = 'Download complete! Tap Details to install.';
      setTimeout(() => {
        banner.style.display = 'none';
      }, 5000);
    }
  }, 600);
}

function showApkDownloadDetails() {
  alert('ShambaVest Mobile App APK (v2.4.0)\nSize: 18.4 MB\nStatus: Download completed successfully.');
}

// Additional Feature Modal Helpers
function openMessagesModal() {
  openModal('messagesModal');
}

function openPersonalInfoModal() {
  if (state.currentUser) {
    const pEl = document.getElementById('modalInfoPhone');
    const idEl = document.getElementById('modalInfoId');
    const vipEl = document.getElementById('modalInfoVip');

    if (pEl) pEl.innerText = `+251 ${state.currentUser.mobile}`;
    if (idEl) idEl.innerText = state.currentUser.inviteCode || '12194';
    if (vipEl) vipEl.innerText = `${state.currentUser.vipLevel || 'VIP0'} Member`;
  }
  openModal('personalInfoModal');
}

function openAboutUsModal() {
  openModal('aboutUsModal');
}

// Log Out User
function logoutUser() {
  state.currentUser = null;
  state.activeTab = 'auth';
  state.save();
  renderAppView();
  showToast('Logged out successfully.');
}

// Modals Control Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// Product Purchase Modal Handlers
function openPurchaseModal(name, price, profit, daily, days, image) {
  state.selectedProduct = { name, price: parseFloat(price), profit, daily, days, image: image || getPlanImage(name) };
  
  const titleEl = document.getElementById('purchModalTitle');
  const priceEl = document.getElementById('purchModalPrice');
  const profitEl = document.getElementById('purchModalProfit');

  if (titleEl) titleEl.innerText = name;
  if (priceEl) priceEl.innerText = `Br${price}`;
  if (profitEl) profitEl.innerText = `Br${profit}`;

  openModal('purchaseModal');
}

function confirmPurchaseProduct() {
  closeModal('purchaseModal');

  if (!state.currentUser) {
    showToast('Please log in before purchasing products!', true);
    switchTab('auth');
    return;
  }

  const user = state.currentUser;
  const prod = state.selectedProduct;
  if (!prod) return;

  if (user.balance < prod.price) {
    showToast(`Insufficient balance! Minimum Br ${prod.price} required. Opening Recharge...`, true);
    setTimeout(() => {
      openRechargeScreen();
    }, 1000);
    return;
  }

  // Deduct balance and create pending plan
  user.balance -= prod.price;
  
  // Initialize pendingPlans array if not exists
  if (!user.pendingPlans) user.pendingPlans = [];
  
  const planIndex = user.pendingPlans.length;
  user.pendingPlans.push({
    name: prod.name,
    price: prod.price,
    daily: prod.daily,
    profit: prod.profit,
    days: prod.days,
    image: prod.image || getPlanImage(prod.name)
  });
  
  user.history.unshift({
    type: `Purchase: ${prod.name}`,
    amount: -prod.price,
    date: new Date().toLocaleDateString(),
    status: 'PENDING_PAYMENT',
    planIndex: planIndex
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  showToast(`Purchase submitted! Please deposit Br ${prod.price} to activate your ${prod.name} plan.`);
  setTimeout(() => {
    openRechargeScreen();
  }, 1500);
  renderAppView();
}

// Helper to check Ethiopia Local Time (UTC+3) Withdrawal Hours (09:00 AM - 05:00 PM)
function isWithinEthiopiaWithdrawalHours() {
  const now = new Date();
  // Ethiopian Local Time is East Africa Time (UTC+3)
  const utcHour = now.getUTCHours();
  const ethiopianHour = (utcHour + 3) % 24;

  // 09:00 AM (hour 9) to 05:00 PM (hour 17)
  const isAllowed = ethiopianHour >= 9 && ethiopianHour < 17;
  
  console.log(`Withdrawal time check: Ethiopia Hour = ${ethiopianHour}, Allowed = ${isAllowed} (09:00-17:00)`);
  
  return isAllowed;
}

// Daily Income Distribution System (24-hour intervals)
function processDailyIncomeDistribution() {
  if (!state.currentUser) return;
  
  const user = state.currentUser;
  const now = new Date();
  let totalDistributed = 0;
  
  if (!user.activePlans || user.activePlans.length === 0) {
    return;
  }
  
  user.activePlans.forEach((plan, index) => {
    if (!plan.activatedAt || !plan.lastIncomeDistribution) {
      // Initialize timestamps if missing
      plan.activatedAt = plan.activatedAt || now.toISOString();
      plan.lastIncomeDistribution = plan.lastIncomeDistribution || now.toISOString();
      return;
    }
    
    const lastDistribution = new Date(plan.lastIncomeDistribution);
    const hoursSinceLastDistribution = (now - lastDistribution) / (1000 * 60 * 60);
    
    // Check if 24 hours have passed
    if (hoursSinceLastDistribution >= 24) {
      const dailyIncome = parseNum(plan.daily);
      
      // Check if plan is still active (has days left)
      if (plan.daysLeft > 0) {
        user.balance += dailyIncome;
        user.accumulatedYield += dailyIncome;
        
        // Add to history
        user.history.unshift({
          type: `Daily Income (${plan.name})`,
          amount: dailyIncome,
          date: now.toLocaleDateString(),
          status: 'COMPLETED'
        });
        
        totalDistributed += dailyIncome;
        
        // Update last distribution timestamp
        plan.lastIncomeDistribution = now.toISOString();
        
        // Decrement days left
        plan.daysLeft -= 1;
        
        console.log(`Distributed daily income Br ${dailyIncome.toFixed(2)} for ${plan.name}. Days left: ${plan.daysLeft}`);
        
        // Check if plan has expired
        if (plan.daysLeft <= 0) {
          plan.daysLeft = 0;
          user.history.unshift({
            type: `Plan Expired (${plan.name})`,
            amount: 0,
            date: now.toLocaleDateString(),
            status: 'COMPLETED'
          });
          console.log(`Plan ${plan.name} has expired after ${plan.days} days.`);
        }
      }
    }
  });
  
  if (totalDistributed > 0) {
    // Recalculate total income from history
    recalculateTotalIncome(user);
    
    state.registeredUsers[user.mobile] = user;
    state.save();
    showToast(`🎉 Daily income of Br ${totalDistributed.toFixed(2)} has been added to your balance!`);
  }
}

// Recalculate total income from user history
function recalculateTotalIncome(user) {
  if (!user || !user.history) return;
  
  let totalIncome = 0;
  
  user.history.forEach(item => {
    // Sum all positive amounts (deposits, daily income, commissions)
    if (item.amount > 0 && (
      item.type.includes('Daily Income') ||
      item.type.includes('Commission') ||
      item.type.includes('Deposit') ||
      item.type.includes('Yield')
    )) {
      totalIncome += item.amount;
    }
  });
  
  user.accumulatedYield = totalIncome;
  console.log(`Recalculated total income for user ${user.mobile}: Br ${totalIncome.toFixed(2)}`);
}

// Initialize daily income check on app load and set up periodic checks
function initializeDailyIncomeSystem() {
  // Run immediately on load
  processDailyIncomeDistribution();
  
  // Check every hour (in case user keeps app open)
  setInterval(() => {
    processDailyIncomeDistribution();
  }, 60 * 60 * 1000); // Every hour
}

// Render Dedicated Withdraw Screen (Matching Reference Functionality & Features)
function openWithdrawModal() {
  if (!state.currentUser) {
    showToast('Please log in to request a withdrawal!', true);
    switchTab('auth');
    return;
  }
  openSubpage('withdraw');
}

function renderWithdrawView() {
  if (!state.currentUser) return;
  const user = state.currentUser;

  const balEl = document.getElementById('withdrawBalanceVal');
  if (balEl) balEl.innerText = `Br ${user.balance.toFixed(2)}`;

  const bd = user.bankDetails || {
    realName: 'Nobel',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000736684318'
  };

  const nameEl = document.getElementById('withdrawRealNameVal');
  const bankEl = document.getElementById('withdrawBankNameVal');
  const acEl = document.getElementById('withdrawAccountNumVal');

  if (nameEl) nameEl.innerText = bd.realName;
  if (bankEl) bankEl.innerText = bd.bankName;
  if (acEl) acEl.innerText = bd.accountNumber;

  updateWithdrawButtonText();

  // Live Withdrawal Hours Window Status Badge
  const hoursStatusEl = document.getElementById('withdrawHoursStatusBadge');
  if (hoursStatusEl) {
    const isOpen = isWithinEthiopiaWithdrawalHours();
    if (isOpen) {
      hoursStatusEl.className = 'withdraw-status-badge open';
      hoursStatusEl.innerHTML = `🟢 Withdrawal Window OPEN (09:00 AM – 05:00 PM EAT)`;
    } else {
      hoursStatusEl.className = 'withdraw-status-badge closed';
      hoursStatusEl.innerHTML = `🔴 Withdrawal Window CLOSED (09:00 AM – 05:00 PM EAT Only)`;
    }
  }
}

function updateWithdrawButtonText() {
  const input = document.getElementById('withdrawAmountInput');
  const btn = document.getElementById('btnSubmitWithdraw');
  if (!btn) return;

  const val = input ? parseFloat(input.value) || 0 : 0;
  btn.innerText = `Withdraw Br ${val > 0 ? val.toLocaleString() : '0'}`;
}

function submitWithdrawalScreen() {
  if (!state.currentUser) {
    showToast('Please log in first!', true);
    switchTab('auth');
    return;
  }

  // Strict Enforce Withdrawal Hours: 09:00 AM – 05:00 PM (Ethiopia local time)
  if (!isWithinEthiopiaWithdrawalHours()) {
    showToast('⚠️ Withdrawals are strictly allowed only during Withdrawal Hours: 09:00 AM – 05:00 PM (Ethiopia local time)!', true, 4500);
    return;
  }

  const user = state.currentUser;
  const input = document.getElementById('withdrawAmountInput');
  const amount = input ? parseFloat(input.value) : 0;

  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid withdrawal amount!', true);
    return;
  }

  if (amount < 200) {
    showToast('Minimum Withdrawal Amount is Br 200!', true);
    return;
  }

  // Calculate 15% fee (deducted from requested amount)
  const fee = amount * 0.15;
  const actualWithdrawal = amount - fee;

  if (amount > user.balance) {
    showToast(`Insufficient balance! Required: Br ${amount.toFixed(2)}. Available: Br ${user.balance.toFixed(2)}`, true);
    return;
  }

  const bd = user.bankDetails || {
    realName: 'Nobel',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000736684318'
  };

  const wId = `w_${Date.now()}`;
  const userPhone = user.mobile || user.fullMobile;

  // Push to Admin Withdrawals Queue in REAL-TIME!
  state.adminWithdrawals.unshift({
    id: wId,
    phone: userPhone,
    bank: bd.bankName,
    account: bd.accountNumber,
    requestedAmount: amount,
    fee: fee,
    actualWithdrawal: actualWithdrawal,
    status: 'Processing',
    createdAt: new Date().toISOString()
  });

  // Hold balance (requested amount) and add PENDING withdrawal to user history
  user.balance -= amount;
  user.history.unshift({
    id: wId,
    type: `Withdrawal (${bd.bankName})`,
    amount: -amount,
    fee: fee,
    actualWithdrawal: actualWithdrawal,
    date: new Date().toLocaleDateString(),
    status: 'PENDING'
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  if (input) input.value = '';
  updateWithdrawButtonText();
  renderWithdrawView();

  showToast(`✅ Withdrawal request of Br ${amount.toFixed(2)} submitted successfully!`);
}

function renderBindWalletView() {
  if (!state.currentUser) return;
  const bd = state.currentUser.bankDetails || {
    realName: 'Nobel',
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000736684318'
  };

  const nameIn = document.getElementById('bindRealNameInput');
  const bankIn = document.getElementById('bindBankInput');
  const acIn = document.getElementById('bindAcNumInput');

  if (nameIn) nameIn.value = bd.realName;
  if (bankIn) bankIn.value = bd.bankName;
  if (acIn) acIn.value = bd.accountNumber;

  // Update card display with all values
  const cardName = document.getElementById('bindWalletCardName');
  const cardBank = document.getElementById('bindWalletCardBank');
  const cardAccount = document.getElementById('bindWalletCardAccount');
  
  if (cardName) cardName.innerText = bd.realName;
  if (cardBank) cardBank.innerText = bd.bankName;
  if (cardAccount) cardAccount.innerText = bd.accountNumber;
}

// Profile Carousel Functions
let profileCarouselIndex = 0;
let profileCarouselInterval = null;

function updateProfileCarouselPosition() {
  const track = document.getElementById('profileCarouselTrack');
  const dots = document.querySelectorAll('#profileCarouselDots .carousel-dot');
  
  if (track) {
    track.style.transform = `translateX(-${profileCarouselIndex * 100}%)`;
  }
  
  if (dots) {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === profileCarouselIndex);
    });
  }
}

function goToProfileCarouselSlide(index) {
  profileCarouselIndex = index;
  updateProfileCarouselPosition();
  
  // Reset auto-advance timer
  if (profileCarouselInterval) clearInterval(profileCarouselInterval);
  profileCarouselInterval = setInterval(() => {
    profileCarouselIndex = (profileCarouselIndex + 1) % 3;
    updateProfileCarouselPosition();
  }, 5000);
}

// Start profile carousel auto-advance when profile page loads
function startProfileCarousel() {
  if (profileCarouselInterval) clearInterval(profileCarouselInterval);
  profileCarouselInterval = setInterval(() => {
    profileCarouselIndex = (profileCarouselIndex + 1) % 3;
    updateProfileCarouselPosition();
  }, 5000);
}

function saveBindWallet() {
  if (!state.currentUser) return;
  const nameIn = document.getElementById('bindRealNameInput');
  const bankIn = document.getElementById('bindBankInput');
  const acIn = document.getElementById('bindAcNumInput');

  const realName = nameIn ? nameIn.value.trim() : '';
  const bankName = bankIn ? bankIn.value.trim() : '';
  const accountNumber = acIn ? acIn.value.trim() : '';

  if (!realName || !bankName || !accountNumber) {
    showToast('Please fill in all bank details!', true);
    return;
  }

  state.currentUser.bankDetails = {
    realName,
    bankName,
    accountNumber
  };

  state.registeredUsers[state.currentUser.mobile] = state.currentUser;
  state.save();

  showToast('✅ Bank Card details bound successfully!');
  openSubpage('withdraw');
}

// Customer Support Telegram Link Handler (@shambavest1)
function openServiceModal() {
  window.open('https://t.me/shambavest1', '_blank');
}

// Telegram Official Channel Invite Link Handler
function openChannelLink() {
  window.open('https://t.me/+1QX2V18acUE5Y2I0', '_blank');
}

// Floating Treasure Bonus FAB Handler
function openTreasureModal() {
  if (!state.currentUser) {
    showToast('Please log in first to claim daily bonus!', true);
    return;
  }
  const bonus = 100.00;
  const user = state.currentUser;
  user.balance += bonus;
  user.history.unshift({
    type: 'Treasure Chest Reward',
    amount: bonus,
    date: new Date().toLocaleDateString(),
    status: 'COMPLETED'
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  showToast(`🎁 You opened the Treasure Chest and won Br ${bonus.toFixed(2)} Bonus!`);
  renderAppView();
}

// Share View Rendering & Dynamic Unique Link Handlers
function renderShareView() {
  let code = 'f513800e';
  if (state.currentUser) {
    if (!state.currentUser.inviteCode && !state.currentUser.referralCode) {
      state.currentUser.inviteCode = generateUniqueCodeForPhone(state.currentUser.mobile || 'user');
      state.currentUser.referralCode = state.currentUser.inviteCode;
      state.save();
    }
    code = state.currentUser.referralCode || state.currentUser.inviteCode || 'f513800e';
  }

  const baseOrigin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : 'https://shambavest.app';
  const shareLink = `${baseOrigin}/?ref=${code}`;

  const qrImg = document.getElementById('shareQrCodeImg');
  const linkInput = document.getElementById('shareLinkInput');
  const codeInput = document.getElementById('shareCodeInput');

  if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareLink)}`;
  if (linkInput) linkInput.value = shareLink;
  if (codeInput) codeInput.value = code;
}

// Universal Cross-Platform Clipboard Copy Handler
function copyText(text) {
  if (!text) return;
  const strText = text.toString().trim();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(strText).then(() => {
      showToast(`✅ Copied: ${strText}`);
    }).catch(() => {
      fallbackCopyText(strText);
    });
  } else {
    fallbackCopyText(strText);
  }
}

function fallbackCopyText(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    if (textArea.setSelectionRange) {
      textArea.setSelectionRange(0, 999999);
    }

    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    showToast(`✅ Copied: ${text}`);
  } catch (err) {
    showToast(`Copied: ${text}`);
  }
}

function copyUserShareLink() {
  const linkInput = document.getElementById('shareLinkInput');
  if (linkInput) {
    linkInput.select();
    copyText(linkInput.value || 'https://shambavest.app/?ref=f513800e');
  }
}

function copyUserShareCode() {
  const codeInput = document.getElementById('shareCodeInput');
  if (codeInput) {
    codeInput.select();
    copyText(codeInput.value || 'f513800e');
  }
}

// Team View State & Data Handler (Matching Reference Screenshot Features)
let currentTeamLevel = 1;

function switchTeamLevelTab(levelNum) {
  currentTeamLevel = levelNum;

  [1, 2, 3].forEach(lvl => {
    const btn = document.getElementById(`teamTabLv${lvl}`);
    if (btn) btn.classList.toggle('active', lvl === levelNum);
  });

  renderTeamView();
}

/* ==========================================================================
   LEVEL 1 (25%), LEVEL 2 (3%), LEVEL 3 (2%) COMMISSION CALCULATOR & DISTRIBUTOR
   ========================================================================== */
function distributeTeamCommissions(purchaserUser, amount, sourceDesc) {
  if (!purchaserUser || !amount || amount <= 0) return;

  const commissionRates = [
    { level: 1, rate: 0.25, percentText: '25%', referrerPhone: purchaserUser.level1Referrer },
    { level: 2, rate: 0.03, percentText: '3%', referrerPhone: purchaserUser.level2Referrer },
    { level: 3, rate: 0.02, percentText: '2%', referrerPhone: purchaserUser.level3Referrer }
  ];

  commissionRates.forEach(tier => {
    const refPhone = tier.referrerPhone;
    if (!refPhone) return;

    const commissionAmount = parseFloat((amount * tier.rate).toFixed(2));
    if (commissionAmount <= 0) return;

    // Find target referrer in state.registeredUsers
    let referrer = state.registeredUsers[refPhone];
    if (!referrer) {
      for (let k in state.registeredUsers) {
        if (k.includes(refPhone) || refPhone.includes(k)) {
          referrer = state.registeredUsers[k];
          break;
        }
      }
    }

    if (referrer) {
      referrer.balance = (referrer.balance || 0) + commissionAmount;
      referrer.totalTeamCommission = (referrer.totalTeamCommission || 0) + commissionAmount;

      if (!referrer.teamCommissionBreakdown) {
        referrer.teamCommissionBreakdown = { level1: 0, level2: 0, level3: 0 };
      }
      if (tier.level === 1) referrer.teamCommissionBreakdown.level1 += commissionAmount;
      if (tier.level === 2) referrer.teamCommissionBreakdown.level2 += commissionAmount;
      if (tier.level === 3) referrer.teamCommissionBreakdown.level3 += commissionAmount;

      if (!referrer.memberCommissions) referrer.memberCommissions = {};
      referrer.memberCommissions[purchaserUser.mobile] = (referrer.memberCommissions[purchaserUser.mobile] || 0) + commissionAmount;

      if (!referrer.history) referrer.history = [];
      referrer.history.unshift({
        id: 'COMM_' + Date.now() + '_' + tier.level,
        type: `Level ${tier.level} Commission (${tier.percentText})`,
        amount: commissionAmount,
        date: new Date().toLocaleString(),
        status: 'COMPLETED',
        desc: `Earned Br ${commissionAmount.toFixed(2)} (${tier.percentText}) from ${purchaserUser.mobile} ${sourceDesc}`
      });

      // Update admin user list record for referrer
      const adminRec = state.adminUsersList.find(u => u.phone === referrer.mobile);
      if (adminRec) {
        adminRec.rawBalance = referrer.balance;
        adminRec.balance = `${referrer.balance.toFixed(2)} ETB`;
      }

      // If referrer is current logged-in user, sync current session
      if (state.currentUser && (state.currentUser.mobile === referrer.mobile || state.currentUser.mobile === refPhone)) {
        state.currentUser.balance = referrer.balance;
        state.currentUser.totalTeamCommission = referrer.totalTeamCommission;
        state.currentUser.teamCommissionBreakdown = referrer.teamCommissionBreakdown;
        state.currentUser.memberCommissions = referrer.memberCommissions;
        state.currentUser.history = referrer.history;
      }

      showToast(`🎁 Level ${tier.level} (${tier.percentText}) Commission: Br ${commissionAmount.toFixed(2)} credited!`);
    }
  });

  state.save();
}

function renderTeamView() {
  const currentTab = currentTeamLevel || 1;
  const user = state.currentUser;

  let tabMembers = [];
  let totalRechargeAllLevels = 0;
  let totalTeamSizeAllLevels = 0;

  if (user) {
    for (let k in state.registeredUsers) {
      const u = state.registeredUsers[k];
      if (u.mobile === user.mobile) continue;

      const activePlansRecharge = (u.activePlans || []).reduce((sum, p) => sum + (p.price || 0), 0);
      const completedDepositsRecharge = (u.history || [])
        .filter(h => h && (h.status === 'COMPLETED' || h.status === 'Approved') && (h.type.includes('Deposit') || h.type.includes('Recharge') || h.type.includes('Purchase')))
        .reduce((sum, h) => sum + Math.abs(h.amount || 0), 0);
      const directTotalRecharge = u.totalRecharge || 0;

      const userRecharge = Math.max(activePlansRecharge, completedDepositsRecharge, directTotalRecharge);
      const userWithdraw = (u.history || []).filter(h => h && h.type && h.type.includes('Withdraw')).reduce((sum, h) => sum + Math.abs(h.amount || 0), 0);
      const joinDate = u.registeredAt ? u.registeredAt.replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16);
      const fullPhone = u.fullMobile || u.mobile;

      // Check if member belongs to Level 1, 2, or 3
      const isL1 = u.level1Referrer === user.mobile || (user.fullMobile && u.level1Referrer === user.fullMobile);
      const isL2 = u.level2Referrer === user.mobile || (user.fullMobile && u.level2Referrer === user.fullMobile);
      const isL3 = u.level3Referrer === user.mobile || (user.fullMobile && u.level3Referrer === user.fullMobile);

      if (isL1 || isL2 || isL3) {
        totalTeamSizeAllLevels++;
        totalRechargeAllLevels += userRecharge;
      }

      let matchesActiveTab = false;
      let tierRate = 0.25;
      if (currentTab === 1 && isL1) { matchesActiveTab = true; tierRate = 0.25; }
      if (currentTab === 2 && isL2) { matchesActiveTab = true; tierRate = 0.03; }
      if (currentTab === 3 && isL3) { matchesActiveTab = true; tierRate = 0.02; }

      if (matchesActiveTab) {
        const commFromMember = (user.memberCommissions && user.memberCommissions[u.mobile] !== undefined)
          ? user.memberCommissions[u.mobile]
          : (userRecharge * tierRate);
        tabMembers.push({
          phone: fullPhone,
          recharge: userRecharge,
          withdraw: userWithdraw,
          commission: commFromMember,
          time: joinDate
        });
      }
    }
  }

  const overallCommission = user ? (user.totalTeamCommission || 0) : 0;

  const rechargeEl = document.getElementById('teamRechargeVal');
  const sizeEl = document.getElementById('teamSizeVal');
  const commEl = document.getElementById('teamCommissionVal');
  const container = document.getElementById('teamMembersList');

  if (rechargeEl) rechargeEl.innerText = `Br ${totalRechargeAllLevels.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (sizeEl) sizeEl.innerText = totalTeamSizeAllLevels;
  if (commEl) commEl.innerText = `Br ${overallCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (container) {
    if (tabMembers.length === 0) {
      container.innerHTML = `
        <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 32px 20px; text-align: center; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <div style="width: 56px; height: 56px; margin: 0 auto 12px auto; background: var(--color-surface-subtle); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border);">
            <svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" style="stroke: var(--color-text-secondary);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div style="font-family: var(--font-family); font-size: 15px; font-weight: 700; color: var(--color-text-main); margin-bottom: 4px;">No Level ${currentTab} Team Members Yet</div>
          <div style="font-size: 12.5px; color: var(--color-text-secondary); max-width: 280px; margin: 0 auto; line-height: 1.5;">Share your unique link or code from the Share tab to invite friends and earn 25%, 3%, or 2% commissions!</div>
        </div>
      `;
    } else {
      container.innerHTML = tabMembers.map(member => `
        <div class="team-member-card" style="background: #FFFFFF; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div class="team-member-info-left" style="flex: 1;">
            <div class="team-member-phone" style="font-weight: 700; font-size: 15px; color: #0F172A; margin-bottom: 4px;">
              📱 Mobile: <span style="color: #10B981;">${member.phone}</span>
            </div>
            <div class="team-member-stats-row" style="font-size: 13px; color: #64748B; display: flex; gap: 14px; margin-bottom: 4px;">
              <div>Recharge: <strong style="color: #0F172A;">Br ${member.recharge.toFixed(2)}</strong></div>
              <div>Commission: <strong style="color: #F59E0B;">Br ${member.commission.toFixed(2)}</strong></div>
            </div>
            <div class="team-member-time" style="font-size: 11.5px; color: #94A3B8;">Time : ${member.time}</div>
          </div>
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">
            Level ${currentTab} (${currentTab === 1 ? '25%' : (currentTab === 2 ? '3%' : '2%')})
          </div>
        </div>
      `).join('');
    }
  }
}

/* ==========================================================================
   ADMIN PORTAL ENGINE (Matching Reference Screenshots 1-5)
   ========================================================================== */

function openAdminPortal() {
  console.log('Attempting to open admin portal...');
  console.log('Current admin password:', state.adminPassword);
  
  // Show custom password modal
  openModal('adminPasswordModal');
  
  // Clear previous input
  const passwordInput = document.getElementById('adminPasswordInput');
  if (passwordInput) {
    passwordInput.value = '';
    passwordInput.focus();
  }
}

function submitAdminPassword() {
  const passwordInput = document.getElementById('adminPasswordInput');
  const password = passwordInput ? passwordInput.value : '';
  
  console.log('Password entered:', password ? '***' : 'empty');
  
  if (!password) {
    showToast('Please enter a password!', true);
    return;
  }
  
  if (password !== state.adminPassword) {
    console.log('Password incorrect');
    showToast('Incorrect admin password!', true);
    passwordInput.value = '';
    return;
  }
  
  console.log('Password correct, opening admin portal');
  closeModal('adminPasswordModal');
  
  state.isAdminMode = true;
  
  // Hide normal bottom nav bar
  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) navBar.style.display = 'none';

  // Hide all user sections
  const views = [
    'authView', 'homeView', 'rechargeView', 'incomeView', 
    'teamView', 'shareView', 'profileView',
    'balanceDetailsView', 'rechargeRecordsView', 'withdrawalRecordsView',
    'personalInfoView', 'changeEmailView', 'messagesView', 'bindWalletView', 'changePasswordView',
    'noteView'
  ];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.style.display = 'none';
  });

  const adminView = document.getElementById('adminPortalView');
  if (adminView) adminView.style.display = 'flex';

  switchAdminTab(state.adminActiveTab || 'deposit');
}

function closeAdminPasswordModal() {
  closeModal('adminPasswordModal');
}

function exitAdminPortal() {
  state.isAdminMode = false;

  const adminView = document.getElementById('adminPortalView');
  if (adminView) adminView.style.display = 'none';

  // Restore normal bottom nav bar
  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) navBar.style.display = 'flex';

  switchTab('home');
}

function switchAdminTab(tabName) {
  state.adminActiveTab = tabName;
  
  // Update header title to match screenshots
  const headerTitle = document.getElementById('adminHeaderTitle');
  if (headerTitle) {
    if (tabName === 'deposit') headerTitle.innerText = 'Manage Dep...';
    else if (tabName === 'withdraw') headerTitle.innerText = 'Manage With...';
    else if (tabName === 'user') headerTitle.innerText = 'Manage User...';
    else if (tabName === 'vip') headerTitle.innerText = 'Manage VIP...';
    else headerTitle.innerText = 'Admin Dashboard';
  }

  // Update nav item active states
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.admintab === tabName);
  });

  // Toggle subview visibility
  const subviews = ['adminDashboardSubview', 'adminDepositSubview', 'adminWithdrawSubview', 'adminUserSubview', 'adminVipSubview'];
  subviews.forEach(sv => {
    const el = document.getElementById(sv);
    if (el) el.style.display = (sv === `admin${capitalizeFirstLetter(tabName)}Subview`) ? 'block' : 'none';
  });

  renderAdminPortal();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderAdminPortal() {
  if (state.adminActiveTab === 'dashboard') renderAdminDashboard();
  if (state.adminActiveTab === 'deposit') renderAdminDeposits();
  if (state.adminActiveTab === 'withdraw') renderAdminWithdrawals();
  if (state.adminActiveTab === 'user') renderAdminUsers();
  if (state.adminActiveTab === 'vip') renderAdminVip();
}

// 1. Render Admin Dashboard (Matching Screenshots 2 & 3 - Real-Time Dynamic Metrics)
function renderAdminDashboard() {
  const totMembers = document.getElementById('adminMetricTotalMembers');
  const actMembers = document.getElementById('adminMetricActiveMembers');
  const totDep = document.getElementById('adminMetricTotalDeposit');
  const procDep = document.getElementById('adminMetricProcessingDeposit');
  const totWith = document.getElementById('adminMetricTotalWithdraw');
  const procWith = document.getElementById('adminMetricProcessingWithdraw');

  const pendingDepsCount = state.adminDeposits.filter(d => d.status === 'Pending').length;
  const pendingWithsCount = state.adminWithdrawals.filter(w => w.status === 'Processing' || w.status === 'Pending').length;
  
  const approvedDepSum = state.adminDeposits
    .filter(d => d.status === 'Approved')
    .reduce((sum, d) => sum + (d.rawAmount || parseFloat(d.amount) || 0), 0);

  const approvedWithSum = state.adminWithdrawals
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + (w.amount || 0), 0);

  const totalUsersCount = Object.keys(state.registeredUsers).length;

  if (totMembers) totMembers.innerText = totalUsersCount || '0';
  if (actMembers) actMembers.innerText = Math.max(1, totalUsersCount) || '0';
  if (totDep) totDep.innerText = approvedDepSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (procDep) procDep.innerText = pendingDepsCount;
  if (totWith) totWith.innerText = approvedWithSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (procWith) procWith.innerText = pendingWithsCount;
  
  console.log('Dashboard stats updated from real Firebase data:', {
    totalUsers: totalUsersCount,
    totalDeposit: approvedDepSum,
    processingDeposit: pendingDepsCount,
    totalWithdraw: approvedWithSum,
    processingWithdraw: pendingWithsCount
  });
}

// 2. Render Pending Deposits (Matching Screenshot 1 & 2)
function renderAdminDeposits() {
  const tbody = document.getElementById('adminDepositTableBody');
  if (!tbody) return;

  if (!state.adminDeposits || state.adminDeposits.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748B; padding:20px;">No deposit requests found</td></tr>`;
    return;
  }

  tbody.innerHTML = state.adminDeposits.map(dep => `
    <tr>
      <td style="font-weight:700;">${dep.phone}</td>
      <td style="font-weight:700;">${dep.amount}</td>
      <td style="color:#94A3B8;">${dep.bank}</td>
      <td>
        <div class="admin-tx-detail-text">
          ${dep.txId}
          <button type="button" class="btn-copy-sm" title="Copy Transaction ID" onclick="copyAdminText('${escapeJsString(dep.txId)}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </td>
      <td>
        <span class="admin-badge ${getAdminStatusBadgeClass(dep.status)}">${dep.status}</span>
      </td>
      <td>
        <div class="admin-actions-cell">
          <button type="button" class="btn-admin-approve" onclick="approveDepositRequest('${dep.id}')">Approve</button>
          <button type="button" class="btn-admin-reject" onclick="rejectDepositRequest('${dep.id}')">Reject</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 3. Render Pending Withdrawals (Matching Screenshot 4)
function renderAdminWithdrawals() {
  const tbody = document.getElementById('adminWithdrawTableBody');
  if (!tbody) return;

  if (!state.adminWithdrawals || state.adminWithdrawals.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748B; padding:20px;">No withdrawal requests found</td></tr>`;
    return;
  }

  tbody.innerHTML = state.adminWithdrawals.map(w => `
    <tr>
      <td style="font-weight:700;">${w.phone || '909175504'}</td>
      <td style="font-weight:700;">${w.amount ? `${w.amount}.00 ETB` : '255.00 ETB'}</td>
      <td style="color:#94A3B8;">${w.bank}</td>
      <td>
        <span style="color:#38BDF8; font-weight:700;">${w.account}</span>
        <button type="button" class="btn-copy-sm" title="Copy Account Number" onclick="copyAdminText('${w.account}')">
          <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </td>
      <td>
        <span class="admin-badge ${getAdminStatusBadgeClass(w.status)}">${w.status}</span>
      </td>
      <td>
        <div class="admin-actions-cell">
          <button type="button" class="btn-admin-approve" onclick="approveWithdrawalRequest('${w.id}')">Approve</button>
          <button type="button" class="btn-admin-reject" onclick="rejectWithdrawalRequest('${w.id}')">Reject</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 4. Render Registered Users (Matching Screenshot 1)
function renderAdminUsers(filterQuery = '') {
  const tbody = document.getElementById('adminUserTableBody');
  if (!tbody) return;

  let usersList = state.adminUsersList;
  if (filterQuery) {
    usersList = usersList.filter(u => u.phone.includes(filterQuery));
  }

  if (!usersList || usersList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748B; padding:20px;">No matching users found</td></tr>`;
    return;
  }

  tbody.innerHTML = usersList.map(u => `
    <tr>
      <td style="font-weight:700;">${u.phone}</td>
      <td style="font-weight:700; color:#FBBF24;">${u.balance}</td>
      <td>
        <div style="font-size:12px; line-height:1.4;">
          <div style="color:#94A3B8;">Bank: <strong style="color:#FFFFFF;">${u.bank || 'N/A'}</strong></div>
          <div style="color:#94A3B8;">AC: <strong style="color:#10B981;">${u.ac || 'N/A'}</strong></div>
        </div>
      </td>
      <td style="color:#94A3B8; font-size:12px;">${u.joined}</td>
      <td>
        <div class="user-actions-row">
          <!-- 1. Login As User (Blue) -->
          <button type="button" class="btn-user-act btn-user-act-login" data-tooltip="Login as this user" onclick="adminLoginAsUser('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          </button>

          <!-- 1b. Edit Balance (Teal) -->
          <button type="button" class="btn-user-act btn-user-act-balance" data-tooltip="Set exact balance" onclick="adminEditUserBalance('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </button>
          
          <!-- 2. Gift Bonus (Purple) -->
          <button type="button" class="btn-user-act btn-user-act-bonus" data-tooltip="Add bonus to user" onclick="adminGiveUserBonus('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>
          </button>

          <!-- 3. Edit Income (Green) -->
          <button type="button" class="btn-user-act btn-user-act-edit" data-tooltip="Edit user total income" onclick="adminEditUserIncome('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>

          <!-- 4. Remove Products (Orange) -->
          <button type="button" class="btn-user-act btn-user-act-remove" data-tooltip="Remove user products" onclick="adminRemoveUserProducts('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>

          <!-- 5. Reset Password (Amber) -->
          <button type="button" class="btn-user-act btn-user-act-key" data-tooltip="Reset user password" onclick="adminResetUserPassword('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3"/></svg>
          </button>

          <!-- 6. Delete / Ban (Red) -->
          <button type="button" class="btn-user-act btn-user-act-delete" data-tooltip="Delete user account" onclick="adminDeleteUser('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchAdminUsers() {
  const query = document.getElementById('adminUserSearchInput').value.trim();
  renderAdminUsers(query);
}

// User Actions Handlers (Matching Screenshot 1)
function adminLoginAsUser(phone) {
  let user = state.registeredUsers[phone];
  if (!user) {
    // Create session for user
    user = {
      mobile: phone,
      fullMobile: `+251${phone}`,
      password: 'user123',
      inviteCode: '150bc0d8',
      balance: 200.00,
      accumulatedYield: 0.00,
      vipLevel: 'VIP 1',
      registeredAt: new Date().toISOString(),
      activePlans: [],
      history: []
    };
    state.registeredUsers[phone] = user;
  }
  state.currentUser = user;
  state.save();
  exitAdminPortal();
  showToast(`🔑 Logged in as user +251 ${phone}!`);
}

// =============================================
// ADMIN MODAL CONTROLLER (replaces all prompt/confirm)
// =============================================
let _adminActionCallback = null;
let _adminConfirmCallback = null;
let _vipEditIndex = null;

// Robust user lookup: tries direct key first, then searches by mobile property
function findRegisteredUser(phone) {
  // Direct key match (most common case)
  if (state.registeredUsers[phone]) return { key: phone, user: state.registeredUsers[phone] };
  // Fallback: search all users by mobile property
  for (const key in state.registeredUsers) {
    const u = state.registeredUsers[key];
    if (u.mobile === phone || u.fullMobile === phone || key.includes(phone) || (phone && phone.includes(key))) {
      return { key, user: u };
    }
  }
  return null;
}

function openAdminActionModal({ title, subtitle, currentLabel, currentValue, inputPrefix = 'Br', placeholder = 'Enter value', iconBg = '#0D9488', onConfirm }) {
  document.getElementById('adminActionModalTitle').innerText = title;
  document.getElementById('adminActionModalSubtitle').innerText = subtitle;
  document.getElementById('adminActionCurrentLabel').innerText = currentLabel;
  document.getElementById('adminActionCurrentValue').innerText = currentValue;
  document.getElementById('adminActionInputPrefix').innerText = inputPrefix;
  document.getElementById('adminActionInput').value = '';
  document.getElementById('adminActionInput').placeholder = placeholder;
  document.getElementById('adminActionError').style.display = 'none';
  document.getElementById('adminActionModalIcon').style.background = iconBg;
  _adminActionCallback = onConfirm;
  document.getElementById('adminActionModal').classList.add('show');
  setTimeout(() => document.getElementById('adminActionInput').focus(), 300);
}

function closeAdminActionModal() {
  document.getElementById('adminActionModal').classList.remove('show');
  _adminActionCallback = null;
}

function submitAdminAction() {
  const val = document.getElementById('adminActionInput').value.trim();
  const errEl = document.getElementById('adminActionError');
  if (!val) {
    errEl.innerText = '⚠ Please enter a value';
    errEl.style.display = 'block';
    return;
  }
  if (_adminActionCallback) {
    const result = _adminActionCallback(val);
    if (result === false) return; // callback returned false = validation failed
  }
  closeAdminActionModal();
}

function openAdminConfirmModal({ title, subtitle, message, confirmLabel = 'Confirm', onConfirm }) {
  document.getElementById('adminConfirmTitle').innerText = title;
  document.getElementById('adminConfirmSubtitle').innerText = subtitle;
  document.getElementById('adminConfirmMessage').innerText = message;
  document.getElementById('adminConfirmActionBtn').innerText = confirmLabel;
  _adminConfirmCallback = onConfirm;
  document.getElementById('adminConfirmModal').classList.add('show');
}

function closeAdminConfirmModal() {
  document.getElementById('adminConfirmModal').classList.remove('show');
  _adminConfirmCallback = null;
}

function submitAdminConfirm() {
  if (_adminConfirmCallback) _adminConfirmCallback();
  closeAdminConfirmModal();
}

// =============================================
// ADMIN USER ACTION FUNCTIONS (Modal-based)
// =============================================

function adminGiveUserBonus(phone) {
  const found = findRegisteredUser(phone);
  if (!found) { showToast('User not found!', true); return; }
  const { key, user } = found;
  const current = (user.balance || 0).toFixed(2);
  openAdminActionModal({
    title: 'Gift Bonus',
    subtitle: `User: +251 ${phone}`,
    currentLabel: 'Current Balance',
    currentValue: `Br ${current}`,
    inputPrefix: 'Br',
    placeholder: 'Enter bonus amount',
    iconBg: '#A855F7',
    onConfirm: (val) => {
      const bonus = parseFloat(val);
      if (isNaN(bonus) || bonus <= 0) {
        document.getElementById('adminActionError').innerText = '⚠ Enter a valid bonus amount > 0';
        document.getElementById('adminActionError').style.display = 'block';
        return false;
      }
      user.balance = (user.balance || 0) + bonus;
      const userItem = state.adminUsersList.find(u => u.phone === phone);
      if (userItem) { userItem.rawBalance = user.balance; userItem.balance = `Br ${user.balance.toFixed(2)}`; }
      if (state.currentUser && (state.currentUser.mobile === phone || state.currentUser.mobile === key)) state.currentUser.balance = user.balance;
      state.save();
      showToast(`🎁 Added Br ${bonus.toFixed(2)} bonus to user ${phone}!`);
      renderAdminUsers();
      if (typeof renderIncomeView === 'function') renderIncomeView();
    }
  });
}

// Edit User Balance — Admin sets exact balance
function adminEditUserBalance(phone) {
  const found = findRegisteredUser(phone);
  if (!found) { showToast('User not found!', true); return; }
  const { key, user } = found;
  const current = (user.balance || 0).toFixed(2);
  openAdminActionModal({
    title: 'Edit Balance',
    subtitle: `User: +251 ${phone}`,
    currentLabel: 'Current Balance',
    currentValue: `Br ${current}`,
    inputPrefix: 'Br',
    placeholder: 'Enter exact balance',
    iconBg: '#0D9488',
    onConfirm: (val) => {
      const newBal = parseFloat(val);
      if (isNaN(newBal) || newBal < 0) {
        document.getElementById('adminActionError').innerText = '⚠ Enter a valid amount ≥ 0';
        document.getElementById('adminActionError').style.display = 'block';
        return false;
      }
      user.balance = newBal;
      const userItem = state.adminUsersList.find(u => u.phone === phone);
      if (userItem) { userItem.rawBalance = newBal; userItem.balance = `Br ${newBal.toFixed(2)}`; }
      if (state.currentUser && (state.currentUser.mobile === phone || state.currentUser.mobile === key)) state.currentUser.balance = newBal;
      state.save();
      showToast(`✅ Balance for ${phone} set to Br ${newBal.toFixed(2)}!`);
      renderAdminUsers();
      if (typeof renderIncomeView === 'function') renderIncomeView();
    }
  });
}

function adminEditUserIncome(phone) {
  const found = findRegisteredUser(phone);
  if (!found) { showToast('User not found!', true); return; }
  const { key, user } = found;
  const current = (user.accumulatedYield || 0).toFixed(2);
  openAdminActionModal({
    title: 'Edit Total Income',
    subtitle: `User: +251 ${phone}`,
    currentLabel: 'Current Income',
    currentValue: `Br ${current}`,
    inputPrefix: 'Br',
    placeholder: 'Enter new total income',
    iconBg: '#059669',
    onConfirm: (val) => {
      const newIncome = parseFloat(val);
      if (isNaN(newIncome) || newIncome < 0) {
        document.getElementById('adminActionError').innerText = '⚠ Enter a valid amount ≥ 0';
        document.getElementById('adminActionError').style.display = 'block';
        return false;
      }
      user.accumulatedYield = newIncome;
      const userItem = state.adminUsersList.find(u => u.phone === phone);
      if (userItem) userItem.accumulatedYield = newIncome;
      if (state.currentUser && (state.currentUser.mobile === phone || state.currentUser.mobile === key)) state.currentUser.accumulatedYield = newIncome;
      state.save();
      showToast(`✅ Income for ${phone} updated to Br ${newIncome.toFixed(2)}!`);
      renderAdminUsers();
      if (typeof renderIncomeView === 'function') renderIncomeView();
    }
  });
}

function adminRemoveUserProducts(phone) {
  const found = findRegisteredUser(phone);
  if (!found) { showToast('User not found!', true); return; }
  const { key, user } = found;
  if (!user.activePlans || user.activePlans.length === 0) {
    showToast('User has no active products to remove.', true); return;
  }
  openAdminConfirmModal({
    title: 'Remove Products',
    subtitle: `User: +251 ${phone}`,
    message: `This user has ${user.activePlans.length} active plan(s): ${user.activePlans.map((p,i) => `${i+1}. ${p.name}`).join(', ')}. All plans will be removed.`,
    confirmLabel: 'Remove All',
    onConfirm: () => {
      user.activePlans = [];
      if (state.currentUser && (state.currentUser.mobile === phone || state.currentUser.mobile === key)) state.currentUser.activePlans = [];
      state.save();
      showToast(`✅ All products removed from user ${phone}!`);
      renderAdminUsers();
      if (typeof renderIncomeView === 'function') renderIncomeView();
    }
  });
}

function adminResetUserPassword(phone) {
  const found = findRegisteredUser(phone);
  openAdminActionModal({
    title: 'Reset Password',
    subtitle: `User: +251 ${phone}`,
    currentLabel: 'Action',
    currentValue: 'Set new password',
    inputPrefix: '🔑',
    placeholder: 'Enter new password',
    iconBg: '#D97706',
    onConfirm: (val) => {
      if (!val || val.length < 4) {
        document.getElementById('adminActionError').innerText = '⚠ Password must be at least 4 characters';
        document.getElementById('adminActionError').style.display = 'block';
        return false;
      }
      if (found) found.user.password = val;
      state.save();
      showToast(`🔑 Password for ${phone} reset successfully!`);
    }
  });
}

function adminDeleteUser(phone) {
  const found = findRegisteredUser(phone);
  openAdminConfirmModal({
    title: 'Delete User',
    subtitle: 'This cannot be undone',
    message: `Are you sure you want to permanently delete/ban user +251 ${phone}? All their data will be removed.`,
    confirmLabel: '🗑️ Delete',
    onConfirm: () => {
      state.adminUsersList = state.adminUsersList.filter(u => u.phone !== phone);
      if (found) delete state.registeredUsers[found.key];
      state.save();
      showToast(`🗑️ User ${phone} deleted successfully!`);
      renderAdminUsers();
    }
  });
}

function adminChangePassword() {
  // Show custom change password modal
  openModal('adminChangePasswordModal');
  
  // Clear previous inputs
  const currentInput = document.getElementById('currentPasswordInput');
  const newInput = document.getElementById('newPasswordInput');
  const confirmInput = document.getElementById('confirmPasswordInput');
  
  if (currentInput) currentInput.value = '';
  if (newInput) newInput.value = '';
  if (confirmInput) confirmInput.value = '';
  
  if (currentInput) currentInput.focus();
}

function submitAdminChangePassword() {
  const currentInput = document.getElementById('currentPasswordInput');
  const newInput = document.getElementById('newPasswordInput');
  const confirmInput = document.getElementById('confirmPasswordInput');
  
  const currentPassword = currentInput ? currentInput.value : '';
  const newPassword = newInput ? newInput.value : '';
  const confirmPassword = confirmInput ? confirmInput.value : '';
  
  if (!currentPassword) {
    showToast('Please enter current password!', true);
    return;
  }
  
  if (currentPassword !== state.adminPassword) {
    showToast('Incorrect current password!', true);
    currentInput.value = '';
    return;
  }
  
  if (!newPassword) {
    showToast('Please enter new password!', true);
    return;
  }
  
  if (newPassword.length < 4) {
    showToast('Password must be at least 4 characters!', true);
    return;
  }
  
  if (!confirmPassword) {
    showToast('Please confirm new password!', true);
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showToast('Passwords do not match!', true);
    newInput.value = '';
    confirmInput.value = '';
    return;
  }
  
  state.adminPassword = newPassword;
  state.save();
  closeModal('adminChangePasswordModal');
  showToast('✅ Admin password changed successfully!');
}

function closeAdminChangePasswordModal() {
  closeModal('adminChangePasswordModal');
}

// 5. Render VIP Investment Plans (Matching Screenshot 4)
function renderAdminVip() {
  const tbody = document.getElementById('adminVipTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.adminVipPlans.map((plan, index) => `
    <tr>
      <td style="font-weight:800; color:#FBBF24;">${plan.name}</td>
      <td style="font-weight:700;">${plan.price}</td>
      <td style="color:#10B981; font-weight:700;">${plan.daily}</td>
      <td style="color:#94A3B8;">${plan.duration || '160 Days'}</td>
      <td>
        <button type="button" class="btn-admin-approve" style="background:#F59E0B; color:#0F172A; margin-bottom: 4px;" onclick="editVipPlan(${index})">Edit</button>
        <button type="button" class="btn-admin-approve" style="background:${plan.status === 'active' ? '#EF4444' : '#10B981'}; color:#FFFFFF;" onclick="toggleVipStatus(${index})">Toggle</button>
      </td>
    </tr>
  `).join('');
}

function toggleVipStatus(index) {
  const plan = state.adminVipPlans[index];
  if (!plan) return;
  plan.status = plan.status === 'active' ? 'coming_soon' : 'active';
  state.save();
  showToast(`✅ ${plan.name} status changed to ${plan.status}!`);
  renderAdminVip();
  if (state.activeTab === 'home') renderVipButtons();
}

function editVipPlan(index) {
  const plan = state.adminVipPlans[index];
  if (!plan) return;
  _vipEditIndex = index;
  document.getElementById('vipEditModalTitle').innerText = `Edit ${plan.name}`;
  document.getElementById('vipEditModalSubtitle').innerText = 'Update price, daily income and duration';
  document.getElementById('vipEditPrice').value = plan.price || '';
  document.getElementById('vipEditDaily').value = plan.daily || '';
  document.getElementById('vipEditDuration').value = plan.duration || '160 Days';
  document.getElementById('adminVipEditModal').classList.add('show');
}

function submitVipPlanEdit() {
  const plan = state.adminVipPlans[_vipEditIndex];
  if (!plan) return;
  const price = document.getElementById('vipEditPrice').value.trim();
  const daily = document.getElementById('vipEditDaily').value.trim();
  const duration = document.getElementById('vipEditDuration').value.trim();
  if (!price || !daily || !duration) { showToast('Please fill all fields!', true); return; }
  plan.price = price;
  plan.daily = daily;
  plan.duration = duration;
  state.save();
  document.getElementById('adminVipEditModal').classList.remove('show');
  showToast(`✅ ${plan.name} updated successfully!`);
  renderAdminVip();
  renderVipButtons();
}

// Action Logic Handlers (Bi-directional Real-Time Linking)
function approveDepositRequest(depId) {
  const dep = state.adminDeposits.find(d => d.id === depId);
  if (!dep) return;

  dep.status = 'Approved';

  const creditAmt = dep.rawAmount || parseFloat(dep.amount) || 0;
  let targetUser = null;

  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (user.mobile.includes(dep.phone) || dep.phone.includes(user.mobile)) {
      user.balance += creditAmt;
      user.totalRecharge = (user.totalRecharge || 0) + creditAmt;
      const h = (user.history || []).find(item => item.id === depId || item.type.includes('Deposit'));
      if (h) h.status = 'COMPLETED';
      targetUser = user;
    }
  }

  if (state.currentUser && (state.currentUser.mobile.includes(dep.phone) || dep.phone.includes(state.currentUser.mobile))) {
    state.currentUser.balance += creditAmt;
    state.currentUser.totalRecharge = (state.currentUser.totalRecharge || 0) + creditAmt;
    targetUser = state.currentUser;
  }

  if (targetUser) {
    distributeTeamCommissions(targetUser, creditAmt, 'recharge deposit approval');
    
    // Recalculate total income after deposit
    recalculateTotalIncome(targetUser);
    
    // Check if this deposit was for a VIP product purchase
    // Look for a pending purchase in user's history that matches this deposit amount
    const pendingPurchase = (targetUser.history || []).find(h => 
      h.type.includes('Purchase') && 
      h.status === 'PENDING_PAYMENT' && 
      Math.abs(h.amount) === creditAmt
    );
    
    if (pendingPurchase) {
      // Activate the corresponding plan
      const planIndex = pendingPurchase.planIndex;
      if (planIndex !== undefined && targetUser.pendingPlans && targetUser.pendingPlans[planIndex]) {
        const plan = targetUser.pendingPlans[planIndex];
        
        // Add to active plans with timestamp for daily income tracking
        targetUser.activePlans.push({
          ...plan,
          activatedAt: new Date().toISOString(),
          lastIncomeDistribution: new Date().toISOString(),
          daysLeft: plan.days
        });
        
        // Remove from pending plans
        targetUser.pendingPlans.splice(planIndex, 1);
        
        // Update history status
        pendingPurchase.status = 'COMPLETED';
        pendingPurchase.date = new Date().toLocaleDateString();
        
        console.log(`Activated VIP plan: ${plan.name} for user ${targetUser.mobile}`);
      }
    }
  }

  state.save();
  console.log(`Deposit approved for ${dep.phone}, amount: ${creditAmt}, synced to Firebase`);
  showToast(`✅ Deposit for ${dep.phone} APPROVED! ETB ${creditAmt.toFixed(2)} credited.`);
  renderAdminDeposits();
  renderAdminDashboard();
  if (typeof renderIncomeView === 'function') renderIncomeView();
}

function rejectDepositRequest(depId) {
  const dep = state.adminDeposits.find(d => d.id === depId);
  if (!dep) return;

  dep.status = 'Rejected';

  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (user.mobile.includes(dep.phone) || dep.phone.includes(user.mobile)) {
      const h = (user.history || []).find(item => item.id === depId || item.type.includes('Deposit'));
      if (h) h.status = 'REJECTED';
      
      // Recalculate total income after deposit rejection
      recalculateTotalIncome(user);
    }
  }

  state.save();
  console.log(`Deposit rejected for ${dep.phone}, synced to Firebase`);
  showToast(`❌ Deposit for ${dep.phone} REJECTED.`);
  renderAdminDeposits();
  renderAdminDashboard();
}

function approveWithdrawalRequest(wId) {
  const w = state.adminWithdrawals.find(item => item.id === wId);
  if (!w) return;

  // Check user balance before approval
  let targetUser = null;
  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (w.phone && (user.mobile.includes(w.phone) || w.phone.includes(user.mobile))) {
      targetUser = user;
      break;
    }
  }

  if (!targetUser) {
    showToast('User not found! Cannot approve withdrawal.', true);
    return;
  }

  const requestedAmount = w.requestedAmount || w.amount;
  
  // Check if user has sufficient balance (balance was already deducted, but verify)
  if (targetUser.balance < 0) {
    showToast(`User has insufficient balance! Current: Br ${targetUser.balance.toFixed(2)}. Cannot approve.`, true);
    return;
  }

  w.status = 'Approved';

  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (w.phone && (user.mobile.includes(w.phone) || w.phone.includes(user.mobile))) {
      const h = (user.history || []).find(item => item.id === wId || item.type.includes('Withdrawal'));
      if (h) h.status = 'COMPLETED';
      
      // Recalculate total income after withdrawal approval
      recalculateTotalIncome(user);
    }
  }

  state.save();
  console.log(`Withdrawal approved for ${w.phone}, requested: Br ${requestedAmount}, fee: Br ${w.fee || (requestedAmount * 0.15).toFixed(2)}, actual: Br ${w.actualWithdrawal || (requestedAmount - (requestedAmount * 0.15)).toFixed(2)}, synced to Firebase`);
  showToast(`✅ Withdrawal for ${w.bank} (${w.account}) APPROVED! Requested: Br ${requestedAmount}, Fee: Br ${w.fee || (requestedAmount * 0.15).toFixed(2)}, Actual: Br ${w.actualWithdrawal || (requestedAmount - (requestedAmount * 0.15)).toFixed(2)}`);
  renderAdminWithdrawals();
  renderAdminDashboard();
}

function rejectWithdrawalRequest(wId) {
  const w = state.adminWithdrawals.find(item => item.id === wId);
  if (!w) return;

  w.status = 'Rejected';

  // Refund the requested amount (full amount that was deducted)
  const refundAmt = w.requestedAmount || w.amount;

  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (w.phone && (user.mobile.includes(w.phone) || w.phone.includes(user.mobile))) {
      user.balance += refundAmt;
      const h = (user.history || []).find(item => item.id === wId || item.type.includes('Withdrawal'));
      if (h) h.status = 'REJECTED';
      
      // Recalculate total income after withdrawal rejection
      recalculateTotalIncome(user);
    }
  }

  if (state.currentUser && w.phone && (state.currentUser.mobile.includes(w.phone) || w.phone.includes(state.currentUser.mobile))) {
    state.currentUser.balance += refundAmt;
  }

  state.save();
  console.log(`Withdrawal rejected for ${w.phone}, amount: Br ${refundAmt.toFixed(2)} refunded, synced to Firebase`);
  showToast(`❌ Withdrawal for ${w.bank} (${w.account}) REJECTED. Balance Br ${refundAmt.toFixed(2)} refunded to user.`);
  renderAdminWithdrawals();
  renderAdminDashboard();
}

function getAdminStatusBadgeClass(status) {
  if (status === 'Approved') return 'admin-badge-approved';
  if (status === 'Rejected') return 'admin-badge-rejected';
  return 'admin-badge-pending';
}

function copyAdminText(text) {
  copyText(text);
}

function escapeJsString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
