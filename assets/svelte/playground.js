import '../css/app.css';
import Playground from './components/Playground.svelte';
import { mount } from 'svelte';

mount(Playground, {
  target: document.getElementById('app')
});
