import { ContactEnum } from "../enum/ContactEnum";



export type EmailModel = {
    id: number;
    emailType: ContactEnum;
    emailAddress: string;

}