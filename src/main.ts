import { App } from './App';
// import './style.css';

window.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.createElement('div');
    appContainer.id = 'app-root';
    document.body.appendChild(appContainer);

    try {
        new App('app-root');
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
});
