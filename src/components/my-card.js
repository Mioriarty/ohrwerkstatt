class MyCard extends HTMLElement {
  // Observe `header` and `body` attributes; slots act as fallbacks
  static get observedAttributes() {
    return ['header', 'body'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const headerAttr = this.getAttribute('header');
    const bodyAttr = this.getAttribute('body');

    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .card{
          background: #fff;
          border-radius:10px;
          padding:14px;
          box-shadow: 0 8px 24px rgba(16,24,40,0.06);
          border:1px solid rgba(16,24,40,0.04);
        }
        .header{font-weight:700;margin-bottom:8px}
        .body{color:var(--muted,#6b7280)}
      </style>
      <div class="card">
        <div class="header">${headerAttr ? String(headerAttr) : '<slot name="header"></slot>'}</div>
        <div class="body">${bodyAttr ? String(bodyAttr) : '<slot></slot>'}</div>
      </div>
    `;
  }
}

if (!customElements.get('my-card')) {
  customElements.define('my-card', MyCard);
}

export default MyCard;
