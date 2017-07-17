import {Component, Input} from "@angular/core";
import {LogProvider} from "../../providers/log";

@Component({
    selector: 'print',
    templateUrl: 'build/components/print/print.html'
})
export class PrintComponent {
    @Input()
    name: any;

    @Input()
    value: any;

    @Input()
    async: boolean;

    constructor(private logProvider: LogProvider) {
        logProvider.class(this);
    }
}
