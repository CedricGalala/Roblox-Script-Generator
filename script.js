// All generators (original + new), grouped by category:
const generators = [
  {
    category: "Effects",
    scripts: [
      {
        name: "Kill Brick",
        fields: [{ name: "damage", label: "Damage Amount" }],
        generate: ({ damage }) => `
script.Parent.Touched:Connect(function(hit)
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
    humanoid:TakeDamage(${damage})
  end
end)
`.trim()
      },
      {
        name: "Explosion Trigger",
        fields: [{ name: "power", label: "Explosion Power" }],
        generate: ({ power }) => `
script.Parent.Touched:Connect(function(hit)
  local explosion = Instance.new("Explosion")
  explosion.Position = script.Parent.Position
  explosion.BlastRadius = ${power}
  explosion.Parent = workspace
end)
`.trim()
      }
    ]
  },
  {
    category: "Movement",
    scripts: [
      {
        name: "Jump Pad",
        fields: [{ name: "force", label: "Jump Force" }],
        generate: ({ force }) => `
script.Parent.Touched:Connect(function(hit)
  local human = hit.Parent:FindFirstChild("Humanoid")
  if human then
    human:ChangeState(Enum.HumanoidStateType.Jumping)
    human.JumpPower = ${force}
  end
end)
`.trim()
      },
      {
        name: "Speed Boost Pad",
        fields: [
          { name: "boostSpeed", label: "Boost Speed" },
          { name: "boostDuration", label: "Boost Duration (seconds)" },
          { name: "originalSpeed", label: "Original Speed" }
        ],
        generate: ({ boostSpeed, boostDuration, originalSpeed }) => `
script.Parent.Touched:Connect(function(hit)
  local human = hit.Parent:FindFirstChild("Humanoid")
  if human then
    local originalSpeed = ${originalSpeed}
    human.WalkSpeed = ${boostSpeed}
    task.delay(${boostDuration}, function()
      human.WalkSpeed = originalSpeed
    end)
  end
end)
`.trim()
      }
    ]
  },
  {
    category: "UI",
    scripts: [
      {
        name: "Message Popup (BillboardGui)",
        fields: [{ name: "message", label: "Message Text" }],
        generate: ({ message }) => `
local billboard = Instance.new("BillboardGui", script.Parent)
billboard.Size = UDim2.new(0, 200, 0, 50)
billboard.Adornee = script.Parent
billboard.AlwaysOnTop = true

local label = Instance.new("TextLabel", billboard)
label.Size = UDim2.new(1,0,1,0)
label.BackgroundTransparency = 1
label.TextColor3 = Color3.new(1,1,1)
label.TextStrokeTransparency = 0
label.Text = "${message}"
label.TextScaled = true
`.trim()
      }
    ]
  },
  {
    category: "Interaction",
    scripts: [
      {
        name: "Proximity Prompt Action",
        fields: [{ name: "actionText", label: "Action Text" }],
        generate: ({ actionText }) => `
local prompt = Instance.new("ProximityPrompt", script.Parent)
prompt.ActionText = "${actionText}"
prompt.ObjectText = script.Parent.Name
prompt.MaxActivationDistance = 10
prompt.RequiresLineOfSight = false

prompt.Triggered:Connect(function(player)
  print(player.Name .. " triggered the prompt!")
end)
`.trim()
      }
    ]
  },
  {
    category: "Teleportation",
    scripts: [
      {
        name: "Teleport Pad",
        fields: [
          { name: "x", label: "X Coordinate" },
          { name: "y", label: "Y Coordinate" },
          { name: "z", label: "Z Coordinate" }
        ],
        generate: ({ x, y, z }) => `
script.Parent.Touched:Connect(function(hit)
  local character = hit.Parent
  if character:FindFirstChild("Humanoid") then
    character:SetPrimaryPartCFrame(CFrame.new(${x}, ${y}, ${z}))
  end
end)
`.trim()
      }
    ]
  }
];

const categoriesContainer = document.getElementById("categoriesContainer");

// Helper: create input element for a field
function createInput(field) {
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "8px";

  const label = document.createElement("label");
  label.textContent = field.label + ": ";
  label.htmlFor = "input_" + field.name;
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.id = "input_" + field.name;
  input.name = field.name;
  input.required = true;
  input.style.width = "100%";
  wrapper.appendChild(input);

  return wrapper;
}

function createGeneratorElement(gen) {
  const genDiv = document.createElement("div");
  genDiv.classList.add("generator");

  const title = document.createElement("h3");
  title.textContent = gen.name;
  genDiv.appendChild(title);

  // Form for inputs
  const form = document.createElement("form");
  form.style.marginBottom = "10px";

  // Inputs
  const inputs = {};
  gen.fields.forEach(field => {
    const inputElem = createInput(field);
    form.appendChild(inputElem);
    inputs[field.name] = inputElem.querySelector("input");
  });

  genDiv.appendChild(form);

  // Code output block
  const codeBlock = document.createElement("pre");
  codeBlock.textContent = "-- Fill inputs and click Generate --";
  genDiv.appendChild(codeBlock);

  // Buttons container
  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");

  // Generate button
  const generateBtn = document.createElement("button");
  generateBtn.type = "button";
  generateBtn.textContent = "Generate Script";
  generateBtn.classList.add("copy-btn");
  generateBtn.style.marginRight = "10px";
  generateBtn.addEventListener("click", () => {
    // Gather input values
    const values = {};
    let valid = true;
    for (const key in inputs) {
      const val = inputs[key].value.trim();
      if (!val) {
        alert("Please fill in all inputs!");
        valid = false;
        break;
      }
      values[key] = val;
    }
    if (!valid) return;

    // Generate code and show
    const code = gen.generate(values);
    codeBlock.textContent = code;
  });
  buttonsDiv.appendChild(generateBtn);

  // Copy button
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.textContent = "📋 Copy";
  copyBtn.classList.add("copy-btn");
  copyBtn.addEventListener("click", () => {
    if (codeBlock.textContent && !codeBlock.textContent.includes("Fill inputs")) {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        alert("Script copied to clipboard!");
      });
    } else {
      alert("Generate the script first!");
    }
  });
  buttonsDiv.appendChild(copyBtn);

  // Download button
  const downloadBtn = document.createElement("button");
  downloadBtn.type = "button";
  downloadBtn.textContent = "💾 Download .lua";
  downloadBtn.classList.add("download-btn");
  downloadBtn.addEventListener("click", () => {
    if (codeBlock.textContent && !codeBlock.textContent.includes("Fill inputs")) {
      const blob = new Blob([codeBlock.textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gen.name.replace(/\s+/g, "_")}.lua`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      alert("Generate the script first!");
    }
  });
  buttonsDiv.appendChild(downloadBtn);

  genDiv.appendChild(buttonsDiv);

  return genDiv;
}

function createCategoryElement(category) {
  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category");

  // Arrow icon
  const arrow = document.createElement("span");
  arrow.classList.add("category-arrow");
  arrow.textContent = "▶";
  categoryDiv.appendChild(arrow);

  // Title
  const title = document.createElement("div");
  title.classList.add("category-title");
  title.textContent = category.category;
  categoryDiv.appendChild(title);

  // Generators container (hidden initially)
  const generatorsDiv = document.createElement("div");
  generatorsDiv.classList.add("generators");
  generatorsDiv.style.display = "none";

  // Create each generator element
  category.scripts.forEach(gen => {
    generatorsDiv.appendChild(createGeneratorElement(gen));
  });

  // Add generators container after category div
  categoryDiv.insertAdjacentElement("afterend", generatorsDiv);

  // Toggle on click (categoryDiv only)
  categoryDiv.addEventListener("click", () => {
    if (generatorsDiv.style.display === "none") {
      generatorsDiv.style.display = "block";
      arrow.classList.add("open");
    } else {
      generatorsDiv.style.display = "none";
      arrow.classList.remove("open");
    }
  });

  return categoryDiv;
}

// Render all categories
generators.forEach(cat => {
  const catElem = createCategoryElement(cat);
  categoriesContainer.appendChild(catElem);
});

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Change button emoji
  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "☀️";
  } else {
    darkModeToggle.textContent = "🌙";
  }
});

// Optional: remember dark mode preference in localStorage
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.textContent = "☀️";
}
darkModeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});
