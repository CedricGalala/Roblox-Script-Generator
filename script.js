// --- Configuration ---
const generators = [
  // Effects
  {
    category: "Effects",
    name: "Explosion Trigger",
    inputs: ["Explosion Power"],
    generate: ({"Explosion Power": power}) => `
script.Parent.Touched:Connect(function(hit)
  local explosion = Instance.new("Explosion")
  explosion.Position = script.Parent.Position
  explosion.BlastRadius = ${power}
  explosion.Parent = workspace
end)
    `.trim()
  },
  {
    category: "Effects",
    name: "Speed Boost Pad",
    inputs: ["Boost Speed", "Boost Duration (seconds)", "Original Speed"],
    generate: ({"Boost Speed": b, "Boost Duration (seconds)": d, "Original Speed": o}) => `
script.Parent.Touched:Connect(function(hit)
  local human = hit.Parent:FindFirstChild("Humanoid")
  if human then
    local originalSpeed = ${o}
    human.WalkSpeed = ${b}
    task.delay(${d}, function()
      human.WalkSpeed = originalSpeed
    end)
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
    `.trim()
  },
  // Movement
  {
    category: "Movement",
    name: "Jump Pad",
    inputs: ["Jump Power"],
    generate: ({"Jump Power": jp}) => `
script.Parent.Touched:Connect(function(hit)
  local hrp = hit.Parent:FindFirstChild("HumanoidRootPart")
  if hrp then
    hrp.Velocity = Vector3.new(0, ${jp}, 0)
  end
end)
    `.trim()
  },
  // Interaction
  {
    category: "Interaction",
    name: "Proximity Prompt Action",
    inputs: ["Prompt Text", "Action Script"],
    generate: ({"Prompt Text": t, "Action Script": s}) => `
local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "${t}"
prompt.ObjectText = "Interact"
prompt.Parent = script.Parent
prompt.Triggered:Connect(function(player)
  ${s}
end)
    `.trim()
  }
];

// --- Page Setup ---
const container = document.getElementById("generatorsContainer");
const categories = [...new Set(generators.map(g => g.category))];

categories.forEach(cat => {
  const section = document.createElement("div");
  section.className = "category";
  section.innerHTML = `<h2>${cat}</h2>`;

  generators.filter(g => g.category === cat).forEach(gen => {
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
    };

    div.querySelector(".download").onclick = () => {
      const code = div.querySelector(".output").textContent;
      const blob = new Blob([code], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = gen.name.replace(/\s+/g, '_') + ".lua";
      a.click();
      URL.revokeObjectURL(url);
    };

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
