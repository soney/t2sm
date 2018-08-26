import { FSM } from '../state_machine/FSM';
import { SDBBinding } from '../bindings/sharedb_binding';
import { SDBClient, SDBDoc } from 'sdb-ts';
export interface CTTStateData {

};
export interface CTTTransitionData {
    eventType: string;
    target: SerializedElement;
    manualLabel?: string;
};

export interface SerializedElement {
    tagName: string;
    attributes: { [name: string]: string };
    parent?: { element: SerializedElement, childIndex: number }
};

export class ClientTraceTracker {
    private fsm: FSM<CTTStateData, CTTTransitionData> = new FSM<CTTStateData, CTTTransitionData>();
    private ws: WebSocket;
    private sdbClient: SDBClient;
    private sdbDoc: SDBDoc<any>;
    private sdbBinding: SDBBinding;
    private currentState: string;

    public constructor(serverURL: string, clientID: string) {
        this.ws = new WebSocket(serverURL);
        this.sdbClient = new SDBClient(this.ws);
        this.sdbDoc = this.sdbClient.get('t2sm', 'userTraces');
        this.sdbBinding = new SDBBinding(this.sdbDoc, [clientID], this.fsm);

        this.currentState = this.fsm.addState({});
        this.fsm.addTransition(this.fsm.getStartState(), this.currentState);
    }

    public addEvent(eventType: string, target: HTMLElement, manualLabel?: string): void {
        const sTarget = ClientTraceTracker.serializeElement(target);
        const payload: CTTTransitionData = { eventType, manualLabel, target: sTarget };

        const previousState = this.currentState;
        this.currentState = this.fsm.addState({});
        this.fsm.addTransition(previousState, this.currentState, null, payload);
    }

    private static serializeElement(el: HTMLElement): SerializedElement {
        const { tagName, parentElement } = el;
        const attributes = { };
        for(let i: number = 0; i < el.attributes.length; i++) {
            const { name, value } = el.attributes.item(i);
            attributes[name] = value;
        }
        if (parentElement) {
            const childIndex = Array.prototype.indexOf.call(parentElement.childNodes, el);
            const sParent = ClientTraceTracker.serializeElement(parentElement);
            return { tagName, attributes, parent: { element: sParent, childIndex } };
        } else {
            return { tagName, attributes };
        }
    }
}