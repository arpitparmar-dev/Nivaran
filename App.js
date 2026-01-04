document.addEventListener("DOMContentLoaded", () => {

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

  function save(){
    localStorage.setItem("nivaran", JSON.stringify(app));
  }

  function toggleSidebar(){
    document.getElementById("sidebar")?.classList.toggle("open");
  }

  const usernameInput = document.getElementById("username");
  if (usernameInput) usernameInput.value = app.name;

  function saveName(){
    if (!usernameInput) return;
    app.name = usernameInput.value;
    save();
  }

  function updateRings(){
    document.getElementById("dayCount").innerText = app.day;
    document.getElementById("streakCount").innerText = app.streak;
  }

  function addXP(amount){
    app.xp += amount;
    const newLevel = Math.floor(app.xp / 150) + 1;
    if (newLevel > app.level){
      app.level = newLevel;
      app.history.push(`🏆 Level Up! Level ${app.level}`);
    }
  }

  function unlockBadge(name){
    if (!app.badges.includes(name)){
      app.badges.push(name);
      app.history.push(`🏅 Badge unlocked: ${name}`);
    }
  }

  function renderStats(){
    document.getElementById("xp").innerText = app.xp;
    document.getElementById("level").innerText = app.level;
    document.getElementById("badges").innerText =
      app.badges.join(", ") || "None";
  }

  function renderHistory(){
    const h = document.getElementById("history");
    h.innerHTML = "";
    app.history.slice().reverse().forEach(i => {
      h.innerHTML += `<div>${i}</div>`;
    });
  }

  function renderCalendar(){
    const cal = document.getElementById("calendar");
    cal.innerHTML = "";
    Object.keys(app.reports).forEach(d => {
      const el = document.createElement("div");
      el.innerText = new Date(d).getDate();
      el.title = app.reports[d];
      cal.appendChild(el);
    });
  }

  function dailyTip(){
    const tips = [
      "Delay urges by 10 minutes.",
      "Replace habits, don’t remove them.",
      "Discomfort means growth.",
      "Small wins matter.",
      "Change environment, not willpower."
    ];
    document.getElementById("aiTip").innerText =
      tips[new Date().getDate() % tips.length];
  }

  function selectType(type){
    const plans = [
      "🧘 Mindfulness exercise",
      "🏃 Physical movement",
      "⏱ Delay the urge",
      "📓 Self-reflection"
    ];

    let html = `<h3>${type} Recovery</h3>`;
    plans.forEach(p => html += `<div>${p}</div>`);
    html += `<button onclick="completeDay('${type}')">Mark Complete</button>`;
    document.getElementById("solution").innerHTML = html;
  }

  function completeDay(type){
    const today = new Date().toDateString();
    if (!app.reports[today]){
      app.reports[today] = type;
      app.day++;
      app.streak++;
      addXP(50);

      if (app.day === 2) unlockBadge("Starter");
      if (app.streak % 7 === 0) unlockBadge("Consistency");

      app.history.push(`✅ ${type} completed (+50 XP)`);
      save();
      init();
    }
  }

  function init(){
    updateRings();
    renderStats();
    renderHistory();
    renderCalendar();
    dailyTip();
  }

  init();

  // 🔥 MAKE FUNCTIONS AVAILABLE TO HTML (CRITICAL)
  window.toggleSidebar = toggleSidebar;
  window.saveName = saveName;
  window.selectType = selectType;
  window.completeDay = completeDay;

});
