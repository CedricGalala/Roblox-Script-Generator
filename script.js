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
      }
    ]
  }
];

// Helper to create input
function createInput(field) {
  const label = document.createElement("label");
  label.textContent = field.label;

  const input = document.createElement("input");
  input.type = "text";
  input.name = field.name;
  label.appendChild(input);

  return label;
}

// Create generator UI
function createGeneratorElement(gen) {
  const container = document.createElement("div");
  container.className = "generator";

  const title = document.createElement("h3");
  title.textContent = gen.name;
  container.appendChild(title);

  const form = document.createElement("form");
  gen.fields.forEach(f => {
    form.appendChild(createInput(f));
  });
  container.appendChild(form);

  const codeBlock = document.createElement("pre");
  codeBlock.textContent = "-- Fill inputs and click Generate --";
  container.appendChild(codeBlock);

  const btnGenerate = document.createElement("button");
  btnGenerate.type = "button";
  btnGenerate.textContent = "Generate Script";
  btnGenerate.addEventListener("click", () => {
    const values = {};
    for (const f of gen.fields) {
      const val = form.elements[f.name].value.trim();
      if (!val) {
        alert("Please fill all fields.");
        return;
      }
      values[f.name] = val;
    }
    const code = gen.generate(values);
    codeBlock.textContent = code;
  });
  container.appendChild(btnGenerate);

  const btnCopy = document.createElement("button");
  btnCopy.type = "button";
  btnCopy.textContent = "📋 Copy";
  btnCopy.style.marginLeft = "10px";
  btnCopy.addEventListener("click", () => {
    if (codeBlock.textContent.includes("-- Fill")) {
      alert("Generate the script first.");
      return;
    }
    navigator.clipboard.writeText(codeBlock.textContent);
    alert("Copied to clipboard!");
  });
  container.appendChild(btnCopy);

  return container;
}

// Accordion logic:
const categoriesContainer = document.getElementById("categoriesContainer");
let openedGeneratorsDiv = null;
let openedArrow = null;

generators.forEach(category => {
  const catDiv = document.createElement("div");
  catDiv.className = "category";

  const arrow = document.createElement("span");
  arrow.className = "category-arrow";
  arrow.textContent = "▶";
  catDiv.appendChild(arrow);

  const title = document.createElement("div");
  title.textContent = category.category;
  title.style.flexGrow = "1";
  catDiv.appendChild(title);

  categoriesContainer.appendChild(catDiv);

  // Generators container
  const genContainer = document.createElement("div");
  genContainer.className = "generators";
  genContainer.style.display = "none";
  categoriesContainer.appendChild(genContainer);

  // Add all generators inside this container
  category.scripts.forEach(gen => {
    genContainer.appendChild(createGeneratorElement(gen));
  });

  // Click event - accordion behavior
  catDiv.addEventListener("click", () => {
    if (genContainer.style.display === "none") {
      // Close previously opened
      if (openedGeneratorsDiv && openedGeneratorsDiv !== genContainer) {
        openedGeneratorsDiv.style.display = "none";
        openedArrow.textContent = "▶";
      }
      // Open this
      genContainer.style.display = "block";
      arrow.textContent = "▼";
      openedGeneratorsDiv = genContainer;
      openedArrow = arrow;
    } else {
      // Close if clicking open category
      genContainer.style.display = "none";
      arrow.textContent = "▶";
      openedGeneratorsDiv = null;
      openedArrow = null;
    }
  });
});

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "☀️";
  } else {
    darkModeToggle.textContent = "🌙";
  }
});
