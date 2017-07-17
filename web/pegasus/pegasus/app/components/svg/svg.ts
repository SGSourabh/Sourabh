import {Directive, Input, OnInit, ElementRef} from "@angular/core";
import {Http} from "@angular/http";


@Directive({
    selector: 'inline-svg'
})
export class SvgDirective implements OnInit {
    @Input() src: string;

    constructor(private http: Http, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.http.get(this.src)
            .map(res => res.text())
            .subscribe(data => this.elementRef.nativeElement.innerHTML = data);
    }
}
