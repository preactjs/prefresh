import { render, h } from 'preact'

const app = document.getElementById('app')
try {
  render(h('p', 'hi'), app)
} catch (e) {
  app.innerText = e.message;
}
