import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

//in this case, null is valid
export const mimeType = (
    control: AbstractControl
): Promise<{[key: string]: any}> | Observable <{[key: string]: any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer: Observer <{[key: string]: any}>) => {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);  //8 bit integer

            let header = "";
            let isValid = false;

            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16); //to string hexadecimal value
            }

            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;

                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }

            if (isValid) {
                observer.next(null);
            } else {
                observer.next({invalidMimeType: true});
            }
            //dont forget to let know any subsciber the process has done
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
};