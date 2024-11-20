import { LitElement, html } from 'lit';
import './game-component';

export class MyElement extends LitElement {
  render() {
    return html`
      <game-component></game-component>
    `;
  }
}

customElements.define('my-element', MyElement);
