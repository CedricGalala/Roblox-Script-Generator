document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Loaded and DOM ready");

  const generators = [
    {
      name: "Kill Brick",
      category: "Effects",
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
      name: "Teleport Pad",
      category: "Teleportation",
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
    },
    {
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
    {
      name: "Speed Boost Pad",
      category: "Movement",
      fields: [{ name: "speed", label: "Speed Amount" }],
      generate: ({ speed }) => `
script.Parent.Touched:Connect(function(hit)
  local humanoid = hit.Parent:FindFirstChild("Humanoid")
  if humanoid then
    humanoid.WalkSpeed = ${speed}
  end
end)
      `.trim()
    },
    {
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
      category: "Interaction",
      fields: [
        { name: "actionText", label: "Action Text" },
        { name: "objectName", label: "Object to Create" }
      ],
      generate: ({ actionText, objectName }) => `
local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "${actionText}"
prompt.ObjectText = script.Parent.Name
prompt.RequiresLineOfSight = false
prompt.Parent = script.Parent

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

  const container = document.getElementById("generatorsContainer");
  if (!container) {
    console.error("No container found!");
    return;
  }

  const categories = [...new Set(generators.map(g => g.category))];
  let openCategorySection = null;

  categories.forEach(category => {
    const section = document.createElement("div");
    section.className = "category";

    const heading = document.createElement("h2");
    heading.textContent = category;
    section.appendChild(heading);

    const scriptsWrapper = document.createElement("div");
    scriptsWrapper.className = "generators-wrapper";
    scriptsWrapper.style.display = "none";

    generators.filter(g => g.category === category).forEach(generator => {
      const genDiv = document.createElement("div");
      genDiv.className = "generator";

      const title = document.createElement("h3");
      title.textContent = generator.name;
      genDiv.appendChild(title);

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

        label.appendChild(input);
        form.appendChild(label);
      });
      genDiv.appendChild(form);

      const pre = document.createElement("pre");
      genDiv.appendChild(pre);

      const generateBtn = document.createElement("button");
      generateBtn.textContent = "Generate";
      generateBtn.onclick = () => {
        pre.textContent = generator.generate(state);
      };
      genDiv.appendChild(generateBtn);

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "💾 Download";
      downloadBtn.className = "download";
      downloadBtn.onclick = () => {
        if (!pre.textContent) return;
        const blob = new Blob([pre.textContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = generator.name.replace(/\s+/g, "_") + ".lua";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      genDiv.appendChild(downloadBtn);

      scriptsWrapper.appendChild(genDiv);
    });

    section.appendChild(scriptsWrapper);
    container.appendChild(section);

    heading.style.cursor = "pointer";
    heading.addEventListener("click", () => {
      if (openCategorySection && openCategorySection !== scriptsWrapper) {
        openCategorySection.style.display = "none";
        openCategorySection.parentElement.classList.remove("expanded");
      }

      if (scriptsWrapper.style.display === "block") {
        scriptsWrapper.style.display = "none";
        section.classList.remove("expanded");
        openCategorySection = null;
      } else {
        scriptsWrapper.style.display = "block";
        section.classList.add("expanded");
        openCategorySection = scriptsWrapper;
      }
    });
  });

  document.getElementById("darkModeToggle").onclick = () => {
    document.body.classList.toggle("dark-mode");
  };
});
