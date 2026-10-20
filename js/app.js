// js/app.js - Complete PWA Logic & Handlers with LocalStorage Persistence

let currentLang = 'kn';

// --- LocalStorage Persistence Integration ---
const STORAGE_KEY = 'kalasetu_artisan_listings';

function loadListingsFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load listings from localStorage:", e);
    return [];
  }
}

function saveListingsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myListings));
  } catch (e) {
    console.error("Failed to save listings to localStorage:", e);
  }
}

let myListings = loadListingsFromStorage();
let activeListingMode = null; // 'manual' or 'ai'
let currentManualStep = 1;
const totalManualSteps = 3;

// Photo storage buffers (Max 5 photos each)
let manualPhotos = [];
let aiPhotos = [];
let pendingPublishData = null; // Buffer for preview modal

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
    photoLabel: "ಉತ್ಪನ್ನದ ಫೋಟೋಗಳು (ಗರಿಷ್ಠ 5)",
    photoGuide: "📸 ಗರಿಷ್ಠ 5 ಫೋಟೋಗಳು: ಮುಂಭಾಗ, ಮೇಲ್ಭಾಗ, ಪಕ್ಕದ ನೋಟ, ಇತರ 2 ಚಿತ್ರಗಳು",
    uploadPrompt: "ಫೋಟೋಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಸ್ಪರ್ಶಿಸಿ",
    voiceSectionLabel: "ಧ್ವನಿ ಮೂಲಕ ವಿವರಣೆ ನೀಡಿ (Speech to Text)",
    descPlaceholder: "ಉತ್ಪನ್ನದ ವಿವರ, ವಸ್ತು, ಅಳತೆ ಕುರಿತು ಮಾತನಾಡಿ...",
    micBtn: "ಮಾತನಾಡಿ",
    listeningMsg: "🎙️ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    speechError: "⚠️ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ.",
    aiGenerateBtn: "AI ಮೂಲಕ ವಿವರಗಳನ್ನು ಆಟೋಫಿಲ್ ಮಾಡಿ",
    aiAnalyzing: "⏳ AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    chooserHeader: "ನೀವು ಹೇಗೆ ಉತ್ಪನ್ನವನ್ನು ಪಟ್ಟಿ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
    modeAiTitle: "AI ಧ್ವನಿ / ವಿವರಣೆ",
    modeAiSub: "ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ (AI ಆಟೋಫಿಲ್)",
    modeManualTitle: "ಹಂತ-ಹಂತದ ಮಾಂತ್ರಿಕ (Wizard)",
    modeManualSub: "ಒಂದೊಂದೇ ವಿವರವಾಗಿ ನೀಡಿ",
    btnNext: "ಮುಂದಕ್ಕೆ",
    btnBack: "ಹಿಂದಕ್ಕೆ",
    reviewHeader: "🤖 AI ಪರಿಶೀಲನಾ ಮಾಂತ್ರಿಕ",
    fieldTitle: "ಉತ್ಪನ್ನದ ಹೆಸರು:",
    fieldStory: "ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ:",
    fieldPrice: "ಬೆಲೆ (₹):",
    fieldQuantity: "ಪ್ರಮಾಣ:",
    fieldMaterial: "ಬಳಸಿದ ವಸ್ತು:",
    fieldDimensions: "ಅಳತೆಗಳು:",
    fieldWeight: "ಅಂದಾಜು ತೂಕ:",
    fieldAddress: "ಮಾರಾಟಗಾರರ ವಿಳಾಸ:",
    addressPrivacyNote: "🔒 ವಹಿವಾಟು ವೇದಿಕೆಯ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ನಡೆಯುತ್ತದೆ.",
    publishBtn: "ಮಾರುಕಟ್ಟೆಗೆ ಹಾಕಿ",
    btnPreview: "ಪೂರ್ವವೀಕ್ಷಣೆ ಮಾಡಿ",
    previewTitle: "🔍 ಅಂತಿಮ ಪಟ್ಟಿ ಪರಿಶೀಲನೆ",
    btnEdit: "✏️ ಬದಲಾಯಿಸಿ",
    btnConfirmPublish: "🚀 ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಪ್ರಕಟಿಸಿ",
    ordersTitle: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    noOrders: "ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಇನ್ನು ಬಂದಿಲ್ಲ",
    shopTitle: "ನನ್ನ ಅಂಗಡಿ",
    statActive: "ಸಕ್ರಿಯ ಉತ್ಪನ್ನಗಳು",
    statEarnings: "ಒಟ್ಟು ಗಳಿಕೆ",
    noProducts: "ಇನ್ನೂ ಯಾವುದೇ ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ",
    publishSuccess: "🎉 ಉತ್ಪನ್ನ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!",
    editSave: "💾 ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    maxPhotoError: "⚠️ ಗರಿಷ್ಠ 5 ಫೋಟೋಗಳನ್ನು ಮಾತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು."
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
    photoLabel: "Product Photos (Max 5)",
    photoGuide: "📸 Max 5 photos: Front view, Top view, Side view, + 2 detail photos",
    uploadPrompt: "Tap to capture or upload photos",
    voiceSectionLabel: "Speak Product Details (Speech to Text)",
    descPlaceholder: "Speak out your product details, material, dimensions...",
    micBtn: "Speak",
    listeningMsg: "🎙️ Listening... Speak now",
    speechError: "⚠️ Speech recognition unavailable.",
    aiGenerateBtn: "Auto-fill Fields using AI Vision",
    aiAnalyzing: "⏳ AI Analyzing...",
    chooserHeader: "How would you like to list your product?",
    modeAiTitle: "AI Voice / Description",
    modeAiSub: "Speak or type paragraph (AI Auto-fill)",
    modeManualTitle: "Step-by-Step Wizard",
    modeManualSub: "Fill details across guided steps",
    btnNext: "Next",
    btnBack: "Back",
    reviewHeader: "🤖 AI Review Wizard",
    fieldTitle: "Product Name:",
    fieldStory: "Brief Description:",
    fieldPrice: "Price (₹):",
    fieldQuantity: "Quantity Available:",
    fieldMaterial: "Material:",
    fieldDimensions: "Dimensions:",
    fieldWeight: "Approx Weight:",
    fieldAddress: "Seller Address:",
    addressPrivacyNote: "🔒 All payments & delivery escrow routed securely.",
    publishBtn: "Publish to Marketplace",
    btnPreview: "Preview Details",
    previewTitle: "🔍 Final Listing Review",
    btnEdit: "✏️ Edit Details",
    btnConfirmPublish: "🚀 Confirm & Publish",
    ordersTitle: "My Orders",
    noOrders: "No orders received yet",
    shopTitle: "My Shop",
    statActive: "Active Listings",
    statEarnings: "Total Earnings",
    noProducts: "No products added to your shop yet",
    publishSuccess: "🎉 Product published successfully!",
    editSave: "💾 Save Changes",
    maxPhotoError: "⚠️ You can upload a maximum of 5 photos."
  }
};

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
  renderShopListings(); // Render stored items on startup
});

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

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

// Mode Selector
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

// Dynamic Photo Upload & Validation (Max 5 photos, Image format enforcement)
function triggerPhotoUpload() {
  let fileInput = activeListingMode === 'manual' ? document.getElementById('manual-photo-input') : document.getElementById('ai-photo-input');
  if (fileInput) fileInput.click();
}

function handlePhotoUpload(event, mode) {
  const files = Array.from(event.target.files);
  let targetBuffer = mode === 'manual' ? manualPhotos : aiPhotos;

  // Enforce image format & max 5 photos
  const validImageFiles = files.filter(f => f.type.startsWith('image/'));
  
  if (targetBuffer.length + validImageFiles.length > 5) {
    alert(i18nDict[currentLang].maxPhotoError);
  }

  validImageFiles.slice(0, 5 - targetBuffer.length).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      targetBuffer.push(e.target.result);
      renderGalleryPreviews(mode);
    };
    reader.readAsDataURL(file);
  });
}

function renderGalleryPreviews(mode) {
  let targetBuffer = mode === 'manual' ? manualPhotos : aiPhotos;
  let galleryContainer = document.getElementById(`${mode}-gallery-preview`);
  if (!galleryContainer) return;
  
  galleryContainer.innerHTML = '';

  targetBuffer.forEach((src, index) => {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'thumb-wrapper';
    imgWrapper.innerHTML = `
      <img src="${src}" alt="Photo ${index + 1}">
      <button type="button" class="thumb-remove" onclick="removePhoto(${index}, '${mode}')">×</button>
    `;
    galleryContainer.appendChild(imgWrapper);
  });
}

function removePhoto(index, mode) {
  if (mode === 'manual') {
    manualPhotos.splice(index, 1);
  } else {
    aiPhotos.splice(index, 1);
  }
  renderGalleryPreviews(mode);
}

// Manual Wizard Navigation
function changeWizardStep(direction) {
  if (direction === 1 && !validateCurrentManualStep()) return;

  currentManualStep += direction;
  if (currentManualStep > totalManualSteps) {
    openFinalPreview('manual');
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
  document.getElementById('wizard-next-btn').innerText = currentManualStep === totalManualSteps ? i18nDict[currentLang].btnPreview : i18nDict[currentLang].btnNext;
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

// AI Voice Processing
function processAiExtraction() {
  const btn = document.querySelector('.ai-action-btn');
  const userText = document.getElementById('artisan-voice-input').value;

  btn.innerText = i18nDict[currentLang].aiAnalyzing;

  setTimeout(() => {
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
      document.getElementById('res-address').value = "ಕುಂದಾಪುರ, ಉಡುಪಿ ಜಿಲ್ಲೆ - 576201";
    } else {
      document.getElementById('res-title').value = userText ? userText.slice(0, 30) : "Kasuti Embroidery Saree";
      document.getElementById('res-story').value = userText || "Authentic GI-tagged Kasuti hand-stitched craft from coastal Karnataka.";
      document.getElementById('res-material').value = "Pure Cotton";
      document.getElementById('res-dimensions').value = "6.3 Meters";
      document.getElementById('res-weight').value = "500g";
      document.getElementById('res-price').value = "2500";
      document.getElementById('res-quantity').value = "1";
      document.getElementById('res-address').value = "Kundapura, Udupi Dist - 576201";
    }

    btn.innerText = i18nDict[currentLang].aiGenerateBtn;
  }, 1000);
}

// Final Confirmation Preview Modal
// --- Lightbox Image Expand Logic ---
function openLightbox(src) {
  const modal = document.getElementById('image-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  if (modal && lightboxImg) {
    lightboxImg.src = src;
    modal.style.display = 'flex';
  }
}

function closeLightbox() {
  const modal = document.getElementById('image-lightbox-modal');
  if (modal) modal.style.display = 'none';
}

// --- Final Review Modal UI (Polished Grid & Cards) ---
function openFinalPreview(sourceMode) {
  if (sourceMode === 'manual') {
    pendingPublishData = {
      name: document.getElementById('manual-title').value,
      description: document.getElementById('manual-story').value,
      price: document.getElementById('manual-price').value,
      quantity: document.getElementById('manual-quantity').value,
      material: document.getElementById('manual-material').value,
      dimensions: document.getElementById('manual-dimensions').value,
      weight: document.getElementById('manual-weight').value,
      sellerAddress: document.getElementById('manual-address').value,
      photos: [...manualPhotos]
    };
  } else {
    pendingPublishData = {
      name: document.getElementById('res-title').value,
      description: document.getElementById('res-story').value,
      price: document.getElementById('res-price').value,
      quantity: document.getElementById('res-quantity').value,
      material: document.getElementById('res-material').value,
      dimensions: document.getElementById('res-dimensions').value,
      weight: document.getElementById('res-weight').value,
      sellerAddress: document.getElementById('res-address').value,
      photos: [...aiPhotos]
    };
  }

  // Render Image Thumbnails with Uniform 1:1 Aspect Ratio & Click-to-Expand
  const galleryEl = document.getElementById('preview-photos-gallery');
  if (pendingPublishData.photos && pendingPublishData.photos.length > 0) {
    galleryEl.innerHTML = pendingPublishData.photos.map((src, idx) => `
      <div class="preview-thumb-box" onclick="openLightbox('${src}')" title="Click to view full size">
        <img src="${src}" alt="Photo ${idx + 1}">
        <span class="zoom-badge">🔍</span>
      </div>
    `).join('');
  } else {
    galleryEl.innerHTML = `<div class="no-photo-badge">📷 No photos uploaded</div>`;
  }

  // Render High-Quality Card Structure
  const detailsEl = document.getElementById('preview-details-list');
  detailsEl.innerHTML = `
    <!-- Main Title & Price Header Card -->
    <div class="review-header-card">
      <h3 class="review-prod-title">${pendingPublishData.name || 'Untitled Craft'}</h3>
      <div class="review-price-tag">₹ ${pendingPublishData.price || '0'} <span class="qty-badge">Qty: ${pendingPublishData.quantity || 1}</span></div>
    </div>

    <!-- Specifications Grid -->
    <div class="review-specs-grid">
      <div class="spec-tile">
        <span class="spec-label">${i18nDict[currentLang].fieldMaterial || 'Material'}</span>
        <strong class="spec-value">${pendingPublishData.material || 'N/A'}</strong>
      </div>
      <div class="spec-tile">
        <span class="spec-label">${i18nDict[currentLang].fieldDimensions || 'Dimensions'}</span>
        <strong class="spec-value">${pendingPublishData.dimensions || 'N/A'}</strong>
      </div>
      <div class="spec-tile">
        <span class="spec-label">${i18nDict[currentLang].fieldWeight || 'Weight'}</span>
        <strong class="spec-value">${pendingPublishData.weight || 'N/A'}</strong>
      </div>
    </div>

    <!-- Description Block -->
    <div class="review-section-box">
      <span class="section-label">📜 ${i18nDict[currentLang].fieldStory || 'Brief Description'}</span>
      <p class="section-text">${pendingPublishData.description || 'No description provided.'}</p>
    </div>

    <!-- Address Block -->
    <div class="review-section-box">
      <span class="section-label">📍 ${i18nDict[currentLang].fieldAddress || 'Seller Address'}</span>
      <p class="section-text">${pendingPublishData.sellerAddress || 'Not specified'}</p>
      <small class="escrow-privacy-pill">🔒 Platform Escrow Delivery Enabled</small>
    </div>
  `;

  document.getElementById('preview-modal').style.display = 'flex';
}

function closePreviewModal() {
  document.getElementById('preview-modal').style.display = 'none';
}

function confirmAndPublish() {
  if (pendingPublishData) {
    myListings.push({ ...pendingPublishData, id: Date.now() });
    
    // Save state to LocalStorage
    saveListingsToStorage();

    renderShopListings();
    alert(i18nDict[currentLang].publishSuccess);
    closePreviewModal();

    // Reset Buffers & Gallery Previews
    manualPhotos = [];
    aiPhotos = [];
    renderGalleryPreviews('manual');
    renderGalleryPreviews('ai');

    document.getElementById('manual-wizard-container').style.display = 'none';
    document.getElementById('ai-wizard-container').style.display = 'none';
    document.getElementById('listing-mode-chooser').style.display = 'block';
    activeListingMode = null;

    switchScreen('screen-shop');
  }
}

// My Shop Expandable Product Cards & Edit Support
function renderShopListings() {
  const container = document.getElementById('shop-products-list');
  const countEl = document.getElementById('stat-active-count');

  if (!container) return;

  if (myListings.length > 0) {
    container.innerHTML = '';
    myListings.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'shop-expandable-card';
      card.innerHTML = `
        <div class="card-summary" onclick="toggleShopCardDetails(${index})">
          <div class="summary-left">
            <span class="product-icon">🧶</span>
            <strong>${item.name}</strong>
          </div>
          <span class="status-active">₹ ${item.price} ▾</span>
        </div>

        <div id="shop-card-detail-${index}" class="card-details-expanded" style="display:none;">
          <div class="detail-gallery">
            ${(item.photos || []).map(p => `<img src="${p}">`).join('')}
          </div>
          <div class="edit-fields-group">
            <label>${i18nDict[currentLang].fieldTitle}</label>
            <input type="text" id="edit-title-${index}" value="${item.name}">
            
            <label>${i18nDict[currentLang].fieldPrice}</label>
            <input type="number" id="edit-price-${index}" value="${item.price}">

            <label>${i18nDict[currentLang].fieldMaterial}</label>
            <input type="text" id="edit-material-${index}" value="${item.material || ''}">

            <label>${i18nDict[currentLang].fieldStory}</label>
            <textarea id="edit-desc-${index}" rows="2">${item.description || ''}</textarea>

            <button type="button" class="publish-btn" style="margin-top:0.75rem;" onclick="saveShopItemEdits(${index})">
              ${i18nDict[currentLang].editSave}
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
    if (countEl) countEl.innerText = myListings.length;
  } else {
    container.innerHTML = `<div id="no-products-msg" class="empty-state"><p data-i18n="noProducts">${i18nDict[currentLang].noProducts}</p></div>`;
    if (countEl) countEl.innerText = 0;
  }
}

function toggleShopCardDetails(index) {
  const detailEl = document.getElementById(`shop-card-detail-${index}`);
  if (detailEl) {
    detailEl.style.display = detailEl.style.display === 'none' ? 'block' : 'none';
  }
}

function saveShopItemEdits(index) {
  myListings[index].name = document.getElementById(`edit-title-${index}`).value;
  myListings[index].price = document.getElementById(`edit-price-${index}`).value;
  myListings[index].material = document.getElementById(`edit-material-${index}`).value;
  myListings[index].description = document.getElementById(`edit-desc-${index}`).value;

  // Sync edits to LocalStorage
  saveListingsToStorage();

  renderShopListings();
  alert(currentLang === 'kn' ? "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!" : "Changes saved successfully!");
}