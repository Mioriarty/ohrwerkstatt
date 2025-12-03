import './styled-button.js';

class ListenButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hostClick = this._hostClick.bind(this);

    // static wav files to play on click (place these files relative to this module)
    this._soundFiles = [
      new URL('./sounds/tone1.wav', import.meta.url).href,
      new URL('./sounds/tone2.wav', import.meta.url).href,
    ];
    this._audios = this._soundFiles.map((src) => {
      const a = new Audio(src);
      a.preload = 'auto';
      return a;
    });
  }

  connectedCallback() {
    this.render();
    const inner = this.shadowRoot.querySelector('styled-button');
    if (inner) inner.addEventListener('click', this._hostClick);
  }

  disconnectedCallback() {
    const inner = this.shadowRoot.querySelector('styled-button');
    if (inner) inner.removeEventListener('click', this._hostClick);
  }

  _playSequentially() {
    // play configured audios in sequence
    return this._audios.reduce((p, audio) => {
      return p.then(() => {
        audio.currentTime = 0;
        // play returns a promise; ensure we wait until it ends
        const playPromise = audio.play().catch(() => Promise.resolve());
        return playPromise.then(
          () =>
            new Promise((resolve) => {
              // if the audio already ended or couldn't play, resolve immediately when ended fires
              const onEnded = () => {
                audio.removeEventListener('ended', onEnded);
                resolve();
              };
              audio.addEventListener('ended', onEnded);
            })
        );
      });
    }, Promise.resolve());
  }

  _hostClick(e) {
    // run play sequence but don't block UI
    this._playSequentially().catch(() => {});
    // re-dispatch click from this component so external listeners still work
    this.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  }

  render() {
    const label = this.getAttribute('label') || 'Listen';
    const variant = this.getAttribute('variant') || '';
    const size = this.getAttribute('size') || '';

    this.shadowRoot.innerHTML = `
            <style>
                :host { display: inline-block; }

                /* Target the inner button via part exposed by styled-button */
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

                /* small visual tweak when disabled */
                styled-button[disabled]::part(button) {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            </style>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />

            <styled-button ${variant ? `variant="${variant}"` : ''} ${size ? `size="${size}"` : ''}>
                <i class="fas fa-play"></i>
                ${label}
            </styled-button>
        `;
  }
}

if (!customElements.get('listen-button')) {
  customElements.define('listen-button', ListenButton);
}

export default ListenButton;
