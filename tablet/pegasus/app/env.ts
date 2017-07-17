const HTTP_TIMEOUT: number = 60000;

export const LANGUAGE = {
    ENGLISH: "en",
    VIETNAMESSE: "vi"
};

export interface Environment {
    securityApi: string;
    mainApi: string;
    fingerprint?: string;
    analytics?: string;
    language: string;
    timeout: number;
    debug: boolean;
    bypass: boolean;
    angularProd: boolean;
}

export const LOCAL: Environment = {
    mainApi: 'https://localhost:8443/mock/api',
    securityApi: 'https://localhost:8443/mock/api',
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: true,
    bypass: true,
    angularProd: false
};

export const TEST: Environment = {
    mainApi: 'https://192.168.43.182:8443/mock/api',
    securityApi: 'https://192.168.43.182:8443/mock/api',
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: true,
    bypass: false,
    angularProd: false
};

export const DEV: Environment = {
    mainApi: 'http://192.168.5.156/esb/api/fsp',
    securityApi: 'http://192.168.5.156/security/vibmobile',
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: true,
    bypass: false,
    angularProd: false
};

export const STAGING: Environment = {
    mainApi: 'https://10.50.175.13/esb/api/fsp',
    securityApi: 'https://10.50.175.13/security/vibmobile',
    fingerprint: '1C C6 57 AC 6C 2A 4D ED EA C4 BE 78 61 E1 9E 64 D3 BE 3C 47',
    analytics: 'UA-23573610-11',
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: false,
    bypass: false,
    angularProd: false
};

export const PROD: Environment = {
    mainApi: 'https://bpmapi.vib.com.vn/esb/api/fsp',
    securityApi: 'https://bpmapi.vib.com.vn/security/vibmobile',
    fingerprint: '1C C6 57 AC 6C 2A 4D ED EA C4 BE 78 61 E1 9E 64 D3 BE 3C 47',
    analytics: 'UA-23573610-11',
    language: LANGUAGE.VIETNAMESSE,
    timeout: HTTP_TIMEOUT,
    debug: false,
    bypass: false,
    angularProd: false
};

export const ENV: Environment = LOCAL;