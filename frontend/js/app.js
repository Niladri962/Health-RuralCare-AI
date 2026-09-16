/* =========================================================
   RURALCARE AI
   Frontend application
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY = "ruralcare_conversations_v2";
const LANGUAGE_KEY = "ruralcare_language_v2";
const API_BASE_URL = (
    window.RURALCARE_API_URL
    || "http://127.0.0.1:8000"
).replace(/\/$/, "");


/* =========================================================
   STATE
========================================================= */

const state = {

    conversations: [],

    activeConversationId: null,

    language: "English",

    isLoading: false,

    isRecording: false,

    recognition: null

};


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    English: {

        newChat: "New consultation",
        recent: "Recent consultations",

        emergency: "Emergency?",
        emergencyText:
            "If someone is in immediate danger, call 112 or go to the nearest emergency department.",

        about: "About RuralCare",

        welcome:
            "How can we help you today?",

        description:
            "Describe your symptoms, health concern, or question in your own words.",

        noticeTitle:
            "Healthcare guidance, not a diagnosis",

        noticeText:
            "RuralCare helps understand your concern and identify how urgently you may need medical attention.",

        placeholder:
            "Describe your symptoms or health concern...",

        disclaimer:
            "RuralCare can make mistakes. For emergencies, contact local emergency services.",

        modalTitle:
            "About RuralCare",

        modalText:
            "RuralCare is an AI-assisted healthcare triage interface designed to help people describe health concerns and understand the appropriate level of care.",

        modalWarningTitle:
            "Important",

        modalWarningText:
            "This service does not replace a qualified healthcare professional and should not be used as a diagnosis.",

        done:
            "Done",

        emergencyModalTitle:
            "Possible emergency",

        emergencyModalText:
            "Some symptoms may require immediate medical attention. Please contact emergency services or go to the nearest emergency department.",

        emergencyServices:
            "Emergency services",

        understand:
            "I understand",

        emptyHistory:
            "Your previous consultations will appear here.",

        clearAll:
            "Clear all",

        clearTitle:
            "Clear all chats?",

        clearText:
            "This permanently deletes every saved consultation on this device. This action cannot be undone.",

        cancel:
            "Cancel",

        confirmClear:
            "Clear all chats"

    },


    Hindi: {

        newChat: "नई परामर्श",
        recent: "हाल की परामर्श",

        emergency: "आपातकाल?",
        emergencyText:
            "यदि किसी व्यक्ति को तत्काल खतरा है, तो 112 पर कॉल करें या निकटतम आपातकालीन विभाग में जाएँ।",

        about: "RuralCare के बारे में",

        welcome:
            "आज हम आपकी कैसे मदद कर सकते हैं?",

        description:
            "अपने लक्षण, स्वास्थ्य समस्या या प्रश्न को अपने शब्दों में लिखें।",

        noticeTitle:
            "स्वास्थ्य संबंधी मार्गदर्शन, निदान नहीं",

        noticeText:
            "RuralCare आपकी समस्या को समझने और यह जानने में सहायता करता है कि आपको कितनी जल्दी चिकित्सा सहायता की आवश्यकता हो सकती है।",

        placeholder:
            "अपने लक्षण या स्वास्थ्य समस्या के बारे में लिखें...",

        disclaimer:
            "RuralCare से गलती हो सकती है। आपातकाल में स्थानीय आपातकालीन सेवाओं से संपर्क करें।",

        modalTitle:
            "RuralCare के बारे में",

        modalText:
            "RuralCare एक AI-सहायता प्राप्त स्वास्थ्य ट्रायेज इंटरफेस है, जो स्वास्थ्य संबंधी समस्याओं को समझने और उचित चिकित्सा सहायता के स्तर को पहचानने में मदद करता है।",

        modalWarningTitle:
            "महत्वपूर्ण",

        modalWarningText:
            "यह सेवा योग्य स्वास्थ्य पेशेवर का विकल्प नहीं है और इसे निदान के लिए उपयोग नहीं किया जाना चाहिए।",

        done:
            "ठीक है",

        emergencyModalTitle:
            "संभावित आपातकाल",

        emergencyModalText:
            "कुछ लक्षणों के लिए तुरंत चिकित्सा सहायता की आवश्यकता हो सकती है। कृपया आपातकालीन सेवाओं से संपर्क करें या निकटतम आपातकालीन विभाग जाएँ।",

        emergencyServices:
            "आपातकालीन सेवा",

        understand:
            "मैं समझता/समझती हूँ",

        emptyHistory:
            "आपकी पिछली परामर्श यहाँ दिखाई देंगी।",

        clearAll:
            "सभी हटाएँ",

        clearTitle:
            "सभी चैट हटाएँ?",

        clearText:
            "इससे इस डिवाइस पर सहेजी गई सभी परामर्श स्थायी रूप से मिट जाएंगी। यह क्रिया वापस नहीं ली जा सकती।",

        cancel:
            "रद्द करें",

        confirmClear:
            "सभी चैट हटाएँ"

    },


    Marathi: {

        newChat: "नवीन सल्लामसलत",
        recent: "अलीकडील सल्लामसलत",

        emergency: "आपत्कालीन स्थिती?",
        emergencyText:
            "एखाद्या व्यक्तीला तात्काळ धोका असल्यास 112 वर कॉल करा किंवा जवळच्या आपत्कालीन विभागात जा.",

        about: "RuralCare बद्दल",

        welcome:
            "आज आम्ही तुमची कशी मदत करू शकतो?",

        description:
            "तुमची लक्षणे, आरोग्य समस्या किंवा प्रश्न तुमच्या स्वतःच्या शब्दांत लिहा.",

        noticeTitle:
            "आरोग्य मार्गदर्शन, निदान नाही",

        noticeText:
            "RuralCare तुमची समस्या समजून घेण्यास आणि वैद्यकीय मदतीची किती तातडीची गरज आहे हे ओळखण्यास मदत करते.",

        placeholder:
            "तुमची लक्षणे किंवा आरोग्य समस्या लिहा...",

        disclaimer:
            "RuralCare कडून चुका होऊ शकतात. आपत्कालीन परिस्थितीत स्थानिक आपत्कालीन सेवांशी संपर्क साधा.",

        modalTitle:
            "RuralCare बद्दल",

        modalText:
            "RuralCare हे AI-सहाय्यित आरोग्य ट्रायेज इंटरफेस आहे, जे आरोग्यविषयक समस्या समजून घेण्यास आणि योग्य वैद्यकीय मदत निवडण्यास मदत करते.",

        modalWarningTitle:
            "महत्त्वाचे",

        modalWarningText:
            "ही सेवा पात्र आरोग्य व्यावसायिकाचा पर्याय नाही आणि निदानासाठी वापरली जाऊ नये.",

        done:
            "ठीक आहे",

        emergencyModalTitle:
            "संभाव्य आपत्कालीन स्थिती",

        emergencyModalText:
            "काही लक्षणांसाठी त्वरित वैद्यकीय मदतीची आवश्यकता असू शकते. कृपया आपत्कालीन सेवांशी संपर्क साधा किंवा जवळच्या आपत्कालीन विभागात जा.",

        emergencyServices:
            "आपत्कालीन सेवा",

        understand:
            "मला समजले",

        emptyHistory:
            "तुमच्या मागील सल्लामसलती येथे दिसतील.",

        clearAll:
            "सर्व हटवा",

        clearTitle:
            "सर्व चॅट हटवायच्या?",

        clearText:
            "यामुळे या डिव्हाइसवर जतन केलेल्या सर्व सल्लामसलती कायमस्वरूपी हटवल्या जातील. ही कृती पूर्ववत करता येणार नाही.",

        cancel:
            "रद्द करा",

        confirmClear:
            "सर्व चॅट हटवा"

    },


    Punjabi: {

        newChat: "ਨਵੀਂ ਸਲਾਹ",
        recent: "ਹਾਲੀਆ ਸਲਾਹਾਂ",

        emergency: "ਐਮਰਜੈਂਸੀ?",
        emergencyText:
            "ਜੇ ਕਿਸੇ ਵਿਅਕਤੀ ਨੂੰ ਤੁਰੰਤ ਖਤਰਾ ਹੈ, ਤਾਂ 112 'ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ।",

        about: "RuralCare ਬਾਰੇ",

        welcome:
            "ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?",

        description:
            "ਆਪਣੇ ਲੱਛਣ, ਸਿਹਤ ਸਮੱਸਿਆ ਜਾਂ ਸਵਾਲ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖੋ।",

        noticeTitle:
            "ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ, ਨਿਦਾਨ ਨਹੀਂ",

        noticeText:
            "RuralCare ਤੁਹਾਡੀ ਸਮੱਸਿਆ ਨੂੰ ਸਮਝਣ ਅਤੇ ਇਹ ਪਛਾਣਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ ਕਿ ਤੁਹਾਨੂੰ ਕਿੰਨੀ ਜਲਦੀ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ।",

        placeholder:
            "ਆਪਣੇ ਲੱਛਣ ਜਾਂ ਸਿਹਤ ਸਮੱਸਿਆ ਲਿਖੋ...",

        disclaimer:
            "RuralCare ਤੋਂ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ। ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਸਥਾਨਕ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",

        modalTitle:
            "RuralCare ਬਾਰੇ",

        modalText:
            "RuralCare ਇੱਕ AI-ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਸਿਹਤ ਟ੍ਰਾਇਏਜ ਇੰਟਰਫੇਸ ਹੈ ਜੋ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਨੂੰ ਸਮਝਣ ਅਤੇ ਉਚਿਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਪਛਾਣ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",

        modalWarningTitle:
            "ਮਹੱਤਵਪੂਰਨ",

        modalWarningText:
            "ਇਹ ਸੇਵਾ ਯੋਗ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ ਅਤੇ ਇਸਨੂੰ ਨਿਦਾਨ ਲਈ ਵਰਤਿਆ ਨਹੀਂ ਜਾਣਾ ਚਾਹੀਦਾ।",

        done:
            "ਠੀਕ ਹੈ",

        emergencyModalTitle:
            "ਸੰਭਾਵਿਤ ਐਮਰਜੈਂਸੀ",

        emergencyModalText:
            "ਕੁਝ ਲੱਛਣਾਂ ਲਈ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ।",

        emergencyServices:
            "ਐਮਰਜੈਂਸੀ ਸੇਵਾ",

        understand:
            "ਮੈਂ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ",

        emptyHistory:
            "ਤੁਹਾਡੀਆਂ ਪਿਛਲੀਆਂ ਸਲਾਹਾਂ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੀਆਂ।",

        clearAll:
            "ਸਭ ਹਟਾਓ",

        clearTitle:
            "ਸਾਰੀਆਂ ਚੈਟਾਂ ਹਟਾਉਣੀਆਂ ਹਨ?",

        clearText:
            "ਇਸ ਨਾਲ ਇਸ ਡਿਵਾਈਸ 'ਤੇ ਸੰਭਾਲੀਆਂ ਸਾਰੀਆਂ ਸਲਾਹਾਂ ਸਦਾ ਲਈ ਮਿਟ ਜਾਣਗੀਆਂ। ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਹੋ ਸਕਦੀ।",

        cancel:
            "ਰੱਦ ਕਰੋ",

        confirmClear:
            "ਸਾਰੀਆਂ ਚੈਟਾਂ ਹਟਾਓ"

    },


    Bengali: {

        newChat: "নতুন পরামর্শ",
        recent: "সাম্প্রতিক পরামর্শ",

        emergency: "জরুরি অবস্থা?",
        emergencyText:
            "কেউ তাৎক্ষণিক বিপদের মধ্যে থাকলে 112 নম্বরে কল করুন অথবা নিকটস্থ জরুরি বিভাগে যান।",

        about: "RuralCare সম্পর্কে",

        welcome:
            "আজ আমরা কীভাবে আপনাকে সাহায্য করতে পারি?",

        description:
            "আপনার উপসর্গ, স্বাস্থ্য সমস্যা বা প্রশ্ন নিজের ভাষায় লিখুন।",

        noticeTitle:
            "স্বাস্থ্য সংক্রান্ত নির্দেশনা, রোগ নির্ণয় নয়",

        noticeText:
            "RuralCare আপনার সমস্যা বুঝতে এবং কত দ্রুত চিকিৎসা সহায়তার প্রয়োজন হতে পারে তা বুঝতে সাহায্য করে।",

        placeholder:
            "আপনার উপসর্গ বা স্বাস্থ্য সমস্যা লিখুন...",

        disclaimer:
            "RuralCare ভুল করতে পারে। জরুরি অবস্থায় স্থানীয় জরুরি পরিষেবার সঙ্গে যোগাযোগ করুন।",

        modalTitle:
            "RuralCare সম্পর্কে",

        modalText:
            "RuralCare একটি AI-সহায়িত স্বাস্থ্য ট্রায়াজ ইন্টারফেস, যা স্বাস্থ্য সমস্যা বুঝতে এবং উপযুক্ত চিকিৎসা সহায়তার স্তর চিহ্নিত করতে সাহায্য করে।",

        modalWarningTitle:
            "গুরুত্বপূর্ণ",

        modalWarningText:
            "এই পরিষেবা যোগ্য স্বাস্থ্য পেশাদারের বিকল্প নয় এবং রোগ নির্ণয়ের জন্য ব্যবহার করা উচিত নয়।",

        done:
            "ঠিক আছে",

        emergencyModalTitle:
            "সম্ভাব্য জরুরি অবস্থা",

        emergencyModalText:
            "কিছু উপসর্গের জন্য তাৎক্ষণিক চিকিৎসা সহায়তার প্রয়োজন হতে পারে। জরুরি পরিষেবায় যোগাযোগ করুন অথবা নিকটস্থ জরুরি বিভাগে যান।",

        emergencyServices:
            "জরুরি পরিষেবা",

        understand:
            "আমি বুঝেছি",

        emptyHistory:
            "আপনার আগের পরামর্শগুলি এখানে দেখা যাবে।",

        clearAll:
            "সব মুছুন",

        clearTitle:
            "সব চ্যাট মুছবেন?",

        clearText:
            "এতে এই ডিভাইসে সংরক্ষিত সমস্ত পরামর্শ স্থায়ীভাবে মুছে যাবে। এই কাজটি ফেরানো যাবে না।",

        cancel:
            "বাতিল",

        confirmClear:
            "সব চ্যাট মুছুন"

    }

};


/* =========================================================
   DOM
========================================================= */

const elements = {

    body: document.body,

    sidebar: document.getElementById("sidebar"),

    newChatButton:
        document.getElementById("newChatButton"),

    newChatText:
        document.getElementById("newChatText"),

    recentTitle:
        document.getElementById("recentTitle"),

    emergencyTitle:
        document.getElementById("emergencyTitle"),

    emergencyText:
        document.getElementById("emergencyText"),

    aboutButton:
        document.getElementById("aboutButton"),

    aboutText:
        document.getElementById("aboutText"),

    mobileMenuButton:
        document.getElementById("mobileMenuButton"),

    languageSelect:
        document.getElementById("languageSelect"),

    welcomeScreen:
        document.getElementById("welcomeScreen"),

    welcomeTitle:
        document.getElementById("welcomeTitle"),

    welcomeDescription:
        document.getElementById("welcomeDescription"),

    noticeTitle:
        document.getElementById("noticeTitle"),

    noticeText:
        document.getElementById("noticeText"),

    messages:
        document.getElementById("messages"),

    chatScrollArea:
        document.getElementById("chatScrollArea"),

    typingIndicator:
        document.getElementById("typingIndicator"),

    chatForm:
        document.getElementById("chatForm"),

    messageInput:
        document.getElementById("messageInput"),

    sendButton:
        document.getElementById("sendButton"),

    microphoneButton:
        document.getElementById("microphoneButton"),

    microphoneIcon:
        document.getElementById("microphoneIcon"),

    composerDisclaimer:
        document.getElementById("composerDisclaimer"),

    aboutModal:
        document.getElementById("aboutModal"),

    aboutModalClose:
        document.getElementById("aboutModalClose"),

    modalTitle:
        document.getElementById("modalTitle"),

    modalText:
        document.getElementById("modalText"),

    modalWarningTitle:
        document.getElementById("modalWarningTitle"),

    modalWarningText:
        document.getElementById("modalWarningText"),

    modalDoneButton:
        document.getElementById("modalDoneButton"),

    emergencyModal:
        document.getElementById("emergencyModal"),

    emergencyModalClose:
        document.getElementById("emergencyModalClose"),

    emergencyModalTitle:
        document.getElementById("emergencyModalTitle"),

    emergencyModalText:
        document.getElementById("emergencyModalText"),

    callText:
        document.getElementById("callText"),

    emergencyDoneButton:
        document.getElementById("emergencyDoneButton"),

    conversationHistory:
        document.getElementById("conversationHistory"),

    clearHistoryButton:
        document.getElementById("clearHistoryButton"),

    clearHistoryText:
        document.getElementById("clearHistoryText"),

    clearModal:
        document.getElementById("clearModal"),

    clearModalClose:
        document.getElementById("clearModalClose"),

    clearModalTitle:
        document.getElementById("clearModalTitle"),

    clearModalText:
        document.getElementById("clearModalText"),

    clearCancelButton:
        document.getElementById("clearCancelButton"),

    clearConfirmButton:
        document.getElementById("clearConfirmButton")

};


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", initialize);


function initialize() {

    loadState();

    bindEvents();

    applyLanguage();

    renderHistory();

    if (state.activeConversationId) {
        loadActiveConversation();
    } else {
        showWelcome();
    }

    resizeTextarea();

}


/* =========================================================
   STATE STORAGE
========================================================= */

function loadState() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {
                state.conversations = parsed;
            }

        }

    } catch (error) {

        console.error(
            "Unable to load saved conversations:",
            error
        );

        state.conversations = [];

    }


    try {

        const savedLanguage =
            localStorage.getItem(LANGUAGE_KEY);

        if (
            savedLanguage &&
            translations[savedLanguage]
        ) {
            state.language = savedLanguage;
        }

    } catch (error) {

        state.language = "English";

    }


    state.activeConversationId =
        null;

}


function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state.conversations)
        );

        localStorage.setItem(
            LANGUAGE_KEY,
            state.language
        );

    } catch (error) {

        console.error(
            "Unable to save RuralCare state:",
            error
        );

    }

}


/* =========================================================
   EVENT BINDINGS
========================================================= */

function bindEvents() {

    elements.newChatButton.addEventListener(
        "click",
        startNewConsultation
    );


    elements.languageSelect.addEventListener(
        "change",
        handleLanguageChange
    );


    elements.chatForm.addEventListener(
        "submit",
        handleSubmit
    );


    elements.messageInput.addEventListener(
        "input",
        resizeTextarea
    );


    elements.messageInput.addEventListener(
        "keydown",
        handleTextareaKeydown
    );


    elements.aboutButton.addEventListener(
        "click",
        openAboutModal
    );


    elements.aboutModalClose.addEventListener(
        "click",
        closeAboutModal
    );


    elements.modalDoneButton.addEventListener(
        "click",
        closeAboutModal
    );


    elements.emergencyModalClose.addEventListener(
        "click",
        closeEmergencyModal
    );


    elements.emergencyDoneButton.addEventListener(
        "click",
        closeEmergencyModal
    );


    elements.aboutModal.addEventListener(
        "click",
        handleModalBackgroundClick
    );


    elements.emergencyModal.addEventListener(
        "click",
        handleModalBackgroundClick
    );


    elements.clearHistoryButton.addEventListener(
        "click",
        openClearModal
    );


    elements.clearModalClose.addEventListener(
        "click",
        closeClearModal
    );


    elements.clearCancelButton.addEventListener(
        "click",
        closeClearModal
    );


    elements.clearConfirmButton.addEventListener(
        "click",
        clearAllConversations
    );


    elements.clearModal.addEventListener(
        "click",
        handleModalBackgroundClick
    );


    elements.mobileMenuButton.addEventListener(
        "click",
        toggleSidebar
    );


    elements.microphoneButton.addEventListener(
        "click",
        toggleVoiceInput
    );


    document.addEventListener(
        "keydown",
        handleGlobalKeyboard
    );

}


/* =========================================================
   LANGUAGE
========================================================= */

function handleLanguageChange(event) {

    const newLanguage =
        event.target.value;

    if (!translations[newLanguage]) {
        return;
    }

    /*
     * IMPORTANT:
     *
     * Changing language NEVER:
     * - creates a new conversation
     * - deletes messages
     * - clears state
     * - resets memory
     *
     * It only changes interface language and tells
     * backend which language should be used for future replies.
     */

    state.language = newLanguage;

    saveState();

    applyLanguage();

    /*
     * Existing messages are intentionally NOT rerendered
     * into another language.
     *
     * Their original content remains visible, preserving
     * the actual conversation history.
     */

}


function applyLanguage() {

    const t =
        translations[state.language];

    elements.languageSelect.value =
        state.language;


    elements.newChatText.textContent =
        t.newChat;


    elements.recentTitle.textContent =
        t.recent;


    elements.emergencyTitle.textContent =
        t.emergency;


    elements.emergencyText.textContent =
        t.emergencyText;


    elements.aboutText.textContent =
        t.about;


    elements.welcomeTitle.textContent =
        t.welcome;


    elements.welcomeDescription.textContent =
        t.description;


    elements.noticeTitle.textContent =
        t.noticeTitle;


    elements.noticeText.textContent =
        t.noticeText;


    elements.messageInput.placeholder =
        t.placeholder;


    elements.composerDisclaimer.textContent =
        t.disclaimer;


    elements.modalTitle.textContent =
        t.modalTitle;


    elements.modalText.textContent =
        t.modalText;


    elements.modalWarningTitle.textContent =
        t.modalWarningTitle;


    elements.modalWarningText.textContent =
        t.modalWarningText;


    elements.modalDoneButton.textContent =
        t.done;


    elements.emergencyModalTitle.textContent =
        t.emergencyModalTitle;


    elements.emergencyModalText.textContent =
        t.emergencyModalText;


    elements.callText.textContent =
        t.emergencyServices;


    elements.emergencyDoneButton.textContent =
        t.understand;


    elements.clearHistoryText.textContent =
        t.clearAll;


    elements.clearHistoryButton.title =
        t.clearTitle;


    elements.clearModalTitle.textContent =
        t.clearTitle;


    elements.clearModalText.textContent =
        t.clearText;


    elements.clearCancelButton.textContent =
        t.cancel;


    elements.clearConfirmButton.textContent =
        t.confirmClear;


    document.documentElement.lang =
        getHtmlLanguageCode(state.language);

}


function getHtmlLanguageCode(language) {

    const codes = {

        English: "en",
        Hindi: "hi",
        Marathi: "mr",
        Punjabi: "pa",
        Bengali: "bn"

    };

    return codes[language] || "en";

}


/* =========================================================
   NEW CONSULTATION
========================================================= */

function startNewConsultation() {

    /*
     * Do NOT delete old conversation.
     *
     * We simply create a fresh conversation object.
     */

    const conversation = {

        id: createId(),

        title:
            getNewConversationTitle(),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        language:
            state.language,

        messages: []

    };


    state.conversations.unshift(
        conversation
    );


    state.activeConversationId =
        conversation.id;


    saveState();

    renderHistory();

    renderConversation();

    closeSidebarOnMobile();

    elements.messageInput.focus();

}


function getNewConversationTitle() {

    const titles = {

        English: "New consultation",
        Hindi: "नई परामर्श",
        Marathi: "नवीन सल्लामसलत",
        Punjabi: "ਨਵੀਂ ਸਲਾਹ",
        Bengali: "নতুন পরামর্শ"

    };

    return titles[state.language] ||
        titles.English;

}


/* =========================================================
   CONVERSATION ID
========================================================= */

function createId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


/* =========================================================
   ACTIVE CONVERSATION
========================================================= */

function getActiveConversation() {

    return state.conversations.find(
        conversation =>
            conversation.id ===
            state.activeConversationId
    );

}


function loadActiveConversation() {

    const conversation =
        getActiveConversation();

    if (!conversation) {

        state.activeConversationId =
            null;

        showWelcome();

        return;

    }

    renderConversation();

}


function renderConversation() {

    const conversation =
        getActiveConversation();


    elements.messages.innerHTML = "";


    if (
        !conversation ||
        !Array.isArray(conversation.messages) ||
        conversation.messages.length === 0
    ) {

        showWelcome();

        return;

    }


    elements.welcomeScreen.classList.add(
        "hidden"
    );


    for (
        const message of conversation.messages
    ) {

        renderMessage(
            message.role,
            message.content,
            message.emergency === true
        );

    }


    scrollToBottom(false);

}


/* =========================================================
   WELCOME
========================================================= */

function showWelcome() {

    elements.messages.innerHTML = "";

    elements.welcomeScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

    const container =
        elements.conversationHistory;


    container.innerHTML = "";


    /*
     * "Clear all" is only meaningful when
     * something is actually stored.
     */

    elements.clearHistoryButton.classList.toggle(
        "hidden",
        state.conversations.length === 0
    );


    if (
        state.conversations.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-history";

        empty.textContent =
            translations[state.language]
                .emptyHistory;

        container.appendChild(empty);

        return;

    }


    /*
     * Show newest conversations first.
     */

    const sorted =
        [...state.conversations]
            .sort(
                (a, b) =>
                    new Date(b.updatedAt) -
                    new Date(a.updatedAt)
            );


    for (
        const conversation of sorted
    ) {

        const item =
            document.createElement("div");

        item.className =
            "history-item";


        if (
            conversation.id ===
            state.activeConversationId
        ) {

            item.classList.add(
                "active"
            );

        }


        const icon =
            document.createElement("div");

        icon.className =
            "history-icon";

        icon.textContent =
            "◌";


        const content =
            document.createElement("div");

        content.className =
            "history-content";


        const title =
            document.createElement("div");

        title.className =
            "history-title";

        title.textContent =
            conversation.title ||
            "Consultation";


        const date =
            document.createElement("div");

        date.className =
            "history-date";

        date.textContent =
            formatConversationDate(
                conversation.updatedAt
            );


        content.appendChild(title);
        content.appendChild(date);

        item.appendChild(icon);
        item.appendChild(content);


        item.addEventListener(
            "click",
            () => {

                state.activeConversationId =
                    conversation.id;

                saveState();

                renderHistory();

                renderConversation();

                closeSidebarOnMobile();

            }
        );


        container.appendChild(item);

    }

}


function formatConversationDate(dateValue) {

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(date.getTime())
    ) {
        return "";
    }


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    const oneDay =
        24 * 60 * 60 * 1000;


    if (difference < oneDay) {

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    return date.toLocaleDateString(
        [],
        {
            day: "numeric",
            month: "short"
        }
    );

}


/* =========================================================
   SEND MESSAGE
========================================================= */

async function handleSubmit(event) {

    event.preventDefault();


    if (state.isLoading) {
        return;
    }


    const text =
        elements.messageInput.value.trim();


    if (!text) {
        return;
    }


    /*
     * Make sure a conversation exists.
     *
     * Normally New Consultation creates one,
     * but this also protects against edge cases.
     */

    if (!state.activeConversationId) {
        startNewConsultation();
    }


    const conversation =
        getActiveConversation();


    if (!conversation) {
        return;
    }


    /*
     * Prevent duplicate submission.
     */

    state.isLoading = true;

    elements.sendButton.disabled =
        true;


    elements.messageInput.value = "";

    resizeTextarea();


    /*
     * Add ONLY the current user message.
     *
     * This is critical for preventing duplicate
     * frontend messages.
     */

    conversation.messages.push({

        role: "user",

        content: text,

        timestamp:
            new Date().toISOString()

    });


    /*
     * Update title using first user message.
     */

    if (
        conversation.messages.filter(
            message =>
                message.role === "user"
        ).length === 1
    ) {

        conversation.title =
            createConversationTitle(
                text
            );

    }


    conversation.updatedAt =
        new Date().toISOString();


    saveState();

    renderConversation();

    renderHistory();

    showTyping();


    try {

        /*
         * Send the complete conversation to backend.
         *
         * This preserves memory across language changes
         * and multiple turns.
         */

        const conversationForApi =
            conversation.messages.map(
                message => ({
                    role: message.role,
                    content: message.content
                })
            );


        const response =
            await fetch(
                `${API_BASE_URL}/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            message: text,

                            language:
                                state.language,

                            conversation:
                                conversationForApi
                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * NEVER append a response if backend
         * didn't actually return one.
         */

        const assistantText =
            typeof data.response === "string"
                ? data.response.trim()
                : "";


        if (!assistantText) {

            throw new Error(
                "The assistant returned an empty response."
            );

        }


        /*
         * The chat may have been deleted while this
         * request was in flight, so drop the reply
         * instead of writing into a removed chat.
         */

        if (
            !state.conversations.includes(
                conversation
            )
        ) {

            hideTyping();

            return;

        }


        /*
         * Add exactly ONE assistant message.
         */

        conversation.messages.push({

            role: "assistant",

            content: assistantText,

            emergency:
                data.emergency === true,

            timestamp:
                new Date().toISOString()

        });


        conversation.updatedAt =
            new Date().toISOString();


        saveState();

        hideTyping();

        renderConversation();

        renderHistory();


        if (
            data.emergency === true
        ) {

            openEmergencyModal();

        }

    } catch (error) {

        console.error(
            "Chat request failed:",
            error
        );


        hideTyping();


        /*
         * IMPORTANT:
         *
         * Do not repeatedly display the same
         * hard-coded error.
         *
         * We create one error message for
         * this failed request only.
         */

        if (
            !state.conversations.includes(
                conversation
            )
        ) {

            return;

        }


        const errorMessage =
            getErrorMessage();


        conversation.messages.push({

            role: "assistant",

            content: errorMessage,

            error: true,

            timestamp:
                new Date().toISOString()

        });


        conversation.updatedAt =
            new Date().toISOString();


        saveState();

        renderConversation();

    } finally {

        state.isLoading = false;

        elements.sendButton.disabled =
            false;

        elements.messageInput.focus();

    }

}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage() {

    const messages = {

        English:
            "I couldn't process that request right now. Please try again in a moment.",

        Hindi:
            "मैं अभी इस अनुरोध को संसाधित नहीं कर सका/सकी। कृपया थोड़ी देर बाद फिर प्रयास करें।",

        Marathi:
            "मी आत्ता हा अनुरोध प्रक्रिया करू शकलो नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा।",

        Punjabi:
            "ਮੈਂ ਇਸ ਬੇਨਤੀ ਨੂੰ ਇਸ ਸਮੇਂ ਪ੍ਰਕਿਰਿਆ ਨਹੀਂ ਕਰ ਸਕਿਆ/ਸਕਈ। ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",

        Bengali:
            "আমি এই মুহূর্তে অনুরোধটি প্রক্রিয়া করতে পারিনি। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।"

    };


    return (
        messages[state.language] ||
        messages.English
    );

}


/* =========================================================
   CONVERSATION TITLE
========================================================= */

function createConversationTitle(text) {

    const cleaned =
        text
            .replace(/\s+/g, " ")
            .trim();


    if (cleaned.length <= 38) {
        return cleaned;
    }


    return (
        cleaned.substring(0, 38) +
        "..."
    );

}


/* =========================================================
   MESSAGE RENDERING
========================================================= */

function renderMessage(
    role,
    content,
    emergency = false
) {

    const row =
        document.createElement("div");


    row.className =
        `message-row ${role}`;


    if (role === "user") {

        const contentWrapper =
            document.createElement("div");

        contentWrapper.className =
            "message-content";


        const bubble =
            document.createElement("div");

        bubble.className =
            "user-bubble";

        bubble.textContent =
            content;


        contentWrapper.appendChild(
            bubble
        );

        row.appendChild(
            contentWrapper
        );

    } else {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "assistant-wrapper";


        const avatar =
            document.createElement("div");

        avatar.className =
            "assistant-avatar";

        avatar.textContent =
            "+";


        const contentWrapper =
            document.createElement("div");

        contentWrapper.className =
            "message-content";


        const bubble =
            document.createElement("div");

        bubble.className =
            "assistant-bubble";


        bubble.innerHTML =
            formatAssistantText(
                content
            );


        contentWrapper.appendChild(
            bubble
        );


        if (emergency) {

            const emergencyBox =
                document.createElement("div");

            emergencyBox.className =
                "emergency-message";

            emergencyBox.textContent =
                getEmergencyInlineText();


            contentWrapper.appendChild(
                emergencyBox
            );

        }


        wrapper.appendChild(avatar);

        wrapper.appendChild(
            contentWrapper
        );

        row.appendChild(wrapper);

    }


    elements.messages.appendChild(
        row
    );

}


/* =========================================================
   ASSISTANT TEXT FORMATTER
========================================================= */

function formatAssistantText(text) {

    /*
     * Escape HTML first.
     * This prevents assistant output from injecting HTML.
     */

    const escaped =
        escapeHtml(text);


    /*
     * Convert simple markdown-style formatting.
     */

    let html =
        escaped;


    html =
        html.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    html =
        html.replace(
            /^### (.*)$/gm,
            "<h3>$1</h3>"
        );


    html =
        html.replace(
            /^[-•] (.*)$/gm,
            "<li>$1</li>"
        );


    html =
        html.replace(
            /(<li>.*<\/li>)/gs,
            "<ul>$1</ul>"
        );


    /*
     * Preserve paragraphs/newlines.
     */

    const paragraphs =
        html
            .split(/\n{2,}/)
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(Boolean);


    if (paragraphs.length === 0) {
        return "";
    }


    return paragraphs
        .map(
            paragraph => {

                if (
                    paragraph.startsWith("<h3>") ||
                    paragraph.startsWith("<ul>")
                ) {
                    return paragraph;
                }

                return `<p>${paragraph.replace(/\n/g, "<br>")}</p>`;

            }
        )
        .join("");

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


/* =========================================================
   EMERGENCY
========================================================= */

function getEmergencyInlineText() {

    const messages = {

        English:
            "If you are experiencing severe or life-threatening symptoms, seek emergency medical care immediately. In India, you can call 112.",

        Hindi:
            "यदि गंभीर या जानलेवा लक्षण हैं, तो तुरंत आपातकालीन चिकित्सा सहायता लें। भारत में 112 पर कॉल किया जा सकता है।",

        Marathi:
            "गंभीर किंवा जीवघेणी लक्षणे असल्यास त्वरित आपत्कालीन वैद्यकीय मदत घ्या. भारतात 112 वर कॉल करू शकता.",

        Punjabi:
            "ਜੇ ਗੰਭੀਰ ਜਾਂ ਜਾਨਲੇਵਾ ਲੱਛਣ ਹਨ, ਤਾਂ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਲਓ। ਭਾਰਤ ਵਿੱਚ 112 'ਤੇ ਕਾਲ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।",

        Bengali:
            "গুরুতর বা জীবন-ঝুঁকিপূর্ণ উপসর্গ থাকলে অবিলম্বে জরুরি চিকিৎসা নিন। ভারতে 112 নম্বরে কল করা যায়।"

    };


    return (
        messages[state.language] ||
        messages.English
    );

}


function openEmergencyModal() {

    elements.emergencyModal.classList.remove(
        "hidden"
    );

}


function closeEmergencyModal() {

    elements.emergencyModal.classList.add(
        "hidden"
    );

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping() {

    elements.typingIndicator.classList.remove(
        "hidden"
    );

    scrollToBottom(true);

}


function hideTyping() {

    elements.typingIndicator.classList.add(
        "hidden"
    );

}


/* =========================================================
   SCROLL
========================================================= */

function scrollToBottom(smooth = true) {

    requestAnimationFrame(
        () => {

            elements.chatScrollArea.scrollTo(
                {
                    top:
                        elements.chatScrollArea
                            .scrollHeight,

                    behavior:
                        smooth
                            ? "smooth"
                            : "auto"
                }
            );

        }
    );

}


/* =========================================================
   TEXTAREA
========================================================= */

function resizeTextarea() {

    const textarea =
        elements.messageInput;


    textarea.style.height =
        "auto";


    textarea.style.height =
        Math.min(
            textarea.scrollHeight,
            160
        ) + "px";

}


function handleTextareaKeydown(event) {

    /*
     * Enter = send
     * Shift + Enter = new line
     */

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        elements.chatForm.requestSubmit();

    }

}


/* =========================================================
   VOICE INPUT
========================================================= */

function initializeSpeechRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        elements.microphoneButton.style.display =
            "none";

        return;

    }


    state.recognition =
        new SpeechRecognition();


    state.recognition.continuous =
        false;


    state.recognition.interimResults =
        true;


    state.recognition.lang =
        getSpeechLanguage(
            state.language
        );


    state.recognition.onstart =
        () => {

            state.isRecording = true;

            elements.microphoneButton
                .classList.add(
                    "recording"
                );

            elements.microphoneIcon
                .textContent = "■";

        };


    state.recognition.onresult =
        event => {

            let transcript = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;

            }


            if (transcript.trim()) {

                elements.messageInput.value =
                    transcript;

                resizeTextarea();

            }

        };


    state.recognition.onerror =
        error => {

            console.error(
                "Speech recognition error:",
                error
            );

        };


    state.recognition.onend =
        () => {

            state.isRecording = false;

            elements.microphoneButton
                .classList.remove(
                    "recording"
                );

            elements.microphoneIcon
                .textContent = "🎙";

        };

}


function getSpeechLanguage(language) {

    const languages = {

        English: "en-IN",

        Hindi: "hi-IN",

        Marathi: "mr-IN",

        Punjabi: "pa-IN",

        Bengali: "bn-IN"

    };


    return (
        languages[language] ||
        "en-IN"
    );

}


function toggleVoiceInput() {

    if (!state.recognition) {

        initializeSpeechRecognition();

    }


    if (!state.recognition) {
        return;
    }


    /*
     * IMPORTANT:
     *
     * The selected language controls the
     * browser speech-recognition language too.
     */

    state.recognition.lang =
        getSpeechLanguage(
            state.language
        );


    if (state.isRecording) {

        state.recognition.stop();

    } else {

        try {

            state.recognition.start();

        } catch (error) {

            console.error(
                "Unable to start microphone:",
                error
            );

        }

    }

}


/* =========================================================
   MODALS
========================================================= */

function openAboutModal() {

    elements.aboutModal.classList.remove(
        "hidden"
    );

}


function closeAboutModal() {

    elements.aboutModal.classList.add(
        "hidden"
    );

}


function openClearModal() {

    if (state.conversations.length === 0) {
        return;
    }

    elements.clearModal.classList.remove(
        "hidden"
    );

}


function closeClearModal() {

    elements.clearModal.classList.add(
        "hidden"
    );

}


function clearAllConversations() {

    state.conversations = [];

    state.activeConversationId = null;


    /*
     * A request may still be in flight; make sure the
     * reply cannot be written into a deleted chat.
     */

    state.isLoading = false;

    hideTyping();


    try {

        localStorage.removeItem(STORAGE_KEY);

    } catch (error) {

        console.error(
            "Unable to clear saved conversations:",
            error
        );

    }


    saveState();

    renderHistory();

    showWelcome();

    closeClearModal();

    closeSidebarOnMobile();

}


function handleModalBackgroundClick(event) {

    if (
        event.target ===
        elements.aboutModal
    ) {

        closeAboutModal();

    }


    if (
        event.target ===
        elements.emergencyModal
    ) {

        closeEmergencyModal();

    }


    if (
        event.target ===
        elements.clearModal
    ) {

        closeClearModal();

    }

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    elements.sidebar.classList.toggle(
        "open"
    );

}


function closeSidebarOnMobile() {

    elements.sidebar.classList.remove(
        "open"
    );

}


/* =========================================================
   GLOBAL KEYBOARD
========================================================= */

function handleGlobalKeyboard(event) {

    if (
        event.key === "Escape"
    ) {

        closeAboutModal();

        closeEmergencyModal();

        closeClearModal();

        closeSidebarOnMobile();

    }

}


/* =========================================================
   START VOICE RECOGNITION
========================================================= */

initializeSpeechRecognition();