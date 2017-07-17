import {Directive, HostListener, OnInit} from "@angular/core";
import {NgControl} from "@angular/forms";
@Directive({
    selector: '[inputnumber]'
})

export class InputNumberDirective {

    constructor(private ngControl: NgControl) {
      
    }


 @HostListener("focus", ["$event.target.value"])
    onFocus(value) {
        if (!this.ngControl) {
            return;
        }
        if(value==0|| value=='0'){
        	console.log('00')
         this.ngControl.valueAccessor.writeValue(null);
        }else{
         this.ngControl.valueAccessor.writeValue(Number(value));

        }
    }
}