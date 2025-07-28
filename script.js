// Kill Brick Script Template
const killBrickTemplate = `
script.Parent.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid:TakeDamage({{damage}})
    end
end)
`;

// Teleport Pad Script Template
const teleportTemplate = `
script.Parent.Touched:Connect(function(hit)
    local character = hit.Parent
    if character:FindFirstChild("Humanoid") then
        character:SetPrimaryPartCFrame(CFrame.new({{x}}, {{y}}, {{z}}))
    end
end)
`;

// Replace {{placeholders}} with real values
function fillTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
}

// Generate Kill Brick Script
document.getElementById("generateKillBrick").addEventListener("click", () => {
  const damage = document.getElementById("damageInput").value || "10";
  const script = fillTemplate(killBrickTemplate, { damage });
  document.getElementById("killOutput").textContent = script.trim();
});

// Generate Teleport Script
document.getElementById("generateTeleport").addEventListener("click", () => {
  const x = document.getElementById("xInput").value || "0";
  const y = document.getElementById("yInput").value || "10";
  const z = document.getElementById("zInput").value || "0";
  const script = fillTemplate(teleportTemplate, { x, y, z });
  document.getElementById("teleportOutput").textContent = script.trim();
});

// Utility: Copy text to clipboard with fallback
function copyTextToClipboard(text) {
  if (!text) {
    alert("Nothing to copy! Please generate a script first.");
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Script copied to clipboard!");
    }, () => {
      alert("Failed to copy. Try again.");
    });
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      alert(successful ? "Script copied to clipboard!" : "Failed to copy. Try again.");
    } catch (err) {
      alert("Failed to copy. Try again.");
    }

    document.body.removeChild(textArea);
  }
}

// Copy Kill Brick Script to Clipboard
document.getElementById("copyKillScript").addEventListener("click", () => {
  const text = document.getElementById("killOutput").textContent.trim();
  copyTextToClipboard(text);
});

// Copy Teleport Script to Clipboard
document.getElementById("copyTeleportScript").addEventListener("click", () => {
  const text = document.getElementById("teleportOutput").textContent.trim();
  copyTextToClipboard(text);
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    darkModeToggle.textContent = '🌙 Dark Mode';
  }
  localStorage.setItem('darkMode', enabled ? 'true' : 'false');
}

// Load preference on page load
const savedMode = localStorage.getItem('darkMode');
setDarkMode(savedMode === 'true');

// Toggle on button click
darkModeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});
