// Restaurant Marketing AI Platform - Main Entry Point
import './styles/index.css';
import { Router } from './router.js';
import { renderNavbar } from './components/navbar.js';

// Initialize the application
class App {
    constructor() {
        this.router = new Router();
        this.init();
    }

    init() {
        // Render the app structure
        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="animated-bg"></div>
      <nav class="navbar" id="navbar"></nav>
      <main id="main-content"></main>
    `;

        // Initialize navbar
        renderNavbar();

        // Handle navbar scroll effect
        this.setupScrollEffect();

        // Initialize router
        this.router.init();
    }

    setupScrollEffect() {
        const navbar = document.getElementById('navbar');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

export default App;
