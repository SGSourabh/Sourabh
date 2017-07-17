import {Pipe, PipeTransform} from "@angular/core";

const PADDING = "000000";

@Pipe({name: "currency"})
export class CurrencyPipe implements PipeTransform {

    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor() {
        this.DECIMAL_SEPARATOR = ".";
        this.THOUSANDS_SEPARATOR = ",";
    }

    transform(value: number | string, fractionSize: number = 2): string {
        let [integer, fraction = ""] = (value || "0").toString().split(this.DECIMAL_SEPARATOR);
        fraction = fractionSize > 0 ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize) : "";
        return Number(integer + fraction) ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR) + fraction : "0" + this.DECIMAL_SEPARATOR + "00";
    }

    parse(value: string, fractionSize: number = 2): string {
        let [integer, fraction = ""] = (value || "0").split(this.DECIMAL_SEPARATOR);
        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");
        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0 ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize) : "";
        return integer + fraction;
    }

}
