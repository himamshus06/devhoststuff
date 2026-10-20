// js/app.js - Localization & Dynamic PWA Logic

let currentLang = 'kn'; // Default to Kannada
let myListings = [];   // Dynamic app state for published crafts

// Complete Pure Dictionaries with All Required Listing Fields
const i18nDict = {
  kn: {
    langBtnText: "English",
    welcomeMsg: "ನಮಸ್ಕಾರ, ಸ್ವಾಗತ!",
    welcomeSub: "ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುಗಳನ್ನು ಸುಲಭವಾಗಿ ಮಾರಾಟ ಮಾಡಿ",
    btnAddProduct: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    btnAddSub: "ಫೋಟೋ ಮತ್ತು ಧ್ವನಿ ವಿವರಣೆ ಮೂಲಕ",
    btnMyOrders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    btnOrdersSub: "ಬಂದಿರುವ ಆರ್ಡರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    btnMyShop: "ನನ್ನ ಅಂಗಡಿ",
    btnShopSub: "ನಿಮ್ಮ ವಸ್ತುಗಳ ಪಟ್ಟಿ ಮತ್ತು ಗಳಿಕೆ",
    back: "ಹಿಂದಕ್ಕೆ",
    addTitle: "ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    photoLabel: "ಉತ್ಪನ್ನದ ಫೋಟೋಗಳು",
    uploadPrompt: "ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಸ್ಪರ್ಶಿಸಿ",
    changePhoto: "❌ ಬದಲಾಯಿಸಿ",
    voiceSectionLabel: "ಧ್ವನಿ ಮೂಲಕ ವಿವರಣೆ ನೀಡಿ (Speech to Text)",
    descPlaceholder: "ಉತ್ಪನ್ನದ ವಿವರ, ವಸ್ತು, ಅಳತೆ ಕುರಿತು ಮಾತನಾಡಿ...",
    micBtn: "ಮಾತನಾಡಿ",
    listeningMsg: "🎙️ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    speechError: "⚠️ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ ಅಥವಾ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ.",
    aiGenerateBtn: "AI ಮೂಲಕ ವಿವರಗಳನ್ನು ಆಟೋಫಿಲ್ ಮಾಡಿ",
    aiAnalyzing: "⏳ AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    formHeader: "📝 ಉತ್ಪನ್ನ ವಿವರಗಳು",
    fieldTitle: "ಉತ್ಪನ್ನದ ಹೆಸರು (Product Name):",
    fieldStory: "ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ (Brief Description):",
    fieldPrice: "ಬೆಲೆ (Price in ₹):",
    fieldQuantity: "ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ (Quantity):",
    fieldMaterial: "ಬಳಸಿದ ವಸ್ತು (Material):",
    fieldDimensions: "ಅಳತೆಗಳು (Dimensions):",
    fieldWeight: "ಅಂದಾಜು ತೂಕ (Approx Weight):",
    fieldAddress: "ಮಾರಾಟಗಾರರ ವಿಳಾಸ (Seller Address):",
    addressPrivacyNote: "🔒 ವಹಿವಾಟು ವೇದಿಕೆಯ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ನಡೆಯುತ್ತದೆ.",
    publishBtn: "ಮಾರುಕಟ್ಟೆಗೆ ಹಾಕಿ",
    ordersTitle: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    noOrders: "ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಇನ್ನು ಬಂದಿಲ್ಲ",
    shopTitle: "ನನ್ನ ಅಂಗಡಿ",
    statActive: "ಸಕ್ರಿಯ ಉತ್ಪನ್ನಗಳು",
    statEarnings: "ಒಟ್ಟು ಗಳಿಕೆ",
    noProducts: "ಇನ್ನೂ ಯಾವುದೇ ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ",
    publishSuccess: "🎉 ಉತ್ಪನ್ನ ಯಶಸ್ವಿಯಾಗಿ ಮಾರುಕಟ್ಟೆಗೆ ಸೇರಿಸಲಾಗಿದೆ!",
    chooserHeader: "ನೀವು ಹೇಗೆ ಉತ್ಪನ್ನವನ್ನು ಪಟ್ಟಿ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
modeAiTitle: "AI ಧ್ವನಿ / ವಿವರಣೆ",
modeAiSub: "ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ (AI ಆಟೋಫಿಲ್)",
modeManualTitle: "ಹಂತ-ಹಂತದ ಮಾಂತ್ರಿಕ (Wizard)",
modeManualSub: "ಒಂದೊಂದೇ ವಿವರವಾಗಿ ನೀಡಿ",
btnNext: "ಮುಂದಕ್ಕೆ",
reviewHeader: "🤖 AI ಪರಿಶೀಲನಾ ಮಾಂತ್ರಿಕ"
  },
  en: {
    langBtnText: "ಕನ್ನಡ",
    welcomeMsg: "Welcome, Artisan!",
    welcomeSub: "Easily showcase & sell your coastal crafts",
    btnAddProduct: "Add Product",
    btnAddSub: "Via photo & voice input",
    btnMyOrders: "My Orders",
    btnOrdersSub: "Manage customer requests",
    btnMyShop: "My Shop",
    btnShopSub: "View active catalogue",
    back: "Back",
    addTitle: "Add New Product",
    photoLabel: "Product Pictures",
    uploadPrompt: "Tap to capture or upload photo",
    changePhoto: "❌ Change",
    voiceSectionLabel: "Speak Product Details (Speech to Text)",
    descPlaceholder: "Speak out your product details, material, dimensions...",
    micBtn: "Speak",
    listeningMsg: "🎙️ Listening... Speak now",
    speechError: "⚠️ Speech recognition unsupported or permission denied.",
    aiGenerateBtn: "Auto-fill Fields using AI Vision",
    aiAnalyzing: "⏳ AI Analyzing...",
    formHeader: "📝 Product Details",
    fieldTitle: "Product Name:",
    fieldStory: "Brief Description:",
    fieldPrice: "Price (₹):",
    fieldQuantity: "Quantity Available:",
    fieldMaterial: "Material:",
    fieldDimensions: "Dimensions:",
    fieldWeight: "Approx Weight:",
    fieldAddress: "Seller Address:",
    addressPrivacyNote: "🔒 All payments & delivery escrow are routed securely through our platform.",
    publishBtn: "Publish to Marketplace",
    ordersTitle: "My Orders",
    noOrders: "No orders received yet",
    shopTitle: "My Shop",
    statActive: "Active Listings",
    statEarnings: "Total Earnings",
    noProducts: "No products added to your shop yet",
    publishSuccess: "🎉 Product published successfully!",
    chooserHeader: "How would you like to list your product?",
modeAiTitle: "AI Voice / Description",
modeAiSub: "Speak or type paragraph (AI Auto-fill)",
modeManualTitle: "Step-by-Step Wizard",
modeManualSub: "Fill details across guided steps",
btnNext: "Next",
reviewHeader: "🤖 AI Review Wizard"
  }
};

// Initialization & Custom CSS Theme Properties Injection
document.addEventListener("DOMContentLoaded", () => {
  if (window.APP_CONFIG) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', window.APP_CONFIG.colors.primary);
    root.style.setProperty('--color-primary-hover', window.APP_CONFIG.colors.primaryHover);
    root.style.setProperty('--color-secondary', window.APP_CONFIG.colors.secondary);
    root.style.setProperty('--color-bg', window.APP_CONFIG.colors.background);
    root.style.setProperty('--color-surface', window.APP_CONFIG.colors.surface);
    root.style.setProperty('--color-text', window.APP_CONFIG.colors.textMain);
    root.style.setProperty('--font-main', window.APP_CONFIG.fonts.primaryFamily);
  }
  updateLanguageUI();
});

// Navigation & Screen Control
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

// Language Switching Engine
function toggleLanguage() {
  currentLang = currentLang === 'kn' ? 'en' : 'kn';
  updateLanguageUI();
}

function updateLanguageUI() {
  const texts = i18nDict[currentLang];

  if (window.APP_CONFIG) {
    document.getElementById("page-title").innerText = window.APP_CONFIG.appName[currentLang];
    document.getElementById("app-brand-name").innerText = window.APP_CONFIG.appName[currentLang];
    document.getElementById("app-tagline").innerText = window.APP_CONFIG.tagline[currentLang];
  }

  document.getElementById("lang-toggle-btn").innerText = texts.langBtnText;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) el.innerText = texts[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (texts[key]) el.placeholder = texts[key];
  });
}

// --- Web Speech API (Speech-To-Text Engine) ---
let recognition = null;
let isListening = false;

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  return rec;
}

function toggleSpeechRecognition() {
  if (!recognition) {
    recognition = initSpeechRecognition();
  }

  if (!recognition) {
    document.getElementById('speech-status').innerText = i18nDict[currentLang].speechError;
    return;
  }

  const micBtn = document.getElementById('mic-btn');
  const statusEl = document.getElementById('speech-status');
  const textarea = document.getElementById('artisan-voice-input');

  if (!isListening) {
    recognition.lang = currentLang === 'kn' ? 'kn-IN' : 'en-US';

    recognition.onstart = () => {
      isListening = true;
      if (micBtn) micBtn.classList.add('recording');
      if (statusEl) statusEl.innerText = i18nDict[currentLang].listeningMsg;
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      textarea.value = transcript;
    };

    recognition.onerror = (err) => {
      console.error("Speech Error:", err);
      if (statusEl) statusEl.innerText = i18nDict[currentLang].speechError;
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };

    recognition.start();
  } else {
    recognition.stop();
    stopListening();
  }
}

function stopListening() {
  isListening = false;
  const micBtn = document.getElementById('mic-btn');
  if (micBtn) micBtn.classList.remove('recording');
  const statusEl = document.getElementById('speech-status');
  if (statusEl) statusEl.innerText = '';
}

// Photo Handling
function triggerPhotoUpload() {
  document.getElementById('product-photo-input').click();
}

function handleImageSelected(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('image-preview').src = e.target.result;
      document.getElementById('image-preview-container').style.display = 'block';
      document.querySelector('.upload-box').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

function resetPhoto() {
  document.getElementById('product-photo-input').value = '';
  document.getElementById('image-preview-container').style.display = 'none';
  document.querySelector('.upload-box').style.display = 'flex';
}

// AI Auto-fill Action
function runAIVisionListing() {
  const btn = document.querySelector('.ai-action-btn');
  const userSpeechText = document.getElementById('artisan-voice-input').value;

  btn.innerText = i18nDict[currentLang].aiAnalyzing;

  setTimeout(() => {
    if (currentLang === 'kn') {
      document.getElementById('res-title').value = userSpeechText ? userSpeechText.slice(0, 25) : "ಕಾಸುತಿ ಎಂಬ್ರಾಯ್ಡರಿ ಸೀರೆ";
      document.getElementById('res-story').value = userSpeechText || "ಶುದ್ಧ ಹತ್ತಿ ದಾರದಿಂದ ತಯಾರಿಸಿದ ಸಾಂಪ್ರದಾಯಿಕ ಕಾಸುತಿ ಕರಕುಶಲ ವಸ್ತು.";
      document.getElementById('res-material').value = "ಹತ್ತಿ ದಾರ (Cotton Thread)";
      document.getElementById('res-dimensions').value = "6.3 ಮೀಟರ್";
      document.getElementById('res-weight').value = "500 ಗ್ರಾಂ";
      document.getElementById('res-price').value = "2500";
      document.getElementById('res-quantity').value = "2";
      document.getElementById('res-address').value = "ಕುಂದಾಪುರ, ಉಡುಪಿ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ - 576201";
    } else {
      document.getElementById('res-title').value = userSpeechText ? userSpeechText.slice(0, 25) : "Kasuti Embroidery Saree";
      document.getElementById('res-story').value = userSpeechText || "Authentic GI-tagged Kasuti hand-stitched craft from coastal Karnataka.";
      document.getElementById('res-material').value = "Pure Cotton Thread & Silk";
      document.getElementById('res-dimensions').value = "6.3 Meters";
      document.getElementById('res-weight').value = "500g";
      document.getElementById('res-price').value = "2500";
      document.getElementById('res-quantity').value = "2";
      document.getElementById('res-address').value = "Kundapura, Udupi Dist, Karnataka - 576201";
    }

    btn.innerText = i18nDict[currentLang].aiGenerateBtn;
  }, 1000);
}

// Publish Product Payload & Shop State Update
function publishProduct() {
  const productData = {
    name: document.getElementById('res-title').value,
    description: document.getElementById('res-story').value,
    price: document.getElementById('res-price').value,
    quantity: document.getElementById('res-quantity').value,
    material: document.getElementById('res-material').value,
    dimensions: document.getElementById('res-dimensions').value,
    weight: document.getElementById('res-weight').value,
    sellerAddress: document.getElementById('res-address').value,
    photoSrc: document.getElementById('image-preview').src || null
  };

  if (productData.name && productData.price) {
    myListings.push(productData);
    renderShopListings();
    alert(i18nDict[currentLang].publishSuccess);

    // Reset fields & navigate to shop
    resetPhoto();
    document.getElementById('artisan-voice-input').value = '';
    
    // Clear dynamic inputs
    document.getElementById('res-title').value = '';
    document.getElementById('res-story').value = '';
    document.getElementById('res-price').value = '';
    document.getElementById('res-quantity').value = '1';
    document.getElementById('res-material').value = '';
    document.getElementById('res-dimensions').value = '';
    document.getElementById('res-weight').value = '';
    document.getElementById('res-address').value = '';

    switchScreen('screen-shop');
  }
}

// Render Published Products in "My Shop"
function renderShopListings() {
  const container = document.getElementById('shop-products-list');
  const countEl = document.getElementById('stat-active-count');

  if (myListings.length > 0) {
    container.innerHTML = '';
    myListings.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'mini-product-card';
      card.innerHTML = `
        <span>🧶 ${item.name}</span>
        <span class="status-active">₹ ${item.price}</span>
      `;
      container.appendChild(card);
    });
    if (countEl) countEl.innerText = myListings.length;
  }
}

let activeListingMode = null; // 'manual' or 'ai'
let currentManualStep = 1;
const totalManualSteps = 3;

function selectListingMode(mode) {
  activeListingMode = mode;
  document.getElementById('listing-mode-chooser').style.display = 'none';

  if (mode === 'manual') {
    currentManualStep = 1;
    document.getElementById('manual-wizard-container').style.display = 'block';
    updateManualWizardSteps();
  } else {
    document.getElementById('ai-wizard-container').style.display = 'block';
    document.getElementById('ai-input-stage').style.display = 'block';
    document.getElementById('ai-review-stage').style.display = 'none';
  }
}

function handleBackAction() {
  const manualContainer = document.getElementById('manual-wizard-container');
  const aiContainer = document.getElementById('ai-wizard-container');

  if (manualContainer.style.display === 'block' || aiContainer.style.display === 'block') {
    manualContainer.style.display = 'none';
    aiContainer.style.display = 'none';
    document.getElementById('listing-mode-chooser').style.display = 'block';
    activeListingMode = null;
  } else {
    switchScreen('screen-home');
  }
}

// Manual Wizard Navigation
function changeWizardStep(direction) {
  if (direction === 1 && !validateCurrentManualStep()) return;
  
  currentManualStep += direction;
  if (currentManualStep > totalManualSteps) {
    publishManualProduct();
    return;
  }
  if (currentManualStep < 1) currentManualStep = 1;

  updateManualWizardSteps();
}

function updateManualWizardSteps() {
  document.querySelectorAll('.wizard-step').forEach(stepEl => {
    const stepNum = parseInt(stepEl.getAttribute('data-step'));
    stepEl.style.display = stepNum === currentManualStep ? 'block' : 'none';
  });

  const stepIndicator = document.getElementById('wizard-step-indicator');
  stepIndicator.innerText = currentLang === 'kn' ? `ಹಂತ ${currentManualStep} / ${totalManualSteps}` : `Step ${currentManualStep} of ${totalManualSteps}`;

  document.getElementById('wizard-prev-btn').style.display = currentManualStep > 1 ? 'inline-block' : 'none';
  document.getElementById('wizard-next-btn').innerText = currentManualStep === totalManualSteps ? (i18nDict[currentLang].publishBtn || "Publish") : (i18nDict[currentLang].btnNext || "Next");
}

function validateCurrentManualStep() {
  if (currentManualStep === 1) {
    const title = document.getElementById('manual-title').value.trim();
    const price = document.getElementById('manual-price').value.trim();
    if (!title || !price) {
      alert(currentLang === 'kn' ? "ದಯವಿಟ್ಟು ಹೆಸರು ಮತ್ತು ಬೆಲೆ ನಮೂದಿಸಿ." : "Please enter product name and price.");
      return false;
    }
  }
  return true;
}

// Manual Photo Handler
function handleManualImageSelected(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('manual-img-preview').src = e.target.result;
      document.getElementById('manual-img-preview-container').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function handleAiImageSelected(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('ai-img-preview').src = e.target.result;
      document.getElementById('ai-img-preview-container').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// AI Paragraph / Speech to Wizard Review Stage
function processAiExtraction() {
  const btn = document.querySelector('.ai-action-btn');
  const userText = document.getElementById('artisan-voice-input').value;

  btn.innerText = i18nDict[currentLang].aiAnalyzing;

  setTimeout(() => {
    // Hide input stage, show wizard confirmation review stage
    document.getElementById('ai-input-stage').style.display = 'none';
    document.getElementById('ai-review-stage').style.display = 'block';

    if (currentLang === 'kn') {
      document.getElementById('res-title').value = userText ? userText.slice(0, 30) : "ಕಾಸುತಿ ಎಂಬ್ರಾಯ್ಡರಿ ಸೀರೆ";
      document.getElementById('res-story').value = userText || "ಶುದ್ಧ ಹತ್ತಿ ದಾರದಿಂದ ತಯಾರಿಸಿದ ಸಾಂಪ್ರದಾಯಿಕ ಕಾಸುತಿ ಕರಕುಶಲ ವಸ್ತು.";
      document.getElementById('res-material').value = "ಹತ್ತಿ ದಾರ (Cotton)";
      document.getElementById('res-dimensions').value = "6.3 ಮೀಟರ್";
      document.getElementById('res-weight').value = "500 ಗ್ರಾಂ";
      document.getElementById('res-price').value = "2500";
      document.getElementById('res-quantity').value = "1";
      document.getElementById('res-address').value = "ಕುಂದಾಪುರ, ಉಡುಪಿ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ - 576201";
    } else {
      document.getElementById('res-title').value = userText ? userText.slice(0, 30) : "Kasuti Embroidery Saree";
      document.getElementById('res-story').value = userText || "Authentic GI-tagged Kasuti hand-stitched craft from coastal Karnataka.";
      document.getElementById('res-material').value = "Pure Cotton";
      document.getElementById('res-dimensions').value = "6.3 Meters";
      document.getElementById('res-weight').value = "500g";
      document.getElementById('res-price').value = "2500";
      document.getElementById('res-quantity').value = "1";
      document.getElementById('res-address').value = "Kundapura, Udupi Dist, Karnataka - 576201";
    }

    btn.innerText = i18nDict[currentLang].aiGenerateBtn;
  }, 1000);
}

function publishManualProduct() {
  const productData = {
    name: document.getElementById('manual-title').value,
    description: document.getElementById('manual-story').value,
    price: document.getElementById('manual-price').value,
    quantity: document.getElementById('manual-quantity').value,
    material: document.getElementById('manual-material').value,
    dimensions: document.getElementById('manual-dimensions').value,
    weight: document.getElementById('manual-weight').value,
    sellerAddress: document.getElementById('manual-address').value,
    photoSrc: document.getElementById('manual-img-preview').src || null
  };

  myListings.push(productData);
  renderShopListings();
  alert(i18nDict[currentLang].publishSuccess);
  resetAndGoToShop();
}

function publishProductFromAi() {
  const productData = {
    name: document.getElementById('res-title').value,
    description: document.getElementById('res-story').value,
    price: document.getElementById('res-price').value,
    quantity: document.getElementById('res-quantity').value,
    material: document.getElementById('res-material').value,
    dimensions: document.getElementById('res-dimensions').value,
    weight: document.getElementById('res-weight').value,
    sellerAddress: document.getElementById('res-address').value,
    photoSrc: document.getElementById('ai-img-preview').src || null
  };

  myListings.push(productData);
  renderShopListings();
  alert(i18nDict[currentLang].publishSuccess);
  resetAndGoToShop();
}

function resetAndGoToShop() {
  document.getElementById('manual-wizard-container').style.display = 'none';
  document.getElementById('ai-wizard-container').style.display = 'none';
  document.getElementById('listing-mode-chooser').style.display = 'block';
  activeListingMode = null;
  switchScreen('screen-shop');
}