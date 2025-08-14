document.addEventListener("DOMContentLoaded", function () {

  // ==== Templates ====
  const templates = {
    killBrick: `script.Parent.Touched:Connect(function(hit)
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
      humanoid:TakeDamage({{damage}})
  end
end)`,

    teleport: `script.Parent.Touched:Connect(function(hit)
  local character = hit.Parent
  if character:FindFirstChild("HumanoidRootPart") then
      character:MoveTo(Vector3.new({{x}}, {{y}}, {{z}}))
  end
end)`,

    spinner: `while true do
  script.Parent.CFrame = script.Parent.CFrame * CFrame.Angles(0, math.rad({{speed}}) * wait(), 0)
end`,

    toggleDoor: `local door = script.Parent
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
end)`,

    powerUp: `local powerUpName = "{{name}}"
local duration = {{duration}}

script.Parent.Touched:Connect(function(hit)
  local player = game.Players:GetPlayerFromCharacter(hit.Parent)
  if player then
      print(player.Name .. " picked up " .. powerUpName)
      wait(duration)
      print(powerUpName .. " expired for " .. player.Name)
  end
end)`,

    jumpPad: `local jumpPad = script.Parent
local jumpPower = {{power}}
jumpPad.Touched:Connect(function(hit)
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
      humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
      humanoid.JumpPower = jumpPower
  end
end)`,

    speedBoost: `local speedPad = script.Parent
local speedAmount = {{speed}}
speedPad.Touched:Connect(function(hit)
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
      humanoid.WalkSpeed = speedAmount
  end
end)`,

    messagePopup: `local billboard = Instance.new("BillboardGui")
billboard.Size = UDim2.new(0,200,0,50)
billboard.Adornee = script.Parent
billboard.Parent = script.Parent
local textLabel = Instance.new("TextLabel")
textLabel.Text = "{{message}}"
textLabel.Size = UDim2.new(1,0,1,0)
textLabel.Parent = billboard`,

    explosionTrigger: `local part = script.Parent
part.Touched:Connect(function(hit)
  local explosion = Instance.new("Explosion")
  explosion.Position = part.Position
  explosion.BlastRadius = {{radius}}
  explosion.Parent = workspace
  explosion:Destroy()
end)`,

    proximityPrompt: `local prompt = Instance.new("ProximityPrompt")
prompt.Parent = script.Parent
prompt.ActionText = "{{action}}"
prompt.Triggered:Connect(function(player)
  print(player.Name .. " triggered the prompt!")
end)`
  };

  // ==== Helper Functions ====
  function fillTemplate(template, values) {
    return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
  }

  function copyText(text) {
    if (!text) { alert("Generate a script first!"); return; }
    navigator.clipboard.writeText(text).then(()=>alert("Script copied!")).catch(()=>alert("Failed to copy."));
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

  // ==== Generator Config ====
  const generators = [
    { genBtn:"generateKillBrick", output:"killOutput", template:templates.killBrick, values:()=>({damage:document.getElementById("damageInput").value||"10"}), copyBtn:"copyKillScript", downloadBtn:"downloadKillScript", filename:"KillBrick.lua" },
    { genBtn:"generateTeleport", output:"teleportOutput", template:templates.teleport, values:()=>({x:document.getElementById("xInput").value||"0", y:document.getElementById("yInput").value||"10", z:document.getElementById("zInput").value||"0"}), copyBtn:"copyTeleportScript", downloadBtn:"downloadTeleportScript", filename:"TeleportPad.lua" },
    { genBtn:"generateSpinner", output:"spinnerOutput", template:templates.spinner, values:()=>({speed:document.getElementById("spinSpeedInput").value||"60"}), copyBtn:"copySpinnerScript", downloadBtn:"downloadSpinnerScript", filename:"Spinner.lua" },
    { genBtn:"generateDoor", output:"doorOutput", template:templates.toggleDoor, values:()=>({x:document.getElementById("doorXInput").value||"0", y:document.getElementById("doorYInput").value||"10", z:document.getElementById("doorZInput").value||"0"}), copyBtn:"copyDoorScript", downloadBtn:"downloadDoorScript", filename:"ToggleDoor.lua" },
    { genBtn:"generatePowerUp", output:"powerUpOutput", template:templates.powerUp, values:()=>({name:document.getElementById("powerUpNameInput").value.trim()||"SpeedBoost", duration:document.getElementById("powerUpDurationInput").value||"10"}), copyBtn:"copyPowerUpScript", downloadBtn:"downloadPowerUpScript", filename:"PowerUp.lua" },

    { genBtn:"generateJumpPad", output:"jumpPadOutput", template:templates.jumpPad, values:()=>({power:document.getElementById("jumpForceInput").value||"100"}), copyBtn:"copyJumpPadScript", downloadBtn:"downloadJumpPadScript", filename:"JumpPad.lua" },
    { genBtn:"generateSpeedBoost", output:"speedBoostOutput", template:templates.speedBoost, values:()=>({speed:document.getElementById("speedBoostInput").value||"2"}), copyBtn:"copySpeedBoostScript", downloadBtn:"downloadSpeedBoostScript", filename:"SpeedBoost.lua" },
    { genBtn:"generateMessagePopup", output:"messagePopupOutput", template:templates.messagePopup, values:()=>({message:document.getElementById("popupMessageInput").value||"Hello!"}), copyBtn:"copyMessagePopupScript", downloadBtn:"downloadMessagePopupScript", filename:"MessagePopup.lua" },
    { genBtn:"generateExplosionTrigger", output:"explosionTriggerOutput", template:templates.explosionTrigger, values:()=>({radius:document.getElementById("explosionPowerInput").value||"50"}), copyBtn:"copyExplosionTriggerScript", downloadBtn:"downloadExplosionTriggerScript", filename:"Explosion.lua" },
    { genBtn:"generateProximityPrompt", output:"proximityPromptOutput", template:templates.proximityPrompt, values:()=>({action:document.getElementById("promptActionInput").value||"DoAction"}), copyBtn:"copyProximityPromptScript", downloadBtn:"downloadProximityPromptScript", filename:"ProximityPrompt.lua" }
  ];

  // ==== Attach Events ====
  generators.forEach(gen=>{
    const genBtn=document.getElementById(gen.genBtn);
    const outputEl=document.getElementById(gen.output);
    const copyBtn=document.getElementById(gen.copyBtn);
    const downloadBtn=document.getElementById(gen.downloadBtn);

    genBtn.addEventListener("click", ()=>{
      // Collapse all sections first
      document.querySelectorAll("section.tool .content").forEach(c=>c.classList.add("collapsed"));

      // Expand the section of the clicked button
      const contentDiv = genBtn.closest("section.tool").querySelector(".content");
      contentDiv.classList.remove("collapsed");

      // Generate the script
      outputEl.textContent = fillTemplate(gen.template, gen.values()).trim();
    });

    copyBtn.addEventListener("click", ()=>copyText(outputEl.textContent.trim()));
    downloadBtn.addEventListener("click", ()=>downloadScript(gen.filename, outputEl.textContent.trim()));
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
