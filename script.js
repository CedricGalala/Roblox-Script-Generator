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

// Copy Kill Brick Script to Clipboard
document.getElementById("copyKillScript").addEventListener("click", () => {
  const text = document.getElementById("killOutput").textContent;
  if (text.trim() === '') {
    alert("Please generate a script first!");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    alert("Kill Brick script copied to clipboard!");
  });
});

// Copy Teleport Script to Clipboard
document.getElementById("copyTeleportScript").addEventListener("click", () => {
  const text = document.getElementById("teleportOutput").textContent;
  if (text.trim() === '') {
    alert("Please generate a script first!");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    alert("Teleport script copied to clipboard!");
  });
});
