import {Component, OnInit} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {PersonalPage} from "./personal/personal";
import {portfolioPage} from "./portfolio/portfolio";
import {DueDiligencePage} from "./due-diligence/due-diligence";
import {BackgroundPage} from "./background/background";
import {FinancialPage} from "./financial/financial";
import {GoalsPage} from "./goals/goals";
import {LogProvider} from "../../../providers/log";

@Component({
    templateUrl: 'build/pages/lead/manager/tabs.html',
    pipes: [TranslatePipe]
})
export class TabsPage implements OnInit {
    private selectedIndex: number;
    private tab1Root: any;
    private tab2Root: any;
    private tab3Root: any;
    private tab4Root: any;
    private tab5Root: any;
    private tab6Root: any;

    constructor(private logProvider: LogProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.tab1Root = PersonalPage;
        this.tab2Root = portfolioPage;
        this.tab3Root = DueDiligencePage;
        this.tab4Root = BackgroundPage;
        this.tab5Root = GoalsPage;
        this.tab6Root = FinancialPage;
        this.selectedIndex = 0;
    }
}
