import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import "./person-card.js";
import { userEvent } from "@testing-library/user-event";

// Type declaration for the PersonCard element
declare global {
  interface HTMLElementTagNameMap {
    "person-card": HTMLElement & {
      name: string;
      role: string;
      status: string;
      email: string;
      dateJoined: string;
      location: string;
    };
  }
}

describe("PersonCard Component Initialization", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should initialize and render the PersonCard component", () => {
    // Create the component
    const personCard = document.createElement("person-card");

    // Set some basic attributes
    personCard.setAttribute("name", "John Doe");
    personCard.setAttribute("role", "Software Engineer");

    // Add to DOM
    container.appendChild(personCard);

    // Verify the component is in the document
    expect(personCard).toBeInTheDocument();

    // Verify it has a shadow root (web component feature)
    expect(personCard.shadowRoot).toBeTruthy();

    // Verify basic structure exists in shadow DOM
    const shadowRoot = personCard.shadowRoot!;
    expect(shadowRoot.querySelector(".person-card")).toBeTruthy();
    expect(shadowRoot.querySelector(".name")).toBeTruthy();
    expect(shadowRoot.querySelector(".role")).toBeTruthy();
  });

  it("should render with all attributes provided", () => {
    const personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Jane Smith");
    personCard.setAttribute("role", "Product Manager");
    personCard.setAttribute("status", "active");
    personCard.setAttribute("email", "jane@example.com");
    personCard.setAttribute("date-joined", "2023-01-15");
    personCard.setAttribute("location", "San Francisco, CA");

    container.appendChild(personCard);

    const shadowRoot = personCard.shadowRoot!;

    // Verify all content is rendered correctly
    expect(shadowRoot.querySelector(".name")).toHaveTextContent("Jane Smith");
    expect(shadowRoot.querySelector(".role")).toHaveTextContent(
      "Product Manager"
    );
    expect(shadowRoot.querySelector(".status")).toHaveTextContent("Active");
    expect(shadowRoot.querySelector(".email-text")).toHaveTextContent(
      "jane@example.com"
    );
    expect(shadowRoot.querySelector(".location-text")).toHaveTextContent(
      "San Francisco, CA"
    );
  });

  it("should render with fallback values when attributes are missing", () => {
    const personCard = document.createElement("person-card");
    container.appendChild(personCard);

    const shadowRoot = personCard.shadowRoot!;

    // Verify fallback values are used
    expect(shadowRoot.querySelector(".name")).toHaveTextContent(
      "Unknown Person"
    );
    expect(shadowRoot.querySelector(".role")).toHaveTextContent(
      "No role specified"
    );
    expect(shadowRoot.querySelector(".status")).toHaveTextContent("Active");
    expect(shadowRoot.querySelector(".email-text")).toHaveTextContent(
      "No email provided"
    );
    expect(shadowRoot.querySelector(".date-text")).toHaveTextContent(
      "Date not available"
    );
    expect(shadowRoot.querySelector(".location-text")).toHaveTextContent(
      "Location not specified"
    );
  });

  it("should render with different status values", () => {
    const personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Test User");
    personCard.setAttribute("role", "Developer");
    personCard.setAttribute("status", "inactive");

    container.appendChild(personCard);

    const shadowRoot = personCard.shadowRoot!;
    const statusElement = shadowRoot.querySelector(".status");

    expect(statusElement).toHaveTextContent("Inactive");
    expect(statusElement).toHaveClass("inactive");
  });

  it("should update content when attributes change", () => {
    const personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Initial Name");
    personCard.setAttribute("role", "Initial Role");

    container.appendChild(personCard);

    const shadowRoot = personCard.shadowRoot!;

    // Verify initial content
    expect(shadowRoot.querySelector(".name")).toHaveTextContent("Initial Name");
    expect(shadowRoot.querySelector(".role")).toHaveTextContent("Initial Role");

    // Update attributes
    personCard.setAttribute("name", "Updated Name");
    personCard.setAttribute("role", "Updated Role");

    // Verify content is updated
    expect(shadowRoot.querySelector(".name")).toHaveTextContent("Updated Name");
    expect(shadowRoot.querySelector(".role")).toHaveTextContent("Updated Role");
  });

  it("should have proper observed attributes", () => {
    const personCard = document.createElement("person-card");
    container.appendChild(personCard);

    // Get the constructor to access static properties
    const PersonCardConstructor = personCard.constructor as any;
    const observedAttributes = PersonCardConstructor.observedAttributes;

    // Verify observed attributes are defined
    expect(observedAttributes).toContain("name");
    expect(observedAttributes).toContain("role");
    expect(observedAttributes).toContain("status");
    expect(observedAttributes).toContain("email");
    expect(observedAttributes).toContain("date-joined");
    expect(observedAttributes).toContain("location");
  });

  it("should have getter and setter methods for all properties", () => {
    const personCard = document.createElement("person-card");
    container.appendChild(personCard);

    // Test getters and setters
    personCard.name = "Test Name";
    expect(personCard.name).toBe("Test Name");
    expect(personCard.getAttribute("name")).toBe("Test Name");

    personCard.role = "Test Role";
    expect(personCard.role).toBe("Test Role");
    expect(personCard.getAttribute("role")).toBe("Test Role");

    personCard.status = "away";
    expect(personCard.status).toBe("away");
    expect(personCard.getAttribute("status")).toBe("away");

    personCard.email = "test@example.com";
    expect(personCard.email).toBe("test@example.com");
    expect(personCard.getAttribute("email")).toBe("test@example.com");

    personCard.dateJoined = "2023-06-01";
    expect(personCard.dateJoined).toBe("2023-06-01");
    expect(personCard.getAttribute("date-joined")).toBe("2023-06-01");

    personCard.location = "Test Location";
    expect(personCard.location).toBe("Test Location");
    expect(personCard.getAttribute("location")).toBe("Test Location");
  });

  it("should dispatch initialization event when connected", () => {
    const personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Event Test");
    personCard.setAttribute("role", "Tester");

    let eventDispatched = false;
    let eventData: any = null;

    personCard.addEventListener("person-card:initialized", (event) => {
      eventDispatched = true;
      eventData = (event as CustomEvent).detail;
    });

    container.appendChild(personCard);

    expect(eventDispatched).toBe(true);
    expect(eventData).toBeTruthy();
    expect(eventData.personData.name).toBe("Event Test");
    expect(eventData.personData.role).toBe("Tester");
  });

  it("should have interactive elements properly rendered", () => {
    const personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Interactive Test");
    personCard.setAttribute("role", "Tester");

    container.appendChild(personCard);

    const shadowRoot = personCard.shadowRoot!;

    // Verify interactive elements exist
    expect(shadowRoot.querySelector(".view-profile-button")).toBeTruthy();
    expect(shadowRoot.querySelector(".menu-button")).toBeTruthy();
    expect(shadowRoot.querySelector(".dropdown-menu")).toBeTruthy();

    // Verify menu items exist
    const menuItems = shadowRoot.querySelectorAll(".menu-item");
    expect(menuItems.length).toBeGreaterThan(0);
  });
});

describe("PersonCard Menu Functionality", () => {
  let container: HTMLElement;
  let personCard: HTMLElement & {
    name: string;
    role: string;
    status: string;
    email: string;
    dateJoined: string;
    location: string;
  };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Menu Test User");
    personCard.setAttribute("role", "Developer");
    container.appendChild(personCard);

    user = userEvent.setup();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should open menu when menu button is clicked", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Menu should be closed initially
    expect(dropdownMenu).not.toHaveClass("open");

    // Click menu button using user-event
    await user.click(menuButton);

    // Menu should be open
    expect(dropdownMenu).toHaveClass("open");
    expect(personCard).toHaveAttribute("aria-expanded", "true");
  });

  it("should close menu when menu button is clicked again", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Open menu first
    await user.click(menuButton);
    expect(dropdownMenu).toHaveClass("open");

    // Click menu button again
    await user.click(menuButton);

    // Menu should be closed
    expect(dropdownMenu).not.toHaveClass("open");
    expect(personCard).toHaveAttribute("aria-expanded", "false");
  });

  it("should close menu when clicking outside the component", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Open menu
    await user.click(menuButton);
    expect(dropdownMenu).toHaveClass("open");

    // Click outside the component
    await user.click(document.body);

    // Menu should be closed
    expect(dropdownMenu).not.toHaveClass("open");
  });

  it("should dispatch menu toggle event when menu is opened/closed", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;

    let eventDispatched = false;
    let eventData: any = null;

    personCard.addEventListener("person-card:menu-toggled", (event) => {
      eventDispatched = true;
      eventData = (event as CustomEvent).detail;
    });

    // Open menu
    await user.click(menuButton);

    expect(eventDispatched).toBe(true);
    expect(eventData.isOpen).toBe(true);
    expect(eventData.personData.name).toBe("Menu Test User");

    // Reset for close test
    eventDispatched = false;
    eventData = null;

    // Close menu
    await user.click(menuButton);

    expect(eventDispatched).toBe(true);
    expect(eventData.isOpen).toBe(false);
  });

  it("should dispatch events when menu items are clicked", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;

    // Open menu
    await user.click(menuButton);

    const menuItems = shadowRoot.querySelectorAll(".menu-item");
    const editProfileItem = menuItems[0] as HTMLElement;

    let eventDispatched = false;
    let eventData: any = null;

    personCard.addEventListener("person-card:menu-item-clicked", (event) => {
      eventDispatched = true;
      eventData = (event as CustomEvent).detail;
    });

    // Click edit profile menu item
    await user.click(editProfileItem);

    expect(eventDispatched).toBe(true);
    expect(eventData.action).toBe("edit-profile");
    expect(eventData.personData.name).toBe("Menu Test User");
  });
});

describe("PersonCard Keyboard Navigation", () => {
  let container: HTMLElement;
  let personCard: HTMLElement & {
    name: string;
    role: string;
    status: string;
    email: string;
    dateJoined: string;
    location: string;
  };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    personCard = document.createElement("person-card");
    personCard.setAttribute("name", "Keyboard Test User");
    personCard.setAttribute("role", "Developer");
    container.appendChild(personCard);

    user = userEvent.setup();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should open menu when Enter key is pressed on menu button", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Focus menu button
    menuButton.focus();

    // Press Enter key
    await user.keyboard("{Enter}");

    // Menu should be open
    expect(dropdownMenu).toHaveClass("open");
    expect(personCard).toHaveAttribute("aria-expanded", "true");
  });

  it("should open menu when Space key is pressed on menu button", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Focus menu button
    menuButton.focus();

    // Press Space key
    await user.keyboard(" ");

    // Menu should be open
    expect(dropdownMenu).toHaveClass("open");
    expect(personCard).toHaveAttribute("aria-expanded", "true");
  });

  it("should close menu when Escape key is pressed", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Open menu
    await user.click(menuButton);
    expect(dropdownMenu).toHaveClass("open");

    // Press Escape key
    await user.keyboard("{Escape}");

    // Menu should be closed
    expect(dropdownMenu).not.toHaveClass("open");
    expect(personCard).toHaveAttribute("aria-expanded", "false");
  });

  it("should close menu when Escape key is pressed on menu item", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    // Open menu
    await user.click(menuButton);

    const menuItems = shadowRoot.querySelectorAll(".menu-item");
    const firstMenuItem = menuItems[0] as HTMLElement;

    // Focus menu item and press Escape
    firstMenuItem.focus();
    await user.keyboard("{Escape}");

    // Menu should be closed
    expect(dropdownMenu).not.toHaveClass("open");
    expect(personCard).toHaveAttribute("aria-expanded", "false");
  });

  it("should activate menu item when Enter key is pressed", async () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;

    // Open menu
    await user.click(menuButton);

    const menuItems = shadowRoot.querySelectorAll(".menu-item");
    const firstMenuItem = menuItems[0] as HTMLElement;

    let eventDispatched = false;

    personCard.addEventListener("person-card:menu-item-clicked", () => {
      eventDispatched = true;
    });

    // Press Enter key on menu item
    await user.keyboard("{Enter}");

    // Event should be dispatched
    expect(eventDispatched).toBe(true);
  });
});

describe("PersonCard Accessibility and ARIA", () => {
  let container: HTMLElement;
  let personCard: HTMLElement & {
    name: string;
    role: string;
    status: string;
    email: string;
    dateJoined: string;
    location: string;
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    personCard = document.createElement("person-card");
    personCard.setAttribute("name", "A11y Test User");
    personCard.setAttribute("role", "QA");
    container.appendChild(personCard);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should have proper ARIA attributes on menu button", () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuButton = shadowRoot.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    expect(menuButton).toHaveAttribute(
      "aria-label",
      "Open menu for person actions"
    );
    expect(menuButton).toHaveAttribute("aria-haspopup", "true");
    expect(menuButton).toHaveAttribute("aria-controls", "person-menu");
    expect(menuButton).toHaveAttribute("aria-describedby", "menu-description");
  });

  it("should have proper ARIA roles and attributes on menu", () => {
    const shadowRoot = personCard.shadowRoot!;
    const dropdownMenu = shadowRoot.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;
    expect(dropdownMenu).toHaveAttribute("role", "menu");
    expect(dropdownMenu).toHaveAttribute("aria-orientation", "vertical");
    expect(dropdownMenu).toHaveAttribute(
      "aria-describedby",
      "menu-description"
    );
  });

  it("should have proper ARIA roles and labels on menu items", () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuItems = shadowRoot.querySelectorAll(".menu-item");
    menuItems.forEach((item) => {
      expect(item).toHaveAttribute("role", "menuitem");
      expect(item).toHaveAttribute("aria-label");
    });
  });

  it("should have a visually hidden menu description for screen readers", () => {
    const shadowRoot = personCard.shadowRoot!;
    const menuDescription = shadowRoot.querySelector(
      ".menu-description"
    ) as HTMLElement;
    expect(menuDescription).toBeTruthy();
    expect(menuDescription.classList.contains("sr-only")).toBe(true);
    expect(menuDescription.textContent).toMatch(
      /Menu with actions for this person/i
    );
  });

  it("should have a visually hidden label for the menu button", () => {
    const shadowRoot = personCard.shadowRoot!;
    const srOnly = shadowRoot.querySelector(
      ".menu-button .sr-only"
    ) as HTMLElement;
    expect(srOnly).toBeTruthy();
    expect(srOnly.textContent).toMatch(/More actions/i);
    expect(srOnly.classList.contains("sr-only")).toBe(true);
  });
});

describe("PersonCard Data Handling and Graceful Degradation", () => {
  let container: HTMLElement;
  let personCard: HTMLElement & {
    name: string;
    role: string;
    status: string;
    email: string;
    dateJoined: string;
    location: string;
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    personCard = document.createElement("person-card");
    container.appendChild(personCard);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should display fallback for missing required fields", () => {
    const shadowRoot = personCard.shadowRoot!;
    expect(shadowRoot.querySelector(".name")).toHaveTextContent(
      "Unknown Person"
    );
    expect(shadowRoot.querySelector(".role")).toHaveTextContent(
      "No role specified"
    );
  });

  it("should display fallback for missing optional fields", () => {
    const shadowRoot = personCard.shadowRoot!;
    expect(shadowRoot.querySelector(".email-text")).toHaveTextContent(
      "No email provided"
    );
    expect(shadowRoot.querySelector(".date-text")).toHaveTextContent(
      "Date not available"
    );
    expect(shadowRoot.querySelector(".location-text")).toHaveTextContent(
      "Location not specified"
    );
  });

  it("should display fallback for empty string attributes", () => {
    personCard.setAttribute("name", "");
    personCard.setAttribute("role", "");
    personCard.setAttribute("email", "");
    personCard.setAttribute("date-joined", "");
    personCard.setAttribute("location", "");
    const shadowRoot = personCard.shadowRoot!;
    expect(shadowRoot.querySelector(".name")).toHaveTextContent(
      "Unknown Person"
    );
    expect(shadowRoot.querySelector(".role")).toHaveTextContent(
      "No role specified"
    );
    expect(shadowRoot.querySelector(".email-text")).toHaveTextContent(
      "No email provided"
    );
    expect(shadowRoot.querySelector(".date-text")).toHaveTextContent(
      "Date not available"
    );
    expect(shadowRoot.querySelector(".location-text")).toHaveTextContent(
      "Location not specified"
    );
  });

  it("should sanitize and not render HTML in name, role, or location", () => {
    personCard.setAttribute("name", "<img src=x onerror=alert(1)>");
    personCard.setAttribute("role", "<script>alert(1)</script>");
    personCard.setAttribute("location", "<b>London</b>");
    const shadowRoot = personCard.shadowRoot!;

    // Check that HTML is escaped (not rendered as HTML)
    expect(shadowRoot.querySelector(".name")!.innerHTML).not.toContain("<img");
    expect(shadowRoot.querySelector(".role")!.innerHTML).not.toContain(
      "<script"
    );
    expect(shadowRoot.querySelector(".location-text")!.innerHTML).not.toContain(
      "<b>"
    );

    // Check that the escaped HTML content is displayed as text
    expect(shadowRoot.querySelector(".name")).toHaveTextContent(
      "&lt;img src=x onerror=alert(1)&gt;"
    );
    expect(shadowRoot.querySelector(".role")).toHaveTextContent(
      "&lt;script&gt;alert(1)&lt;&#x2F;script&gt;"
    );
    expect(shadowRoot.querySelector(".location-text")).toHaveTextContent(
      "&lt;b&gt;London&lt;&#x2F;b&gt;"
    );
  });

  it("should sanitize and not render HTML in email", () => {
    personCard.setAttribute("email", "<a href=mailto:x@y.com>malicious</a>");
    const shadowRoot = personCard.shadowRoot!;

    // Check that HTML is escaped
    expect(shadowRoot.querySelector(".email-text")!.innerHTML).not.toContain(
      "<a"
    );

    // The email sanitization function returns empty string for invalid format, triggering fallback
    expect(shadowRoot.querySelector(".email-text")).toHaveTextContent(
      "No email provided"
    );
  });

  it("should display fallback for invalid date", () => {
    personCard.setAttribute("date-joined", "not-a-date");
    const shadowRoot = personCard.shadowRoot!;
    expect(shadowRoot.querySelector(".date-text")).toHaveTextContent(
      "Date not available"
    );
  });
});
