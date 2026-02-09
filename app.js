let currentAddiction = "";

let appData = JSON.parse(localStorage.getItem("niv_v_final")) || {
    user: { name: "Guest", img: null },
    sm: { day: 1, streak: 0, shields: 0, done: {} },
    sa: { day: 1, streak: 0, shields: 0, done: {} },
    gm: { day: 1, streak: 0, shields: 0, done: {} },
    jf: { day: 1, streak: 0, shields: 0, done: {} }
};

const MILESTONES = [7, 21, 30, 60, 75, 120];
const STAT_MAP = {"Mobile & Social Media":"sm","Smoking / Alcohol":"sa","Gaming":"gm", "Junk Food":"jf"};

// --- UNIQUE DAY-BY-DAY MISSIONS ---
const DAILY_MISSIONS = {
    "sm": [
        "Day 1: Uninstall one non-essential social app.",
        "Day 2: Set a 30-minute limit on Instagram/TikTok.",
        "Day 3: Do not check your phone for the first hour of the day.",
        "Day 4: Turn off all non-human notifications.",
        "Day 5: Leave your phone in another room while eating.",
        "Day 6: No phone 1 hour before sleep.",
        "Day 7: Full 24-hour social media fast."
    ],
    "sa": [
        "Day 1: Pour away any remaining stash/bottles.",
        "Day 2: Identify your top 3 'trigger' situations.",
        "Day 3: Drink 3 Liters of water today.",
        "Day 4: Call a friend or mentor for 10 minutes.",
        "Day 5: Walk for 20 minutes when a craving hits.",
        "Day 6: Write down 5 things you'll gain by quitting.",
        "Day 7: Avoid the place where you usually indulge."
    ],
    "gm": [
        "Day 1: Move your console/PC to a different spot.",
        "Day 2: Unsubscribe from one gaming YouTube channel.",
        "Day 3: Limit gaming to exactly 1 hour (or zero).",
        "Day 4: Clean your physical desk space entirely.",
        "Day 5: Try a new physical hobby for 30 minutes.",
        "Day 6: Research a skill you want to learn instead.",
        "Day 7: Delete one game you are addicted to."
    ],
    "jf": [
        "Day 1: Swap soda for sparkling or plain water.",
        "Day 2: No added sugar in your tea/coffee.",
        "Day 3: Eat two servings of green vegetables.",
        "Day 4: Do not eat any packaged snacks today.",
        "Day 5: Cook a meal from scratch at home.",
        "Day 6: Read the nutrition label of everything you eat.",
        "Day 7: Fast from all junk food for 24 hours."
    ]
};

// --- UNIQUE ROUTINE TASKS PER DAY ---
const DAILY_ROUTINES = {
    1: ["Morning Stretch", "Plan the Day", "10 Min Meditation"],
    2: ["Drink Water First", "Read 5 Pages", "Journal Feelings"],
    3: ["No Screen @ Breakfast", "Deep Breathing", "Tidy Room"],
    4: ["Cold Shower", "Positive Affirmation", "Light Exercise"],
    5: ["Healthy Breakfast", "Work/Study Focus", "Early Sleep"],
    6: ["Mindful Walking", "Gratitude List", "Tea over Coffee"],
    7: ["Reflect on Week 1", "Clean Environment", "Digital Detox"]
};
// 🧠 ADDICTION RECOVERY PROTOCOL (7-Day Cycles)
const RECOVERY_PROTOCOL = {

    sm: [ // Mobile / Social Media
        {
            diet: "High-protein breakfast + banana (dopamine support)",
            physical: "20 min brisk walk in sunlight",
            mental: "10 min meditation (focus on breath)",
            music: "Lo-fi focus instrumental",
            lifestyle: "No phone first 60 minutes after waking"
        },
        {
            diet: "Walnuts + dark chocolate (small piece)",
            physical: "Bodyweight workout 25 min",
            mental: "Journaling: Why am I quitting?",
            music: "Soft classical piano",
            lifestyle: "Turn phone grayscale for the day"
        },
        {
            diet: "Omega-3 rich meal (seeds/fish)",
            physical: "30 min strength training",
            mental: "Deep work session 45 min",
            music: "Instrumental ambient",
            lifestyle: "No scrolling after 8PM"
        },
        {
            diet: "No sugar today",
            physical: "HIIT 20 min",
            mental: "Cold shower 30 sec",
            music: "Motivational instrumental",
            lifestyle: "Notifications off all day"
        },
        {
            diet: "Green smoothie + protein",
            physical: "Yoga 25 min",
            mental: "Gratitude practice",
            music: "Nature rain sounds",
            lifestyle: "Social media max 20 mins"
        },
        {
            diet: "Clean eating whole day",
            physical: "Outdoor walk 40 min",
            mental: "Visualization: Future self",
            music: "Deep focus instrumental",
            lifestyle: "No phone during meals"
        },
        {
            diet: "Balanced meal + fruits",
            physical: "Stretch + light cardio",
            mental: "Weekly reflection",
            music: "Silence (no music challenge)",
            lifestyle: "24h digital detox"
        }
    ],

    sa: [ // Smoking / Alcohol
        {
            diet: "Vitamin C rich fruits (orange, amla)",
            physical: "Fast walk 25 min",
            mental: "Urge surfing practice 5 min",
            music: "Calm instrumental",
            lifestyle: "Avoid trigger place today"
        },
        {
            diet: "Green detox smoothie",
            physical: "Light jog 20 min",
            mental: "Breathing exercise 4-7-8",
            music: "Soft recovery music",
            lifestyle: "Drink 3L water"
        },
        {
            diet: "High protein + fiber meal",
            physical: "Strength workout 30 min",
            mental: "Write 5 benefits of quitting",
            music: "Motivational beats",
            lifestyle: "Stay away from old friends triggers"
        },
        {
            diet: "No caffeine day",
            physical: "Yoga 30 min",
            mental: "Cold exposure 1 min",
            music: "Instrumental focus",
            lifestyle: "Sleep before 10:30PM"
        },
        {
            diet: "Antioxidant rich meal",
            physical: "Cardio 35 min",
            mental: "Guided meditation",
            music: "Healing frequency 432Hz",
            lifestyle: "Sunlight 20 min"
        },
        {
            diet: "Hydration focus day",
            physical: "Strength training",
            mental: "Visualize clean lungs",
            music: "Upbeat instrumental",
            lifestyle: "No junk food"
        },
        {
            diet: "Balanced clean diet",
            physical: "Active rest + stretching",
            mental: "Reflect progress",
            music: "Silence challenge",
            lifestyle: "Digital minimal day"
        }
    ]
};

function initApp() {
    document.getElementById('currentUserName').innerText = appData.user.name;
    if(appData.user.img) applyAvatar(appData.user.img);
    updateSidebarBars();
}

function updateSidebarBars() {
    ["sm", "sa", "gm", "jf"].forEach(key => {
        const day = appData[key].day;
        const currentM = MILESTONES.find(m => day <= m) || 120;
        const prevM = MILESTONES[MILESTONES.indexOf(currentM) - 1] || 0;
        const pct = Math.floor(((day - 1 - prevM) / (currentM - prevM)) * 100);
        const label = document.getElementById(`pct-${key}`);
        const bar = document.getElementById(`bar-${key}`);
        if(label) label.innerText = pct + "%";
        if(bar) bar.style.width = pct + "%";
    });
}

function openAddiction(type) {
    currentAddiction = type;
    const key = STAT_MAP[type];
    const currentDay = appData[key].day;

    document.getElementById('dashboard').style.display = "none";
    document.getElementById('addictionPage').style.display = "block";
    
    // Sync Widgets
    document.getElementById('widgetDay').innerText = currentDay;
    document.getElementById('widgetStreak').innerText = appData[key].streak;
    
    // Load UNIQUE Mission
    const missionIndex = (currentDay - 1) % 7; // Cycles every 7 days, or expand list
    const mission = DAILY_MISSIONS[key][missionIndex] || "Keep pushing forward!";
    document.getElementById('specialTaskBox').innerHTML = `
        <div class="card special-mission">
            <h4 style="margin:0 0 5px 0; color:var(--secondary);">⭐ Special Mission</h4>
            <p style="margin:0; font-weight:bold;">${mission}</p>
        </div>`;
    
    // Load UNIQUE Routine
    const routineIndex = ((currentDay - 1) % 7) + 1;
    const routine = DAILY_ROUTINES[routineIndex] || ["Standard Check-in", "Stay Focused", "Sleep Early"];
// 🔥 Load Recovery Protocol (rotates every 7 days)
const recoveryIndex = (currentDay - 1) % 7;
const recovery = RECOVERY_PROTOCOL[key] 
    ? RECOVERY_PROTOCOL[key][recoveryIndex]
    : null;

if (recovery) {
    document.getElementById('specialTaskBox').innerHTML += `
        <div class="card" style="margin-top:15px;">
            <h4 style="color:var(--secondary); margin-bottom:10px;">🧠 Recovery Boost Plan</h4>
            <p><b>🥗 Diet:</b> ${recovery.diet}</p>
            <p><b>🏃 Physical:</b> ${recovery.physical}</p>
            <p><b>🧘 Mental:</b> ${recovery.mental}</p>
            <p><b>🎵 Music:</b> ${recovery.music}</p>
            <p><b>🌞 Lifestyle:</b> ${recovery.lifestyle}</p>
        </div>
    `;
}

    document.getElementById('routineHeading').innerText = `Day ${currentDay} Routine`;
    document.getElementById('taskList').innerHTML = routine.map(t => `
        <div class="task-row">
            <span>${t}</span>
            <input type="checkbox" style="width:20px; height:20px;">
        </div>`).join('');
    
    document.getElementById('taskContent').style.display = "block";
    document.getElementById('successCard').style.display = "none";
    updateTrophyUI();
}

function markDone() {
    const key = STAT_MAP[currentAddiction];
    const checks = document.querySelectorAll('#taskList input[type="checkbox"]');
    if(!Array.from(checks).every(c => c.checked)) {
        showWarning();
        return;
    }

    appData[key].streak++;
    if(appData[key].streak % 3 === 0) appData[key].shields++;
    appData[key].done[appData[key].day] = true;
    localStorage.setItem("niv_v_final", JSON.stringify(appData));

    confetti({ particleCount: 150, spread: 70 });
    document.getElementById('taskContent').style.display = "none";
    document.getElementById('successCard').style.display = "block";
    document.getElementById('successTitle').innerText = (appData[key].streak % 3 === 0) ? "🛡️ SHIELD EARNED!" : "🌟 DAY COMPLETE";
    document.getElementById('widgetStreak').innerText = appData[key].streak;
}

function advanceToNextDay() {
    const key = STAT_MAP[currentAddiction];
    appData[key].day++;
    localStorage.setItem("niv_v_final", JSON.stringify(appData));
    openAddiction(currentAddiction);
    updateSidebarBars();
}

function updateTrophyUI() {
    const key = STAT_MAP[currentAddiction];
    const day = appData[key].day;
    const currentM = MILESTONES.find(m => day <= m) || 120;
    const prevM = MILESTONES[MILESTONES.indexOf(currentM) - 1] || 0;
    const progress = (day - prevM) / (currentM - prevM);

    document.getElementById('shieldCount').innerText = appData[key].shields;
    const trophy = document.getElementById('trophyPath');
    
    if (day <= 7) trophy.style.stroke = "#d1ccbc";
    else if (day <= 21) trophy.style.stroke = "url(#bronze)";
    else if (day <= 75) trophy.style.stroke = "url(#silver)";
    else trophy.style.stroke = "url(#gold)";

    document.getElementById('milestoneLabel').innerText = `Goal: Day ${currentM}`;
    trophy.style.strokeDashoffset = 260 - (260 * progress);
}

// --- MODALS & PROFILE ---
function showWarning() { document.getElementById('warningModal').style.display = "flex"; }
function hideWarning() { document.getElementById('warningModal').style.display = "none"; }
function showResetModal() { document.getElementById('resetModal').style.display="flex"; }
function hideResetModal() { document.getElementById('resetModal').style.display="none"; }
function confirmReset() { localStorage.clear(); location.reload(); }

function showEditProfile() { 
    document.getElementById('profileDisplay').style.display="none";
    document.getElementById('profileEdit').style.display="block"; 
}
function saveProfile() {
    const n = document.getElementById('userNameInput').value;
    if(n) appData.user.name = n;
    localStorage.setItem("niv_v_final", JSON.stringify(appData));
    location.reload();
}
function previewImg(input) {
    const reader = new FileReader();
    reader.onload = e => { appData.user.img = e.target.result; applyAvatar(e.target.result); };
    reader.readAsDataURL(input.files[0]);
}
function applyAvatar(src) { 
    document.getElementById('userAvatar').innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover;">`; 
}
function toggleSidebar() { 
    const open = document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').style.display = open ? "block" : "none";
}
function goBack() { 
    document.getElementById('dashboard').style.display="block"; 
    document.getElementById('addictionPage').style.display="none"; 
    updateSidebarBars();
}
