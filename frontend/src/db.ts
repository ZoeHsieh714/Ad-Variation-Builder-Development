import Dexie, { Table } from 'dexie';

export interface GenerationHistory {
    id?: number;
    timestamp: Date;
    sampleAdName: string;
    source: 'prompt' | 'image';
    promptsText?: string;
    productImageCount?: number;
    generatedImages: string[];
}

export class AdVariationDB extends Dexie {
    history!: Table<GenerationHistory>;

    constructor() {
        super('AdVariationDB');
        this.version(1).stores({
            history: '++id, timestamp, source, sampleAdName'
        });
    }
}

export const db = new AdVariationDB();
