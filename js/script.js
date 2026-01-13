// BCT Sleep Wellness Hub - PSQI Assessment JavaScript

// Global variables
let assessmentHistory = [];
let currentResults = null;
let currentSectionNumber = 1;
const totalSections = 7;
let userProfile = {
    name: '',
    age: '',
    privacyMode: true
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    initializeApp();
    optimizeVideoForDevice();
});

function initializeApp() {
    setupEventListeners();
    loadHistoryFromStorage();
    loadUserProfile();
    loadDarkModePreference();
    updateHistoryDisplay();
    checkForExistingResults();
    updateProgressBar();
    console.log('App initialized successfully');
}

// Optimize video background for device
function optimizeVideoForDevice() {
    const video = document.getElementById('bgVideo');
    if (!video) return;
    
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    
    if (isMobile || isSmallScreen) {
        // Hide video on mobile, show gradient background
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }
        document.body.style.background = 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%)';
    } else {
        // On desktop, ensure video plays
        if (video) {
            video.play().catch(function(error) {
                console.log('Video autoplay prevented:', error);
            });
        }
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    optimizeVideoForDevice();
});

// Dark Mode Functions
function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('darkMode', newTheme);
}

function loadDarkModePreference() {
    const savedTheme = localStorage.getItem('darkMode') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// User Profile Functions
function saveUserProfile() {
    const name = document.getElementById('userName').value.trim();
    const age = document.getElementById('userAge').value.trim();
    const privacyMode = document.getElementById('privacyMode').checked;
    
    if (!name || !age) {
        showNotification('Please enter both your name and age.', 'warning');
        return;
    }
    
    if (age < 1 || age > 120) {
        showNotification('Please enter a valid age between 1 and 120.', 'error');
        return;
    }
    
    userProfile = {
        name: name,
        age: parseInt(age),
        privacyMode: privacyMode
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    console.log('Profile saved:', userProfile);
    showNotification('Profile saved successfully! You can now take the assessment.', 'success');
}

function loadUserProfile() {
    try {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            userProfile = JSON.parse(saved);
            
            // Update form fields
            const nameInput = document.getElementById('userName');
            const ageInput = document.getElementById('userAge');
            const privacyCheckbox = document.getElementById('privacyMode');
            
            if (nameInput) nameInput.value = userProfile.name || '';
            if (ageInput) ageInput.value = userProfile.age || '';
            if (privacyCheckbox) privacyCheckbox.checked = userProfile.privacyMode !== false;
            
            console.log('Profile loaded:', userProfile);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

function getDisplayName(result) {
    // If privacy mode is ON, show Anonymous
    if (result.privacyMode === true) {
        return 'Anonymous User';
    }
    // If privacy mode is OFF and we have a name, show it
    if (result.userName && result.userName !== 'Anonymous') {
        return result.userName;
    }
    // Default to Anonymous
    return 'Anonymous User';
}

// Section Navigation
function nextSection() {
    const currentSection = document.querySelector('.form-section[data-section="' + currentSectionNumber + '"]');
    
    // Validate current section before moving forward
    if (!validateCurrentSection(currentSectionNumber)) {
        showNotification('Please answer all questions in this section before continuing.', 'warning');
        return;
    }
    
    if (currentSectionNumber < totalSections) {
        // Hide current section
        currentSection.classList.remove('active');
        
        // Show next section
        currentSectionNumber++;
        const nextSection = document.querySelector('.form-section[data-section="' + currentSectionNumber + '"]');
        nextSection.classList.add('active');
        
        // Update progress
        updateProgressBar();
        
        // Scroll to form section instead of top
        const formSection = document.querySelector('.psqi-form');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function previousSection() {
    if (currentSectionNumber > 1) {
        // Hide current section
        const currentSection = document.querySelector('.form-section[data-section="' + currentSectionNumber + '"]');
        currentSection.classList.remove('active');
        
        // Show previous section
        currentSectionNumber--;
        const prevSection = document.querySelector('.form-section[data-section="' + currentSectionNumber + '"]');
        prevSection.classList.add('active');
        
        // Update progress
        updateProgressBar();
        
        // Scroll to form section instead of top
        const formSection = document.querySelector('.psqi-form');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function validateCurrentSection(sectionNum) {
    const section = document.querySelector('.form-section[data-section="' + sectionNum + '"]');
    const requiredInputs = section.querySelectorAll('[required]');
    
    let allFilled = true;
    
    requiredInputs.forEach(function(input) {
        if (input.type === 'radio') {
            const name = input.name;
            const checked = section.querySelector('input[name="' + name + '"]:checked');
            if (!checked) {
                allFilled = false;
            }
        } else {
            if (!input.value) {
                allFilled = false;
            }
        }
    });
    
    return allFilled;
}

function updateProgressBar() {
    const progress = (currentSectionNumber / totalSections) * 100;
    const progressBar = document.getElementById('progressBar');
    const currentSectionText = document.getElementById('currentSection');
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    if (currentSectionText) {
        currentSectionText.textContent = currentSectionNumber;
    }
}

function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Form submission
    const form = document.getElementById('psqiForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Radio button selection visual feedback
    const radioLabels = document.querySelectorAll('.option-label');
    radioLabels.forEach(function(label) {
        label.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Remove selected class from siblings
                const name = radio.name;
                const allLabels = document.querySelectorAll('input[name="' + name + '"]');
                allLabels.forEach(function(r) {
                    r.parentElement.classList.remove('selected');
                });
                
                // Add selected class to current
                this.classList.add('selected');
            }
        });
    });
}

function showTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Mark button as active
    const selectedButton = document.querySelector('[data-tab="' + tabName + '"]');
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    // Update displays when switching to certain tabs
    if (tabName === 'results') {
        displayResults();
    } else if (tabName === 'history') {
        updateHistoryDisplay();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');

    // Validate all sections
    if (!validateAllSections()) {
        showNotification('Please complete all sections of the assessment.', 'error');
        return;
    }

    // Get current user profile state before calculating
    const currentName = document.getElementById('userName').value.trim();
    const currentAge = document.getElementById('userAge').value.trim();
    const currentPrivacy = document.getElementById('privacyMode').checked;
    
    // Update userProfile with current values
    if (currentName && currentAge) {
        userProfile = {
            name: currentName,
            age: parseInt(currentAge),
            privacyMode: currentPrivacy
        };
    }
    
    console.log('Using profile for this assessment:', userProfile);

    // Calculate PSQI score
    const results = calculatePSQI();
    console.log('Calculated results:', results);
    
    // Store results
    currentResults = results;
    
    // Save to history
    saveToHistory(results);
    
    // Reset to first section
    resetForm();
    
    // Show results
    showTab('results');
    displayResults();
    
    // Show success notification
    showNotification('Assessment completed successfully! View your results below.', 'success');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateAllSections() {
    for (let i = 1; i <= totalSections; i++) {
        if (!validateCurrentSection(i)) {
            return false;
        }
    }
    return true;
}

function resetForm() {
    // Reset to first section
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    
    const firstSection = document.querySelector('.form-section[data-section="1"]');
    if (firstSection) {
        firstSection.classList.add('active');
    }
    
    currentSectionNumber = 1;
    updateProgressBar();
    
    // Remove all selected classes
    const selectedOptions = document.querySelectorAll('.option-label.selected');
    selectedOptions.forEach(function(option) {
        option.classList.remove('selected');
    });
}

function calculatePSQI() {
    const form = document.getElementById('psqiForm');
    const formData = new FormData(form);
    
    // Helper function to get form value
    function getValue(name) {
        const value = formData.get(name);
        return value ? parseFloat(value) : 0;
    }
    
    // Component 1: Subjective Sleep Quality (Question 9)
    const c1 = getValue('q9');
    
    // Component 2: Sleep Latency (Question 2 + 5a)
    const q2 = getValue('q2');
    let q2_score = 0;
    if (q2 <= 15) q2_score = 0;
    else if (q2 <= 30) q2_score = 1;
    else if (q2 <= 60) q2_score = 2;
    else q2_score = 3;
    
    const q5a = getValue('q5a');
    const c2_sum = q2_score + q5a;
    let c2 = 0;
    if (c2_sum === 0) c2 = 0;
    else if (c2_sum <= 2) c2 = 1;
    else if (c2_sum <= 4) c2 = 2;
    else c2 = 3;
    
    // Component 3: Sleep Duration (Question 4)
    const q4 = getValue('q4');
    let c3 = 0;
    if (q4 > 7) c3 = 0;
    else if (q4 >= 6) c3 = 1;
    else if (q4 >= 5) c3 = 2;
    else c3 = 3;
    
    // Component 4: Sleep Efficiency (Questions 1, 3, 4)
    const bedtime = formData.get('q1');
    const waketime = formData.get('q3');
    const sleepHours = q4;
    
    let efficiency = 0;
    let c4 = 0;
    
    if (bedtime && waketime && sleepHours > 0) {
        const timeInBed = calculateTimeInBed(bedtime, waketime);
        if (timeInBed > 0) {
            efficiency = (sleepHours / timeInBed) * 100;
            
            if (efficiency > 85) c4 = 0;
            else if (efficiency >= 75) c4 = 1;
            else if (efficiency >= 65) c4 = 2;
            else c4 = 3;
        }
    }
    
    // Component 5: Sleep Disturbances (Questions 5b-5j)
    const disturbances = ['q5b', 'q5c', 'q5d', 'q5e', 'q5f', 'q5g', 'q5h', 'q5i', 'q5j'];
    let disturbanceSum = 0;
    for (let i = 0; i < disturbances.length; i++) {
        disturbanceSum += getValue(disturbances[i]);
    }
    
    let c5 = 0;
    if (disturbanceSum === 0) c5 = 0;
    else if (disturbanceSum <= 9) c5 = 1;
    else if (disturbanceSum <= 18) c5 = 2;
    else c5 = 3;
    
    // Component 6: Use of Sleep Medication (Question 6)
    const c6 = getValue('q6');
    
    // Component 7: Daytime Dysfunction (Questions 7 + 8)
    const q7 = getValue('q7');
    const q8 = getValue('q8');
    const c7_sum = q7 + q8;
    let c7 = 0;
    if (c7_sum === 0) c7 = 0;
    else if (c7_sum <= 2) c7 = 1;
    else if (c7_sum <= 4) c7 = 2;
    else c7 = 3;
    
    // Global PSQI Score
    const globalScore = c1 + c2 + c3 + c4 + c5 + c6 + c7;
    
    // Create results object
    const results = {
        date: new Date().toISOString(),
        globalScore: globalScore,
        userName: userProfile.name || 'Anonymous',
        userAge: userProfile.age || null,
        privacyMode: userProfile.privacyMode === true,
        components: {
            c1: { name: 'Subjective Sleep Quality', score: c1 },
            c2: { name: 'Sleep Latency', score: c2 },
            c3: { name: 'Sleep Duration', score: c3 },
            c4: { name: 'Sleep Efficiency', score: c4, efficiency: efficiency.toFixed(1) },
            c5: { name: 'Sleep Disturbances', score: c5 },
            c6: { name: 'Use of Sleep Medication', score: c6 },
            c7: { name: 'Daytime Dysfunction', score: c7 }
        },
        rawData: {
            sleepHours: q4,
            sleepLatency: q2,
            bedtime: bedtime,
            waketime: waketime
        }
    };
    
    console.log('Assessment results created:', results);
    
    return results;
}

function calculateTimeInBed(bedtime, waketime) {
    const bedParts = bedtime.split(':');
    const wakeParts = waketime.split(':');
    
    const bedHour = parseInt(bedParts[0]);
    const bedMin = parseInt(bedParts[1]);
    const wakeHour = parseInt(wakeParts[0]);
    const wakeMin = parseInt(wakeParts[1]);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    // Handle overnight sleep
    if (wakeMinutes <= bedMinutes) {
        wakeMinutes += 24 * 60;
    }
    
    const totalMinutes = wakeMinutes - bedMinutes;
    return totalMinutes / 60;
}

function displayResults() {
    const resultsCard = document.getElementById('resultsCard');
    const noResults = document.getElementById('noResults');
    
    if (!currentResults) {
        // Check if we have results in history
        if (assessmentHistory.length > 0) {
            currentResults = assessmentHistory[assessmentHistory.length - 1];
        } else {
            if (resultsCard) resultsCard.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }
    }
    
    if (resultsCard) resultsCard.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    
    // Display total score
    const totalScoreEl = document.getElementById('totalScore');
    if (totalScoreEl) {
        totalScoreEl.textContent = currentResults.globalScore;
    }
    
    // Display interpretation
    const interpretationEl = document.getElementById('scoreInterpretation');
    if (interpretationEl) {
        const interpretation = getScoreInterpretation(currentResults.globalScore);
        interpretationEl.innerHTML = interpretation.html;
        interpretationEl.className = 'score-interpretation ' + interpretation.class;
    }
    
    // Display component scores
    displayComponentScores(currentResults.components);
    
    // Display recommendations
    displayRecommendations(currentResults);
}

function getScoreInterpretation(score) {
    if (score <= 5) {
        return {
            html: '<strong>Good Sleep Quality</strong><br>Your PSQI score indicates good overall sleep quality. Continue maintaining your healthy sleep habits!',
            class: 'score-good'
        };
    } else {
        return {
            html: '<strong>Poor Sleep Quality</strong><br>Your PSQI score suggests poor sleep quality. Consider implementing the recommendations below and consulting with a healthcare provider if sleep problems persist.',
            class: 'score-poor'
        };
    }
}

function displayComponentScores(components) {
    const container = document.getElementById('componentScores');
    if (!container) return;
    
    container.innerHTML = '';
    
    const componentArray = Object.values(components);
    for (let i = 0; i < componentArray.length; i++) {
        const component = componentArray[i];
        const item = document.createElement('div');
        item.className = 'component-item';
        
        let detailText = '';
        if (component.efficiency !== undefined) {
            detailText = '<div style="font-size: 0.85rem; color: #888; margin-top: 5px;">Efficiency: ' + component.efficiency + '%</div>';
        }
        
        item.innerHTML = 
            '<div class="component-item-name">' + component.name + '</div>' +
            '<div class="component-item-score">' + component.score + ' / 3</div>' +
            detailText;
        
        container.appendChild(item);
    }
}

function displayRecommendations(results) {
    const container = document.getElementById('recommendations');
    if (!container) return;
    
    const recommendations = generateRecommendations(results);
    
    let html = '<h3>Personalized Recommendations</h3>';
    for (let i = 0; i < recommendations.length; i++) {
        const rec = recommendations[i];
        html += '<div class="recommendation-item">' +
                '<strong>' + rec.title + '</strong><br>' +
                rec.description +
                '</div>';
    }
    
    container.innerHTML = html;
}

function generateRecommendations(results) {
    const recommendations = [];
    const components = results.components;
    
    // Check sleep duration
    if (components.c3.score >= 2) {
        recommendations.push({
            title: 'Increase Sleep Duration',
            description: 'You are averaging ' + results.rawData.sleepHours + ' hours of sleep. Aim for 7-9 hours per night for optimal health and academic performance.'
        });
    }
    
    // Check sleep latency
    if (components.c2.score >= 2) {
        recommendations.push({
            title: 'Reduce Sleep Latency',
            description: 'You are taking a long time to fall asleep. Try relaxation techniques like the 4-7-8 breathing method, avoid screens 1 hour before bed, and establish a consistent bedtime routine.'
        });
    }
    
    // Check sleep efficiency
    if (components.c4.score >= 2) {
        recommendations.push({
            title: 'Improve Sleep Efficiency',
            description: 'Your sleep efficiency is ' + components.c4.efficiency + '%. Use your bed only for sleep, avoid daytime napping, and maintain consistent sleep/wake times.'
        });
    }
    
    // Check sleep disturbances
    if (components.c5.score >= 2) {
        recommendations.push({
            title: 'Address Sleep Disturbances',
            description: 'You are experiencing frequent sleep disruptions. Optimize your sleep environment (cool, dark, quiet), limit fluids before bed, and address any environmental factors affecting your sleep.'
        });
    }
    
    // Check medication use
    if (components.c6.score >= 1) {
        recommendations.push({
            title: 'Review Sleep Medication Use',
            description: 'Consider non-pharmacological approaches like CBT-I (Cognitive Behavioral Therapy for Insomnia). Consult with a healthcare provider about your sleep medication use.'
        });
    }
    
    // Check daytime dysfunction
    if (components.c7.score >= 2) {
        recommendations.push({
            title: 'Manage Daytime Sleepiness',
            description: 'Improve nighttime sleep quality, avoid long daytime naps, get exposure to bright light in the morning, and maintain regular physical activity.'
        });
    }
    
    // General good sleep practices
    if (results.globalScore > 5) {
        recommendations.push({
            title: 'General Sleep Hygiene Tips',
            description: 'Maintain a consistent sleep schedule, create a relaxing bedtime routine, limit caffeine after 2 PM, exercise regularly (but not close to bedtime), and manage stress through relaxation techniques.'
        });
    }
    
    if (recommendations.length === 0) {
        recommendations.push({
            title: 'Excellent Sleep Quality!',
            description: 'Your sleep quality is good. Keep maintaining your healthy sleep habits and consistent routine!'
        });
    }
    
    return recommendations;
}

function saveToHistory(results) {
    assessmentHistory.push(results);
    saveHistoryToStorage();
}

function saveHistoryToStorage() {
    try {
        const data = {
            history: assessmentHistory,
            currentResults: currentResults
        };
        localStorage.setItem('bctPSQIData', JSON.stringify(data));
        console.log('History saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadHistoryFromStorage() {
    try {
        const saved = localStorage.getItem('bctPSQIData');
        if (saved) {
            const data = JSON.parse(saved);
            assessmentHistory = data.history || [];
            currentResults = data.currentResults || null;
            console.log('Loaded history:', assessmentHistory.length, 'assessments');
        }
    } catch (error) {
        console.error('Error loading history:', error);
        assessmentHistory = [];
        currentResults = null;
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');
    
    if (!historyList || !noHistory) return;
    
    if (assessmentHistory.length === 0) {
        historyList.style.display = 'none';
        noHistory.style.display = 'block';
        return;
    }
    
    historyList.style.display = 'block';
    noHistory.style.display = 'none';
    
    // Sort by date (newest first)
    const sortedHistory = assessmentHistory.slice().reverse();
    
    let html = '';
    for (let i = 0; i < sortedHistory.length; i++) {
        const result = sortedHistory[i];
        const date = new Date(result.date);
        const interpretation = result.globalScore <= 5 ? 'Good sleep quality' : 'Poor sleep quality';
        const scoreClass = result.globalScore <= 5 ? 'score-good' : 'score-poor';
        const originalIndex = assessmentHistory.length - 1 - i;
        
        // Determine display name based on privacy mode
        let displayName = 'Anonymous User';
        let ageDisplay = '';
        
        console.log('Processing history item:', result);
        
        // Check privacy mode - if false, show the name
        if (result.privacyMode === false && result.userName && result.userName !== 'Anonymous') {
            displayName = result.userName;
        } else if (result.privacyMode === true || result.privacyMode === undefined) {
            displayName = 'Anonymous User';
        }
        
        // Add age if available
        if (result.userAge) {
            ageDisplay = ', Age: ' + result.userAge;
        }
        
        html += '<div class="history-item">' +
                '<div class="history-date">' + formatDate(date) + '</div>' +
                '<div class="history-user-info">' + displayName + ageDisplay + '</div>' +
                '<div class="history-score">' + result.globalScore + ' / 21</div>' +
                '<div class="history-interpretation ' + scoreClass + '">' + interpretation + '</div>' +
                '<div class="history-actions">' +
                '<button class="btn btn-primary btn-small" onclick="viewHistoryDetails(' + originalIndex + ')">View Details</button>' +
                '<button class="btn btn-secondary btn-small" onclick="deleteHistoryItem(' + originalIndex + ')">Delete</button>' +
                '</div>' +
                '</div>';
    }
    
    historyList.innerHTML = html;
}

function viewHistoryDetails(index) {
    currentResults = assessmentHistory[index];
    showTab('results');
    displayResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteHistoryItem(index) {
    if (confirm('Are you sure you want to delete this assessment?')) {
        assessmentHistory.splice(index, 1);
        saveHistoryToStorage();
        updateHistoryDisplay();
        showNotification('Assessment deleted successfully.', 'success');
        
        // If we deleted the current results, clear it
        if (assessmentHistory.length > 0) {
            currentResults = assessmentHistory[assessmentHistory.length - 1];
        } else {
            currentResults = null;
        }
    }
}

function checkForExistingResults() {
    if (currentResults || assessmentHistory.length > 0) {
        console.log('Found existing results');
    }
}

function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type) {
    type = type || 'info';
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = 
        'position: fixed;' +
        'top: 100px;' +
        'right: 20px;' +
        'background: ' + colors[type] + ';' +
        'color: white;' +
        'padding: 15px 20px;' +
        'border-radius: 10px;' +
        'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);' +
        'z-index: 10000;' +
        'max-width: 350px;' +
        'animation: slideInRight 0.3s ease-out;' +
        'font-weight: 500;';
    
    notification.innerHTML = 
        '<div style="display: flex; align-items: center; gap: 10px;">' +
        '<span>' + message + '</span>' +
        '<button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; margin-left: auto;">×</button>' +
        '</div>';
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function goToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showTab('assessment');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = 
    '@keyframes slideInRight {' +
    '    from { transform: translateX(100%); opacity: 0; }' +
    '    to { transform: translateX(0); opacity: 1; }' +
    '}' +
    '@keyframes slideOutRight {' +
    '    from { transform: translateX(0); opacity: 1; }' +
    '    to { transform: translateX(100%); opacity: 0; }' +
    '}';
document.head.appendChild(style);

// Export functions for global access
window.showTab = showTab;
window.viewHistoryDetails = viewHistoryDetails;
window.deleteHistoryItem = deleteHistoryItem;
window.goToHome = goToHome;
window.toggleDarkMode = toggleDarkMode;
window.nextSection = nextSection;
window.previousSection = previousSection;
window.saveUserProfile = saveUserProfile;