{\rtf1\ansi\ansicpg1252\cocoartf1561\cocoasubrtf610
{\fonttbl\f0\fswiss\fcharset0 ArialMT;}
{\colortbl;\red255\green255\blue255;\red26\green26\blue26;\red255\green255\blue255;\red16\green60\blue192;
}
{\*\expandedcolortbl;;\cssrgb\c13333\c13333\c13333;\cssrgb\c100000\c100000\c100000;\cssrgb\c6667\c33333\c80000;
}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs26 \cf2 \cb3 \expnd0\expndtw0\kerning0
const BROKER_HOST = "{\field{\*\fldinst{HYPERLINK "http://broker.emqx.io/"}}{\fldrslt \cf4 \cb3 \ul \ulc4 broker.emqx.io}}";\cb1 \
\cb3 const BROKER_PORT = 8084; \cb1 \
\cb3 const TOPIC = "term-chat/global/v3";\cb1 \
\cb3 const userID = "USR_" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');\cb1 \
\
\cb3 const screen = document.getElementById('screen');\cb1 \
\cb3 const input = document.getElementById('msg-input');\cb1 \
\cb3 let client = null;\cb1 \
\
\cb3 // --- TYPEWRITER EFFECT ---\cb1 \
\cb3 function typeWriter(text, element, speed = 30) \{\cb1 \
\cb3 \'a0 \'a0 return new Promise(resolve => \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 let i = 0;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const span = document.createElement('span');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 element.appendChild(span);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const cursor = document.createElement('span');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 cursor.className = 'cursor-block';\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 element.appendChild(cursor);\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 function type() \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 if (i < text.length) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 span.textContent += text.charAt(i);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 i++;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 screen.scrollTop = screen.scrollHeight;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 setTimeout(type, speed);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \} else \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 cursor.style.display = 'none';\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 resolve();\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \}\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \}\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 type();\cb1 \
\cb3 \'a0 \'a0 \});\cb1 \
\cb3 \}\cb1 \
\
\cb3 // --- VISUAL NOTIFICATION (FLASH) ---\cb1 \
\cb3 function flashNotification() \{\cb1 \
\cb3 \'a0 \'a0 document.body.classList.remove('notify-flash');\cb1 \
\cb3 \'a0 \'a0 void document.body.offsetWidth; // trigger reflow\cb1 \
\cb3 \'a0 \'a0 document.body.classList.add('notify-flash');\cb1 \
\cb3 \}\cb1 \
\
\cb3 // --- MAIN BOOT SEQUENCE ---\cb1 \
\cb3 async function bootSystem() \{\cb1 \
\cb3 \'a0 \'a0 const div = document.createElement('div');\cb1 \
\cb3 \'a0 \'a0 div.className = 'log-entry system-msg';\cb1 \
\cb3 \'a0 \'a0 screen.appendChild(div);\cb1 \
\
\cb3 \'a0 \'a0 // Lithuanian Boot Messages\cb1 \
\cb3 \'a0 \'a0 await typeWriter("INICIALIZUOJAMA SISTEMA...", div);\cb1 \
\cb3 \'a0 \'a0 await typeWriter("KRAUNAMI TINKLO TVARKYKL\uc0\u278 S...", div);\cb1 \
\cb3 \'a0 \'a0 await typeWriter("JUNGIAMASI PRIE SERVERIO...", div);\cb1 \
\cb3 \'a0 \'a0 initMQTT();\cb1 \
\cb3 \}\cb1 \
\
\cb3 // --- MQTT LOGIC ---\cb1 \
\cb3 function initMQTT() \{\cb1 \
\cb3 \'a0 \'a0 client = new Paho.MQTT.Client(BROKER_HOST, BROKER_PORT, "web_" + parseInt(Math.random() * 100000, 10));\cb1 \
\cb3 \'a0 \'a0 client.onConnectionLost = onConnectionLost;\cb1 \
\cb3 \'a0 \'a0 client.onMessageArrived = onMessageArrived;\cb1 \
\cb3 \'a0 \'a0 client.connect(\{ onSuccess: onConnect, useSSL: true, onFailure: onFailure \});\cb1 \
\cb3 \}\cb1 \
\
\cb3 function onConnect() \{\cb1 \
\cb3 \'a0 \'a0 log("SISTEMA PRIJUNGTA.", 'system-msg');\cb1 \
\cb3 \'a0 \'a0 log(`NAUDOTOJAS: $\{userID\}`, 'system-msg');\cb1 \
\cb3 \'a0 \'a0 client.subscribe(TOPIC);\cb1 \
\cb3 \'a0 \'a0 input.focus();\cb1 \
\
\cb3 \'a0 \'a0 // Announce Join\cb1 \
\cb3 \'a0 \'a0 const announceMsg = new Paho.MQTT.Message(JSON.stringify(\{ type: 'join', id: userID \}));\cb1 \
\cb3 \'a0 \'a0 announceMsg.destinationName = TOPIC;\cb1 \
\cb3 \'a0 \'a0 client.send(announceMsg);\cb1 \
\cb3 \}\cb1 \
\
\cb3 function onFailure(responseObject) \{\cb1 \
\cb3 \'a0 \'a0 log("KLAIDA: " + responseObject.errorMessage, 'error-msg');\cb1 \
\cb3 \'a0 \'a0 setTimeout(initMQTT, 3000);\cb1 \
\cb3 \}\cb1 \
\
\cb3 function onConnectionLost(responseObject) \{\cb1 \
\cb3 \'a0 \'a0 if (responseObject.errorCode !== 0) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 log("RY\'8aYS PRARASTAS. BANDOM I\'8a NAUJO...", 'error-msg');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 setTimeout(initMQTT, 3000);\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \}\cb1 \
\
\cb3 function onMessageArrived(message) \{\cb1 \
\cb3 \'a0 \'a0 try \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const payload = JSON.parse(message.payloadString);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 if ({\field{\*\fldinst{HYPERLINK "http://payload.id/"}}{\fldrslt \cf4 \cb3 \ul \ulc4 payload.id}} === userID) return;\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 if (payload.type === 'join') \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 // NOTIFICATION & GREETING LOGIC\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 flashNotification(); \cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 log(`NAUJAS NAUDOTOJAS: $\{{\field{\*\fldinst{HYPERLINK "http://payload.id/"}}{\fldrslt \cf4 \cb3 \ul \ulc4 payload.id}}\}`, 'system-msg');\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 // Automated Greeting Sequence\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 setTimeout(() => \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 log(`SISTEMA: SIUN\uc0\u268 IAMAS PASISVEIKINIMAS...`, 'system-msg');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \}, 500);\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 setTimeout(() => \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 // Lithuanian Greetings\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 log(`PASISVEIKINIMAS: LABAS / HI / HELLO`, 'greeting-msg');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 log(`U\'8eKLAUSA: PASIKALBAM? PA\'8aNEK\uc0\u278 KIM?`, 'greeting-msg');\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 // Helper: Auto-fill "LABAS!" in Lithuanian\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 input.value = "LABAS!";\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 \}, 1200);\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 \} else if (payload.type === 'chat') \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 log(`&lt;$\{userID\}&gt; $\{payload.msg\}`, 'stranger-msg');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \}\cb1 \
\cb3 \'a0 \'a0 \} catch (e) \{ console.error(e); \}\cb1 \
\cb3 \}\cb1 \
\
\cb3 function log(text, type = 'user-msg') \{\cb1 \
\cb3 \'a0 \'a0 const div = document.createElement('div');\cb1 \
\cb3 \'a0 \'a0 div.className = `log-entry $\{type\}`;\cb1 \
\cb3 \'a0 \'a0 const now = new Date();\cb1 \
\cb3 \'a0 \'a0 const time = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');\cb1 \
\
\cb3 \'a0 \'a0 if (type === 'system-msg' || type === 'error-msg') \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 div.innerText = `[$\{time\}] $\{text\}`;\cb1 \
\cb3 \'a0 \'a0 \} else \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 div.innerHTML = `<span class="timestamp">[$\{time\}]</span> $\{text\}`;\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \'a0 \'a0 screen.appendChild(div);\cb1 \
\cb3 \'a0 \'a0 screen.scrollTop = screen.scrollHeight;\cb1 \
\cb3 \}\cb1 \
\
\cb3 function sendMessage() \{\cb1 \
\cb3 \'a0 \'a0 const text = input.value.trim();\cb1 \
\cb3 \'a0 \'a0 if (text && client && client.isConnected()) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 log(`&lt;$\{userID\}&gt; $\{text\}`, 'system-msg');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const message = new Paho.MQTT.Message(JSON.stringify(\{ type: 'chat', id: userID, msg: text \}));\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 message.destinationName = TOPIC;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 client.send(message);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 input.value = '';\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \}\cb1 \
\
\cb3 input.addEventListener('keypress', function (e) \{\cb1 \
\cb3 \'a0 \'a0 if (e.key === 'Enter') sendMessage();\cb1 \
\cb3 \});\cb1 \
\
\cb3 // Start Boot Sequence\cb1 \
\cb3 window.onload = bootSystem;}