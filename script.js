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

// ==== NEW Templates ====
const jumpPadTemplate = `
local jumpForce = {{force}}

script.Parent.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid and hit.Parent:FindFirstChild("HumanoidRootPart") then
        hit.Parent.HumanoidRootPart.Velocity = Vector3.new(0, jumpForce, 0)
    end
end)
`;

const speedBoostTemplate = `
local boostSpeed = {{speed}}
local duration = {{duration}}

script.Parent.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        local originalSpeed = humanoid.WalkSpeed
        humanoid.WalkSpeed = boostSpeed
        wait(duration)
        humanoid.WalkSpeed = originalSpeed
    end
end)
`;

const messagePopupTemplate = `
local message = "{{text}}"

script.Parent.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        local gui = Instance.new("BillboardGui", player.PlayerGui)
        gui.Size = UDim2.new(0, 200, 0, 50)
        gui.StudsOffset = Vector3.new(0, 3, 0)
        gui.AlwaysOnTop = true
        local label = Instance.new("TextLabel", gui)
        label.Size = UDim2.new(1, 0, 1, 0)
        label.Text = message
        wait(3)
        gui:Destroy()
    end
end)
`;

const explosionTriggerTemplate = `
local power = {{power}}

script.Parent.Touched:Connect(function(hit)
    local explosion = Instance.new("Explosion")
    explosion.BlastRadius = power
    explosion.Position = script.Parent.Position
    explosion.Parent = workspace
    explosion:Destroy()
end)
`;

const proximityPromptTemplate = `
local prompt = Instance.new("ProximityPrompt", script.Parent)
prompt.ActionText = "{{action}}"
prompt.ObjectText = "Interact"
prompt.RequiresLineOfSight = false
prompt.MaxActivationDistance = 10

prompt.Triggered:Connect(function(player)
    print(player.Name .. " performed action: " .. prompt.ActionText)
end)
`;

// ==== Helper Function ====
function fillTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
}

// ==== Original Generators ====
document.getElementById("generateKillBrick").addEventListener("click", () => {
  const damage = document.getElementById("damageInput").value || "10";
  const script = fillTemplate(killBrickTemplate, { damage });
  document.getElementById("killOutput").textContent = script.trim();
});

document.getElementById("generateTeleport").addEventListener("click", () => {
  const x = document.getElementById("xInput").value || "0";
  const y = document.getElementById("yInput").value || "10";
  const z = document.getElementById("zInput").value || "0";
  const script = fillTemplate(teleportTemplate, { x, y, z });
  document.getElementById("teleportOutput").textContent = script.trim();
});

document.getElementById("generateSpinner").addEventListener("click", () => {
  const speed = document.getElementById("spinSpeedInput").value || "60";
  const script = fillTemplate(spinnerTemplate, { speed });
  document.getElementById("spinnerOutput").textContent = script.trim();
});

document.getElementById("generateDoor").addEventListener("click", () => {
  const x = document.getElementById("doorXInput").value || "0";
  const y = document.getElementById("doorYInput").value || "10";
  const z = document.getElementById("doorZInput").value || "0";
  const script = fillTemplate(toggleDoorTemplate, { x, y, z });
  document.getElementById("doorOutput").textContent = script.trim();
});

document.getElementById("generatePowerUp").addEventListener("click", () => {
  const name = document.getElementById("powerUpNameInput").value.trim() || "SpeedBoost";
  const duration = document.getElementById("powerUpDurationInput").value || "10";
  const script = fillTemplate(powerUpTemplate, { name, duration });
  document.getElementById("powerUpOutput").textContent = script.trim();
});

// ==== New Generators ====
document.getElementById("generateJumpPad").addEventListener("click", () => {
  const force = document.getElementById("jumpForceInput").value || "100";
  const script = fillTemplate(jumpPadTemplate, { force });
  document.getElementById("jumpPadOutput").textContent = script.trim();
});

document.getElementById("generateSpeedBoost").addEventListener("click", () => {
  const speed = document.getElementById("boostSpeedInput").value || "50";
  const duration = document.getElementById("boostDurationInput").value || "5";
  const script = fillTemplate(speedBoostTemplate, { speed, duration });
  document.getElementById("speedBoostOutput").textContent = script.trim();
});

document.getElementById("generateMessagePopup").addEventListener("click", () => {
  const text = document.getElementById("popupMessageInput").value.trim() || "Hello Player!";
  const script = fillTemplate(messagePopupTemplate, { text });
  document.getElementById("messagePopupOutput").textContent = script.trim();
});

document.getElementById("generateExplosionTrigger").addEventListener("click", () => {
  const power = document.getElementById("explosionPowerInput").value || "100";
  const script = fillTemplate(explosionTriggerTemplate, { power });
  document.getElementById("explosionTriggerOutput").textContent = script.trim();
});

document.getElementById("generateProximityPrompt").addEventListener("click", () => {
  const action = document.getElementById("promptActionInput").value.trim() || "OpenGate";
  const script = fillTemplate(proximityPromptTemplate, { action });
  document.getElementById("proximityPromptOutput").textContent = script.trim();
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

// ==== Copy Button Events ====
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
document.getElementById("copyJumpPadScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("jumpPadOutput").textContent.trim());
});
document.getElementById("copySpeedBoostScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("speedBoostOutput").textContent.trim());
});
document.getElementById("copyMessagePopupScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("messagePopupOutput").textContent.trim());
});
document.getElementById("copyExplosionTriggerScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("explosionTriggerOutput").textContent.trim());
});
document.getElementById("copyProximityPromptScript").addEventListener("click", () => {
  copyTextToClipboard(document.getElementById("proximityPromptOutput").textContent.trim());
});

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
