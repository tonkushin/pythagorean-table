import {Component, computed, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {form, FormField, FormRoot, max, min,} from '@angular/forms/signals';

export interface RangeModel {
    min: number | null;
    max: number | null;
}

@Component({
    selector: 'pt-root',
    imports: [RouterOutlet, FormsModule, FormField, FormRoot],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    readonly model = signal<RangeModel>({
        min: 1,
        max: 9,
    });

    readonly rangeForm = form(this.model, (path) => {
        min(path.min, 1);
        max(path.min, 1);

        min(path.max, 9);
        max(path.max, 9);
    });

    readonly table = computed(() => {
        const {min, max} = this.model();
        const _min = min ?? 0;
        const _max = max ?? 0;

        const header: (number | null)[] = [null];
        const table: (number | null)[][] = [header];

        for (let col = _min; col <= _max; col++) {
            header.push(col);
        }

        for (let row = _min; row <= _max; row++) {
            const currentRow: (number | null)[] = [row];

            for (let col = _min; col <= _max; col++) {
                currentRow.push(row * col);
            }

            table.push(currentRow);
        }

        return table;
    });
}
