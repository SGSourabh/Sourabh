import {Injectable} from "@angular/core";
import {ENV} from "../env";

@Injectable()
export class LogProvider {

    constructor() {
        this.class(this);
    }

    class(clazz: any) {
        if (ENV.debug) {
            console.debug(clazz.constructor.name);
        }
    }

    info(...objects: any[]) {
        if (ENV.debug) {
            let strings = objects.filter(o => typeof o === 'string');
            if (strings.length > 0) {
                console.info(strings.join(':'));
            }
            objects.filter(o => typeof o !== 'string').forEach(object => console.info(object));
        }
    }

    warn(...objects: any[]) {
        let strings = objects.filter(o => typeof o === 'string');
        if (strings.length > 0) {
            console.warn(strings.join(':'));
        }
        objects.filter(o => typeof o !== 'string').forEach(object => console.warn(object));
    }

    error(...objects: any[]) {
        let strings = objects.filter(o => typeof o === 'string');
        if (strings.length > 0) {
            console.error(strings.join(':'));
        }
        objects.filter(o => typeof o !== 'string').forEach(object => console.error(object));
    }
}
