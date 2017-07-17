export interface LendingRate {
    productName: string;
    lendingPackage: string;
    honeymoonRate: number;
    afterHoneymoonRate: number;
    honeymoonPeriod: number;
    year1Rate: number;
    year2Rate: number;
    year3Rate: number;
    afterYear4Rate: number;
    minLoanTerm: number;
    maxLoanTerm: number;
    minLoanAmount: number;
    maxLoanAmount: number;
}

export interface SavingRate {
    salesGroup: string;
    currency: string;
    interestReceived: string;
    threshold: string;
    depositTerm: number;
    depositTermDuration: string;
    interest: number;
}