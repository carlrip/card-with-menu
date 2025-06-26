import "./style.css";
import "./person-card.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Person Card Component - Keyboard Navigation Test</h1>
    <p>Use Tab to navigate between elements. Use Enter/Space to activate buttons. Use arrow keys in the menu.</p>
    
    <person-card 
      name="John Doe" 
      role="Software Engineer" 
      status="Active" 
      email="john.doe@example.com" 
      date-joined="2024-01-01" 
      location="New York">
    </person-card>
    
    <div style="margin-top: 20px;">
      <button id="test-button">Test Button (Tab here after menu)</button>
    </div>
  </div>
`;

const personCard = document.querySelector("person-card");

personCard?.addEventListener("person-card:initialized", (event) => {
  console.log("Person card initialized", (event as CustomEvent).detail);
});

personCard?.addEventListener("person-card:profile-viewed", (event) => {
  console.log("Profile viewed", (event as CustomEvent).detail);
});

personCard?.addEventListener("person-card:menu-toggled", (event) => {
  console.log("Menu toggled", (event as CustomEvent).detail);
});

personCard?.addEventListener("person-card:menu-item-clicked", (event) => {
  console.log("Menu item clicked", (event as CustomEvent).detail);
});

// Add test button functionality
const testButton = document.getElementById("test-button");
testButton?.addEventListener("click", () => {
  console.log("Test button clicked");
});
