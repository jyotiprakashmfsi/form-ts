import { BaseComponent } from './BaseComponent';

export interface FormData {
    id?: number;
    name: string;
    email: string;
    phone: string;
}

interface FormState {
    formData: FormData;
    isEditing: boolean;
    editingId: number | null;
}

export class Form extends BaseComponent<FormState> {
    private onSubmit: (data: FormData, editingId: number | null) => void;

    constructor(containerId: string, onSubmit: (data: FormData, editingId: number | null) => void) {
        super(containerId);
        this.onSubmit = onSubmit;
        this.state = {
            formData: {
                name: '',
                email: '',
                phone: ''
            },
            isEditing: false,
            editingId: null
        };
        console.log(`[Form] Initialstate:`, this.state);
        this.mount();
    }

    public setEditData(data: FormData, id: number) {
        console.log(`[setting data:`, { data, id });
        this.setState({
            formData: { ...data },
            isEditing: true,
            editingId: id
        });
    }

    public clearForm() {
        this.setState({
            formData: {
                name: '',
                email: '',
                phone: ''
            },
            isEditing: false,
            editingId: null
        });
    }

    private handleSubmit = (e: Event) => {
        e.preventDefault();
        console.log(`[Form] Handling form submit:`, this.state.formData);
        this.onSubmit(this.state.formData, this.state.editingId);
        this.clearForm(); 
    };

    private handleInputChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        console.log(`[Form] Input change:`, { field: target.name, value: target.value });
        this.setState({
            formData: {
                ...this.state.formData,
                [target.name]: target.value
            }
        });
    };

    protected render(): void {
        this.cleanupEventListeners();

        this.element.innerHTML = `
            <form class="form">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value="${this.state.formData.name}"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value="${this.state.formData.email}"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value="${this.state.formData.phone}"
                        required
                    />
                </div>
                <button type="submit">
                    ${this.state.isEditing ? 'Update' : 'Submit'}
                </button>
            </form>
        `;

        const form = this.element.querySelector('form');
        const inputs = this.element.querySelectorAll('input');

        if (form) {
            this.addEventListenerWithCleanup(form, 'submit', this.handleSubmit);
        }

        inputs.forEach(input => {
            this.addEventListenerWithCleanup(input, 'input', this.handleInputChange);
        });
    }
}
