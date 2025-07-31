// ==== Templates ====
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
    if character:FindFirstChild("HumanoidRootPart") then
        character:MoveTo(Vector3.new({{x}}, {{y}}, {{z}}))
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
        -- Apply power-up effect here
        wait(duration)
        print(powerUpName .. " expired for " .. player.Name)
    end
end)
`;

// ==== Helper Function ====
function fillTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
}

function downloadScript(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==== Kill Brick ====
document.getElementById("generateKillBrick").addEventListener("click", () => {
  const damage = document.getElementById("damageInput").value || "10";
  const script = fillTemplate(killBrickTemplate, { damage });
  document.getElementById("killOutput").textContent = script.trim();
});

document.getElementById("copyKillScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("killOutput").textContent.trim());
});

document.getElementById("downloadKillScript").addEventListener("click", () => {
  const content = document.getElementById("killOutput").textContent.trim();
  console.log("KillBrick Download clicked. Content length:", content.length);
  if (!content) {
    alert("Please generate the Kill Brick script before downloading.");
    return;
  }
  downloadScript(content, "KillBrick.lua");
});

// ==== Teleport Pad ====
document.getElementById("generateTeleport").addEventListener("click", () => {
  const x = document.getElementById("xInput").value || "0";
  const y = document.getElementById("yInput").value || "10";
  const z = document.getElementById("zInput").value || "0";
  const script = fillTemplate(teleportTemplate, { x, y, z });
  document.getElementById("teleportOutput").textContent = script.trim();
});

document.getElementById("copyTeleportScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("teleportOutput").textContent.trim());
});

document.getElementById("downloadTeleportScript").addEventListener("click", () => {
  const content = document.getElementById("teleportOutput").textContent.trim();
  console.log("Teleport Download clicked. Content length:", content.length);
  if (!content) {
    alert("Please generate the Teleport Pad script before downloading.");
    return;
  }
  downloadScript(content, "TeleportPad.lua");
});

// ==== Spinner Part ====
document.getElementById("generateSpinner").addEventListener("click", () => {
  const speed = document.getElementById("spinSpeedInput").value || "60";
  const script = fillTemplate(spinnerTemplate, { speed });
  document.getElementById("spinnerOutput").textContent = script.trim();
});

document.getElementById("copySpinnerScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("spinnerOutput").textContent.trim());
});

document.getElementById("downloadSpinnerScript").addEventListener("click", () => {
  const content = document.getElementById("spinnerOutput").textContent.trim();
  console.log("Spinner Download clicked. Content length:", content.length);
  if (!content) {
    alert("Please generate the Spinner script before downloading.");
    return;
  }
  downloadScript(content, "Spinner.lua");
});

// ==== Toggle Door ====
document.getElementById("generateDoor").addEventListener("click", () => {
  const x = document.getElementById("doorXInput").value || "0";
  const y = document.getElementById("doorYInput").value || "10";
  const z = document.getElementById("doorZInput").value || "0";
  const script = fillTemplate(toggleDoorTemplate, { x, y, z });
  document.getElementById("doorOutput").textContent = script.trim();
});

document.getElementById("copyDoorScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("doorOutput").textContent.trim());
});

document.getElementById("downloadDoorScript").addEventListener("click", () => {
  const content = document.getElementById("doorOutput").textContent.trim();
  console.log("ToggleDoor Download clicked. Content length:", content.length);
  if (!content) {
    alert("Please generate the Toggle Door script before downloading.");
    return;
  }
  downloadScript(content, "ToggleDoor.lua");
});

// ==== Power-Up Pickup ====
document.getElementById("generatePowerUp").addEventListener("click", () => {
  const name = document.getElementById("powerUpNameInput").value.trim() || "SpeedBoost";
  const duration = document.getElementById("powerUpDurationInput").value || "10";
  const script = fillTemplate(powerUpTemplate, { name, duration });
  document.getElementById("powerUpOutput").textContent = script.trim();
});

document.getElementById("copyPowerUpScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("powerUpOutput").textContent.trim());
});

document.getElementById("downloadPowerUpScript").addEventListener("click", () => {
  const content = document.getElementById("powerUpOutput").textContent.trim();
  console.log("PowerUp Download clicked. Content length:", content.length);
  if (!content) {
    alert("Please generate the Power-Up script before downloading.");
    return;
  }
  downloadScript(content, "PowerUp.lua");
});

// ==== Clipboard Copy Helper ====
function copyTextToClipboard(text) {
  if (!text) {
    alert("Nothing to copy! Please generate a script first.");
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Script copied to clipboard!");
    }).catch(() => {
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
      document.execCommand("copy");
      alert("Script copied to clipboard!");
    } catch {
      alert("Failed to copy. Try again.");
    }
    document.body.removeChild(textArea);
  }
}

// ==== Dark Mode Toggle ====
const darkModeToggle = document.getElementById("darkModeToggle");

function setDarkMode(enabled) {
  document.body.classList.toggle("dark-mode", enabled);
  darkModeToggle.textContent = enabled ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", enabled ? "true" : "false");
}

const savedMode = localStorage.getItem("darkMode") === "true";
setDarkMode(savedMode);

darkModeToggle.addEventListener("click", () => {
  const enabled = !document.body.classList.contains("dark-mode");
  setDarkMode(enabled);
});
