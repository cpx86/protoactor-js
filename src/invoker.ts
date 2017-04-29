import {Message} from "./messages";
export interface IMessageInvoker {
    InvokeSystemMessage(message: string): Promise<void>;
    InvokeUserMessage(message: string): Promise<void>;
    EscalateFailure(error: any, message?: Message): void;
}