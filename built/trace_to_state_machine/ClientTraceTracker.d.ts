export interface CTTStateData {
}
export interface CTTTransitionData {
    eventType: string;
    target: SerializedElement;
    manualLabel?: string;
}
export interface SerializedElement {
    tagName: string;
    attributes: {
        [name: string]: string;
    };
    parent?: {
        element: SerializedElement;
        childIndex: number;
    };
}
export declare class ClientTraceTracker {
    private fsm;
    private ws;
    private sdbClient;
    private sdbDoc;
    private sdbBinding;
    private currentState;
    constructor(serverURL: string, clientID: string);
    addEvent(eventType: string, target: HTMLElement, manualLabel?: string): void;
    private static serializeElement;
}
