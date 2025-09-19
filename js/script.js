// BCT Sleep Wellness Hub - JavaScript

// Global variables
let sleepData = {
    logs: [],
    stats: {
        avgSleep: 8.0,
        streak: 3,
        totalNights: 12
    }
};

let selectedMood = '😊';
let quizAnswers = {};
let currentQuestionIndex = 1;

// User data
let userData = {
    ageRange: '',
    sleepTime: '',
    quizResults: {}
};

// Show quiz popup on page load
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('sleepQuizPopup').style.display = 'flex';
    }, 2000); // Show after 2 seconds
});

// Navigation functions
function goToHome() {
    // Scroll to top with animation
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Show tracker tab
    showTab('tracker');
    
    // Add celebration animation
    const logo = document.querySelector('.nav-logo-img');
    if (logo) {
        logo.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            logo.style.transform = '';
        }, 500);
    }
}

// Quiz functions
function answerQuestion(questionNum, answer) {
    quizAnswers[`question${questionNum}`] = answer;
    
    // Add selection animation
    event.target.style.background = '#c53030';
    event.target.style.color = 'white';
    event.target.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        // Hide current question
        document.getElementById(`question${questionNum}`).classList.remove('active');
        
        if (questionNum < 3) {
            // Show next question
            currentQuestionIndex = questionNum + 1;
            document.getElementById(`question${currentQuestionIndex}`).classList.add('active');
        } else {
            // Show results
            showQuizResults();
        }
    }, 500);
}

function showQuizResults() {
    document.querySelectorAll('.quiz-question').forEach(q => q.style.display = 'none');
    
    const resultsDiv = document.getElementById('quizResults');
    const resultsText = document.getElementById('resultsText');
    
    // Calculate score
    let score = 0;
    Object.values(quizAnswers).forEach(answer => {
        if (answer === 'often') score += 3;
        else if (answer === 'sometimes') score += 2;
        else if (answer === 'rarely') score += 1;
    });
    
    let resultMessage = '';
    if (score <= 3) {
        resultMessage = '🌟 Excellent! You have good sleep habits. Keep it up and use our app to maintain your healthy routine!';
    } else if (score <= 6) {
        resultMessage = '😊 Good! You have decent sleep habits but there\'s room for improvement. Our personalized tips will help you optimize your sleep!';
    } else {
        resultMessage = '😴 Your sleep might need some attention. Don\'t worry - our comprehensive sleep solutions are designed specifically to help BCT students like you!';
    }
    
    resultsText.textContent = resultMessage;
    userData.quizResults = { score, answers: quizAnswers };
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function closeQuiz() {
    const popup = document.getElementById('sleepQuizPopup');
    popup.style.animation = 'fadeOut 0.5s ease-in';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 500);
    
    // Save quiz data
    saveData();
}

// Search for personalized tips
function searchPersonalizedTips() {
    const ageRange = document.getElementById('ageRange').value;
    const sleepTime = document.getElementById('sleepTime').value;
    
    if (!ageRange || !sleepTime) {
        showNotification('Please select both age range and sleep time!', 'warning');
        return;
    }
    
    userData.ageRange = ageRange;
    userData.sleepTime = sleepTime;
    
    // Create personalized content
    generatePersonalizedContent();
    
    // Show notification with animation
    showNotification('🎯 Personalized tips generated based on your profile!', 'success');
    
    // Scroll to tips section
    showTab('tips');
    setTimeout(() => {
        document.getElementById('tips').scrollIntoView({ behavior: 'smooth' });
    }, 500);
    
    // Add search animation
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.style.background = '#10b981';
    searchBtn.innerHTML = '✅ Tips Generated!';
    
    setTimeout(() => {
        searchBtn.style.background = '';
        searchBtn.innerHTML = '🔍 Get Personalized Tips';
    }, 3000);
}

function generatePersonalizedContent() {
    // This would generate content based on age range and sleep time
    const personalizedTips = getPersonalizedTips(userData.ageRange, userData.sleepTime);
    
    // Update tips section with personalized content
    updateTipsSection(personalizedTips);
}

function getPersonalizedTips(ageRange, sleepTime) {
    let tips = [];
    
    // Age-based tips
    if (ageRange === '16-18') {
        tips.push({
            title: '📚 High School Sleep Strategy',
            content: 'As a high school student, aim for 8-10 hours of sleep. Your brain is still developing, and adequate sleep is crucial for memory consolidation and academic performance.'
        });
    } else if (ageRange === '19-21') {
        tips.push({
            title: '🎓 College Transition Tips',
            content: 'College life brings new challenges. Maintain a consistent sleep schedule despite irregular class times. Avoid all-nighters - they hurt more than help!'
        });
    } else if (ageRange === '22-24') {
        tips.push({
            title: '💼 Young Professional Balance',
            content: 'Balancing work/studies and social life? Prioritize 7-9 hours of sleep. Quality sleep improves decision-making and stress management.'
        });
    } else {
        tips.push({
            title: '🌟 Mature Student Success',
            content: 'As a mature student, you might have additional responsibilities. Focus on sleep quality over quantity - even 6-7 hours of quality sleep can be effective.'
        });
    }
    
    // Sleep time-based tips
    if (sleepTime === 'day') {
        tips.push({
            title: '🌙 Day Sleeper Guide',
            content: 'Working night shifts? Create a dark, cool environment for day sleep. Use blackout curtains and white noise. Avoid caffeine 6 hours before your bedtime.'
        });
    } else if (sleepTime === 'irregular') {
        tips.push({
            title: '⏰ Irregular Schedule Management',
            content: 'Irregular schedules are tough! Focus on sleep hygiene basics: dark room, cool temperature, no screens 1 hour before bed. Consider melatonin (consult a doctor first).'
        });
    } else {
        tips.push({
            title: '🌃 Night Sleep Optimization',
            content: 'Perfect! Night sleep aligns with your natural circadian rhythm. Maintain consistent bedtime and wake-up times, even on weekends.'
        });
    }
    
    return tips;
}

function updateTipsSection(personalizedTips) {
    const tipsContainer = document.querySelector('#tips .tips-grid');
    
    // Add personalized tips at the beginning
    personalizedTips.forEach((tip, index) => {
        const tipCard = document.createElement('div');
        tipCard.className = 'tip-card personalized-tip';
        tipCard.innerHTML = `
            <h4>${tip.title}</h4>
            <p>${tip.content}</p>
            <div class="personalized-badge">✨ Personalized for you</div>
        `;
        tipCard.style.animation = `slideInLeft 0.5s ease-out ${index * 0.2}s`;
        tipCard.style.border = '2px solid #10b981';
        tipsContainer.insertBefore(tipCard, tipsContainer.firstChild);
    });
}

// Motivational quotes from famous authors
const quotes = [
    {
        text: "The best bridge between despair and hope is a good night's sleep.",
        author: "E.B. White"
    },
    {
        text: "Sleep is the best meditation.",
        author: "Dalai Lama"
    },
    {
        text: "A good laugh and a long sleep are the best cures in the doctor's book.",
        author: "Irish Proverb"
    },
    {
        text: "Sleep is the golden chain that ties health and our bodies together.",
        author: "Thomas Dekker"
    },
    {
        text: "The minute anyone's getting anxious I say, you must eat and you must sleep. They're the two vital elements for a healthy life.",
        author: "Francesca Annis"
    },
    {
        text: "Your future depends on your dreams, so go to sleep.",
        author: "Mesut Barazany"
    },
    {
        text: "Sleep is that golden chain that ties health and our bodies together.",
        author: "Thomas Dekker"
    },
    {
        text: "A well-spent day brings happy sleep.",
        author: "Leonardo da Vinci"
    },
    {
        text: "Sleep is the cousin of death, but dreams are the children of hope.",
        author: "Malcolm X"
    },
    {
        text: "The night is the hardest time to be alive and 4am knows all my secrets.",
        author: "Poppy Z. Brite"
    }
];

// Sleep affirmations
const affirmations = [
    "I deserve rest and my body knows how to sleep naturally.",
    "Each night of good sleep makes me a better student and person.",
    "I release the day's stress and welcome peaceful sleep.",
    "My mind is calm, my body is relaxed, and sleep comes easily.",
    "I trust my body's natural sleep rhythms.",
    "Quality sleep is my investment in tomorrow's success.",
    "I create boundaries that protect my sleep and well-being.",
    "Every night is a chance to recharge and reset.",
    "I choose sleep over late-night scrolling because I value my health.",
    "My bedroom is my sanctuary of rest and recovery.",
    "I am grateful for the opportunity to rest and restore my energy.",
    "Sleep comes naturally to me when I create the right conditions.",
    "I let go of today's worries and embrace tomorrow's possibilities.",
    "My sleep is deep, peaceful, and rejuvenating.",
    "I honor my body's need for rest and recovery."
];

// DOM Elements
let tabButtons, tabContents, logSleepBtn, newAffirmationBtn, moodButtons;

// Initialize the application
function init() {
    // Cache DOM elements
    cacheDOMElements();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load saved data from localStorage (if available)
    loadSavedData();
    
    // Set default mood
    const defaultMoodBtn = document.querySelector('[data-mood="😊"]');
    if (defaultMoodBtn) {
        defaultMoodBtn.classList.add('selected');
    }
    
    // Show initial quote
    showRandomQuote();
    
    // Update displays
    updateSleepStats();
    updateQualityIndicator();
    
    // Add loading animation
    document.body.classList.remove('loading');
    
    console.log('BCT Sleep Wellness Hub initialized successfully!');
}

// Cache DOM elements for better performance
function cacheDOMElements() {
    tabButtons = document.querySelectorAll('.tab-btn');
    tabContents = document.querySelectorAll('.tab-content');
    logSleepBtn = document.getElementById('logSleepBtn');
    newAffirmationBtn = document.getElementById('newAffirmationBtn');
    moodButtons = document.querySelectorAll('.mood-btn');
}

// Set up all event listeners
function setupEventListeners() {
    // Tab switching
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const tabs = ['tracker', 'tips', 'motivation', 'analysis'];
            showTab(tabs[index]);
        });
    });
    
    // Sleep logging
    if (logSleepBtn) {
        logSleepBtn.addEventListener('click', logSleep);
    }
    
    // New affirmation
    if (newAffirmationBtn) {
        newAffirmationBtn.addEventListener('click', getNewAffirmation);
    }
    
    // Mood selection
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            selectMood(mood, this);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Load saved data from localStorage
function loadSavedData() {
    try {
        const saved = localStorage.getItem('bctSleepData');
        if (saved) {
            sleepData = JSON.parse(saved);
            console.log('Loaded saved sleep data:', sleepData);
        }
    } catch (error) {
        console.log('No saved data found or error loading data:', error);
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('bctSleepData', JSON.stringify(sleepData));
    } catch (error) {
        console.warn('Could not save data to localStorage:', error);
    }
}

// Tab switching functionality
function showTab(tabName) {
    // Add loading effect
    document.body.classList.add('loading');
    
    setTimeout(() => {
        // Hide all tab contents
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Mark correct button as active
        const tabNames = ['tracker', 'tips', 'motivation', 'analysis'];
        const tabIndex = tabNames.indexOf(tabName);
        if (tabIndex !== -1 && tabButtons[tabIndex]) {
            tabButtons[tabIndex].classList.add('active');
        }

        // Special actions for certain tabs
        if (tabName === 'motivation') {
            showRandomQuote();
        }
        
        // Remove loading effect
        document.body.classList.remove('loading');
    }, 200);
}

// Mood selection
function selectMood(mood, buttonElement) {
    selectedMood = mood;
    
    // Remove selected class from all mood buttons
    moodButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    buttonElement.classList.add('selected');
    
    // Add animation feedback
    buttonElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        buttonElement.style.transform = '';
    }, 200);
}

// Sleep logging functionality
function logSleep() {
    const bedtime = document.getElementById('bedtime').value;
    const wakeup = document.getElementById('wakeup').value;
    const quality = document.getElementById('quality').value;
    const studyHours = document.getElementById('studyhours').value;

    // Validation
    if (!bedtime || !wakeup) {
        showNotification('Please fill in both bedtime and wake-up time!', 'error');
        return;
    }

    if (!selectedMood) {
        showNotification('Please select how you feel right now!', 'warning');
        return;
    }

    // Calculate sleep duration
    const sleepDuration = calculateSleepDuration(bedtime, wakeup);
    const durationHours = parseSleepDuration(sleepDuration);

    // Create sleep log
    const sleepLog = {
        id: Date.now(), // Unique ID
        date: new Date().toDateString(),
        bedtime: bedtime,
        wakeup: wakeup,
        duration: sleepDuration,
        durationHours: durationHours,
        quality: quality,
        mood: selectedMood,
        studyHours: parseInt(studyHours) || 0,
        timestamp: new Date()
    };

    // Add to sleep data
    sleepData.logs.push(sleepLog);
    
    // Update statistics
    updateStats();
    
    // Save data
    saveData();

    // Generate personalized feedback
    const feedback = generateFeedback(sleepLog);
    showNotification(`Sleep logged successfully! 🌙\n\n${feedback}`, 'success');

    // Update displays
    updateSleepStats();
    updateQualityIndicator();
    
    // Reset form
    resetSleepForm();
    
    // Add celebration animation
    celebrateLogSubmission();
}

// Calculate sleep duration
function calculateSleepDuration(bedtime, wakeup) {
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeup.split(':').map(Number);

    let bedTimeMinutes = bedHour * 60 + bedMin;
    let wakeTimeMinutes = wakeHour * 60 + wakeMin;

    // Handle overnight sleep
    if (wakeTimeMinutes <= bedTimeMinutes) {
        wakeTimeMinutes += 24 * 60; // Add 24 hours
    }

    const durationMinutes = wakeTimeMinutes - bedTimeMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h ${minutes}m`;
}

// Parse sleep duration to hours (for calculations)
function parseSleepDuration(duration) {
    const matches = duration.match(/(\d+)h\s*(\d+)m/);
    if (matches) {
        const hours = parseInt(matches[1]);
        const minutes = parseInt(matches[2]);
        return hours + (minutes / 60);
    }
    return 0;
}

// Generate personalized feedback
function generateFeedback(log) {
    const duration = log.durationHours;
    let feedback = "";

    if (duration >= 8) {
        feedback = "Excellent! You're getting optimal sleep for academic performance. 🌟";
    } else if (duration >= 7) {
        feedback = "Good job! You're in the healthy sleep range. Keep it up! 👍";
    } else if (duration >= 6) {
        feedback = "You're getting some sleep, but aim for 7-8 hours for better focus in class. 📚";
    } else {
        feedback = "Your sleep is quite short. Prioritize getting more rest for your health and studies. 😴";
    }

    if (log.studyHours >= 4) {
        feedback += "\n\nTip: Try to limit late-night studying to improve sleep quality.";
    }

    if (log.mood === '😵' || log.mood === '😩') {
        feedback += "\n\nRemember: Tomorrow is a new day. Prioritize rest tonight! 💙";
    }

    return feedback;
}

// Update statistics
function updateStats() {
    const logs = sleepData.logs;
    if (logs.length === 0) return;

    // Calculate average sleep
    const totalHours = logs.reduce((sum, log) => {
        return sum + log.durationHours;
    }, 0);
    sleepData.stats.avgSleep = (totalHours / logs.length).toFixed(1);

    // Calculate streak (consecutive days with 7+ hours)
    let currentStreak = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
        const hours = logs[i].durationHours;
        if (hours >= 7) {
            currentStreak++;
        } else {
            break;
        }
    }
    sleepData.stats.streak = currentStreak;

    // Total nights
    sleepData.stats.totalNights = logs.length;
}

// Update sleep statistics display
function updateSleepStats() {
    const avgSleepEl = document.getElementById('avgSleep');
    const sleepStreakEl = document.getElementById('sleepStreak');
    const totalNightsEl = document.getElementById('totalNights');
    
    if (avgSleepEl) avgSleepEl.textContent = sleepData.stats.avgSleep + 'h';
    if (sleepStreakEl) sleepStreakEl.textContent = sleepData.stats.streak;
    if (totalNightsEl) totalNightsEl.textContent = sleepData.stats.totalNights;
}

// Update sleep quality indicator
function updateQualityIndicator() {
    const indicator = document.getElementById('qualityIndicator');
    if (!indicator) return;
    
    const logs = sleepData.logs;
    
    if (logs.length === 0) {
        indicator.innerHTML = '<div class="quality-circle quality-good">Good</div>';
        return;
    }
    
    const recentQuality = logs[logs.length - 1].quality;
    let qualityClass, qualityText;
    
    switch (recentQuality) {
        case 'excellent':
            qualityClass = 'quality-excellent';
            qualityText = 'Excellent';
            break;
        case 'good':
            qualityClass = 'quality-good';
            qualityText = 'Good';
            break;
        case 'fair':
            qualityClass = 'quality-fair';
            qualityText = 'Fair';
            break;
        case 'poor':
            qualityClass = 'quality-poor';
            qualityText = 'Poor';
            break;
        default:
            qualityClass = 'quality-good';
            qualityText = 'Good';
    }
    
    indicator.innerHTML = `<div class="quality-circle ${qualityClass}">${qualityText}</div>`;
}

// Show random motivational quote
function showRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteCard = document.getElementById('dailyQuote');
    
    if (quoteCard) {
        quoteCard.innerHTML = `
            <div class="quote-text">${randomQuote.text}</div>
            <div class="quote-author">- ${randomQuote.author}</div>
        `;
        
        // Add animation
        quoteCard.style.opacity = '0';
        setTimeout(() => {
            quoteCard.style.opacity = '1';
        }, 100);
    }
}

// Get new affirmation
function getNewAffirmation() {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    const affirmationEl = document.getElementById('affirmation');
    
    if (affirmationEl) {
        // Add fade effect
        affirmationEl.style.opacity = '0';
        setTimeout(() => {
            affirmationEl.textContent = `"${randomAffirmation}"`;
            affirmationEl.style.opacity = '1';
        }, 200);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Reset sleep form
function resetSleepForm() {
    // Reset mood selection
    moodButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Set default mood
    const defaultMoodBtn = document.querySelector('[data-mood="😊"]');
    if (defaultMoodBtn) {
        defaultMoodBtn.classList.add('selected');
        selectedMood = '😊';
    }
}

// Celebration animation for successful log submission
function celebrateLogSubmission() {
    const logButton = document.getElementById('logSleepBtn');
    if (logButton) {
        logButton.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        logButton.textContent = 'Logged! ✅';
        
        setTimeout(() => {
            logButton.style.background = '';
            logButton.textContent = 'Log My Sleep';
        }, 2000);
    }
}

// Utility function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Utility function to get sleep quality color
function getQualityColor(quality) {
    const colors = {
        excellent: '#10b981',
        good: '#3b82f6',
        fair: '#f59e0b',
        poor: '#ef4444'
    };
    return colors[quality] || colors.good;
}

// Add CSS animations dynamically
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            float: right;
            margin-left: 10px;
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('BCT Sleep Hub Error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addCustomStyles();
    init();
});

// Export functions for potential future use
window.BCTSleepHub = {
    showTab,
    logSleep,
    showRandomQuote,
    getNewAffirmation,
    sleepData
};