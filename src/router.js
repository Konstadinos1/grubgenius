// Client-side Router for SPA Navigation
import { renderLanding } from './pages/landing.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCompetitorAnalysis } from './pages/competitor-analysis.js';
import { renderSeoGenerator } from './pages/seo-generator.js';
import { renderAppBuilder } from './pages/app-builder.js';

export class Router {
    constructor() {
        this.routes = {
            '/': renderLanding,
            '/dashboard': renderDashboard,
            '/competitor-analysis': renderCompetitorAnalysis,
            '/seo-generator': renderSeoGenerator,
            '/app-builder': renderAppBuilder
        };
        this.currentPath = '/';
    }

    init() {
        // Handle initial route
        this.handleRoute();

        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', () => this.handleRoute());

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-link]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigate(path);
            }
        });
    }

    navigate(path) {
        if (path === this.currentPath) return;

        history.pushState(null, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        this.currentPath = path;

        const mainContent = document.getElementById('main-content');
        const renderPage = this.routes[path] || this.routes['/'];

        // Add page transition
        mainContent.classList.add('page-enter');

        // Clear and render new content
        mainContent.innerHTML = '';
        renderPage(mainContent);

        // Trigger animation
        requestAnimationFrame(() => {
            mainContent.classList.remove('page-enter');
            mainContent.classList.add('page-enter-active');

            setTimeout(() => {
                mainContent.classList.remove('page-enter-active');
            }, 300);
        });

        // Update active nav links
        this.updateActiveLinks(path);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveLinks(path) {
        document.querySelectorAll('.navbar-link, .sidebar-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}
