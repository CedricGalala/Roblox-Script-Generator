window.addEventListener('DOMContentLoaded', () => {

// ==== Templates ====
const templates = {
  // Touch-Based Scripts
  killBrick: {
    category: "Touch-Based Scripts",
    template: `
script.Parent.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid:TakeDamage({{damage}})
    end
end)
    `
  },
  teleport: {
    category: "Touch-Based Scripts",
    template: `
script.Parent.Touched:Connect(function(hit)
    local character = hit.Parent
    if character:FindFirstChild("HumanoidRootPart") then
        character:MoveTo(Vector3.new({{x}}, {{y}}, {{z}}))
    end
end)
    `
  },
  powerUp: {
    category: "Touch-Based Scripts",
    template: `
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
    `
  },
  speedBoost: {
    category: "Touch-Based Scripts",
    template: `
local speedBoost = {{speed}}
local duration = {{duration}}

script.Parent.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        local originalSpeed = humanoid.WalkSpeed
        humanoid.WalkSpeed = speedBoost
        wait(duration)
        humanoid.WalkSpeed = originalSpeed
    end
end)
    `
  },
  explosionTrigger: {
    category: "Touch-Based Scripts",
    template: `
script.Parent.Touched:Connect(function(hit)
    local explosion = Instance.new("Explosion")
    explosion.Position = script.Parent.Position
    explosion.BlastRadius = {{radius}}
    explosion.BlastPressure = {{pressure}}
    explosion.Parent = workspace
end)
    `
  },

  // Loop/Continuous Scripts
  spinner: {
    category: "Loop/Continuous Scripts",
    template: `
while true do
    script.Parent.CFrame = script.Parent.CFrame * CFrame.Angles(0, math.rad({{speed}}) * wait(), 0)
end
    `
  },

  // UI/Feedback Scripts
  messagePopup: {
    category: "UI/Feedback Scripts",
    template: `
local billboard = Instance.new("BillboardGui")
local textLabel = Instance.new("TextLabel")

billboard.Adornee = script.Parent
billboard.Size = UDim2.new(0, 200, 0, 50)
billboard.StudsOffset = Vector3.new(0, 3, 0)
billboard.AlwaysOnTop = true

textLabel.Size = UDim2.new(1, 0, 1, 0)
textLabel.Text = "{{message}}"
textLabel.BackgroundTransparency = 1
textLabel.TextColor3 = Color3.new(1, 1, 1)
textLabel.TextScaled = true
textLabel.Parent = billboard

billboard.Parent = script.Parent
    `
  },

  // Interaction Scripts
  toggleDoor: {
    category: "Interaction Scripts",
    template: `
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
    `
  },
  proximityPrompt: {
    category: "Interaction Scripts",
    template: `
local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "{{action}}"
prompt.ObjectText = "{{object}}"
prompt.RequiresLineOfSight = false
prompt.MaxActivationDistance = 10
prompt.Parent = script.Parent

prompt.Triggered:Connect(function(player)
    print(player.Name .. " triggered the action!")
    -- Add your custom logic here
end)
    `
  },

  // Movement-Based Scripts
  jumpPad: {
    category: "Movement-Based Scripts",
    template: `
script.Parent.Touched:Connect(function(hit)
    local humanoidRootPart = hit.Parent:FindFirstChild("HumanoidRootPart")
    if humanoidRootPart then
        humanoidRootPart.Velocity = Vector3.new(0, {{force}}, 0)
    end
end)
    `
  }
};

// ==== Helper Functions ====
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

}); // end DOMContentLoaded
