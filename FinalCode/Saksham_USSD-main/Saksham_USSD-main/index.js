// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Body parser to handle JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --------- DUMMY DATA (yehi judges ko dikhana hai) ----------

// Trainer list
const trainers = [
  {
    id: 1,
    name: "District Trainer – Patna",
    phone: "9999999999",
    region: "Bihar"
  },
  {
    id: 2,
    name: "State Level Trainer – Guwahati",
    phone: "8888888888",
    region: "Assam"
  },
  {
    id: 3,
    name: "Block Trainer – Surat",
    phone: "7777777777",
    region: "Gujarat"
  }
];


// Training sessions
const trainingSessions = [
  // Trainer 1 — Patna
  {
    id: 1,
    trainerId: 1,
    title: "Flood Response Mock Drill – Patna",
    theme: "Flood",
    date: "2025-12-03",
    status: "completed"
  },
  {
    id: 2,
    trainerId: 1,
    title: "School Safety Awareness Drive",
    theme: "Safety",
    date: "2025-12-10",
    status: "ongoing"
  },
  {
    id: 3,
    trainerId: 1,
    title: "Fire Evacuation Training (Upcoming)",
    theme: "Fire",
    date: "2025-12-21",
    status: "upcoming"
  },

  // Trainer 2 — Guwahati
  {
    id: 4,
    trainerId: 2,
    title: "Cyclone Preparedness Camp – Assam",
    theme: "Cyclone",
    date: "2025-11-25",
    status: "completed"
  },
  {
    id: 5,
    trainerId: 2,
    title: "Landslide Rescue Techniques Workshop",
    theme: "Landslide",
    date: "2025-12-15",
    status: "upcoming"
  },

  // Trainer 3 — Surat
  {
    id: 6,
    trainerId: 3,
    title: "Earthquake First Response Demo",
    theme: "Earthquake",
    date: "2025-12-05",
    status: "completed"
  }
];


// Helper: trainer find by phone number
function findTrainerByPhone(phone) {
  return trainers.find(t => t.phone === phone);
}

// Helper: menu text
function getMenuText(trainerName) {
  return `Hi ${trainerName},

NDMA Training Menu:
1. Current training session
2. Past trainings
3. Upcoming trainings
4. Important alerts

Reply with 1, 2, 3 or 4.`;
}

// Helper: build reply based on option
function buildReply(option, trainer) {
  const sessions = trainingSessions.filter(s => s.trainerId === trainer.id);
  let text = '';

  if (option === '1') {
    const ongoing = sessions.filter(s => s.status === 'ongoing');
    if (ongoing.length === 0) {
      text = `No ongoing training right now for ${trainer.name}.`;
    } else {
      const s = ongoing[0];
      text = `Current Training for ${trainer.name}:
Title: ${s.title}
Date: ${s.date}
Theme: ${s.theme}
Status: ${s.status}`;
    }
  } else if (option === '2') {
    const past = sessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 3);

    if (past.length === 0) {
      text = `No past trainings found for ${trainer.name}.`;
    } else {
      text = `Past Trainings (${trainer.name}):\n`;
      past.forEach((p, idx) => {
        text += `${idx + 1}) ${p.title} - ${p.date} (${p.theme})\n`;
      });
    }
  } else if (option === '3') {
    const upcoming = sessions
      .filter(s => s.status === 'upcoming')
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 3);

    if (upcoming.length === 0) {
      text = `No upcoming trainings scheduled for ${trainer.name}.`;
    } else {
      text = `Upcoming Trainings (${trainer.name}):\n`;
      upcoming.forEach((u, idx) => {
        text += `${idx + 1}) ${u.title} - ${u.date} (${u.theme})\n`;
      });
    }
  } else if (option === '4') {
    text = `Important Alerts:
1) Please update attendance for last session.
2) New Flood SOP uploaded on NDMA portal.
3) State-level review meeting scheduled next week.`;
  } else {
    text = 'Invalid option. Please reply with 1, 2, 3 or 4.';
  }

  return text;
}

// --------------- API ROUTES (simulation) -------------------

// Simulate incoming call
app.post('/simulate-call', (req, res) => {
  const { phone } = req.body;

  const trainer = findTrainerByPhone(phone);
  if (!trainer) {
    return res.json({
      success: false,
      message: 'Trainer not found for this phone number. Use 9999999999 or 8888888888 for demo.'
    });
  }

  const smsText = getMenuText(trainer.name);

  return res.json({
    success: true,
    sms: smsText
  });
});

// Simulate incoming SMS reply
app.post('/simulate-sms', (req, res) => {
  const { phone, text } = req.body;

  const trainer = findTrainerByPhone(phone);
  if (!trainer) {
    return res.json({
      success: false,
      message: 'Trainer not found for this phone number.'
    });
  }

  const option = (text || '').trim();
  const reply = buildReply(option, trainer);

  return res.json({
    success: true,
    sms: reply
  });
});

// --------------- FRONTEND (simple HTML page) ----------------

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>NDMA Offline Feature Demo</title>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; background: #f5f5f5; padding: 20px; }
    h1 { text-align: center; }
    .box { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    label { font-weight: bold; }
    input, button, textarea { padding: 8px; margin-top: 5px; }
    input { width: 100%; box-sizing: border-box; }
    button { cursor: pointer; }
    textarea { width: 100%; height: 180px; box-sizing: border-box; }
    small { color: #555; }
  </style>
</head>
<body>
  <h1>NDMA - Offline / Low Network Training Access (Demo)</h1>

  <div class="box">
    <h3>Step 1: Enter Trainer Phone Number</h3>
    <label>Phone Number (demo: 9999999999 or 8888888888)</label><br/>
    <input type="text" id="phone" value="9999999999" />
    <br/><br/>
    <button onclick="dialNumber()">📞 Dial NDMA Number (Simulate Call)</button>
    <p><small>This simulates: Trainer gives a missed call → System sends SMS menu.</small></p>
  </div>

  <div class="box">
    <h3>Step 2: SMS Inbox (Trainer's Phone Screen)</h3>
    <textarea id="smsInbox" readonly></textarea>
  </div>

  <div class="box">
    <h3>Step 3: Reply to SMS</h3>
    <label>Type 1, 2, 3 or 4 and press Reply</label><br/>
    <input type="text" id="replyText" placeholder="e.g. 1" />
    <br/><br/>
    <button onclick="sendReply()">📩 Send SMS Reply</button>
    <p><small>Option 1 = Current Training, 2 = Past, 3 = Upcoming, 4 = Alerts</small></p>
  </div>

  <script>
    async function dialNumber() {
      const phone = document.getElementById('phone').value.trim();
      if (!phone) {
        alert('Please enter phone number');
        return;
      }

      const response = await fetch('/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();
      const inbox = document.getElementById('smsInbox');

      if (!data.success) {
        inbox.value += "\\n---\\n" + "System: " + data.message + "\\n";
      } else {
        inbox.value += "\\n---\\n" + "From NDMA: \\n" + data.sms + "\\n";
      }

      inbox.scrollTop = inbox.scrollHeight;
    }

    async function sendReply() {
      const phone = document.getElementById('phone').value.trim();
      const text = document.getElementById('replyText').value.trim();
      if (!phone || !text) {
        alert('Phone and reply text required');
        return;
      }

      const inbox = document.getElementById('smsInbox');
      inbox.value += "\\nYou: " + text + "\\n";

      const response = await fetch('/simulate-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text })
      });

      const data = await response.json();

      if (!data.success) {
        inbox.value += "System: " + data.message + "\\n";
      } else {
        inbox.value += "From NDMA: \\n" + data.sms + "\\n";
      }

      inbox.scrollTop = inbox.scrollHeight;
      document.getElementById('replyText').value = '';
    }
  </script>
</body>
</html>
  `);
});

// ----------------- START SERVER ---------------------

const PORT = 3000;
app.listen(PORT, () => {
  console.log('NDMA Offline Demo running on http://localhost:' + PORT);
});
