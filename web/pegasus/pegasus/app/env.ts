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
    mainApi: 'http://78.47.222.237:8480/esb/api/fsp', 
    securityApi: 'http://148.251.238.201:8080/security/vibweb', 
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: true,
    bypass: false,
    angularProd: false
};

export const STAGING: Environment = {
    mainApi: 'http://10.50.143.35/esb/api/fsp',
    securityApi: 'http://10.50.143.35/security/vibweb',
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: false,
    bypass: false,
    angularProd: false
};

export const UAT: Environment = {
    mainApi: 'http://UAT-AG-HAIN01/esb/api/fsp',
    securityApi: 'http://UAT-AG-HAIN01/security/vibweb',
    language: LANGUAGE.ENGLISH,
    timeout: HTTP_TIMEOUT,
    debug: false,
    bypass: false,
    angularProd: false
};

export const PROD: Environment = {
    mainApi: 'http://10.60.33.8/esb/api/fsp',
    securityApi: 'http://10.60.33.8/security/vibweb',
    language: LANGUAGE.VIETNAMESSE,
    timeout: HTTP_TIMEOUT,
    debug: false,
    bypass: false,
    angularProd: false
};

export const ENV: Environment = DEV;