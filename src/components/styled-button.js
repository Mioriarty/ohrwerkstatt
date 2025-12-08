import { LitElement, html, css } from 'https://esm.sh/lit';

export class StyledButton extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    name: { type: String, reflect: true },
    value: { type: String, reflect: true },
    label: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    fullRow: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.type = 'button';
    this.size = 'small';
    this.disabled = false;
    this.fullRow = false;
  }

  static styles = css`
    :host {
      display: inline-block;
      line-height: 0;
    }
    button {
      border: none;
      border-radius: 12px;
      cursor: pointer;
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
    button:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    button:active {
      transform: translateY(0);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    ::slotted([slot='icon-left']),
    ::slotted([slot='icon-right']) {
      display: inline-flex;
      width: 1em;
      height: 1em;
      align-items: center;
      justify-content: center;
    }
    ::slotted(svg) {
      width: 1em;
      height: 1em;
      fill: currentColor;
    }

    .variant-primary {
      background: linear-gradient(135deg, var(--primary, #0f62fe), var(--primary-hover, #0b4fd6));
    }

    .variant-secondary {
      background: var(--bg-muted);
      color: var(--text);
      border: 2px solid var(--border);
    }

    .variant-secondary:hover:not([disabled]) {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .variant-secondary[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .size-big {
      padding: 1rem 2rem;
      font-size: 1.05rem;
    }
    .size-small {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }
    .full-row {
      width: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.addEventListener('keydown', this._onHostKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onHostKeydown);
  }

  _onHostKeydown(e) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      // trigger the internal button click; this fires the host click normally
      this.shadowRoot.querySelector('button')?.click();
    }
  }

  render() {
    const variantClass = this.variant ? `variant-${this.variant}` : '';
    const sizeClass = this.size ? `size-${this.size}` : 'size-small';
    const fullRowClass = this.fullRow ? 'full-row' : '';

    return html`
      <button
        part="button"
        class="${variantClass} ${sizeClass} ${fullRowClass}"
        .disabled=${this.disabled}
        .type=${this.type}
        .name=${this.name || ''}
        .value=${this.value || ''}
      >
        <slot name="icon-left"></slot>
        ${this.label ? this.label : html`<slot></slot>`}
        <slot name="icon-right"></slot>
      </button>
    `;
  }
}

customElements.define('styled-button', StyledButton);
