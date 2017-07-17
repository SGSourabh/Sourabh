import {Pipe} from "@angular/core";
import * as moment from "moment";

@Pipe({
    name: 'dateMomentFormat'
})
export class DateMomentFormatPipe {
    transform(value: string, format: string = "DD-MM-YYYY"): string {
        if (!value) {
            return value;
        }
        return moment(value).utc().format(format)
    }
}
