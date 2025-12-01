const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
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
    <div class="header"><slot name="header"></slot></div>
    <div class="body"><slot></slot></div>
  </div>
`;

class MyCard extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(cardTemplate.content.cloneNode(true));
  }
}

if (!customElements.get('my-card')) {
  customElements.define('my-card', MyCard);
}

export default MyCard;
