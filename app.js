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

// Global State Handler
class AppState {
  constructor() {
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

    const savedDeposits = JSON.parse(localStorage.getItem('twiga_admin_deposits') || 'null');
    this.adminDeposits = savedDeposits || [
      { id: 'dep_1', phone: '251949799890', amount: '5,000.00 ETB', rawAmount: 5000, bank: 'CBE', txId: 'Dear Wondayehu Daniel Mignane You successfully transferred ETB5000.00 from account 1*******0141 to account 1*******1897 (Abush Solomon Tareke). Service charge of ETB 1.00 and VAT(15%) of ETB0.15 and Disaster Recovery(5%) of 0.05 with total ETB5001.20 .Your current balance is ETB52,832.29. Thanks for Banking with CBE. https://mreciept.cbe.com.et/v2-cXGjqfBgbLzf491Hn for feedback: https://forms.gle/kGNGQpG3mQCCk3iD6', status: 'Pending' },
      { id: 'dep_2', phone: '32994030', amount: '700.00 ETB', rawAmount: 700, bank: 'CBE', txId: 'FT262244HZTR', status: 'Pending' },
      { id: 'dep_3', phone: '05969651', amount: '700.00 ETB', rawAmount: 700, bank: 'CBE', txId: 'FT2624J97HV', status: 'Pending' },
      { id: 'dep_4', phone: '76668956', amount: '700.00 ETB', rawAmount: 700, bank: 'CBE', txId: '1000729928872', status: 'Pending' },
      { id: 'dep_5', phone: '6990603', amount: '700.00 ETB', rawAmount: 700, bank: 'CBE', txId: 'Dear Temesgen Tedila Gonchile You have received ETB 255.00 from account 1*******1897 (Abush Solomon Tareke) to your account 1*******9086. Your current balance is ETB12,728.27. Thanks for Banking with CBE. https://mreciept.cbe.com.et/v2-cXJoxXbQX28g2dHI for feedback: https://forms.gle/kGNGQpG3mQCCk3iD6', status: 'Rejected' }
    ];

    const savedWithdrawals = JSON.parse(localStorage.getItem('twiga_admin_withdrawals') || 'null');
    this.adminWithdrawals = savedWithdrawals || [
      { id: 'w_1', phone: '909175504', bank: 'Telebirr', account: '0909175504', amount: 255, status: 'Processing' },
      { id: 'w_2', phone: '0983878498', bank: 'CBE', account: '1000681781707', amount: 255, status: 'Processing' },
      { id: 'w_3', phone: '941414141', bank: 'CBE', account: '1000406593677', amount: 1105, status: 'Processing' },
      { id: 'w_4', phone: '910789349', bank: 'CBE', account: '1000454061498', amount: 1360, status: 'Processing' },
      { id: 'w_5', phone: '911460732', bank: 'CBE', account: '1000127361488', amount: 255, status: 'Processing' },
      { id: 'w_6', phone: '944331234', bank: 'CBE', account: '1000640843466', amount: 2210, status: 'Processing' },
      { id: 'w_7', phone: '910591628', bank: 'CBE', account: '910591628', amount: 255, status: 'Processing' },
      { id: 'w_8', phone: '964120641', bank: 'CBE', account: '1000582586717', amount: 425, status: 'Processing' },
      { id: 'w_9', phone: '910897605', bank: 'Telebirr', account: '0910897605', amount: 425, status: 'Processing' },
      { id: 'w_10', phone: '943211234', bank: 'CBE', account: '1000742780302', amount: 680, status: 'Processing' },
      { id: 'w_11', phone: '989370042', bank: 'Telebirr', account: '0918977673', amount: 1700, status: 'Processing' },
      { id: 'w_12', phone: '954321234', bank: 'CBE', account: '1000566833127', amount: 3060, status: 'Processing' },
      { id: 'w_13', phone: '964235432', bank: 'CBE', account: '1000620894978', amount: 1785, status: 'Processing' }
    ];

    const savedAdminUsers = JSON.parse(localStorage.getItem('twiga_admin_users_list') || 'null');
    this.adminUsersList = savedAdminUsers || [
      { phone: '251940834', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-14 02:23:30' },
      { phone: '2515100022', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-14 01:45:54' },
      { phone: '251647596', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-14 01:22:10' },
      { phone: '251078971', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-14 00:05:13' },
      { phone: '2513947110', balance: '210.00 ETB', rawBalance: 210, role: 'User', joined: '2026-08-13 23:56:39' },
      { phone: '251205264', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-13 23:28:25' },
      { phone: '251983355', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-13 17:18:36' },
      { phone: '251081147', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-13 15:51:56' },
      { phone: '251023354', balance: '200.00 ETB', rawBalance: 200, role: 'User', joined: '2026-08-13 13:16:50' }
    ];

    const savedVipPlans = JSON.parse(localStorage.getItem('twiga_admin_vip_plans') || 'null');
    this.adminVipPlans = savedVipPlans || [
      { name: 'VIP 1', price: '700.00 ETB', daily: '150.00 ETB', duration: '365 Days' },
      { name: 'VIP 2', price: '1,300.00 ETB', daily: '280.00 ETB', duration: '365 Days' },
      { name: 'VIP 3', price: '2,800.00 ETB', daily: '626.00 ETB', duration: '365 Days' },
      { name: 'VIP 4', price: '5,000.00 ETB', daily: '1,210.00 ETB', duration: '365 Days' },
      { name: 'VIP 5', price: '8,000.00 ETB', daily: '2,080.00 ETB', duration: '365 Days' },
      { name: 'VIP 6', price: '12,000.00 ETB', daily: '3,360.00 ETB', duration: '365 Days' },
      { name: 'VIP 7', price: '30,000.00 ETB', daily: '9,000.00 ETB', duration: '365 Days' },
      { name: 'VIP 8', price: '70,000.00 ETB', daily: '24,500.00 ETB', duration: '365 Days' },
      { name: 'VIP 9', price: '100,000.00 ETB', daily: '40,000.00 ETB', duration: '365 Days' },
      { name: 'VIP 10', price: '200,000.00 ETB', daily: '90,000.00 ETB', duration: '365 Days' }
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
  initHeroCarousel();
  checkAdminUrlTrigger();
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

// App Launch Splash Loading Screen Sequence with Controlled Loading Time
function runAppLoadingSequence(totalDurationMs = 3000) {
  const splash = document.getElementById('appLoadingSplash');
  const fill = document.getElementById('splashProgressFill');
  const percentText = document.getElementById('splashPercentText');
  const statusText = document.getElementById('splashStatusText');
  const ringProgress = document.getElementById('splashRingProgress');

  if (!splash) return;

  // Explicitly reset the splash screen state to handle any browser cache / soft reloads
  splash.classList.remove('fade-out');
  
  const circumference = 314; // 2 * PI * 50
  
  if (fill) fill.style.width = '0%';
  if (percentText) percentText.innerText = '0%';
  if (statusText) statusText.innerText = 'Loading portal... 0.0s';
  if (ringProgress) ringProgress.style.strokeDashoffset = circumference;

  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsedMs = Date.now() - startTime;
    let progressRatio = elapsedMs / totalDurationMs;

    if (progressRatio >= 1) {
      progressRatio = 1;
      clearInterval(interval);

      updateProgressDisplay(100, (totalDurationMs / 1000).toFixed(1));

      setTimeout(() => {
        splash.classList.add('fade-out');
      }, 400);
    } else {
      const currentPercent = Math.floor(progressRatio * 100);
      const elapsedSec = (elapsedMs / 1000).toFixed(1);
      updateProgressDisplay(currentPercent, elapsedSec);
    }
  }, 30);

  function updateProgressDisplay(percent, seconds) {
    if (fill) fill.style.width = `${percent}%`;
    if (percentText) percentText.innerText = `${percent}%`;
    if (statusText) statusText.innerText = `Loading portal... ${seconds}s`;

    if (ringProgress) {
      const offset = circumference - (circumference * percent) / 100;
      ringProgress.style.strokeDashoffset = offset;
    }
  }
}

// Toast Manager
function showToast(message, isError = false, duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : ''}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
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

// Password Visibility Toggle
function togglePassVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
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

  // Registration Form Submission (Unique Phone Check & Auto-Fill Login)
  const regForm = document.getElementById('regForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mobileVal = document.getElementById('regMobileInput').value.trim();
      const passVal = document.getElementById('regPassInput').value;
      const confirmPassVal = document.getElementById('regConfirmPassInput').value;
      const inviteVal = document.getElementById('regInviteCodeInput').value.trim() || '150bc0d8';

      if (!mobileVal || !passVal || !confirmPassVal) {
        showToast('Please fill in all required registration fields!', true);
        return;
      }

      if (passVal !== confirmPassVal) {
        showToast('Passwords do not match! Please check again.', true);
        return;
      }

      // Check if user with phone number already exists
      const fullMobile = `+251${mobileVal}`;
      if (state.registeredUsers[mobileVal] || state.registeredUsers[fullMobile]) {
        showToast('Phone number already exists', true);
        return;
      }

      // Create new user object
      const newUser = {
        mobile: mobileVal,
        fullMobile: fullMobile,
        password: passVal,
        inviteCode: inviteVal,
        balance: 50.00, // Welcome registration bonus
        accumulatedYield: 0.00,
        vipLevel: 'VIP 1',
        registeredAt: new Date().toISOString(),
        activePlans: [],
        history: [
          { type: 'Registration Bonus', amount: 50.00, date: new Date().toLocaleDateString(), status: 'COMPLETED' }
        ]
      };

      // Save user to directory
      state.registeredUsers[mobileVal] = newUser;
      
      // REAL-TIME ADMIN SYNC: Push new user to Admin Users List!
      const joinedStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      state.adminUsersList.unshift({
        phone: mobileVal,
        balance: '50.00 ETB',
        rawBalance: 50.00,
        role: 'User',
        bank: 'N/A',
        ac: 'N/A',
        joined: joinedStr
      });

      // Save draft user for auto-fill on login form
      state.draftUser = { mobile: mobileVal, password: passVal };
      state.save();

      showToast('Registration successful! Phone number and password auto-filled below. Click Login to enter.');

      // Switch to Login Mode & Auto-fill inputs
      setAuthMode('login');
      checkAutoFillLogin();
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mobileVal = document.getElementById('loginMobileInput').value.trim();
      const passVal = document.getElementById('loginPassInput').value;

      if (!mobileVal || !passVal) {
        showToast('Please enter your phone number and password!', true);
        return;
      }

      // Check credentials in directory
      const existingUser = state.registeredUsers[mobileVal];
      if (!existingUser) {
        showToast('Account not found! Please register first.', true);
        return;
      }

      if (existingUser.password !== passVal) {
        showToast('Incorrect password! Please try again.', true);
        return;
      }

      // Log in user
      state.currentUser = existingUser;
      state.activeTab = 'home';
      state.save();

      renderAppView();
      showToast(`Welcome back, +251 ${mobileVal}!`);

      // Trigger Announcement Modal on login
      setTimeout(() => {
        openModal('announcementModal');
      }, 500);
    });
  }
}

// Switch Auth View Mode (Login vs Register)
function setAuthMode(mode) {
  state.authMode = mode;
  const btnAuthLogin = document.getElementById('btnAuthLogin');
  const btnAuthRegister = document.getElementById('btnAuthRegister');
  const regForm = document.getElementById('regForm');
  const loginForm = document.getElementById('loginForm');
  const heading = document.getElementById('authHeadingText');
  const subheading = document.getElementById('authSubheadingText');

  if (mode === 'login') {
    btnAuthLogin.classList.add('active');
    btnAuthRegister.classList.remove('active');
    if (regForm) regForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
    if (heading) heading.innerText = state.t('tabLogin');
    if (subheading) subheading.innerText = 'Log in with your registered phone number & password';
  } else {
    btnAuthRegister.classList.add('active');
    btnAuthLogin.classList.remove('active');
    if (regForm) regForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
    if (heading) heading.innerText = state.t('tabRegister');
    if (subheading) subheading.innerText = 'Join Twiga Soko Yetu to start earning daily returns';
  }
}

// Check Auto Fill Login Credentials
function checkAutoFillLogin() {
  const loginMobileInput = document.getElementById('loginMobileInput');
  const loginPassInput = document.getElementById('loginPassInput');

  if (state.draftUser) {
    if (loginMobileInput) loginMobileInput.value = state.draftUser.mobile;
    if (loginPassInput) loginPassInput.value = state.draftUser.password;
  }
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
    'authView', 'homeView', 'rechargeView', 'incomeView', 
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

  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.scrollTop = 0;

  if (state.activeTab === 'home') {
    updateCarouselPosition();
    if (!window.hasShownHomeModal) {
      setTimeout(() => openModal('homeAnnouncementModal'), 500);
      window.hasShownHomeModal = true;
    }
  }
  if (state.activeTab === 'recharge') renderRechargeView();
  if (state.activeTab === 'income') renderIncomeView();
  if (state.activeTab === 'profile') renderProfileView();
  if (state.activeTab === 'balanceDetails') renderBalanceDetailsView();
  if (state.activeTab === 'rechargeRecords') renderRechargeRecordsView();
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

  const btn = document.getElementById('btnDynamicPay');
  if (btn) {
    btn.innerText = `Pay Br ${amount.toLocaleString()}`;
  }
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
    document.getElementById('gwAccountName').innerText = 'Meto';
    document.getElementById('gwAccountNumber').innerText = '0959871054';
  } else {
    document.getElementById('gwLogoTelebirr').style.display = 'none';
    document.getElementById('gwLogoCBE').style.display = 'block';
    document.getElementById('gwChannelName').innerText = 'Commercial Bank of Ethiopia';
    document.getElementById('gwAccountName').innerText = 'Mezumre knife';
    document.getElementById('gwAccountNumber').innerText = '1000764507758';
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

function submitGatewayPayment() {
  const receipt = document.getElementById('gwReceiptInput').value;
  if (!receipt || receipt.trim() === '') {
    showToast('Please enter the payment receipt or SMS text.');
    return;
  }

  const depositAmount = state.rechargeAmount || 970;
  if (!state.currentUser) return;

  const user = state.currentUser;
  const userPhone = user.fullMobile || user.mobile;
  const channelName = document.getElementById('gwChannelName').innerText;
  const bankName = channelName.includes('Telebirr') ? 'Telebirr' : 'CBE';
  const depId = `dep_${Date.now()}`;

  // Push to Admin Deposits queue in REAL-TIME!
  const newDepRequest = {
    id: depId,
    phone: userPhone,
    amount: `${depositAmount.toFixed(2)} ETB`,
    rawAmount: depositAmount,
    bank: bankName,
    txId: receipt,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  state.adminDeposits.unshift(newDepRequest);

  // Add PENDING deposit to user history
  user.history.unshift({
    id: depId,
    type: `Deposit (${bankName})`,
    amount: depositAmount,
    date: new Date().toLocaleDateString(),
    status: 'PENDING'
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  showToast(`✅ Deposit of ETB ${depositAmount.toFixed(2)} submitted to Admin! Status: Pending Approval.`);
  
  // Clean up
  document.getElementById('gwReceiptInput').value = '';
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);
  
  // Show bottom nav bar again
  const navBar = document.querySelector('.bottom-nav-bar');
  if (navBar) navBar.style.display = 'flex';

  switchTab('home');
}

// Render Income View Details
function renderIncomeView() {
  if (!state.currentUser) return;
  const user = state.currentUser;

  const incomeBal = document.getElementById('incomeBalance');
  const yieldEl = document.getElementById('incomeAccumulatedYield');
  const container = document.getElementById('activeProductsContainer');

  if (incomeBal) incomeBal.innerText = `Br ${user.balance.toFixed(2)}`;
  if (yieldEl) yieldEl.innerText = `Br ${user.accumulatedYield.toFixed(2)}`;

  if (container) {
    if (!user.activePlans || user.activePlans.length === 0) {
      container.innerHTML = `
        <div class="balance-info-card" style="text-align: center; color: var(--color-text-secondary); font-size: 13px;">
          No active investment plans yet. Go to Home page and buy Plan A, B, C, D, E, or F!
        </div>
      `;
    } else {
      container.innerHTML = user.activePlans.map(plan => `
        <div class="produce-card-white" style="margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 style="font-family:var(--font-family); font-size:16px; font-weight:800; color:var(--color-text-main);">${plan.name}</h4>
              <p style="font-size:12px; color:var(--color-text-secondary);">Daily yield: <strong style="color:var(--color-accent);">Br ${plan.daily}</strong> | Days left: ${plan.daysLeft}</p>
            </div>
            <div style="text-align:right;">
              <span style="font-size:11px; background:var(--color-accent-subtle); color:var(--color-accent); padding:4px 8px; border-radius:6px; font-weight:700;">RUNNING</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
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
}

// Render Balance Details Subpage View (Image 3 Reference)
function renderBalanceDetailsView() {
  if (!state.currentUser) return;
  const user = state.currentUser;

  const balEl = document.getElementById('balanceDetailsVal');
  if (balEl) balEl.innerText = `Br ${user.balance.toFixed(2)}`;

  switchBalanceTab('my');
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
function openPurchaseModal(name, price, profit, daily, days) {
  state.selectedProduct = { name, price: parseFloat(price), profit, daily, days };
  
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

  user.balance -= prod.price;
  user.activePlans.push({
    name: prod.name,
    price: prod.price,
    daily: prod.daily,
    profit: prod.profit,
    daysLeft: prod.days
  });
  user.history.unshift({
    type: `Purchase: ${prod.name}`,
    amount: -prod.price,
    date: new Date().toLocaleDateString(),
    status: 'COMPLETED'
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  showToast(`Successfully purchased ${prod.name}! Check your Income tab.`);
  renderAppView();
}

// Withdrawal Modal Handler
function openWithdrawModal() {
  if (!state.currentUser) {
    showToast('Please login to request a withdrawal!', true);
    return;
  }
  const user = state.currentUser;

  const amountStr = prompt(`Available Balance: Br ${user.balance.toFixed(2)}\nEnter withdrawal amount (Br):`, '500');
  if (!amountStr || isNaN(amountStr) || parseFloat(amountStr) <= 0) return;

  const amount = parseFloat(amountStr);
  if (amount > user.balance) {
    showToast('Insufficient balance for withdrawal!', true);
    return;
  }

  const bankChoice = prompt('Enter Bank / Wallet Name (CBE or Telebirr):', 'CBE') || 'CBE';
  const acNum = prompt('Enter Bank / Telebirr Account Number:', '1000' + Math.floor(100000000 + Math.random() * 900000000)) || '1000123456789';

  const wId = `w_${Date.now()}`;
  const userPhone = user.mobile || user.fullMobile;

  // Push to Admin Withdrawals Queue in REAL-TIME!
  state.adminWithdrawals.unshift({
    id: wId,
    phone: userPhone,
    bank: bankChoice,
    account: acNum,
    amount: amount,
    status: 'Processing',
    createdAt: new Date().toISOString()
  });

  // Hold balance and add PENDING withdrawal to user history
  user.balance -= amount;
  user.history.unshift({
    id: wId,
    type: `Withdrawal (${bankChoice})`,
    amount: -amount,
    date: new Date().toLocaleDateString(),
    status: 'PENDING'
  });

  state.registeredUsers[user.mobile] = user;
  state.save();

  showToast(`Withdrawal of Br ${amount.toFixed(2)} submitted successfully!`);
  renderAppView();
}

// Customer Support Modal Handler
function openServiceModal() {
  alert('Customer Service Hotline:\nTelegram: @ShambaVestSupport\nAvailable 24/7 for deposit & withdrawal inquiries.');
}

// Telegram Channel Handler
function openChannelLink() {
  window.open('https://t.me/ShambaVestChannel', '_blank');
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

// Copy Code & Share Handlers
function copyRefCode() {
  const input = document.getElementById('teamRefCode');
  if (input) {
    input.select();
    document.execCommand('copy');
    showToast('Referral code copied: 150bc0d8');
  }
}

function copyShareLink() {
  showToast('Invitation link copied to clipboard!');
}

/* ==========================================================================
   ADMIN PORTAL ENGINE (Matching Reference Screenshots 1-5)
   ========================================================================== */

function openAdminPortal() {
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
    .reduce((sum, d) => sum + (d.rawAmount || parseFloat(d.amount) || 0), 40281200);

  const approvedWithSum = state.adminWithdrawals
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + (w.amount || 0), 32345);

  const totalUsersCount = Object.keys(state.registeredUsers).length + state.adminUsersList.length;

  if (totMembers) totMembers.innerText = totalUsersCount || '946';
  if (actMembers) actMembers.innerText = Math.max(1, totalUsersCount - 2) || '938';
  if (totDep) totDep.innerText = approvedDepSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (procDep) procDep.innerText = pendingDepsCount;
  if (totWith) totWith.innerText = approvedWithSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (procWith) procWith.innerText = pendingWithsCount;
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
          <button type="button" class="btn-user-act btn-user-act-login" title="Login As User" onclick="adminLoginAsUser('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          </button>
          
          <!-- 2. Gift Bonus (Purple) -->
          <button type="button" class="btn-user-act btn-user-act-bonus" title="Add Bonus" onclick="adminGiveUserBonus('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/></svg>
          </button>

          <!-- 3. Reset Password (Amber) -->
          <button type="button" class="btn-user-act btn-user-act-key" title="Reset Password" onclick="adminResetUserPassword('${u.phone}')">
            <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3"/></svg>
          </button>

          <!-- 4. Delete / Ban (Red) -->
          <button type="button" class="btn-user-act btn-user-act-delete" title="Delete User" onclick="adminDeleteUser('${u.phone}')">
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

function adminGiveUserBonus(phone) {
  const bonusStr = prompt(`Enter bonus amount to add for user ${phone} (ETB):`, '500');
  if (!bonusStr || isNaN(bonusStr) || parseFloat(bonusStr) <= 0) return;

  const bonus = parseFloat(bonusStr);
  const userItem = state.adminUsersList.find(u => u.phone === phone);
  if (userItem) {
    userItem.rawBalance += bonus;
    userItem.balance = `${userItem.rawBalance.toFixed(2)} ETB`;
  }
  if (state.registeredUsers[phone]) {
    state.registeredUsers[phone].balance += bonus;
  }
  state.save();
  showToast(`🎁 Added ETB ${bonus.toFixed(2)} bonus to user ${phone}!`);
  renderAdminUsers();
}

function adminResetUserPassword(phone) {
  const newPass = prompt(`Enter new password for user ${phone}:`, '123456');
  if (!newPass) return;

  if (state.registeredUsers[phone]) {
    state.registeredUsers[phone].password = newPass;
    state.save();
  }
  showToast(`🔑 Password for user ${phone} reset to "${newPass}"!`);
}

function adminDeleteUser(phone) {
  if (!confirm(`Are you sure you want to delete/ban user ${phone}?`)) return;

  state.adminUsersList = state.adminUsersList.filter(u => u.phone !== phone);
  delete state.registeredUsers[phone];
  state.save();
  showToast(`🗑️ User ${phone} deleted successfully!`);
  renderAdminUsers();
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
      <td style="color:#94A3B8;">${plan.duration}</td>
      <td>
        <button type="button" class="btn-admin-approve" style="background:#F59E0B; color:#0F172A;" onclick="editVipPlan(${index})">Edit</button>
      </td>
    </tr>
  `).join('');
}

function editVipPlan(index) {
  const plan = state.adminVipPlans[index];
  if (!plan) return;

  const newPrice = prompt(`Enter new Price for ${plan.name}:`, plan.price);
  if (!newPrice) return;
  const newDaily = prompt(`Enter new Daily Income for ${plan.name}:`, plan.daily);
  if (!newDaily) return;

  plan.price = newPrice;
  plan.daily = newDaily;
  state.save();
  showToast(`✅ ${plan.name} updated successfully!`);
  renderAdminVip();
}

// Action Logic Handlers (Bi-directional Real-Time Linking)
function approveDepositRequest(depId) {
  const dep = state.adminDeposits.find(d => d.id === depId);
  if (!dep) return;

  dep.status = 'Approved';
  const creditAmt = dep.rawAmount || parseFloat(dep.amount) || 700;

  // Credit target user in state.registeredUsers
  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (user.mobile.includes(dep.phone) || dep.phone.includes(user.mobile)) {
      user.balance += creditAmt;
      const h = (user.history || []).find(item => item.id === depId || item.type.includes('Deposit'));
      if (h) h.status = 'COMPLETED';
    }
  }

  if (state.currentUser && (state.currentUser.mobile.includes(dep.phone) || dep.phone.includes(state.currentUser.mobile))) {
    state.currentUser.balance += creditAmt;
  }

  state.save();
  showToast(`✅ Deposit for ${dep.phone} APPROVED! ETB ${creditAmt.toFixed(2)} credited.`);
  renderAdminDeposits();
  renderAdminDashboard();
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
    }
  }

  state.save();
  showToast(`❌ Deposit for ${dep.phone} REJECTED.`);
  renderAdminDeposits();
  renderAdminDashboard();
}

function approveWithdrawalRequest(wId) {
  const w = state.adminWithdrawals.find(item => item.id === wId);
  if (!w) return;

  w.status = 'Approved';

  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (w.phone && (user.mobile.includes(w.phone) || w.phone.includes(user.mobile))) {
      const h = (user.history || []).find(item => item.id === wId || item.type.includes('Withdrawal'));
      if (h) h.status = 'COMPLETED';
    }
  }

  state.save();
  showToast(`✅ Withdrawal for ${w.bank} (${w.account}) APPROVED!`);
  renderAdminWithdrawals();
  renderAdminDashboard();
}

function rejectWithdrawalRequest(wId) {
  const w = state.adminWithdrawals.find(item => item.id === wId);
  if (!w) return;

  w.status = 'Rejected';
  const refundAmt = w.amount || 500;

  // Refund user balance!
  for (let key in state.registeredUsers) {
    const user = state.registeredUsers[key];
    if (w.phone && (user.mobile.includes(w.phone) || w.phone.includes(user.mobile))) {
      user.balance += refundAmt;
      const h = (user.history || []).find(item => item.id === wId || item.type.includes('Withdrawal'));
      if (h) h.status = 'REJECTED';
    }
  }

  if (state.currentUser && w.phone && (state.currentUser.mobile.includes(w.phone) || w.phone.includes(state.currentUser.mobile))) {
    state.currentUser.balance += refundAmt;
  }

  state.save();
  showToast(`❌ Withdrawal for ${w.bank} (${w.account}) REJECTED. Balance ETB ${refundAmt.toFixed(2)} refunded to user.`);
  renderAdminWithdrawals();
  renderAdminDashboard();
}

function getAdminStatusBadgeClass(status) {
  if (status === 'Approved') return 'admin-badge-approved';
  if (status === 'Rejected') return 'admin-badge-rejected';
  return 'admin-badge-pending';
}

function copyAdminText(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast('Copied to clipboard!');
}

function escapeJsString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
