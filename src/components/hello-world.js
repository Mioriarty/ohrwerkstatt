class HelloWorld extends HTMLElement {
  // Observe `text` attribute; when it changes we re-render
  static get observedAttributes() {
    return ['text'];
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
    const textAttr = this.getAttribute('text');

    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        .wrap{
          padding:12px 16px;
          border-radius:8px;
          background:var(--accent,#eef);
          color:var(--text,#111);
          font-weight:600;
        }
      </style>
      <div class="wrap">${textAttr ? String(textAttr) : 'khdbkfdah<slot>Hallo Welt!</slot>'}</div>
    `;
  }
}

if (!customElements.get('hello-world')) {
  customElements.define('hello-world', HelloWorld);
}

export default HelloWorld;
