import {Component, OnInit} from "@angular/core";
import {AppProvider} from "../../providers/app";
import {LogProvider} from "../../providers/log";
import {UserProvider} from "../../providers/user";
import {PrintComponent} from "../../components/print/print";
import {Observable} from "rxjs/Observable";
import {CordovaProvider} from "../../providers/cordova";
import {Content} from "../../models/content";

@Component({
    templateUrl: 'build/pages/state/state.html',
    directives: [PrintComponent]
})
export class StatePage implements OnInit {
    diff: any;
    contents: Content[];

    constructor(private logProvider: LogProvider,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        Observable.forkJoin(this.userProvider.translation('vi'), this.userProvider.translation('en')).subscribe(
            data => this.diff = this.diffKeys(data[0], data[1]),
            error => this.logProvider.error(error)
        );
        this.cordovaProvider.getStoredText('contents.json').then(text => this.contents = JSON.parse(text) as Content[]);
    }

    private isObject(mixed: any): boolean {
        return mixed && typeof mixed === 'object'
    }

    private isPropUndefined(prop: string, obj: any): boolean {
        return this.isObject(obj) && obj.hasOwnProperty(prop);
    }

    private depthPath(prop, depth) {
        return depth = depth ? `${depth}.${prop}` : prop;
    }

    private diffKeys(now: any, original: any, depth?: number): any {
        // this.logProvider.info(`comparing ${JSON.stringify(now)} to ${JSON.stringify(original)}`);
        if (!this.isObject(original)) {
            throw 'original invalid';
        }
        let diffs = [];
        Object.keys(original).forEach(prop => {
            if (!this.isPropUndefined(prop, now)) {
                // this.logProvider.info(`pushing ${depthPath(prop, depth)}`);
                diffs.push(this.depthPath(prop, depth));
            }
            if (this.isObject(original[prop])) {
                var nowSafe = this.isPropUndefined(prop, now) ? now[prop] : null;
                diffs = Array.prototype.concat.call(diffs, this.diffKeys(nowSafe, original[prop], this.depthPath(prop, depth)));
            }
        });
        return diffs;
    }
}
