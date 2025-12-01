const template = document.createElement('template');
template.innerHTML = `
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
  <div class="wrap"><slot>Hallo Welt!</slot></div>
`;

class HelloWorld extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get('hello-world')) {
  customElements.define('hello-world', HelloWorld);
}

export default HelloWorld;
