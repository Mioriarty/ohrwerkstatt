import { LitElement, html, css } from 'https://esm.sh/lit';

export class ListenButton extends LitElement {
  static properties = {
    label: { type: String },
    variant: { type: String },
    size: { type: String },
    sounds: { type: String }, // comma-separated or JSON string
  };

  constructor() {
    super();
    this.label = 'Listen';
    this.variant = '';
    this.size = '';
    this.sounds = ''; // user can set: <listen-button sounds="tone1.wav,tone2.wav">
    this._audios = [];
  }

  updated(changed) {
    if (changed.has('sounds')) {
      this._loadSounds();
    }
  }

  _loadSounds() {
    let list = [];
    try {
      // allow JSON array or comma-separated string
      list = JSON.parse(this.sounds);
      if (!Array.isArray(list)) list = [this.sounds];
    } catch {
      list = this.sounds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    this._audios = list.map((src) => {
      const url = new URL(src, import.meta.url).href;
      const a = new Audio(url);
      a.preload = 'auto';
      return a;
    });
  }

  _playAll() {
    // restart & play every audio at same time
    this._audios.forEach((a) => {
      a.currentTime = 0;
      a.play().catch(() => {});
    });
  }

  _onClick() {
    this._playAll();

    // re-dispatch click
    this.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    styled-button::part(button) {
      background: var(--bg-muted);
      color: var(--text);
      border: 2px solid var(--border);
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0.5rem;
      border-radius: 12px;
    }

    styled-button::part(button):hover {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    styled-button[disabled]::part(button) {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <styled-button @click=${this._onClick} variant=${this.variant} size=${this.size}>
        <i class="fas fa-play"></i>
        ${this.label}
      </styled-button>
    `;
  }
}

customElements.define('listen-button', ListenButton);
