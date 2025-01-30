import { BaseComponent } from './BaseComponent';
import { FormData } from './Form';

interface TableState {
    data: (FormData & { id: number })[];
}

export class Table extends BaseComponent<TableState> {
    private onEdit: (data: FormData, id: number) => void;

    constructor(containerId: string, onEdit: (data: FormData, id: number) => void) {
        super(containerId);
        this.onEdit = onEdit;
        this.state = {
            data: []
        };
        console.log(`[Table] Initial table state:`, this.state);
        this.mount();
    }

    public addRow(data: FormData & { id: number }) {
        console.log(`[Table] Adding new row:`, data);
        this.setState({
            data: [...this.state.data, data] 
        });
    }

    public updateRow(updatedData: FormData, id: number) {
        console.log(`[Table] Updating row:`, { id, data: updatedData });
        const updatedRows = this.state.data.map(row => 
            row.id === id ? { ...updatedData, id } : row
        );
        this.setState({
            data: updatedRows
        });
    }

    private handleEdit = (id: number) => {
        console.log(`[Table] Handling edit for row:`, id);
        const rowData = this.state.data.find(row => row.id === id);
        if (rowData) {
            this.onEdit(rowData, id);
        }
    };

    protected render(): void {
        this.cleanupEventListeners();

        if (this.state.data.length === 0) {
            this.element.innerHTML = `
                <div class="table-empty">
                    No records found
                </div>
            `;
            return;
        }

        this.element.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.state.data.map(item => `
                            <tr data-id="${item.id}">
                                <td>${item.name}</td>
                                <td>${item.email}</td>
                                <td>${item.phone}</td>
                                <td>
                                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        const editButtons = this.element.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            this.addEventListenerWithCleanup(
                button as HTMLElement,
                'click',
                (e: Event) => {
                    const target = e.target as HTMLElement;
                    console.log(`[Table] Edit button clicked:`, target);
                    const id = parseInt(target.getAttribute('data-id') || '0');
                    if (id) {
                        const rowData = this.state.data.find(row => row.id === id);
                        if (rowData) {
                            console.log(`[Table] Found row data for edit:`, rowData);
                            this.onEdit(rowData, id);
                        } else {
                            console.error(`[Table] No row data found for id:`, id);
                        }
                    }
                }
            );
        });
    }
}
