import {Injectable} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Platform} from "ionic-angular";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {File, Camera, WebIntent, InAppBrowser, Device, FileEntry, Entry, DirectoryEntry} from "ionic-native";
import {CordovaFile, StoredPicture, StoredData} from "../models/cordova";
import {ENV} from "../env";
declare var cordova: any;
declare var window: any;

@Injectable()
export class CordovaProvider {

    constructor(private logProvider: LogProvider,
                private platform: Platform,
                private translateService: TranslateService,
                private appProvider: AppProvider) {
        logProvider.class(this);
    }

    ready(): Promise<void> {
        return this.platform.ready()
            .then(state => {
                if (!this.platform.is('cordova')) {
                    throw Error(this.translateService.instant('message.platformNotSupported'));
                }
            }).catch(error => this.appProvider.promiseReject(error));
    }

    fileReady(): Promise<CordovaFile> {
        return this.ready().then(() => {
            return {
                documents: cordova.file.dataDirectory,
                external: cordova.file.externalDataDirectory,
                media: cordova.file.applicationDirectory + 'www/media/',
                cache: this.platform.is('android') ? cordova.file.externalCacheDirectory : cordova.file.cacheDirectory
            }
        }).catch(error => this.appProvider.promiseReject(error));
    }

    file(): CordovaFile {
        if (!this.platform.is('cordova')) {
            throw Error(this.translateService.instant('message.platformNotSupported'));
        }
        return {
            documents: cordova.file.dataDirectory,
            external: cordova.file.externalDataDirectory,
            media: cordova.file.applicationDirectory + 'www/media/',
            cache: this.platform.is('android') ? cordova.file.externalCacheDirectory : cordova.file.cacheDirectory
        }
    }

    startTrackerWithId() {
        if (this.platform.is('cordova') && ENV.analytics) {
            if (ENV.debug) {
                window.ga.debugMode();
            }
            window.ga.startTrackerWithId(ENV.analytics);
        }
    }

    trackEvent(category: string, action: string, label: string) {
        if (this.platform.is('cordova') && ENV.analytics) {
            window.ga.trackEvent(category, action, label);
        }
    }

    device(): Promise<Device> {
        return this.ready().then(() => Device.device).catch(error => this.appProvider.promiseReject(error));
    }

    checkSecurityApi(): Promise<any> {
        // this.logProvider.info('checkSecurityApi', !ENV.fingerprint);
        if (!ENV.fingerprint) {
            return Promise.resolve();
        }
        return this.ready().then(() =>
            new Promise((resolve, reject) => window.plugins.sslCertificateChecker.check(
                message => resolve(),
                message => reject(this.translateService.instant('message.server_error')),
                ENV.securityApi,
                ENV.fingerprint)
            )
        );
    }

    checkMainApi(bypassPinningCheck?: boolean): Promise<any> {
        // this.logProvider.info('checkMainApi', !bypassPinningCheck === true || !ENV.fingerprint);
        if (!bypassPinningCheck === true || !ENV.fingerprint) {
            return Promise.resolve();
        }
        return this.ready().then(() =>
            new Promise((resolve, reject) => window.plugins.sslCertificateChecker.check(
                message => resolve(),
                message => reject(this.translateService.instant('message.server_error')),
                ENV.mainApi,
                ENV.fingerprint)
            )
        );
    }

    deleteFromDocuments(name: string): Promise<boolean> {
        return this.fileReady().then(cordovaFile =>
            File.removeFile(cordovaFile.documents, name)
                .then(removeResult => true)
        ).catch(error => this.appProvider.promiseReject(error));
    }

    copyMediaToDocuments(name: string) {
        return this.fileReady().then(cordovaFile =>
            File.removeFile(cordovaFile.documents, name)
                .catch(error => this.logProvider.error(JSON.stringify(error)))
                .then(() => File.copyFile(cordovaFile.media, name, cordovaFile.documents, name))
                .then(success => true)
        ).catch(error => this.appProvider.promiseReject(error));
    }

    createDocumentsFile(path: string): Promise<FileEntry> {
        return new Promise<FileEntry>((resolve, reject) => {
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, root => {
                let dirs = path.split("/").filter(f => f != '').reverse();
                let createFile = (entry: Entry, f: string) => (<DirectoryEntry>entry).getFile(f, {
                    create: true,
                    exclusive: false
                }, (fileEntry: FileEntry) => resolve(fileEntry), error => reject(error));
                let createDirectory = (entry: Entry, d: string) => (<DirectoryEntry>entry).getDirectory(d, {create: true, exclusive: false}, directorySuccess, error => reject(error));
                let directorySuccess = (entry: Entry) => dirs.length > 1 ? createDirectory(entry, dirs.pop()) : createFile(entry, dirs.pop());
                if (dirs.length > 1) {
                    createDirectory(root, dirs.pop());
                } else {
                    createFile(root, dirs.pop());
                }
            }, error => reject(error))
        });
    }

    storeBase64Data(path: string, base64Data: string, contentType: string): Promise<StoredData> {
        return this.fileReady().then(cordovaFile =>
            this.createDocumentsFile(path).then(fileEntry =>
                new Promise<StoredData>((resolve, reject) =>
                    fileEntry.createWriter(
                        fileWriter => {
                            fileWriter.onwriteend = () => resolve({path: fileEntry.nativeURL + name, contentType: contentType});
                            fileWriter.onerror = error => reject(error);
                            try {
                                fileWriter.write(this.base64toBlob(base64Data, contentType));
                            } catch (e) {
                                reject(e);
                            }
                        })
                )
            )
        );
    }

    readEntries(path: string) {
        return new Promise<any>((resolve, reject) => {
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + path.split("/").filter(f => f != '').join('/'), (entry: DirectoryEntry) => {
                entry.createReader().readEntries(entries => resolve(entries), error => reject(error));
            }, error => reject(error))
        });
    }

    getStoredFile(path: string): Promise<Entry> {
        return new Promise<Entry>((resolve, reject) =>
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + path.split("/").filter(f => f != '').join('/'), entry => resolve(entry), error => reject(error))
        );
    }

    getStoredBase64Data(name: string): Promise<string> {
        return this.fileReady().then(cordovaFile =>
            File.checkFile(cordovaFile.documents, name).then(() =>
                File.readAsBinaryString(cordovaFile.documents, name))
                .then(result => btoa(<string>result)))
            .catch(error => this.appProvider.promiseReject(error));
    }

    storeText(name: string, text: string): Promise<void> {
        // this.logProvider.info('storeText', name, text);
        return this.fileReady().then(cordovaFile =>
            File.createFile(cordovaFile.documents, name, true)
                .then(() => File.writeExistingFile(cordovaFile.documents, name, text))
        ).catch(error => this.appProvider.promiseReject(error));
    }

    getStoredText(name: string): Promise<string> {
        // this.logProvider.info('getStoredText', name);
        return this.fileReady().then(cordovaFile =>
            File.checkFile(cordovaFile.documents, name)
                .then(file => File.readAsText(cordovaFile.documents, name))
                .then(result => <string>result)
        ).catch(error => this.appProvider.promiseReject(error));
    }

    takeStorePicture(name: string): Promise<StoredPicture> {
        return this.fileReady().then(cordovaFile =>
            Camera.getPicture({destinationType: Camera.DestinationType.DATA_URL, saveToPhotoAlbum: false, allowEdit: true, correctOrientation: true})
                .then(base64ImageData =>
                    File.createFile(cordovaFile.documents, name, true)
                        .then(createSuccess => this.storeBase64Data(name, base64ImageData, 'image/jpeg'))
                        .then(storedData => {
                            return {path: storedData.path};
                        })
                )
        ).catch(error => {
            if ('Camera cancelled.' !== error) {
                return this.appProvider.promiseReject(error);
            }
        });
    }

    getStoredPath(path: string): string {
        return this.platform.is('cordova') ? cordova.file.dataDirectory + path : 'image/photo.png';
    }

    openMediaMp4(name: string) {
        return this.fileReady().then(cordovaFile => {
            if (this.platform.is('android')) {
                return File.removeFile(cordovaFile.cache, name)
                    .catch(error => this.logProvider.error(JSON.stringify(error)))
                    .then(() => File.copyFile(cordovaFile.media, name, cordovaFile.cache, name))
                    .then(success =>
                        WebIntent.startActivity(<any>{
                            action: WebIntent.ACTION_VIEW,
                            url: cordovaFile.cache + name,
                            type: 'video/mp4'
                        })
                    );
            }
            if (this.platform.is('ios')) {
                return File.checkFile(cordovaFile.media, name).then((success) => {
                    InAppBrowser.open(cordovaFile.media + name, '_blank', 'location=no,enableViewportScale=yes,closebuttoncaption=' + this.translateService.instant('action.done') + ',hidden=yes');
                });
            }
            throw Error(this.translateService.instant('message.deviceNotSupported'));
        }).catch(error => this.appProvider.promiseReject(error));
    }

    openDocumentsMp4(name: string) {
        return this.fileReady().then(cordovaFile => {
            if (this.platform.is('android')) {
                return File.removeFile(cordovaFile.cache, name)
                    .catch(error => this.logProvider.error(JSON.stringify(error)))
                    .then(() => File.copyFile(cordovaFile.documents, name, cordovaFile.cache, name))
                    .then(success =>
                        WebIntent.startActivity(<any>{
                            action: WebIntent.ACTION_VIEW,
                            url: cordovaFile.cache + name,
                            type: 'video/mp4'
                        })
                    );
            }
            if (this.platform.is('ios')) {
                return File.checkFile(cordovaFile.documents, name).then((success) => {
                    InAppBrowser.open(cordovaFile.documents + name, '_blank', 'location=no,enableViewportScale=yes,closebuttoncaption=' + this.translateService.instant('action.done') + ',hidden=yes');
                });
            }
            throw Error(this.translateService.instant('message.deviceNotSupported'));
        }).catch(error => this.appProvider.promiseReject(error));
    }

    openMediaPdf(name: string) {
        return this.fileReady().then(cordovaFile => {
            if (this.platform.is('android')) {
                return File.removeFile(cordovaFile.cache, name)
                    .catch(error => this.logProvider.error(JSON.stringify(error)))
                    .then(() => File.copyFile(cordovaFile.media, name, cordovaFile.cache, name))
                    .then(success =>
                        WebIntent.startActivity(<any>{
                            action: WebIntent.ACTION_VIEW,
                            url: cordovaFile.cache + name,
                            type: 'application/pdf'
                        })
                    );
            }
            if (this.platform.is('ios')) {
                return File.checkFile(cordovaFile.media, name).then((success) => {
                    InAppBrowser.open(cordovaFile.media + name, '_blank', 'location=no,enableViewportScale=yes,closebuttoncaption=' + this.translateService.instant('action.done'));
                });
            }
            throw Error(this.translateService.instant('message.deviceNotSupported'));
        }).catch(error => this.appProvider.promiseReject(error));
    }

    openDocumentsPdf(name: string) {
        return this.fileReady().then(cordovaFile => {
            if (this.platform.is('android')) {
                return File.removeFile(cordovaFile.cache, name)
                    .catch(error => this.logProvider.error(JSON.stringify(error)))
                    .then(() => File.copyFile(cordovaFile.documents, name, cordovaFile.cache, name))
                    .then(success =>
                        WebIntent.startActivity(<any>{
                            action: WebIntent.ACTION_VIEW,
                            url: cordovaFile.cache + name,
                            type: 'application/pdf'
                        })
                    );
            }
            if (this.platform.is('ios')) {
                return File.checkFile(cordovaFile.documents, name).then((success) => {
                    InAppBrowser.open(cordovaFile.documents + name, '_blank', 'location=no,enableViewportScale=yes,closebuttoncaption=' + this.translateService.instant('action.done'));
                });
            }
            throw Error(this.translateService.instant('message.deviceNotSupported'));
        }).catch(error => this.appProvider.promiseReject(error));
    }

    private base64toBlob(base64Data: string, contentType: string) {
        let byteCharacters: string = atob(base64Data);
        let byteArrays: Array<Uint8Array> = [];
        for (let offset: number = 0; offset < byteCharacters.length; offset += 512) {
            let slice: string = byteCharacters.slice(offset, offset + 512);
            let byteNumbers: Array<number> = new Array(slice.length);
            for (let i: number = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        return new Blob(byteArrays, {type: contentType});
    }

}
