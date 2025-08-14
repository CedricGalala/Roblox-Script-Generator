document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    {
      name: "Movement",
      generators: [
        { name: "Speed Boost Pad", script: `print("Speed boost script here")` },
        { name: "Jump Pad", script: `print("Jump pad script here")` }
      ]
    },
    {
      name: "Interactions",
      generators: [
        { name: "Message Popup", script: `print("Popup message script here")` },
        { name: "Proximity Prompt Action", script: `print("Proximity prompt script here")` }
      ]
    },
    {
      name: "Effects",
      generators: [
        { name: "Explosion Trigger", script: `print("Explosion trigger script here")` }
      ]
    }
  ];

  const categoriesContainer = document.getElementById("categoriesContainer");

  categories.forEach(category => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");

    const title = document.createElement("h2");
    title.textContent = category.name;
    categoryDiv.appendChild(title);

    const generatorsDiv = document.createElement("div");
    generatorsDiv.classList.add("generators");

    category.generators.forEach(gen => {
      const genDiv = document.createElement("div");
      genDiv.classList.add("generator");

      const genTitle = document.createElement("h3");
      genTitle.textContent = gen.name;

      const codeBlock = document.createElement("pre");
      codeBlock.textContent = gen.script;

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "📋 Copy";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(gen.script);
        alert("Script copied to clipboard!");
      });

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "💾 Download .lua";
      downloadBtn.addEventListener("click", () => {
        const blob = new Blob([gen.script], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${gen.name}.lua`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      genDiv.appendChild(genTitle);
      genDiv.appendChild(codeBlock);
      genDiv.appendChild(copyBtn);
      genDiv.appendChild(downloadBtn);

      generatorsDiv.appendChild(genDiv);
    });

    categoryDiv.appendChild(generatorsDiv);

    categoryDiv.addEventListener("click", () => {
      generatorsDiv.style.display =
        generatorsDiv.style.display === "block" ? "none" : "block";
    });

    categoriesContainer.appendChild(categoryDiv);
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});
