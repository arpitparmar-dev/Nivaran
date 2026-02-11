let currentAddiction = "";

let appData = JSON.parse(localStorage.getItem("niv_v_final")) || {
    user: { name: "Guest", img: null },
    sm: { day: 1, streak: 0, shields: 0, done: {} },
    sa: { day: 1, streak: 0, shields: 0, done: {} },
    gm: { day: 1, streak: 0, shields: 0, done: {} },
    jf: { day: 1, streak: 0, shields: 0, done: {} }
};

const MILESTONES = [7, 21, 30, 60, 75, 120];
const STAT_MAP = {
    "Mobile & Social Media": "sm",
    "Smoking / Alcohol": "sa",
    "Gaming": "gm",
    "Junk Food": "jf"
};

const DAILY_MISSIONS = {
    sm: [
        "Day 1: Uninstall one non-essential social app.",
        "Day 2: Set a 30-minute limit on Instagram/TikTok.",
        "Day 3: Do not check your phone for the first hour of the day.",
        "Day 4: Turn off all non-human notifications.",
        "Day 5: Leave your phone in another room while eating.",
        "Day 6: No phone 1 hour before sleep.",
        "Day 7: Full 24-hour social media fast."
    ],
    sa: [
        "Day 1: Pour away any remaining stash/bottles.",
        "Day 2: Identify your top 3 'trigger' situations.",
        "Day 3: Drink 3 Liters of water today.",
        "Day 4: Call a friend or mentor for 10 minutes.",
        "Day 5: Walk for 20 minutes when a craving hits.",
        "Day 6: Write down 5 things you'll gain by quitting.",
        "Day 7: Avoid the place where you usually indulge."
    ],
    gm: [
        "Day 1: Move your console/PC to a different spot.",
        "Day 2: Unsubscribe from one gaming YouTube channel.",
        "Day 3: Limit gaming to exactly 1 hour (or zero).",
        "Day 4: Clean your physical desk space entirely.",
        "Day 5: Try a new physical hobby for 30 minutes.",
        "Day 6: Research a skill you want to learn instead.",
        "Day 7: Delete one game you are addicted to."
    ],
    jf: [
        "Day 1: Swap soda for sparkling or plain water.",
        "Day 2: No added sugar in your tea/coffee.",
        "Day 3: Eat two servings of green vegetables.",
        "Day 4: Do not eat any packaged snacks today.",
        "Day 5: Cook a meal from scratch at home.",
        "Day 6: Read the nutrition label of everything you eat.",
        "Day 7: Fast from all junk food for 24 hours."
    ]
};

const DAILY_ROUTINES = {
    1: ["Morning Stretch", "Plan the Day", "10 Min Meditation"],
    2: ["Drink Water First", "Read 5 Pages", "Journal Feelings"],
    3: ["No Screen @ Breakfast", "Deep Breathing", "Tidy Room"],
    4: ["Cold Shower", "Positive Affirmation", "Light Exercise"],
    5: ["Healthy Breakfast", "Work/Study Focus", "Early Sleep"],
    6: ["Mindful Walking", "Gratitude List", "Tea over Coffee"],
    7: ["Reflect on Week 1", "Clean Environment", "Digital Detox"]
};

const MEALS = {
    sm: {
        breakfast: ["Oatmeal (Oats) with nuts and banana", "Vegetable omelette (Masala Omelette) + whole wheat toast", "Greek yogurt (Dahi) + berries and seeds", "Peanut butter toast + apple", "Tofu scramble + fruit bowl"],
        lunch: ["Brown rice + lentil curry (Dal) + mixed vegetables (Sabzi)", "Quinoa + grilled chicken/tofu + salad", "Whole wheat flatbread (Roti) + cottage cheese curry (Paneer)", "Chickpea curry (Chole) + brown rice"],
        dinner: ["Vegetable soup + grilled cottage cheese (Paneer)", "Stir-fried vegetables + tofu", "Spinach soup (Palak Soup) + salad", "Light lentil-rice porridge (Khichdi)"]
    },
    sa: {
        breakfast: ["Citrus fruits (Orange/Amla) + oatmeal", "Green smoothie (Spinach + Apple)", "Boiled eggs + whole wheat toast", "Greek yogurt (Dahi) + flax seeds"],
        lunch: ["Brown rice + beetroot + lentil curry (Dal)", "Grilled chicken/tofu + steamed broccoli", "Kidney bean curry (Rajma) + brown rice", "Quinoa + mixed vegetable curry"],
        dinner: ["Vegetable soup + turmeric milk", "Clear chicken soup", "Spinach curry (Palak) + whole wheat flatbread", "Light khichdi + ghee"]
    },
    gm: {
        breakfast: ["Oatmeal + peanut butter + banana", "Egg omelette + whole wheat toast", "Banana peanut butter smoothie", "Sprouts salad + boiled eggs"],
        lunch: ["Brown rice + grilled protein + salad", "Sweet potato + lentil curry (Dal)", "Whole wheat flatbread + cottage cheese curry", "Chickpea curry (Chole) + quinoa"],
        dinner: ["Grilled tofu + sautéed vegetables", "Mixed salad bowl + eggs", "Lentil soup + whole wheat flatbread", "Vegetable curry + quinoa"]
    },
    jf: {
        breakfast: ["Vegetable omelette + fruit", "Sprouts salad + nuts", "Oatmeal (Oats) + chia seeds", "Greek yogurt (Dahi) + apple"],
        lunch: ["Brown rice + lentil curry + salad", "Grilled tofu/chicken + steamed vegetables", "Whole wheat flatbread + vegetable curry", "Lentil-rice porridge (Khichdi)"],
        dinner: ["Vegetable soup + salad", "Stir-fried vegetables + tofu", "Spinach soup (Palak Soup)", "Light lentil curry + whole wheat flatbread"]
    }
};

function getPhase(day){
    if(day <= 7) return 1;
    if(day <= 21) return 2;
    if(day <= 30) return 3;
    if(day <= 60) return 4;
    if(day <= 75) return 5;
    return 6;
}

function generateRecoveryPlan(key, day){
    const phase = getPhase(day);
    const workout = 15 + (day * 0.5);
    const meditation = 5 + (day * 0.2);
    const sunlight = 10 + Math.floor(day / 5);
    const meals = MEALS[key];

    const breakfast = meals.breakfast[day % meals.breakfast.length];
    const lunch = meals.lunch[(day * 2) % meals.lunch.length];
    const dinner = meals.dinner[(day * 3) % meals.dinner.length];

    let plan = {};
    const detailedDietContent = `🥣 BREAKFAST:\n• ${breakfast}\n\n🍛 LUNCH:\n• ${lunch}\n\n🍲 DINNER:\n• ${dinner}\n\n🚫 AVOID:\n• Processed sugar\n• Fried packaged snacks\n• Sugary beverages\n\n💧 WATER:\n• 2.5–3 Litres daily`;

    if(key === "sm"){
        plan = {
            shortDiet: "High protein + low sugar discipline",
            detailedDiet: detailedDietContent,
            physical: `${workout.toFixed(0)} mins brisk walk + posture correction.`,
            mental: `${meditation.toFixed(0)} mins meditation + deep work session.`,
            music: phase < 3 ? "Lo-fi / Ambient focus" : phase < 5 ? "Binaural concentration beats" : "High-focus performance instrumentals",
            lifestyle: `${sunlight} mins morning sunlight + fixed screen schedule.`
        };
    } else if(key === "sa"){
        plan = {
            shortDiet: "Detox + lung & liver recovery",
            detailedDiet: detailedDietContent,
            physical: `${workout.toFixed(0)} mins cardio + breathing drills.`,
            mental: `${meditation.toFixed(0)} mins urge surfing.`,
            music: phase < 3 ? "Calm healing instrumental" : phase < 5 ? "Recovery frequency music" : "Transformation motivation beats",
            lifestyle: `${sunlight} mins sunlight + avoid trigger areas.`
        };
    } else if(key === "gm"){
        plan = {
            shortDiet: "Stable energy, no sugar spikes",
            detailedDiet: detailedDietContent,
            physical: `${workout.toFixed(0)} mins strength training.`,
            mental: `${meditation.toFixed(0)} mins focus training.`,
            music: phase < 3 ? "Focus lo-fi" : phase < 5 ? "Cognitive performance music" : "High intensity gym soundtrack",
            lifestyle: `${sunlight} mins outdoor exposure.`
        };
    } else if(key === "jf"){
        plan = {
            shortDiet: "Whole food reset + sugar elimination",
            detailedDiet: detailedDietContent,
            physical: `${workout.toFixed(0)} mins fat-burn workout.`,
            mental: `${meditation.toFixed(0)} mins mindful eating.`,
            music: phase < 3 ? "Calm discipline playlist" : phase < 5 ? "Focused training beats" : "Hardcore workout motivation",
            lifestyle: `${sunlight} mins post-meal walk.`
        };
    }
    return plan;
}

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
    
    document.getElementById('widgetDay').innerText = currentDay;
    document.getElementById('widgetStreak').innerText = appData[key].streak;
    
    const missionIndex = (currentDay - 1) % 7; 
    const mission = DAILY_MISSIONS[key][missionIndex] || "Keep pushing forward!";
    document.getElementById('specialTaskBox').innerHTML = `
        <div class="card special-mission">
            <h4 style="margin:0 0 5px 0; color:var(--secondary);">⭐ Special Mission</h4>
            <p style="margin:0; font-weight:bold;">${mission}</p>
        </div>`;
    
    const recovery = generateRecoveryPlan(key, currentDay);

    if (recovery) {
        document.getElementById('specialTaskBox').innerHTML += `
            <div class="card" style="margin-top:15px;">
                <h4 style="color:var(--secondary); margin-bottom:10px;">💪 Recovery Boost Plan</h4>

                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px;" onclick="toggleSection('moreDetails', 'arrowIconDiet')">
                    <p style="margin:0;"><b>🥗 Diet:</b> ${recovery.shortDiet}</p>
                    <span id="arrowIconDiet" style="transition: 0.3s; font-size: 14px; opacity: 0.7;">▶</span>
                </div>
                <div id="moreDetails" style="display:none; margin-top:5px; margin-bottom:10px; white-space:pre-line; border-top: 1px solid rgba(0,0,0,0.1); padding-top:10px;">
                    <p style="font-size: 17px; font-weight: bold; margin:0; color: var(--primary);">Detailed Diet Plan:</p>
                    <div style="font-size: 16px; line-height: 1.3; font-weight: 500; margin-top: 5px;">
                        ${recovery.detailedDiet}
                    </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px;" onclick="toggleSection('morePhysical', 'arrowIconPhys')">
                    <p style="margin:0;"><b>🏃 Physical:</b> ${recovery.physical}</p>
                    <span id="arrowIconPhys" style="transition: 0.3s; font-size: 14px; opacity: 0.7;">▶</span>
                </div>
                <div id="morePhysical" style="display:none; margin-top:5px; margin-bottom:10px; border-top: 1px solid rgba(0,0,0,0.1); padding-top:10px;">
                    <p style="font-size: 15px; font-weight: bold; margin-bottom: 8px; color: var(--primary);">Exercise Routines:</p>
                    <a href="https://youtu.be/KaIeBaxzIqs?si=X7DBb4Cdc528aTyV" target="_blank" 
                       style="display: block; background: #66350F; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px; margin-bottom: 6px; width: fit-content;">
                       ▶ WALKING WORKOUT
                    </a>
                    <a href="https://youtu.be/XWQvmh_INTQ?si=YUwz7AdacW9M9YpX" target="_blank" 
                       style="display: block; background: #66350F; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px; width: fit-content;">
                       ▶ POSTURE ROUTINE
                    </a>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px;" onclick="toggleSection('moreMental', 'arrowIconMental')">
                    <p style="margin:0;"><b>🧘 Mental:</b> ${recovery.mental}</p>
                    <span id="arrowIconMental" style="transition: 0.3s; font-size: 14px; opacity: 0.7;">▶</span>
                </div>
                <div id="moreMental" style="display:none; margin-top:5px; margin-bottom:10px; border-top: 1px solid rgba(0,0,0,0.1); padding-top:10px;">
                    <p style="font-size: 15px; font-weight: bold; margin-bottom: 8px; color: var(--primary);">Mindfulness:</p>
                    <div style="font-size: 14px; line-height: 1.4; margin-bottom: 10px;">Focus on your breath and observe your thoughts without judgment to build impulse control.</div>
                    <a href="https://youtu.be/DaHH--jJBtg?si=zwUw0w9NIGM3iTqw" target="_blank" 
                       style="display: block; background: #66350F; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px; width: fit-content;">
                       ▶ WATCH MEDITATION
                    </a>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px;" onclick="toggleSection('moreMusic', 'arrowIconMusic')">
                    <p style="margin:0;"><b>🎵 Music:</b> ${recovery.music}</p>
                    <span id="arrowIconMusic" style="transition: 0.3s; font-size: 14px; opacity: 0.7;">▶</span>
                </div>
                <div id="moreMusic" style="display:none; margin-top:5px; margin-bottom:10px; border-top: 1px solid rgba(0,0,0,0.1); padding-top:10px;">
                    <p style="font-size: 15px; font-weight: bold; margin-bottom: 8px; color: var(--primary);">Audio Therapy:</p>
                    <div style="font-size: 14px; line-height: 1.4; margin-bottom: 10px;">Binaural beats and focus tracks designed to help rewire reward pathways.</div>
                    <a href="https://youtu.be/Vbmx-XFdS8s?si=MbZr2XzXXUdTG-BW" target="_blank" 
                       style="display: block; background: #66350F; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px; width: fit-content;">
                       ▶ LISTEN TO LOFI
                    </a>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px;" onclick="toggleSection('moreLifestyle', 'arrowIconLifestyle')">
                    <p style="margin:0;"><b>🌞 Lifestyle:</b> ${recovery.lifestyle}</p>
                    <span id="arrowIconLifestyle" style="transition: 0.3s; font-size: 14px; opacity: 0.7;">▶</span>
                </div>
                <div id="moreLifestyle" style="display:none; margin-top:5px; margin-bottom:10px; border-top: 1px solid rgba(0,0,0,0.1); padding-top:10px;">
                    <p style="font-size: 15px; font-weight: bold; margin-bottom: 5px; color: var(--primary);">Routine Mastery:</p>
                    <div style="font-size: 14px; line-height: 1.4;">Establish a fixed environment to reduce the brain's reliance on addictive triggers.</div>
                </div>
            </div>
        `;
    }

    const routineIndex = ((currentDay - 1) % 7) + 1;
    const routine = DAILY_ROUTINES[routineIndex] || ["Standard Check-in", "Stay Focused", "Sleep Early"];

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

// --- WHY MODAL FUNCTIONS ---
function showWhyModal(){
    const key = STAT_MAP[currentAddiction];
    let content = "";

    if(key === "sm"){
        content = `<b>📱 Mobile / Social Media Addiction</b><br><br>🥗 Diet stabilizes dopamine by preventing sugar spikes that mimic social media reward loops.<br><br>🏃 Physical activity increases natural dopamine and serotonin, reducing craving for screen stimulation.<br><br>🧘 Meditation strengthens impulse control and reduces compulsive checking behavior.`;
    } else if(key === "sa"){
        content = `<b>🚬 Smoking / Alcohol Recovery</b><br><br>🥗 Antioxidant-rich foods repair liver and lung damage while reducing withdrawal fatigue.<br><br>🏃 Cardio improves oxygen flow and speeds toxin removal.<br><br>🧘 Urge surfing retrains the brain to tolerate cravings without reacting.`;
    } else if(key === "gm"){
        content = `<b>🎮 Gaming Addiction</b><br><br>🥗 Stable meals prevent blood sugar crashes that increase gaming urges.<br><br>🏃 Strength training boosts real-world achievement dopamine.<br><br>🧘 Focus training rebuilds attention span damaged by fast-paced gaming.`;
    } else if(key === "jf"){
        content = `<b>🍔 Junk Food Addiction</b><br><br>🥗 Whole foods reset gut bacteria that drive sugar cravings.<br><br>🏃 Exercise increases insulin sensitivity and reduces craving intensity.<br><br>🧘 Mindful eating rebuilds awareness between hunger and emotional eating.`;
    }

    document.getElementById("whyContent").innerHTML = content;
    document.getElementById("whyModal").style.display = "flex";
}

function closeWhyModal(){
    document.getElementById("whyModal").style.display = "none";
}

// --- UTILITY FUNCTIONS ---
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

function toggleSection(sectionId, arrowId) {
    const box = document.getElementById(sectionId);
    const arrow = document.getElementById(arrowId);
    if(box.style.display === "none"){
        box.style.display = "block";
        arrow.style.transform = "rotate(90deg)";
    } else {
        box.style.display = "none";
        arrow.style.transform = "rotate(0deg)";
    }
}

function goBack() {
    document.getElementById('dashboard').style.display="block";
    document.getElementById('addictionPage').style.display="none";
    updateSidebarBars();
}

function toggleSidebar() {
    const open = document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').style.display = open ? "block" : "none";
}

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
