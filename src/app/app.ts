import {Component, computed} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'pt-root',
    imports: [RouterOutlet, FormsModule],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
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
