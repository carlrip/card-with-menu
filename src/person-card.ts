import { formatDate } from "./utils/dateFormatter.js";
import {
  sanitizeText,
  sanitizeEmail,
  sanitizeDate,
} from "./utils/sanitization.js";

class PersonCard extends HTMLElement {
  static template = `
    <style>
      /* CSS Variables for values used more than once */
      :host {
        --color-primary: #3b82f6;
        --color-primary-hover: #2563eb;
        --color-text-primary: #1e293b;
        --color-text-secondary: #64748b;
        --color-border: #e2e8f0;
        --color-background-hover: #f9fafb;
        --color-background-active: #e5e7eb;
        
        /* Status colors */
        --color-status-active: #16a34a;
        --color-status-active-bg: #dcfce7;
        --color-status-active-text: #166534;
        --color-status-inactive: #dc2626;
        --color-status-inactive-bg: #fef2f2;
        --color-status-inactive-text: #dc2626;
        --color-status-away: #d97706;
        --color-status-away-bg: #fef3c7;
        --color-status-away-text: #d97706;
        
        /* Danger colors */
        --color-danger: #dc2626;
        --color-danger-hover: #b91c1c;
        --color-danger-bg: #fef2f2;
        --color-danger-bg-hover: #fee2e2;
        
        --spacing-sm: 8px;
        --spacing-md: 12px;
        --spacing-lg: 16px;
        --transition-fast: 0.15s ease;
      }

      /* Host element - the card container */
      :host {
        display: block;
        width: 320px;
        height: 320px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        position: relative;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transition: box-shadow 0.2s ease, transform 0.2s ease;
        overflow: hidden;
      }

      /* Hover effect for the entire card */
      :host(:hover) {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transform: translateY(-1px);
      }

      /* Main card layout */
      .person-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }

      /* Card header section */
      .card-header {
        position: relative;
        padding: var(--spacing-lg) var(--spacing-lg) 0 var(--spacing-lg);
        flex-shrink: 0;
        min-height: 48px;
      }

      /* Menu button styling */
      .menu-button {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        color: var(--color-text-secondary);
        transition: all var(--transition-fast);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .menu-button:hover {
        background: var(--color-background-hover);
        color: var(--color-text-primary);
        transform: scale(1.05);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .menu-button:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
        background: var(--color-background-hover);
        color: var(--color-text-primary);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .menu-button[aria-expanded="true"] {
        background: var(--color-primary);
        color: white;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      }

      .menu-button[aria-expanded="true"]:hover {
        background: var(--color-primary-hover);
        color: white;
        box-shadow: 0 3px 6px rgba(59, 130, 246, 0.4);
      }

      /* Dropdown menu styling */
      .dropdown-menu {
        position: absolute;
        top: 44px;
        right: var(--spacing-md);
        background: white;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        min-width: 180px;
        z-index: 1000;
        display: none;
        padding: 6px 0;
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
        transition: all var(--transition-fast);
        backdrop-filter: blur(8px);
      }

      .dropdown-menu.open {
        display: block;
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      /* Menu items styling */
      .menu-item {
        display: flex;
        align-items: center;
        padding: 10px var(--spacing-md);
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-primary);
        text-decoration: none;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: all var(--transition-fast);
        position: relative;
        border-radius: 4px;
        margin: 0 4px;
        width: calc(100% - 8px);
      }

      .menu-item:hover {
        background: var(--color-background-hover);
        color: var(--color-text-primary);
        transform: translateX(2px);
      }

      .menu-item:focus-visible {
        background: var(--color-background-hover);
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
        color: var(--color-text-primary);
        transform: translateX(2px);
      }

      .menu-item:active {
        background: var(--color-background-active);
        transform: translateX(1px);
      }

      .menu-item svg {
        width: 16px;
        height: 16px;
        margin-right: var(--spacing-sm);
        flex-shrink: 0;
        transition: transform var(--transition-fast);
        opacity: 0.8;
      }

      .menu-item:hover svg,
      .menu-item:focus-visible svg {
        transform: scale(1.1);
        opacity: 1;
      }

      /* Danger menu items */
      .menu-item.danger {
        color: var(--color-danger);
      }

      .menu-item.danger:hover {
        background: var(--color-danger-bg);
        color: var(--color-danger-hover);
      }

      .menu-item.danger:focus-visible {
        background: var(--color-danger-bg);
        outline: 2px solid var(--color-danger);
        outline-offset: -2px;
        color: var(--color-danger-hover);
      }

      .menu-item.danger:active {
        background: var(--color-danger-bg-hover);
      }

      .menu-item.danger svg {
        opacity: 0.9;
      }

      .menu-item.danger:hover svg,
      .menu-item.danger:focus-visible svg {
        opacity: 1;
      }

      /* Menu divider */
      .menu-divider {
        height: 1px;
        background: var(--color-border);
        margin: 6px 8px;
        border-radius: 1px;
      }

      /* Person information section */
      .person-info {
        padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
      }

      /* Name styling - Primary heading */
      .name {
        font-size: 20px;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 6px 0;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        letter-spacing: -0.01em;
      }

      /* Role styling - Secondary heading */
      .role {
        font-size: 15px;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-md) 0;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        letter-spacing: 0.01em;
      }

      /* Status indicator styling - Badge */
      .status {
        display: inline-flex;
        align-items: center;
        font-size: 11px;
        font-weight: 600;
        padding: 3px var(--spacing-sm);
        border-radius: 12px;
        margin-bottom: var(--spacing-md);
        width: fit-content;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .status.active {
        background: var(--color-status-active-bg);
        color: var(--color-status-active-text);
      }

      .status.inactive {
        background: var(--color-status-inactive-bg);
        color: var(--color-status-inactive-text);
      }

      .status.away {
        background: var(--color-status-away-bg);
        color: var(--color-status-away-text);
      }

      .status-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 5px;
        flex-shrink: 0;
      }

      .status.active .status-dot {
        background: var(--color-status-active);
      }

      .status.inactive .status-dot {
        background: var(--color-status-inactive);
      }

      .status.away .status-dot {
        background: var(--color-status-away);
      }

      /* Contact details styling */
      .contact-details {
        font-style: normal;
        margin: 0;
        flex: 1;
        min-height: 0;
      }

      .details-list {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .details-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 4px 0;
        display: none;
      }

      .details-value {
        font-size: 14px;
        font-weight: 400;
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-sm) 0;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.4;
      }

      .details-value svg {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        flex-shrink: 0;
        opacity: 0.7;
      }

      /* Card footer section */
      .card-footer {
        padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
        flex-shrink: 0;
      }

      /* View profile button styling */
      .view-profile-button {
        width: 100%;
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 12px var(--spacing-lg);
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        margin-top: var(--spacing-sm);
        transition: all 0.2s ease;
        font-family: inherit;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        position: relative;
        overflow: hidden;
        letter-spacing: 0.01em;
      }

      .view-profile-button:hover {
        background: var(--color-primary-hover);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        transform: translateY(-1px);
      }

      .view-profile-button:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
        background: var(--color-primary-hover);
        color: white;
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      }

      .view-profile-button:active {
        transform: translateY(0);
        box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
      }

      .view-profile-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }

      .view-profile-button:hover::before {
        left: 100%;
      }

      /* Accessibility improvements */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .menu-item:focus-visible,
        .view-profile-button:focus-visible {
          outline: 3px solid;
          outline-offset: 1px;
        }
        
        .menu-item.danger:focus-visible {
          outline: 3px solid;
          outline-offset: 1px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        :host,
        .menu-button,
        .menu-item,
        .view-profile-button,
        .menu-item svg,
        .dropdown-menu {
          transition: none;
        }
        
        :host(:hover) {
          transform: none;
        }
        
        .view-profile-button:active {
          transform: none;
        }
      }

      /* Responsive design considerations */
      @media (max-width: 480px) {
        :host {
          width: 100%;
          max-width: 320px;
          height: auto;
          min-height: 320px;
        }
        
        .person-card {
          height: auto;
          min-height: 320px;
        }
      }

      /* Print styles */
      @media print {
        :host {
          box-shadow: none;
          border: 1px solid #000;
          break-inside: avoid;
        }
        
        .menu-button,
        .dropdown-menu,
        .view-profile-button {
          display: none;
        }
      }
    </style>
    
    <article class="person-card">
      <header class="card-header">
        <button 
          class="menu-button" 
          aria-label="Open menu for person actions" 
          aria-haspopup="true" 
          aria-expanded="false"
          aria-controls="person-menu"
          aria-describedby="menu-description"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <circle cx="8" cy="4" r="1.5"/>
            <circle cx="8" cy="8" r="1.5"/>
            <circle cx="8" cy="12" r="1.5"/>
          </svg>
          <span class="sr-only">More actions</span>
        </button>
        
        <div 
          class="dropdown-menu" 
          role="menu" 
          aria-labelledby="menu-button"
          aria-orientation="vertical"
          aria-describedby="menu-description"
        >
          <div class="menu-description sr-only">
            Menu with actions for this person. Use arrow keys to navigate, Enter to select, and Escape to close.
          </div>
          <button 
            class="menu-item" 
            role="menuitem" 
            data-action="edit-profile"
            aria-label="Edit profile for this person"
            tabindex="-1"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"/>
            </svg>
            Edit Profile
          </button>
          
          <button 
            class="menu-item" 
            role="menuitem" 
            data-action="send-message"
            aria-label="Send message to this person"
            tabindex="-1"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 12.216.784 13 1.75 13h12.5A1.75 1.75 0 0016 11.25v-7.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"/>
            </svg>
            Send Message
          </button>
          
          <button 
            class="menu-item" 
            role="menuitem" 
            data-action="share-contact"
            aria-label="Share contact information for this person"
            tabindex="-1"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 0016 8c0-.79-.152-1.547-.425-2.234l-.416.416a2.5 2.5 0 11-.707-.707l.416-.416A3 3 0 0012 5c-.79 0-1.547.152-2.234.425l-.416-.416a2.5 2.5 0 11-.707.707l.416.416z"/>
            </svg>
            Share Contact
          </button>
          
          <div class="menu-divider" role="separator" aria-hidden="true"></div>
          
          <button 
            class="menu-item danger" 
            role="menuitem" 
            data-action="archive"
            aria-label="Archive this person's profile"
            tabindex="-1"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M0 2a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1v7.5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 011 12.5V5a1 1 0 01-1-1V2zm2 3v7.5A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z"/>
            </svg>
            Archive
          </button>
          
          <button 
            class="menu-item danger" 
            role="menuitem" 
            data-action="delete"
            aria-label="Delete this person's profile permanently"
            tabindex="-1"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
            Delete
          </button>
        </div>
      </header>
      
      <section class="person-info" role="region" aria-labelledby="person-name">
        <h3 class="name" role="heading" aria-level="3"></h3>
        <p class="role" role="text"></p>
        <span class="status" role="status" aria-live="polite"></span>
        
        <address class="contact-details">
          <dl class="details-list">
            <dt class="details-label">Email</dt>
            <dd class="details-value person-email">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 12.216.784 13 1.75 13h12.5A1.75 1.75 0 0016 11.25v-7.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"/>
              </svg>
              <span class="email-text"></span>
            </dd>
            
            <dt class="details-label">Joined</dt>
            <dd class="details-value person-date">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              <span class="date-text"></span>
            </dd>
            
            <dt class="details-label">Location</dt>
            <dd class="details-value person-location">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10zm0-7a3 3 0 100-6 3 3 0 000 6z"/>
              </svg>
              <span class="location-text"></span>
            </dd>
          </dl>
        </address>
      </section>
      
      <footer class="card-footer">
        <button 
          class="view-profile-button" 
          aria-label="View full profile for this person"
          aria-describedby="person-name person-role"
        >
          View Profile
        </button>
      </footer>
    </article>
  `;

  static get observedAttributes() {
    return ["name", "role", "status", "email", "date-joined", "location"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = PersonCard.template;
  }

  // Getters and setters for person data properties
  get name(): string {
    return this.getAttribute("name") || "";
  }

  set name(value: string) {
    this.setAttribute("name", value);
  }

  get role(): string {
    return this.getAttribute("role") || "";
  }

  set role(value: string) {
    this.setAttribute("role", value);
  }

  get status(): string {
    return this.getAttribute("status") || "active";
  }

  set status(value: string) {
    this.setAttribute("status", value);
  }

  get email(): string {
    return this.getAttribute("email") || "";
  }

  set email(value: string) {
    this.setAttribute("email", value);
  }

  get dateJoined(): string {
    return this.getAttribute("date-joined") || "";
  }

  set dateJoined(value: string) {
    this.setAttribute("date-joined", value);
  }

  get location(): string {
    return this.getAttribute("location") || "";
  }

  set location(value: string) {
    this.setAttribute("location", value);
  }

  connectedCallback() {
    // Set up event handling for the View Profile button
    const viewProfileBtn = this.shadowRoot?.querySelector(
      ".view-profile-button"
    );
    if (viewProfileBtn) {
      viewProfileBtn.addEventListener("click", this.#handleViewProfile);
    }

    // Set up event handling for the menu button
    const menuButton = this.shadowRoot?.querySelector(".menu-button");
    if (menuButton) {
      menuButton.addEventListener("click", this.#handleMenuClick);
    }

    // Set up event handling for menu items
    this.#addMenuItemsEventListeners();

    // Initial content update
    this.#updateContent();

    // Dispatch custom event for component initialization
    const customEvent = new CustomEvent("person-card:initialized", {
      bubbles: true,
      composed: true,
      detail: {
        personData: {
          name: this.name,
          role: this.role,
          status: this.status,
          email: this.email,
          dateJoined: this.dateJoined,
          location: this.location,
        },
      },
    });

    this.dispatchEvent(customEvent);
  }

  disconnectedCallback() {
    // Clean up event listeners
    const viewProfileBtn = this.shadowRoot?.querySelector(
      ".view-profile-button"
    );
    if (viewProfileBtn) {
      viewProfileBtn.removeEventListener("click", this.#handleViewProfile);
    }

    const menuButton = this.shadowRoot?.querySelector(".menu-button");
    if (menuButton) {
      menuButton.removeEventListener("click", this.#handleMenuClick);
    }

    // Clean up menu item event listeners
    this.#removeMenuItemsEventListeners();

    // Clean up click outside listener
    this.#removeClickOutsideListener();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    // Only update if the value actually changed
    if (oldValue !== newValue) {
      this.#updateSpecificContent(name, newValue);
    }
  }

  #updateSpecificContent(attributeName: string, newValue: string | null): void {
    const value = newValue || "";

    switch (attributeName) {
      case "name":
        const nameElement = this.shadowRoot?.querySelector(".name");
        if (nameElement) {
          nameElement.textContent = sanitizeText(value) || "Unknown Person";
        }
        break;

      case "role":
        const roleElement = this.shadowRoot?.querySelector(".role");
        if (roleElement) {
          roleElement.textContent = sanitizeText(value) || "No role specified";
        }
        break;

      case "status":
        const statusElement = this.shadowRoot?.querySelector(".status");
        if (statusElement) {
          const statusText = sanitizeText(value) || "active";
          const statusClass = statusText.toLowerCase();

          // Clear existing content and classes
          statusElement.innerHTML = "";
          statusElement.className = `status ${statusClass}`;

          // Add status dot and text
          const statusDot = document.createElement("span");
          statusDot.className = "status-dot";
          statusElement.appendChild(statusDot);

          const statusTextSpan = document.createElement("span");
          statusTextSpan.textContent =
            statusText.charAt(0).toUpperCase() + statusText.slice(1);
          statusElement.appendChild(statusTextSpan);
        }
        break;

      case "email":
        const emailText = this.shadowRoot?.querySelector(".email-text");
        if (emailText) {
          emailText.textContent = sanitizeEmail(value) || "No email provided";
        }
        break;

      case "date-joined":
        const dateText = this.shadowRoot?.querySelector(".date-text");
        if (dateText) {
          const sanitizedDate = sanitizeDate(value);
          dateText.textContent = sanitizedDate
            ? formatDate(sanitizedDate)
            : "Date not available";
        }
        break;

      case "location":
        const locationText = this.shadowRoot?.querySelector(".location-text");
        if (locationText) {
          locationText.textContent =
            sanitizeText(value) || "Location not specified";
        }
        break;
    }
  }

  // Event handlers as arrow functions (no binding needed)
  #handleViewProfile = (event: Event) => {
    event.preventDefault();

    // Dispatch custom event with person data
    const customEvent = new CustomEvent("person-card:profile-viewed", {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name,
        role: this.role,
        status: this.status,
        email: this.email,
        dateJoined: this.dateJoined,
        location: this.location,
      },
    });

    this.dispatchEvent(customEvent);
  };

  #handleMenuClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    // Toggle menu state
    this.#toggleMenu();
  };

  #handleMenuItemClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const menuItem = target.closest(".menu-item") as HTMLElement;

    if (menuItem) {
      this.#handleMenuItemAction(menuItem);
    }
  };

  #handleMenuItemAction = (menuItem: HTMLElement) => {
    const action = menuItem.getAttribute("data-action");

    if (action) {
      // Close the menu first
      this.#closeMenu();

      // Dispatch custom event with action
      const customEvent = new CustomEvent("person-card:menu-item-clicked", {
        bubbles: true,
        composed: true,
        detail: {
          action: action,
          personData: {
            name: this.name,
            role: this.role,
            status: this.status,
            email: this.email,
            dateJoined: this.dateJoined,
            location: this.location,
          },
        },
      });

      this.dispatchEvent(customEvent);
    }
  };

  #handleMenuItemKeydown = (event: KeyboardEvent) => {
    const currentItem = event.target as HTMLElement;
    const menuItems = Array.from(
      this.shadowRoot?.querySelectorAll(".menu-item") || []
    ) as HTMLElement[];
    const currentIndex = menuItems.indexOf(currentItem);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex].focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        const prevIndex =
          currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
        menuItems[prevIndex].focus();
        break;
      case "Home":
        event.preventDefault();
        menuItems[0].focus();
        break;
      case "End":
        event.preventDefault();
        menuItems[menuItems.length - 1].focus();
        break;
      case "Escape":
        event.preventDefault();
        this.#closeMenu();
        break;
      case "Tab":
        // Allow Tab to work normally, but close menu if Tab moves focus outside
        setTimeout(() => {
          const activeElement = this.shadowRoot?.activeElement;
          if (!activeElement || !this.shadowRoot?.contains(activeElement)) {
            this.#closeMenu();
          }
        }, 0);
        break;
    }
  };

  // Menu state management methods
  #isMenuOpen(): boolean {
    return this.getAttribute("aria-expanded") === "true";
  }

  #openMenu(): void {
    const menuButton = this.shadowRoot?.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = this.shadowRoot?.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    if (menuButton && dropdownMenu) {
      this.setAttribute("aria-expanded", "true");
      dropdownMenu.classList.add("open");

      // Make menu items focusable in tab order
      this.#updateMenuItemsTabindex("0");

      // Focus the first menu item for keyboard navigation
      const firstMenuItem = dropdownMenu.querySelector(
        ".menu-item"
      ) as HTMLButtonElement;
      if (firstMenuItem) {
        // Use setTimeout to ensure the menu is fully rendered before focusing
        setTimeout(() => {
          firstMenuItem.focus();
        }, 0);
      } else {
        // If no menu items are available, keep focus on the menu button
        menuButton.focus();
      }

      // Add click outside detection
      this.#addClickOutsideListener();
    }
  }

  #closeMenu(): void {
    const menuButton = this.shadowRoot?.querySelector(
      ".menu-button"
    ) as HTMLButtonElement;
    const dropdownMenu = this.shadowRoot?.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;

    if (menuButton && dropdownMenu) {
      this.setAttribute("aria-expanded", "false");
      dropdownMenu.classList.remove("open");

      // Remove menu items from tab order
      this.#updateMenuItemsTabindex("-1");

      // Return focus to the menu button
      menuButton.focus();

      // Remove click outside detection
      this.#removeClickOutsideListener();
    }
  }

  #toggleMenu(): void {
    if (this.#isMenuOpen()) {
      this.#closeMenu();
    } else {
      this.#openMenu();
    }

    // Dispatch custom event for menu toggle
    const customEvent = new CustomEvent("person-card:menu-toggled", {
      bubbles: true,
      composed: true,
      detail: {
        isOpen: this.#isMenuOpen(),
        personData: {
          name: this.name,
          role: this.role,
          status: this.status,
          email: this.email,
          dateJoined: this.dateJoined,
          location: this.location,
        },
      },
    });

    this.dispatchEvent(customEvent);
  }

  #addClickOutsideListener(): void {
    // Use setTimeout to avoid immediate closure when opening menu
    setTimeout(() => {
      document.addEventListener("click", this.#handleClickOutside);
    }, 0);
  }

  #removeClickOutsideListener(): void {
    document.removeEventListener("click", this.#handleClickOutside);
  }

  #handleClickOutside = (event: Event) => {
    const target = event.target as Node;

    // Check if click is outside the component
    if (!this.contains(target)) {
      this.#closeMenu();
      return;
    }

    // Check if click is inside the card but not on menu button or menu items
    const menuButton = this.shadowRoot?.querySelector(".menu-button");
    const dropdownMenu = this.shadowRoot?.querySelector(".dropdown-menu");

    if (menuButton && dropdownMenu) {
      const isMenuButton = menuButton.contains(target);
      const isMenuItem = dropdownMenu.contains(target);

      // Close menu if clicking inside card but not on menu button or menu items
      if (!isMenuButton && !isMenuItem) {
        this.#closeMenu();
      }
    }
  };

  #removeMenuItemsEventListeners(): void {
    // Remove existing event listeners from all menu items
    const existingMenuItems = this.shadowRoot?.querySelectorAll(".menu-item");
    if (existingMenuItems) {
      existingMenuItems.forEach((item) => {
        item.removeEventListener("click", this.#handleMenuItemClick);
        item.removeEventListener(
          "keydown",
          this.#handleMenuItemKeydown as EventListener
        );
      });
    }
  }

  #addMenuItemsEventListeners(): void {
    // Add event listeners to current menu items
    const menuItems = this.shadowRoot?.querySelectorAll(".menu-item");
    if (menuItems) {
      menuItems.forEach((item) => {
        item.addEventListener("click", this.#handleMenuItemClick);
        item.addEventListener(
          "keydown",
          this.#handleMenuItemKeydown as EventListener
        );
      });
    }
  }

  #updateMenuItemsTabindex(tabindex: string): void {
    // Update tabindex for all menu items
    const menuItems = this.shadowRoot?.querySelectorAll(".menu-item");
    if (menuItems) {
      menuItems.forEach((item) => {
        (item as HTMLElement).setAttribute("tabindex", tabindex);
      });
    }
  }

  #updateContent(): void {
    // Update person name
    const nameElement = this.shadowRoot?.querySelector(".name");
    if (nameElement) {
      nameElement.textContent = sanitizeText(this.name) || "Unknown Person";
    }

    // Update person role
    const roleElement = this.shadowRoot?.querySelector(".role");
    if (roleElement) {
      roleElement.textContent = sanitizeText(this.role) || "No role specified";
    }

    // Update status with proper styling
    const statusElement = this.shadowRoot?.querySelector(".status");
    if (statusElement) {
      const statusText = sanitizeText(this.status) || "active";
      const statusClass = statusText.toLowerCase();

      // Clear existing content and classes
      statusElement.innerHTML = "";
      statusElement.className = `status ${statusClass}`;

      // Add status dot and text
      const statusDot = document.createElement("span");
      statusDot.className = "status-dot";
      statusElement.appendChild(statusDot);

      const statusTextSpan = document.createElement("span");
      statusTextSpan.textContent =
        statusText.charAt(0).toUpperCase() + statusText.slice(1);
      statusElement.appendChild(statusTextSpan);
    }

    // Update contact details
    const emailText = this.shadowRoot?.querySelector(".email-text");
    if (emailText) {
      emailText.textContent = sanitizeEmail(this.email) || "No email provided";
    }

    const dateText = this.shadowRoot?.querySelector(".date-text");
    if (dateText) {
      const sanitizedDate = sanitizeDate(this.dateJoined);
      dateText.textContent = sanitizedDate
        ? formatDate(sanitizedDate)
        : "Date not available";
    }

    const locationText = this.shadowRoot?.querySelector(".location-text");
    if (locationText) {
      locationText.textContent =
        sanitizeText(this.location) || "Location not specified";
    }
  }
}

customElements.define("person-card", PersonCard);
