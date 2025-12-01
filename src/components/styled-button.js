class StyledButton extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'type', 'name', 'value', 'label', 'variant'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._btn = null;
    this._onInternalClick = this._onInternalClick.bind(this);
    this._onHostKeydown = this._onHostKeydown.bind(this);
  }

  connectedCallback() {
    this.render();
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.addEventListener('keydown', this._onHostKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._onHostKeydown);
    if (this._btn) this._btn.removeEventListener('click', this._onInternalClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  _onInternalClick(e) {
    const ev = new MouseEvent('click', e);
    this.dispatchEvent(ev);
  }

  _onHostKeydown(e) {
    if (!this._btn || this._btn.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._btn.click();
    }
  }

  render() {
    const disabled = this.hasAttribute('disabled');
    const type = this.getAttribute('type') || 'button';
    const name = this.getAttribute('name');
    const value = this.getAttribute('value');
    const label = this.getAttribute('label');
    const variant = this.getAttribute('variant');
    const size = this.getAttribute('size');

    const nameAttr = name ? ` name="${name}"` : '';
    const valueAttr = value ? ` value="${value}"` : '';
    const disabledAttr = disabled ? ' disabled' : '';
    const variantClass = variant ? ` variant-${variant}` : '';
    const sizeClass = size ? ` size-${size}` : 'size-small';

    this.shadowRoot.innerHTML = `
        <style>
          :host { display: inline-block; line-height: 0; }
          .btn {
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            text-align: center;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            background: var(--btn-bg, #0f62fe);
            color: var(--btn-color, #fff);
            font-family: inherit;
            font-size: 0.95rem;
            line-height: 1;
          }

          .btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
          .btn:active { transform: translateY(0); }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          ::slotted([slot="icon-left"]), ::slotted([slot="icon-right"]) {
            display: inline-flex;
            width: 1em;
            height: 1em;
            align-items: center;
            justify-content: center;
          }

          ::slotted(svg) { width: 1em; height: 1em; fill: currentColor; }
            

          .btn.variant-primary {
              background: linear-gradient(135deg, var(--primary, #0f62fe), var(--primary-hover, #0b4fd6));
          }

          .btn.size-big {
              padding: 1rem 2rem;
              font-size: 1.05rem;
          }

          .btn.size-small {
              padding: 0.5rem 1rem;
           }
        </style>

        <button part="button" class="btn ${variantClass} ${sizeClass}" type="${type}"${nameAttr}${valueAttr}${disabledAttr}>
          <slot name="icon-left"></slot>
          ${label ? String(label) : '<slot></slot>'}
          <slot name="icon-right"></slot>
        </button>
      `;

    if (this._btn) this._btn.removeEventListener('click', this._onInternalClick);
    this._btn = this.shadowRoot.querySelector('button');
    if (this._btn) this._btn.addEventListener('click', this._onInternalClick);
  }
}

if (!customElements.get('styled-button')) {
  customElements.define('styled-button', StyledButton);
}

export default StyledButton;
