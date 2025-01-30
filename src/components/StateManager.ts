import { FormData } from './Form';

interface AppState {
    formRecords: (FormData & { id: number })[];
    currentEditingId: number | null;
    currentFormData: FormData | null;
}

export class StateManager {
    private static instance: StateManager;
    private state: AppState;

    private constructor() {
        this.state = {
            formRecords: [],
            currentEditingId: null,
            currentFormData: null
        };
    }

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    public addFormRecord(data: FormData): number {
        console.log('[StateManager] Adding form record:', data);
        const id = Date.now();
        const newRecord = {
            ...data,
            id
        };
        this.state.formRecords = [...this.state.formRecords, newRecord];
        console.log('[StateManager] Updated after add:', this.state.formRecords);
        return id;
    }

    public updateFormRecord(data: FormData, id: number): void {
        console.log('[StateManager] Updating form record:', { id, data });
        this.state.formRecords = this.state.formRecords.map(record => 
            record.id === id ? { ...data, id } : record
        );
        console.log('[StateManager] records after update:', this.state.formRecords);
    }

    public getFormRecords(): (FormData & { id: number })[] {
        return [...this.state.formRecords];
    }

    public setEditingRecord(id: number): FormData | null {
        console.log('[StateManager] Current records:', this.state.formRecords);
        const record = this.state.formRecords.find(r => r.id === id);
        console.log('[StateManager] Found:', record);
        
        if (record) {
            this.state.currentEditingId = id;
            this.state.currentFormData = { ...record };
            return this.state.currentFormData;
        }
        return null;
    }

    public clearEditingState(): void {
        this.state.currentEditingId = null;
        this.state.currentFormData = null;
    }

    public getCurrentEditingId(): number | null {
        return this.state.currentEditingId;
    }

    public getCurrentFormData(): FormData | null {
        return this.state.currentFormData ? { ...this.state.currentFormData } : null;
    }
}
