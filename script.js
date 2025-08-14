document.addEventListener("DOMContentLoaded", function () {

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

  const jumpPadTemplate = `
local jumpPad = script.Parent
local jumpPower = {{power}}
jumpPad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
        humanoid.JumpPower = jumpPower
    end
end)
`;

  const speedBoostPadTemplate = `
local speedPad = script.Parent
local speedAmount = {{speed}}
speedPad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.WalkSpeed = speedAmount
    end
end)
`;

  const messagePopupTemplate = `
local billboard = Instance.new("BillboardGui")
billboard.Size = UDim2.new(0,200,0,50)
billboard.Adornee = script.Parent
billboard.Parent = script.Parent
local textLabel = Instance.new("TextLabel")
textLabel.Text = "{{message}}"
textLabel.Size = UDim2.new(1,0,1,0)
textLabel.Parent = billboard
`;

  const explosionTriggerTemplate = `
local part = script.Parent
part.Touched:Connect(function(hit)
    local explosion = Instance.new("Explosion")
    explosion.Position = part.Position
    explosion.BlastRadius = {{radius}}
    explosion.Parent = workspace
    explosion:Destroy()
end)
`;

  const proximityPromptTemplate = `
local prompt = Instance.new("ProximityPrompt")
prompt.Parent = script.Parent
prompt.ActionText = "{{action}}"
prompt.Triggered:Connect(function(player)
    print(player.Name .. " triggered the prompt!")
end)
`;

  // ==== Helpers ====
  function fillTemplate(template, values) {
    return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
  }

  function copyTextToClipboard(text) {
    if (!text) { alert("Nothing to copy! Please generate a script first."); return; }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => alert("Script copied!"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try { document.execCommand("copy"); alert("Script copied!"); } 
      catch { alert("Failed to copy."); }
      document.body.removeChild(textArea);
    }
  }

  function downloadScript(filename, content) {
    if (!content) { alert("Generate a script first!"); return; }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ==== All Generators ====
  const generators = [
    { genBtn:"generateKillBrick", output:"killOutput", template:killBrickTemplate,
      values:()=>({damage:document.getElementById("damageInput").value||"10"}),
      copyBtn:"copyKillScript", downloadBtn:"downloadKillScript", filename:"KillBrick.lua" },
    { genBtn:"generateTeleport", output:"teleportOutput", template:teleportTemplate,
      values:()=>({
        x:document.getElementById("xInput").value||"0",
        y:document.getElementById("yInput").value||"10",
        z:document.getElementById("zInput").value||"0"
      }),
      copyBtn:"copyTeleportScript", downloadBtn:"downloadTeleportScript", filename:"TeleportPad.lua" },
    { genBtn:"generateSpinner", output:"spinnerOutput", template:spinnerTemplate,
      values:()=>({speed:document.getElementById("spinSpeedInput").value||"60"}),
      copyBtn:"copySpinnerScript", downloadBtn:"downloadSpinnerScript", filename:"Spinner.lua" },
    { genBtn:"generateDoor", output:"doorOutput", template:toggleDoorTemplate,
      values:()=>({
        x:document.getElementById("doorXInput").value||"0",
        y:document.getElementById("doorYInput").value||"10",
        z:document.getElementById("doorZInput").value||"0"
      }),
      copyBtn:"copyDoorScript", downloadBtn:"downloadDoorScript", filename:"ToggleDoor.lua" },
    { genBtn:"generatePowerUp", output:"powerUpOutput", template:powerUpTemplate,
      values:()=>({
        name:document.getElementById("powerUpNameInput").value.trim()||"SpeedBoost",
        duration:document.getElementById("powerUpDurationInput").value||"10"
      }),
      copyBtn:"copyPowerUpScript", downloadBtn:"downloadPowerUpScript", filename:"PowerUp.lua" },

    // NEW 5 generators
    { genBtn:"generateJumpPad", output:"jumpPadOutput", template:jumpPadTemplate,
      values:()=>({power:document.getElementById("jumpForceInput").value||"100"}),
      copyBtn:"copyJumpPadScript", downloadBtn:"downloadJumpPadScript", filename:"JumpPad.lua" },
    { genBtn:"generateSpeedBoost", output:"speedBoostOutput", template:speedBoostPadTemplate,
      values:()=>({speed:document.getElementById("speedBoostInput").value||"30"}),
      copyBtn:"copySpeedBoostScript", downloadBtn:"downloadSpeedBoostScript", filename:"SpeedBoost.lua" },
    { genBtn:"generateMessagePopup", output:"messagePopupOutput", template:messagePopupTemplate,
      values:()=>({message:document.getElementById("popupMessageInput").value||"Hello!"}),
      copyBtn:"copyMessagePopupScript", downloadBtn:"downloadMessagePopupScript", filename:"MessagePopup.lua" },
    { genBtn:"generateExplosionTrigger", output:"explosionTriggerOutput", template:explosionTriggerTemplate,
      values:()=>({radius:document.getElementById("explosionPowerInput").value||"50"}),
      copyBtn:"copyExplosionTriggerScript", downloadBtn:"downloadExplosionTriggerScript", filename:"Explosion.lua" },
    { genBtn:"generateProximityPrompt", output:"proximityPromptOutput", template:proximityPromptTemplate,
      values:()=>({action:document.getElementById("promptActionInput").value||"DoAction"}),
      copyBtn:"copyProximityPromptScript", downloadBtn:"downloadProximityPromptScript", filename:"ProximityPrompt.lua" }
  ];

  generators.forEach(gen=>{
    const genBtn=document.getElementById(gen.genBtn);
    const outputEl=document.getElementById(gen.output);
    const copyBtn=document.getElementById(gen.copyBtn);
    const downloadBtn=document.getElementById(gen.downloadBtn);

    genBtn.addEventListener("click",()=>{
      outputEl.textContent = fillTemplate(gen.template, gen.values()).trim();
    });
    copyBtn.addEventListener("click",()=>copyTextToClipboard(outputEl.textContent.trim()));
    downloadBtn.addEventListener("click",()=>downloadScript(gen.filename, outputEl.textContent.trim()));
  });

  // ==== Dark Mode ====
  const darkModeToggle = document.getElementById("darkModeToggle");
  function setDarkMode(enabled){
    document.body.classList.toggle("dark-mode", enabled);
    darkModeToggle.textContent = enabled ? "☀️ Light Mode":"🌙 Dark Mode";
    localStorage.setItem("darkMode", enabled?"true":"false");
  }
  setDarkMode(localStorage.getItem("darkMode")==="true");
  darkModeToggle.addEventListener("click",()=>setDarkMode(!document.body.classList.contains("dark-mode")));

});
