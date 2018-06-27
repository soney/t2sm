export declare abstract class StateContainer {
    private subStates;
    private startState;
    private activeState;
    private states;
    private fireFunctions;
    constructor();
    hasState(label: string): boolean;
    addState(label?: string): string;
    removeState(label: string): this;
    renameState(fromLabel: string, toLabel: string): this;
    addTransition(fromLabel: string, toLabel: string): Function;
    removeTransition(fireFn: Function): this;
    getActiveState(): string;
    setActiveState(label: string): this;
    getStates(): string[];
    private getUniqueStateLabel;
}
