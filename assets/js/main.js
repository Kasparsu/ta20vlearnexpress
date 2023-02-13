import App from './App.svelte'
import '../css/style.css';
let application = null;
if(document.getElementById('app')) {
  application = new App({
    target: document.getElementById('app'),
  })
}
const app = application;
export default app

