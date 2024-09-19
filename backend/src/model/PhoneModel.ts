import { ContactEnum } from "../enum/ContactEnum";



export type PhoneModel = {
    id: number;
    phoneType: ContactEnum;
    phoneNumber: string;
}