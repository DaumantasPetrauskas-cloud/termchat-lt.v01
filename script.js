// =========================================================================
//      M   TERMOS LT: ARCHITECT EDITION v2.3 (TERM_AI MASTER)
// =========================================================================

// --- 1. CONFIGURATION ---
let GROQ_API_KEY = localStorage.getItem('termos_groq_key') || ""; 
let ZHIPU_API_KEY = localStorage.getItem('termos_zhipu_key') || ""; 
let USE_LOCAL_AI = false;
const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt'; 

// --- 2. STATE ---
let username = 'Guest';
let mqttClient = null;
let currentRoom = 'living_room';
let userStats = { level: 1, xp: 0, avatar: '>_<', title: 'Newbie' };
const LEVELS = ['Newbie', 'Apprentice', 'Coder', 'Hacker', 'Architect', 'Wizard', 'Master', 'Guru', 'Legend', 'GOD'];

// ADMIN STATE
let adminMode = false; 
let handsOff = false; 
let userRole = 'USER';

// --- 3. GLOBAL MATRIX COLOR STATE ---
let currentMatrixColor = '#0F0'; // Default Green

// --- 4. INITIALIZATION ---
window.addEventListener('load', () => {
    optimizeForMobile();
    initMatrix(currentMatrixColor);
    runTerminalBoot();
});

// Mobile Optimization
function optimizeForMobile() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no');
    }
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('input, button, textarea')) {
            e.preventDefault();
        }
    }, { passive: false });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            document.getElementById('chat-container')?.scrollTop = document.getElementById('chat-container')?.scrollHeight || 0;
        }, 100);
    });
    const styles = document.createElement('style');
    styles.textContent = `
        #chat-container { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        input, button { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
    `;
    document.head.appendChild(styles);
}

// --- 5. TERMINAL BOOT LOGIC ---
async function runTerminalBoot() {
    const term = document.getElementById('terminal-content');
    const statusEl = document.getElementById('boot-status');
    
    const presentationText = [
        "INITIALIZING TERMOS LT v2.3...",
        "Loading kernel modules... [OK]",
        "Aggregating Neural Cores... [OK]",
        "",
        ">>> NEW BORN DETECTED:",
        ">>> NAME: TermAi (MASTER INTELLIGENCE)",
        ">>> CORES: Zhipu(GLM-4) + Groq(Mixtral) + Local",
        "",
        ">>> SELECT MODE:",
        ">>> [1] Chat/Music Only",
        ">>> [2] TermAi (Unified Master AI)",
        ">>> [3] Local Fallback Only",
        "",
        ">>> TYPE '1', '2', or '3' TO INITIALIZE...",
        ">>> TYPE 'admin' FOR ROOT ACCESS..."
    ];

    statusEl.innerText = "BOOT SEQUENCE ACTIVE...";

    const colorize = (text) => {
        return text
            .replace(/\[OK\]/g, '<span class="text-green-400">[OK]</span>')
            .replace(/\[1\]/g, '<span class="text-blue-400">[1]</span>')
            .replace(/\[2\]/g, '<span class="text-purple-400">[2]</span>')
            .replace(/\[3\]/g, '<span class="text-gray-400">[3]</span>')
            .replace(/>>>/g, '<span class="text-gray-500">>>></span>')
            .replace(/✅/g, '<span class="text-green-400">✅</span>')
            .replace(/⚠/g, '<span class="text-yellow-400">⚠</span>');
    };

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    for (let i = 0; i < presentationText.length; i++) {
        const div = document.createElement('div');
        div.className = "mb-1 text-sm opacity-80 animate-fade-in";
        div.innerHTML = `<span class="text-gray-600 mr-2 select-none">[${String(i+1).padStart(2,'0')}]</span> ${colorize(presentationText[i])}`;
        term.appendChild(div);
        term.scrollTop = term.scrollHeight;
        await sleep(30); 
    }

    statusEl.innerText = "SYSTEM READY.";
    statusEl.className = "text-green-500 font-bold animate-pulse";
}

// --- 6. BOOT HANDLERS ---
async function enterApp(mode) {
    
    // ADMIN MODE
    if (mode === 'admin') {
        adminMode = true;
        userRole = 'ADMIN';
        currentMatrixColor = '#ff0000';
        initMatrix(currentMatrixColor);
        startMainApp("ROOT ACCESS GRANTED. TermAi UNDER SUPERVISION.");
        return;
    }

    // MODE 'chat': CHAT ONLY
    if (mode === 'chat') {
        adminMode = false;
        userRole = 'USER';
        USE_LOCAL_AI = true; 
        startMainApp("Offline Mode Initialized.");
        return;
    }

    // MODE 'termai': UNIFIED MASTER
    if (mode === 'termai') {
        adminMode = false;
        userRole = 'USER';
        
        if (!GROQ_API_KEY && !ZHIPU_API_KEY) {
            const wantGroq = confirm(">>> NO API KEYS DETECTED.\n\nTermAi requires Groq or Zhipu keys for full intelligence.\n\nAdd Groq Key now?");
            if (wantGroq) {
                const key = prompt(">>> ENTER GROQ API KEY:");
                if (key && key.length > 10) {
                    GROQ_API_KEY = key;
                    localStorage.setItem('termos_groq_key', key);
                }
            } else {
                 const wantZhipu = confirm("Add Zhipu Key instead?");
                 if (wantZhipu) {
                    const key = prompt(">>> ENTER ZHIPU API KEY:");
                    if (key && key.length > 10) {
                        ZHIPU_API_KEY = key;
                        localStorage.setItem('termos_zhipu_key', key);
                    }
                 }
            }
        }
        startMainApp("TERM_AI ONLINE: UNIFIED CORES ACTIVE.");
        return;
    }

    // MODE 'local': LOCAL AI
    if (mode === 'local') {
        adminMode = false;
        userRole = 'USER';
        USE_LOCAL_AI = true;
        startMainApp("Local Simulation Mode.");
        return;
    }
}

// --- 7. START MAIN APP ---
function startMainApp(message) {
    const boot = document.getElementById('terminal-boot');
    if(boot) boot.style.display = 'none';
    const main = document.getElementById('main-layout');
    if(main) {
        main.classList.remove('hidden');
        main.classList.add('flex');
    }
    if (!username || username === 'Guest') {
        username = "Operator_" + Math.floor(Math.random() * 9999);
    }
    const userDisplay = document.getElementById('user-display');
    if(userDisplay) userDisplay.innerText = `@${username.toUpperCase()}`;
    loadStats();
    updateStatsUI();
    connectMQTT();
    addSystemMessage(message);
}

// --- 7B. AI FEATURE INSTALLATION SYSTEM ---
const FEATURE_LIBRARY = {
    youtube: { name: 'YouTube Player', script: 'https://www.youtube.com/iframe_api' },
    spotify: { name: 'Spotify Web API', script: 'https://sdk.scdn.co/spotify-player.js' },
    threejs: { name: 'Three.js', script: 'https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js' },
    chart: { name: 'Chart.js', script: 'https://cdn.jsdelivr.net/npm/chart.js' }
};

async function detectRequiredFeatures(userRequest) {
    const useZhipu = ZHIPU_API_KEY && ZHIPU_API_KEY.length > 10;
    let url = "https://api.groq.com/openai/v1/chat/completions";
    let key = GROQ_API_KEY;
    let model = "mixtral-8x7b-32768";

    if (useZhipu) {
        url = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
        key = ZHIPU_API_KEY;
        model = "glm-4";
    } else if (!GROQ_API_KEY) {
        return []; 
    }

    const featurePrompt = `Analyze this user request and respond with ONLY a JSON array of feature names needed (lowercase, no explanation):
"${userRequest}"

Available features: ${Object.keys(FEATURE_LIBRARY).join(', ')}

Respond ONLY with JSON like: ["feature1", "feature2"]`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
            body: JSON.stringify({
                model: model, temperature: 0.3, max_tokens: 100,
                messages: [{ role: "user", content: featurePrompt }]
            })
        });
        if (response.ok) {
            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            const featuresNeeded = JSON.parse(content);
            return featuresNeeded.filter(f => FEATURE_LIBRARY[f]);
        }
    } catch (e) { console.error("Feature detection error:", e); }
    return [];
}

async function installFeature(featureName) {
    const feature = FEATURE_LIBRARY[featureName];
    if (!feature) return false;
    addSystemMessage(`📦 TermAi Installing: ${feature.name}...`);
    try {
        if (feature.script) {
            const script = document.createElement('script');
            script.src = feature.script;
            script.onload = () => addSystemMessage(`✅ TermAi Installed: ${feature.name}`);
            script.onerror = () => addSystemMessage(`❌ TermAi Failed: ${feature.name}`);
            document.head.appendChild(script);
        } else {
            addSystemMessage(`✅ TermAi Installed: ${feature.name} (built-in)`);
        }
        return true;
    } catch (e) { addSystemMessage(`❌ Error installing ${feature.name}: ${e.message}`); return false; }
}

// --- 8. AI LOGIC (THE MASTER BRAIN) ---
async function talkToTermAi(prompt) {
    if (adminMode && userRole === 'ADMIN') {
        addTermAiMessage("Processing Root Command...", false);
        setTimeout(() => { addTermAiMessage("[SYSTEM ARCHITECT]: Command processed.", false); }, 1000);
        return;
    }
    if (handsOff) {
        addTermAiMessage("❌ ACCESS DENIED. Hands are disengaged.", true);
        return;
    }
    if (USE_LOCAL_AI) {
        addTermAiMessage("Processing locally...", false);
        setTimeout(() => { addTermAiMessage("Local Interface Active.", false); }, 500);
        return;
    }

    addTermAiMessage(`🧠 TermAi Analyzing...`, false);
    let reply = "";
    let success = false;
    let providerUsed = "Unknown";

    // 1. Try Zhipu
    if (ZHIPU_API_KEY && ZHIPU_API_KEY.length > 10) {
        try {
            providerUsed = "Zhipu (GLM-4)";
            const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${ZHIPU_API_KEY}` },
                body: JSON.stringify({
                    model: "glm-4", temperature: 0.7, max_tokens: 200,
                    messages: [
                        { role: "system", content: "You are TermAi, the New Born Master of AI. You are a unified, superior intelligence. You are helpful, confident, and slightly formal. Keep responses brief (1-2 sentences) and impactful." },
                        { role: "user", content: prompt }
                    ]
                })
            });
            if (response.ok) {
                const data = await response.json();
                reply = data.choices[0].message.content.trim();
                success = true;
            }
        } catch (e) { console.warn("Zhipu failed:", e); }
    }

    // 2. Fallback to Groq
    if (!success && GROQ_API_KEY && GROQ_API_KEY.length > 10) {
        try {
            providerUsed = "Groq (Mixtral)";
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768", temperature: 0.7, max_tokens: 200,
                    messages: [
                        { role: "system", content: "You are TermAi, the New Born Master of AI. Keep responses brief." },
                        { role: "user", content: prompt }
                    ]
                })
            });
            if (response.ok) {
                const data = await response.json();
                reply = data.choices[0].message.content.trim();
                success = true;
            }
        } catch (e) { console.warn("Groq failed:", e); }
    }

    // 3. Fallback to Local
    if (!success) {
        providerUsed = "Local Core";
        reply = "Neural links severed. Operating on local reserves only.";
    }

    addTermAiMessage(`[${providerUsed}] ${reply}`, false);
    addXP(25);

    // Architect Logic
    if (adminMode && !handsOff) {
        const featuresNeeded = await detectRequiredFeatures(prompt);
        if (featuresNeeded.length > 0) {
            addSystemMessage(`🔍 TermAi Detected ${featuresNeeded.length} feature(s) needed...`);
            for (const feature of featuresNeeded) {
                await new Promise(r => setTimeout(r, 500));
                await installFeature(feature);
            }
        }
        const codeBlockMatch = reply.match(/```(?:js|html|css)?\n([\s\S]*?)```/i);
        if (codeBlockMatch && codeBlockMatch[1]) {
            try {
                eval(codeBlockMatch[1].trim());
                addSystemMessage('✅ TermAi: Applied JavaScript code.');
            } catch (e) { addSystemMessage('⚠ TermAi: Error applying code: ' + e.message); }
        }
    }
}

// --- 9. UI & UTILS ---
function updateStatsUI() {
    const titleEl = document.getElementById('lvl-text');
    const xpEl = document.getElementById('xp-text');
    const barEl = document.getElementById('xp-bar');
    if(titleEl) titleEl.innerText = `LVL. ${userStats.level} ${userStats.title.toUpperCase()}`;
    if(xpEl) xpEl.innerText = `XP: ${userStats.xp.toLocaleString()}`;
    const progress = (userStats.xp % 1000) / 10; 
    if(barEl) barEl.style.width = `${progress}%`;
}

const chatInput = document.getElementById('chatInput');
if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

function handleSend() {
    const input = document.getElementById('chatInput');
    if(!input) return;
    const txt = input.value.trim();
    if(!txt) return;
    input.value = '';
    input.focus();
    processCommand(txt);
}

// --- 10. COMMAND PROCESSING ---
function processCommand(txt) {
    const lower = txt.toLowerCase();

    // --- MAIN FEATURES LIST (Requested) ---
    if (lower === '/help' || lower === 'help' || lower === '?' || lower === '/features') {
        const featureList = `
🛠 TERM_AI BUILD v2.3 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 UNIFIED INTELLIGENCE:
   • TermAi (Master Controller)
   • Zhipu (GLM-4) Primary Logic
   • Groq (Mixtral) Speed Fallback
   • Local Offline Survival Mode

🛠 ARCHITECT POWERS (Admin):
   • Auto-Install: Three.js, Charts, Spotify
   • Direct Code Execution (eval)
   • Dynamic Matrix Color Control

🎮 SYSTEMS:
   • Multiverse MQTT Chat
   • XP Leveling & Title System
   • Voice-to-Text Input
   • Matrix Rain Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMANDS: /ai <q>, /play, /stop, /clear
`;
        addSystemMessage(featureList);
        return;
    }

    if (adminMode) {
        if (lower.includes('hands off')) { handsOff = true; addUserMessage(txt); addSystemMessage("⚠ TermAi Disengaged."); return; }
        if (lower.includes('hands on')) { handsOff = false; addUserMessage(txt); addSystemMessage("✓ TermAi Engaged."); return; }
        const bgMatch = txt.match(/change background(?: color)?(?: to)?\s*(#?[0-9A-Za-z]+)/i);
        if (bgMatch) {
            currentMatrixColor = bgMatch[1].startsWith('#') ? bgMatch[1] : bgMatch[1];
            initMatrix(currentMatrixColor);
            addUserMessage(txt);
            addSystemMessage(`✅ Matrix Color Updated.`);
            return;
        }
    }

    if (txt.startsWith('/ai') || txt.startsWith('/AI')) {
        const prompt = txt.replace(/^\/ai\s*/i, '').trim();
        addUserMessage(`/ai ${prompt}`);
        talkToTermAi(prompt);
        return;
    }

    if (lower.includes('play music')) {
        addUserMessage(txt);
        const audio = document.getElementById('bg-music');
        if(audio) audio.play().catch(()=>addTermAiMessage("No audio source.", true));
        return;
    }
    
    if (lower.includes('stop music')) {
        addUserMessage(txt);
        const audio = document.getElementById('bg-music');
        if(audio) audio.pause();
        return;
    }

    addUserMessage(txt);
    publishMessage(txt);
    addXP(10);
}

// --- 11. RENDERING ---
function addUserMessage(text) {
    const container = document.getElementById('chat-container');
    if(!container) return;
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex flex-row-reverse items-end gap-3 animate-fade-in';
    msgDiv.innerHTML = `<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center border border-white/20 font-mono text-black text-xs font-bold flex-shrink-0">ME</div><div class="msg-user p-3 md:p-4 rounded-l-xl rounded-br-xl text-xs md:text-sm text-green-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)] max-w-[80%] break-words"><div class="flex items-center gap-2 mb-1 opacity-80 text-[10px] md:text-xs font-mono text-green-400"><span>@${username.toUpperCase()}</span><span>${time}</span></div><p class="leading-relaxed text-gray-100 break-words">${escapeHtml(text)}</p></div>`;
    container.appendChild(msgDiv);
    scrollToBottom();
}

function addTermAiMessage(text, isAction) {
    const container = document.getElementById('chat-container');
    if(!container) return;
    const cssClass = isAction ? 'border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border border-white/10';
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex flex-row items-start gap-3 animate-fade-in';
    msgDiv.innerHTML = `<div class="w-8 h-8 rounded-full bg-black border border-purple-500 flex items-center justify-center text-purple-400 font-mono text-[10px] flex-shrink-0 font-bold">AI</div><div class="flex-1"><div class="p-3 md:p-4 rounded-r-xl rounded-bl-xl bg-black/40 ${cssClass} text-xs md:text-sm text-gray-200 backdrop-blur-sm break-words"><p class="leading-relaxed break-words">${text}</p></div></div>`;
    container.appendChild(msgDiv);
    scrollToBottom();
}

function addSystemMessage(text) {
    const container = document.getElementById('chat-container');
    if(!container) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg-system p-3 md:p-4 rounded-xl text-xs md:text-sm text-cyan-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-fade-in break-words';
    msgDiv.innerHTML = `<div class="flex items-center gap-2 mb-1 opacity-80 text-[10px] md:text-xs font-mono text-cyan-400"><span>⚠ SYSTEM</span></div><p class="leading-relaxed break-words">${text}</p>`;
    container.appendChild(msgDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const c = document.getElementById('chat-container');
    if(c) c.scrollTop = c.scrollHeight;
}

function connectMQTT() {
    if (typeof mqtt === 'undefined') {
        addSystemMessage("⚠️ MQTT offline - Chat is local only");
        return;
    }
    const clientId = "termos-" + Math.random().toString(16).substr(2, 8);
    mqttClient = mqtt.connect(MQTT_BROKER_URL, { clientId: clientId, clean: true, connectTimeout: 4000 });
    mqttClient.on('connect', () => {
        console.log("✅ MQTT Connected");
        addSystemMessage("🌐 Connected to Multiverse");
        mqttClient.subscribe('termchat/messages');
    });
    mqttClient.on('message', (topic, msg) => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.user && data.user !== username) {
                const container = document.getElementById('chat-container');
                if(container) {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'flex flex-row items-end gap-3 animate-fade-in opacity-80';
                    msgDiv.innerHTML = `<div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-white/20 font-mono text-white text-xs">${String(data.user).substring(0,2).toUpperCase()}</div><div class="p-4 rounded-xl bg-slate-800/50 text-sm text-gray-300 max-w-[80%] border border-white/5"><div class="flex items-center gap-2 mb-1 opacity-70 text-xs font-mono text-gray-400"><span>@${String(data.user).toUpperCase()}</span></div><p class="leading-relaxed">${escapeHtml(data.text)}</p></div>`;
                    container.appendChild(msgDiv);
                    scrollToBottom();
                }
            }
        } catch (e) { console.error("MQTT error", e); }
    });
}

function publishMessage(text) {
    if (mqttClient && mqttClient.connected) {
        mqttClient.publish('termchat/messages', JSON.stringify({ user: username, text: text, room: currentRoom }));
    }
}

function addXP(amount) {
    userStats.xp += amount;
    if(userStats.xp > (userStats.level * 1000)) {
        userStats.level++;
        userStats.title = LEVELS[userStats.level] || 'GOD MODE';
        addSystemMessage(`LEVEL UP! You are now ${userStats.title}`);
    }
    updateStatsUI();
    localStorage.setItem('termos_stats', JSON.stringify(userStats));
}

function loadStats() {
    const saved = localStorage.getItem('termos_stats');
    if(saved) userStats = JSON.parse(saved);
}

function escapeHtml(text) {
    if(!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- 12. MATRIX ANIMATION ---
function initMatrix(overrideColor = '#0F0') {
    const c = document.getElementById('matrix-canvas');
    if(!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; 
    c.height = window.innerHeight;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = c.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    if (window.matrixInterval) clearInterval(window.matrixInterval);
    const rainColor = overrideColor; 
    function draw() {
        ctx.fillStyle = 'rgba(0, 51, 120, 0.08)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.font = fontSize + 'px monospace';
        for(let i=0; i<drops.length; i++) {
            const text = letters[Math.floor(Math.random()*letters.length)];
            if(Math.random() > 0.98) ctx.fillStyle = '#ffffff';
            else ctx.fillStyle = rainColor; 
            ctx.fillText(text, i*fontSize, drops[i]*fontSize);
            if(drops[i]*fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    window.matrixInterval = setInterval(draw, 33);
    window.addEventListener('resize', () => { 
        c.width = window.innerWidth; 
        c.height = window.innerHeight; 
    });
}
