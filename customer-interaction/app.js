const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let state = "START";
let profile = {
  role: "",
  challenge: "",
  goal: "",
};

function addMessage(text, type = "ai", options = []) {
  const msg = document.createElement("div");
  msg.className = `message ${type}-message`;
  msg.innerHTML = `<div>${text}</div>`;

  if (options.length > 0) {
    const grid = document.createElement("div");
    grid.className = "options-grid";
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "opt-btn";
      btn.innerText = opt;
      btn.onclick = () => handleChoice(opt);
      grid.appendChild(btn);
    });
    msg.appendChild(grid);
  }

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const msg = document.createElement("div");
  msg.className = "message ai-message";
  msg.id = "typing-msg";
  msg.innerHTML =
    '<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("typing-msg");
  if (t) t.remove();
}

function botReply(text, options = [], delay = 1000) {
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(text, "ai", options);
  }, delay);
}

function handleChoice(choice) {
  addMessage(choice, "user");

  if (state === "START") {
    profile.role = choice;
    state = "CHALLENGE";
    botReply(
      `Impressive background! As an <strong>${choice}</strong>, what is the biggest challenge holding you back from your next leadership breakthrough?`,
      [
        "Invisible Glass Ceiling",
        "Strategic Thinking",
        "Influence & Negotiation",
        "Work-Life Balance",
      ],
    );
  } else if (state === "CHALLENGE") {
    profile.challenge = choice;
    state = "GOAL";
    botReply(
      "I see. Many top-tier women leaders face similar hurdles. If you could excel in one area over the next 6 months, what would it be?",
      [
        "Executive Presence",
        "P&L Mastery",
        "Global Board Readiness",
        "Organizational Impact",
      ],
    );
  } else if (state === "GOAL") {
    profile.goal = choice;
    state = "RESULT";
    showFinalRecommendation();
  }
}

function showFinalRecommendation() {
  showTyping();
  setTimeout(() => {
    removeTyping();

    let prog = "";
    let desc = "";

    if (profile.role.includes("Executive") || profile.goal.includes("Board")) {
      prog = "Global Board Program";
      desc =
        "A high-impact program designed for C-suite leaders aiming for global governance roles.";
    } else if (profile.role.includes("Entrepreneur")) {
      prog = "Entrepreneur Accelerator";
      desc =
        "Scale your business while building a powerful personal brand as a founder.";
    } else {
      prog = "Iron Lady Essentials";
      desc =
        "Our flagship program to master corporate politics, negotiation, and strategic influence.";
    }

    const result = `
            <div class="recommendation">
                <h3>Your Pathway: ${prog}</h3>
                <p>Based on your profile as an ${profile.role} dealing with ${profile.challenge}, the <strong>${prog}</strong> is your ideal next step.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">${desc}</p>
                <a href="#" class="btn-link" onclick="alert('Proceeding to program details...')">Explore Program</a>
            </div>
        `;
    addMessage(
      `I've analyzed your Leadership DNA. Here is your personalized acceleration roadmap: ${result}`,
    );
  }, 2000);
}

// Start
window.onload = () => {
  botReply(
    "Welcome to Iron Lady. I'm your Leadership Guide. To help you navigate our programs, tell me: what is your current professional standing?",
    [
      "Mid-Level Manager",
      "Senior Executive",
      "Founder/Entrepreneur",
      "Aspiring Leader",
    ],
  );
};

sendBtn.onclick = () => {
  if (userInput.value.trim()) {
    addMessage(userInput.value, "user");
    userInput.value = "";
    botReply(
      "I'm trained to follow the structured path above for better accuracy. Please select one of the options!",
    );
  }
};

userInput.onkeypress = (e) => {
  if (e.key === "Enter") sendBtn.click();
};
