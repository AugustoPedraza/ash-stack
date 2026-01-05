import '../css/app.css';
import ComponentPlayground from './components/dev/ComponentPlayground.svelte';
import { mount } from 'svelte';

mount(ComponentPlayground, {
  target: document.getElementById('app')
});
