import {Directive, HostListener, Input, OnInit} from "@angular/core";
import {NgControl} from "@angular/forms";

@Directive({
    selector: '[integer]'
})
export class IntegerDirective implements OnInit {
    @Input() integerMin: number = 0;
    @Input() integerMax: number = 0;

    constructor(private ngControl: NgControl) {
    }

    ngOnInit() {
        if (!this.ngControl) {
            return;
        }
        setTimeout(() => {
            let value = parseInt(this.ngControl.value) ? parseInt(this.ngControl.value) : 0;
            this.ngControl.viewToModelUpdate(value);
            this.ngControl.valueAccessor.writeValue(value);
        }, 100);
    }

    @HostListener("blur", ["$event.target.value"])
    onBlur(value) {
        if (!this.ngControl) {
            return;
        }
        value = parseInt(value) ? parseInt(value) : 0;
        if (this.integerMin && value < this.integerMin) {
            value = this.integerMin;
        }
        if (this.integerMax && value > this.integerMax) {
            value = this.integerMax;
        }
        this.ngControl.viewToModelUpdate(value);
        this.ngControl.valueAccessor.writeValue(value);
    }
}
