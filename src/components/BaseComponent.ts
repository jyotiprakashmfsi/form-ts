export abstract class BaseComponent<T = {}> {
    protected element: HTMLElement;
    protected state: T;
    protected containerId: string;
    private eventListeners: Array<{ element: HTMLElement; type: string; listener: EventListener }> = [];

    constructor(containerId: string) {
        console.log(`[BaseComponent] Initializing component with container ID: ${containerId}`);
        this.containerId = containerId;
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id ${containerId} not found`);
        }
        this.element = container;
        this.state = {} as T;
        console.log(`[BaseComponent] Initial state:`, this.state);
    }

    protected abstract render(): void;

    protected setState(newState: Partial<T>) {
        console.log(`[BaseComponent] Updating state:`, newState);
        this.state = { ...this.state, ...newState };
        this.render();
    }

    protected addEventListenerWithCleanup(
        element: HTMLElement,
        type: string,
        listener: EventListener
    ) {
        console.log(`[BaseComponent] Adding event listener: ${type}`);
        element.addEventListener(type, listener);
        this.eventListeners.push({ element, type, listener });
    }

    protected cleanupEventListeners() {
        console.log(`[BaseComponent] Removing all event listeners`);
        this.eventListeners.forEach(({ element, type, listener }) => {
            element.removeEventListener(type, listener);
        });
        this.eventListeners = [];
    }

    protected mount(): void {
        console.log(`[BaseComponent] Mounting component`);
        this.render();
    }

    public destroy() {
        this.cleanupEventListeners();
    }
}
