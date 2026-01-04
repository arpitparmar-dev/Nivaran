let app = JSON.parse(localStorage.getItem("nivaran")) || {
  name:"",
  day:1,
  streak:0,
  xp:0,
  level:1,
  badges:[],
  history:[],
  reports:{}
};

/* SIDEBAR */
function toggleSidebar(){
  document.getElementById("sidebar").classList.toggle("open");
}

/* PROFILE */
document.getElementById("username").value = app.name;
function saveName(){
  app.name = document.getElementById("username").value;
  save();
}

/* RINGS */
function updateRings(){
  document.getElementById("dayCount").innerText = app.day;
  document.getElementById("streakCount").innerText = app.streak;

  document.getElementById("dayRing").style.background =
    `conic-gradient(#2f5d62 ${app.day*10}deg,#e5e7eb 0deg)`;

  document.getElementById("streakRing").style.background =
    `conic-gradient(#5e8b7e ${app.streak*15}deg,#e5e7eb 0deg)`;
}

/* XP + LEVEL */
function addXP(amount){
  app.xp += amount;
  const newLevel = Math.floor(app.xp/150)+1;
  if(newLevel > app.level){
    app.level = newLevel;
    app.history.push(`🏆 Level Up! Reached Level ${app.level}`);
  }
}

/* BADGES */
function unlockBadge(name){
  if(!app.badges.includes(name)){
    app.badges.push(name);
    app.history.push(`🏅 Badge unlocked: ${name}`);
  }
}

/* STATS */
function renderStats(){
  document.getElementById("xp").innerText = app.xp;
  document.getElementById("level").innerText = app.level;
  document.getElementById("badges").innerText = app.badges.join(", ") || "None";
}

/* HISTORY */
function renderHistory(){
  const h=document.getElementById("history");
  h.innerHTML="";
  app.history.slice().reverse().forEach(i=>{
    h.innerHTML+=`<div class="card">${i}</div>`;
  });
}

/* CALENDAR */
function renderCalendar(){
  const cal=document.getElementById("calendar");
  cal.innerHTML="";
  Object.keys(app.reports).forEach(d=>{
    const el=document.createElement("div");
    el.className="day done";
    el.innerText=new Date(d).getDate();
    el.title=app.reports[d];
    cal.appendChild(el);
  });
}

/* AI GUIDANCE */
function dailyTip(){
  const tips=[
    "Delay urges by 10 minutes — urges fade.",
    "Replace habits, don’t remove them.",
    "Discomfort means growth.",
    "Small wins beat motivation.",
    "Change environment, not willpower."
  ];
  document.getElementById("aiTip").innerText =
    tips[new Date().getDate() % tips.length];
}

/* PLANS */
function selectType(type){
  const plans=[
    "🧘 Mindfulness exercise",
    "🏃 Physical movement",
    "⏱ Delay the urge",
    "📓 Self-reflection"
  ];

  let html=`<h2>${type} Recovery</h2>`;
  plans.forEach(p=>html+=`<div class="card">${p}</div>`);
  html+=`<button onclick="completeDay('${type}')">Mark Day Complete</button>`;
  document.getElementById("solution").innerHTML=html;
}

/* COMPLETE DAY */
function completeDay(type){
  const today=new Date().toDateString();
  if(!app.reports[today]){
    app.reports[today]=type;
    app.day++;
    app.streak++;
    addXP(50);

    if(app.day===2) unlockBadge("Starter");
    if(app.streak%7===0) unlockBadge("Consistency");

    app.history.push(`✅ ${type} completed (+50 XP)`);
    save();
    init();
  }
}

/* SAVE */
function save(){
  localStorage.setItem("nivaran",JSON.stringify(app));
}

/* INIT */
function init(){
  updateRings();
  renderStats();
  renderHistory();
  renderCalendar();
  dailyTip();
}
init();
