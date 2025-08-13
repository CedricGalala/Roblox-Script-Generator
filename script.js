@@ -1,143 +1,185 @@
// --- Configuration ---
const generators = [
  // Effects
  {
    name: "Kill Brick",
    category: "Effects",
    name: "Explosion Trigger",
    inputs: ["Explosion Power"],
    generate: ({"Explosion Power": power}) => `
    fields: [{ name: "damage", label: "Damage Amount" }],
    generate: ({ damage }) => `
script.Parent.Touched:Connect(function(hit)
  local explosion = Instance.new("Explosion")
  explosion.Position = script.Parent.Position
  explosion.BlastRadius = ${power}
  explosion.Parent = workspace
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
    humanoid:TakeDamage(${damage})
  end
end)
    `.trim()
  },
  {
    category: "Effects",
    name: "Speed Boost Pad",
    inputs: ["Boost Speed", "Boost Duration (seconds)", "Original Speed"],
    generate: ({"Boost Speed": b, "Boost Duration (seconds)": d, "Original Speed": o}) => `
    name: "Teleport Pad",
    category: "Teleportation",
    fields: [
      { name: "x", label: "X Coordinate" },
      { name: "y", label: "Y Coordinate" },
      { name: "z", label: "Z Coordinate" }
    ],
    generate: ({ x, y, z }) => `
script.Parent.Touched:Connect(function(hit)
  local human = hit.Parent:FindFirstChild("Humanoid")
  if human then
    local originalSpeed = ${o}
    human.WalkSpeed = ${b}
    task.delay(${d}, function()
      human.WalkSpeed = originalSpeed
    end)
  local character = hit.Parent
  if character:FindFirstChild("Humanoid") then
    character:SetPrimaryPartCFrame(CFrame.new(${x}, ${y}, ${z}))
  end
end)
    `.trim()
  },
  {
    category: "UI",
    name: "Message Popup (BillboardGui)",
    inputs: ["Message Text"],
    generate: ({"Message Text": text}) => `
local gui = Instance.new("BillboardGui")
local label = Instance.new("TextLabel")
label.Text = "${text}"
label.Size = UDim2.new(1, 0, 1, 0)
label.BackgroundTransparency = 1
label.TextColor3 = Color3.new(1, 1, 1)
label.TextScaled = true
gui.Size = UDim2.new(0, 200, 0, 50)
gui.AlwaysOnTop = true
gui.Adornee = script.Parent
gui.Parent = script.Parent
label.Parent = gui
    name: "Jump Pad",
    category: "Movement",
    fields: [{ name: "force", label: "Jump Force" }],
    generate: ({ force }) => `
script.Parent.Touched:Connect(function(hit)
  local humanoidRoot = hit.Parent:FindFirstChild("HumanoidRootPart")
  if humanoidRoot then
    humanoidRoot.Velocity = Vector3.new(0, ${force}, 0)
  end
end)
    `.trim()
  },
  // Movement
  {
    name: "Speed Boost Pad",
    category: "Movement",
    name: "Jump Pad",
    inputs: ["Jump Power"],
    generate: ({"Jump Power": jp}) => `
    fields: [{ name: "speed", label: "Speed Amount" }],
    generate: ({ speed }) => `
script.Parent.Touched:Connect(function(hit)
  local hrp = hit.Parent:FindFirstChild("HumanoidRootPart")
  if hrp then
    hrp.Velocity = Vector3.new(0, ${jp}, 0)
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
    humanoid.WalkSpeed = ${speed}
  end
end)
    `.trim()
  },
  // Interaction
  {
    category: "Interaction",
    name: "Message Popup (BillboardGui)",
    category: "UI",
    fields: [{ name: "message", label: "Message Text" }],
    generate: ({ message }) => `
local billboard = Instance.new("BillboardGui")
billboard.Size = UDim2.new(0, 200, 0, 50)
billboard.StudsOffset = Vector3.new(0, 3, 0)
billboard.Adornee = script.Parent
billboard.Parent = script.Parent

local textLabel = Instance.new("TextLabel")
textLabel.Size = UDim2.new(1, 0, 1, 0)
textLabel.BackgroundTransparency = 1
textLabel.TextColor3 = Color3.new(1, 1, 1)
textLabel.TextStrokeTransparency = 0
textLabel.Text = "${message}"
textLabel.Parent = billboard
    `.trim()
  },
  {
    name: "Explosion Trigger",
    category: "Effects",
    fields: [{ name: "blastRadius", label: "Blast Radius" }],
    generate: ({ blastRadius }) => `
script.Parent.Touched:Connect(function()
  local explosion = Instance.new("Explosion")
  explosion.Position = script.Parent.Position
  explosion.BlastRadius = ${blastRadius}
  explosion.Parent = workspace
end)
    `.trim()
  },
  {
    name: "Proximity Prompt Action",
    inputs: ["Prompt Text", "Action Script"],
    generate: ({"Prompt Text": t, "Action Script": s}) => `
    category: "Interaction",
    fields: [
      { name: "actionText", label: "Action Text" },
      { name: "objectName", label: "Object to Create" }
    ],
    generate: ({ actionText, objectName }) => `
local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "${t}"
prompt.ObjectText = "Interact"
prompt.ActionText = "${actionText}"
prompt.ObjectText = script.Parent.Name
prompt.RequiresLineOfSight = false
prompt.Parent = script.Parent
prompt.Triggered:Connect(function(player)
  ${s}

prompt.Triggered:Connect(function()
  local part = Instance.new("Part")
  part.Name = "${objectName}"
  part.Position = script.Parent.Position + Vector3.new(0, 5, 0)
  part.Size = Vector3.new(4, 1, 4)
  part.Anchored = true
  part.Parent = workspace
end)
    `.trim()
  }
];

// --- Page Setup ---
const container = document.getElementById("generatorsContainer");
const categories = [...new Set(generators.map(g => g.category))];

categories.forEach(cat => {
const container = document.getElementById("generatorsContainer");
categories.forEach(category => {
  const section = document.createElement("div");
  section.className = "category";
  section.innerHTML = `<h2>${cat}</h2>`;
  const heading = document.createElement("h2");
  heading.textContent = category;
  section.appendChild(heading);

  generators.filter(g => g.category === cat).forEach(gen => {
  generators.filter(g => g.category === category).forEach(generator => {
    const div = document.createElement("div");
    div.className = "generator";

    div.innerHTML = `
      <h3>${gen.name}</h3>
      <div class="form-group">
        ${gen.inputs.map(input => `
          <label>${input}: <input type="text" data-input="${input}"/></label><br>
        `).join('')}
      </div>
      <button class="generate">Generate</button>
      <button class="download">Download .lua</button>
      <pre><code class="output"></code></pre>
    `;
    const title = document.createElement("h3");
    title.textContent = generator.name;
    div.appendChild(title);

    const form = document.createElement("div");
    form.className = "form-group";
    const state = {};
    generator.fields.forEach(field => {
      const label = document.createElement("label");
      label.textContent = field.label;
      const input = document.createElement("input");
      input.type = "text";
      input.oninput = () => {
        state[field.name] = input.value;
      };
      form.appendChild(label);
      form.appendChild(input);
    });
    div.appendChild(form);

    div.querySelector(".generate").onclick = () => {
      const inputs = {};
      div.querySelectorAll("[data-input]").forEach(inp => {
        inputs[inp.dataset.input] = inp.value;
      });
      try {
        const code = gen.generate(inputs);
        div.querySelector(".output").textContent = code;
      } catch (e) {
        div.querySelector(".output").textContent = "Error: Invalid input.";
      }
    const pre = document.createElement("pre");
    div.appendChild(pre);

    const generateBtn = document.createElement("button");
    generateBtn.textContent = "Generate";
    generateBtn.onclick = () => {
      pre.textContent = generator.generate(state);
    };
    div.appendChild(generateBtn);

    div.querySelector(".download").onclick = () => {
      const code = div.querySelector(".output").textContent;
      const blob = new Blob([code], {type: 'text/plain'});
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "💾 Download";
    downloadBtn.className = "download";
    downloadBtn.onclick = () => {
      if (!pre.textContent) return;
      const blob = new Blob([pre.textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = gen.name.replace(/\s+/g, '_') + ".lua";
      a.download = generator.name.replace(/\s+/g, "_") + ".lua";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };
    div.appendChild(downloadBtn);

    section.appendChild(div);
  });

  container.appendChild(section);
});

// --- Dark Mode Toggle ---
document.getElementById("darkModeToggle").onclick = () => {
  document.body.classList.toggle("dark-mode");
  const toggle = document.getElementById("darkModeToggle");
  toggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
};
