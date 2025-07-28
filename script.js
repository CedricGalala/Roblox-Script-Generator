// Templates
const killBrickTemplate = `
script.Parent.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid:TakeDamage({{damage}})
    end
end)
`;

const teleportTemplate = `
script.Parent.Touched:Connect(function(hit)
    local character = hit.Parent
    if character:FindFirstChild("Humanoid") then
        character:SetPrimaryPartCFrame(CFrame.new({{x}}, {{y}}, {{z}}))
    end
end)
`;

const spinnerTemplate = `
while true do
    script.Parent.CFrame = script.Parent.CFrame * CFrame.Angles(0, math.rad({{speed}}) * wait(), 0)
end
`;

const toggleDoorTemplate = `
local door = script.Parent
local openPos = Vector3.new({{x}}, {{y}}, {{z}})
local closedPos = door.Position
local open = false

door.Touched:Connect(function(hit)
    if hit.Parent:FindFirstChild("Humanoid") then
        if open then
            door.Position = closedPos
            open = false
        else
            door.Position = openPos
            open = true
        end
    end
end)
`;

const powerUpTemplate = `
local powerUpName = "{{name}}"
local duration = {{duration}}

script.Parent.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        print(player.Name .. " picked up " .. powerUpName)
        -- Example: apply power-up effect here
        wait(duration)
        print(powerUpName .. " expired for " .. player.Name)
    end
end)
`;

// Helper to replace placeholders
function fillTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
}

// Kill Brick
document.getElementById("generateKillBrick").addEventListener("click", () => {
  const damage = document.getElementById("damageInput").value || "10";
  const script = fillTemplate(killBrickTemplate, { damage });
  document.getElementById("killOutput").textContent = script.trim();
});

// Teleport Pad
document.getElementById("generateTeleport").addEventListener("click", () => {
  const x = document.getElementById("xInput").value || "0";
  const y = document.getElementById("yInput").value || "10";
  const z = document.getElementById("zInput").value || "0";
  const script = fillTemplate(teleportTemplate, { x, y, z });
  document.getElementById("teleportOutput").textContent = script.trim();
});

// Spinner Part
document.getElementById("generateSpinner").addEventListener("click", () => {
  const speed = document.getElementById("spinSpeedInput").value || "60";
  const script = fillTemplate(spinnerTemplate, { speed });
  document.getElementById("spinnerOutput").textContent = script.trim();
});

// Toggle Door
document.getElementById("generateDoor").addEventListener("click", () => {
  const x = document.getElementById("doorXInput").value || "0";
  const y = document.getElementById("doorYInput").value || "10";
  const z = document.getElementById("doorZInput").value || "0";
  const script = fillTemplate(toggleDoorTemplate, { x, y, z });
  document.getElementById("doorOutput").textContent = script.trim();
});

// Power-Up Pickup
document.getElementById("generatePowerUp").addEventListener("click", () => {
  const name = document.getElementById("powerUpNameInput").value.trim() || "SpeedBoost";
  const duration = document.getElementById("powerUpDurationInput").value || "10";
  const script = fillTemplate(powerUpTemplate, { name, duration });
  document.getElementById("powerUpOutput").textContent = script.trim();
});

// Copy to Clipboard helper
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
      document.execCommand('copy');
      alert("Script copied to clipboard!");
    } catch {
      alert("Failed to copy. Try again.");
    }
    document.body.removeChild(textArea);
  }
}

// Copy buttons
document.getElementById("copyKillScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("killOutput").textContent.trim());
});
document.getElementById("copyTeleportScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("teleportOutput").textContent.trim());
});
document.getElementById("copySpinnerScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("spinnerOutput").textContent.trim());
});
document.getElementById("copyDoorScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("doorOutput").textContent.trim());
});
document.getElementById("copyPowerUpScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("powerUpOutput").textContent.trim());
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

// Initialize dark mode from storage
const savedMode = localStorage.getItem('darkMode');
setDarkMode(savedMode === 'true');

darkModeToggle.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});
