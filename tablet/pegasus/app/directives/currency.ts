import {Directive, HostListener, OnInit} from "@angular/core";
import {NgControl} from "@angular/forms";
import {CurrencyPipe} from "../pipes/currency";

@Directive({
    selector: '[currency]'
})
export class CurrencyDirective implements OnInit {
    private currencyPipe: CurrencyPipe;

    constructor(private ngControl: NgControl) {
        this.currencyPipe = new CurrencyPipe();
    }

    ngOnInit() {
        if (!this.ngControl) {
            return;
        }
        setTimeout(() => this.ngControl.valueAccessor.writeValue(this.currencyPipe.transform(this.ngControl.value)), 100);
    }

    @HostListener("focus", ["$event.target.value"])
    onFocus(value) {
        if (!this.ngControl) {
            return;
        }
        this.ngControl.valueAccessor.writeValue(this.currencyPipe.parse(value));
    }

    @HostListener("blur", ["$event.target.value"])
    onBlur(value) {
        if (!this.ngControl) {
            return;
        }
        let transformed = this.currencyPipe.transform(value);
        this.ngControl.valueAccessor.writeValue(transformed);
        this.ngControl.viewToModelUpdate(Number(this.currencyPipe.parse(transformed)));
    }
}
