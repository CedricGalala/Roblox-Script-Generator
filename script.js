document.addEventListener("DOMContentLoaded", function () {

    // ==== Script Templates ====
    const killBrickTemplate = `
local part = script.Parent
part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid:TakeDamage({{damage}})
    end
end)
`;

    const teleportPadTemplate = `
local teleportPart = script.Parent
local destination = workspace:WaitForChild("{{destination}}")
teleportPart.Touched:Connect(function(hit)
    local character = hit.Parent
    if character:FindFirstChild("HumanoidRootPart") then
        character.HumanoidRootPart.CFrame = destination.CFrame + Vector3.new(0, 3, 0)
    end
end)
`;

    const spinnerPartTemplate = `
local part = script.Parent
local speed = {{speed}}
while true do
    part.CFrame = part.CFrame * CFrame.Angles(0, math.rad(speed), 0)
    task.wait()
end
`;

    const toggleDoorTemplate = `
local door = script.Parent
local open = false
door.ClickDetector.MouseClick:Connect(function()
    if open then
        door.Position = door.Position - Vector3.new(0, 5, 0)
    else
        door.Position = door.Position + Vector3.new(0, 5, 0)
    end
    open = not open
end)
`;

    const powerUpTemplate = `
local powerUp = script.Parent
powerUp.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.WalkSpeed = humanoid.WalkSpeed + {{boost}}
        powerUp:Destroy()
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

    // ==== Helper ====
    function fillTemplate(template, values) {
        return template.replace(/{{(.*?)}}/g, (_, key) => values[key] || '');
    }

    // ==== Event Listeners ====
    document.getElementById("generateKillBrick").addEventListener("click", () => {
        const damage = document.getElementById("damageInput").value || "10";
        document.getElementById("killOutput").textContent = fillTemplate(killBrickTemplate, { damage }).trim();
    });

    document.getElementById("generateTeleport").addEventListener("click", () => {
        const destination = document.getElementById("destinationInput").value || "DestinationPart";
        document.getElementById("teleportOutput").textContent = fillTemplate(teleportPadTemplate, { destination }).trim();
    });

    document.getElementById("generateSpinner").addEventListener("click", () => {
        const speed = document.getElementById("speedInput").value || "5";
        document.getElementById("spinnerOutput").textContent = fillTemplate(spinnerPartTemplate, { speed }).trim();
    });

    document.getElementById("generateDoor").addEventListener("click", () => {
        document.getElementById("doorOutput").textContent = toggleDoorTemplate.trim();
    });

    document.getElementById("generatePowerUp").addEventListener("click", () => {
        const boost = document.getElementById("boostInput").value || "10";
        document.getElementById("powerUpOutput").textContent = fillTemplate(powerUpTemplate, { boost }).trim();
    });

    document.getElementById("generateJumpPad").addEventListener("click", () => {
        const power = document.getElementById("jumpPowerInput").value || "50";
        document.getElementById("jumpPadOutput").textContent = fillTemplate(jumpPadTemplate, { power }).trim();
    });

    document.getElementById("generateSpeedBoost").addEventListener("click", () => {
        const speed = document.getElementById("speedBoostInput").value || "30";
        document.getElementById("speedBoostOutput").textContent = fillTemplate(speedBoostPadTemplate, { speed }).trim();
    });

    document.getElementById("generateMessagePopup").addEventListener("click", () => {
        const message = document.getElementById("messageInput").value || "Hello!";
        document.getElementById("messagePopupOutput").textContent = fillTemplate(messagePopupTemplate, { message }).trim();
    });

    document.getElementById("generateExplosion").addEventListener("click", () => {
        const radius = document.getElementById("explosionRadiusInput").value || "10";
        document.getElementById("explosionOutput").textContent = fillTemplate(explosionTriggerTemplate, { radius }).trim();
    });

    document.getElementById("generateProximityPrompt").addEventListener("click", () => {
        const action = document.getElementById("proximityActionInput").value || "Do Something";
        document.getElementById("proximityOutput").textContent = fillTemplate(proximityPromptTemplate, { action }).trim();
    });

});
