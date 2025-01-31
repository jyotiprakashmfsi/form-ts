import { Form, FormData } from './components/Form';
import { Table } from './components/Table';
import { BaseComponent } from './components/BaseComponent';
import { StateManager } from './components/StateManager';

export class App extends BaseComponent {
    private form: Form | null = null;
    private table: Table | null = null;
    private stateManager: StateManager;

    constructor(containerId: string) {
        console.log(`[App] Initializing app with container:`, containerId);
        super(containerId);
        this.stateManager = StateManager.getInstance();
        this.render();
        this.initializeComponents();
    }

    private initializeComponents() {
        console.log(`[App] Initializing components`);
        this.form = new Form('form-container', this.handleFormSubmit.bind(this));
        this.table = new Table('table-container', this.handleEdit.bind(this));
        
        const records = this.stateManager.getFormRecords();
        if (records.length > 0) {
            records.forEach(record => {
                if (this.table) this.table.addRow(record);
            });
        }
    }

    private handleFormSubmit = (data: FormData, editingId: number | null) => {
        console.log(`[App] Form submitted:`, { data, editingId });
        if (!this.table) return;

        if (editingId !== null) {
            this.stateManager.updateFormRecord(data, editingId);
            this.table.updateRow(data, editingId);
        } else {
            const newId = this.stateManager.addFormRecord(data);
            this.table.addRow({ ...data, id: newId });
        }
    };

    private handleEdit = (data: FormData, id: number) => {
        console.log(`[App] Edit requested:`, { data, id });
        if (!this.form) return;
        
        const formData = this.stateManager.setEditingRecord(id);
        if (formData) {
            console.log(`Setting form data for edit:`, { formData, id });
            this.form.setEditData({ ...formData }, id);
        } else {
            console.error(`[App] Failed to set editing for id:`, id);
        }
    };

    protected render(): void {
        console.log(`[App] Rendering app`);
        const container = document.getElementById(this.containerId);
        if (!container) throw new Error('Container element not found');
        
        const formContainer = document.createElement('div');
        formContainer.id = 'form-container';
        container.appendChild(formContainer);
        
        const tableContainer = document.createElement('div');
        tableContainer.id = 'table-container';
        container.appendChild(tableContainer);
    }
}
