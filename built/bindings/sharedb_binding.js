"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
;
class SDBBinding {
    constructor(fsm, doc, path) {
        this.fsm = fsm;
        this.doc = doc;
        this.path = path;
        this.onStateAdded = (event) => {
            const { state, payload } = event;
            this.doc.submitObjectInsertOp(this.path.concat('states', state), { payload });
        };
        this.onStateRemoved = (event) => {
            const { state } = event;
            this.doc.submitObjectDeleteOp(this.path.concat('states', state));
        };
        this.onActiveStateChanged = (event) => {
            const { state, oldActiveState } = event;
            if (oldActiveState) {
                this.doc.submitObjectReplaceOp(this.path.concat('states', oldActiveState, 'active'), false);
            }
            this.doc.submitObjectReplaceOp(this.path.concat('states', state, 'active'), true);
        };
        this.onTransitionAdded = (event) => {
            const { transition, from, to, payload, alias } = event;
            this.doc.submitObjectInsertOp(this.path.concat('transitions', transition), { from, to, payload, alias });
        };
        this.onStatePayloadChanged = (event) => {
            const { state, payload } = event;
            this.doc.submitObjectInsertOp(this.path.concat('states', state, 'payload'), payload);
        };
        this.onTransitionPayloadChanged = (event) => {
            const { transition, payload } = event;
            this.doc.submitObjectInsertOp(this.path.concat('transitions', transition, 'payload'), payload);
        };
        this.onTransitionRemoved = (event) => {
            const { transition } = event;
            this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition));
        };
        this.onTransitionToStateChanged = (event) => {
            const { transition, state } = event;
            this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'to'), state);
        };
        this.onTransitionFromStateChanged = (event) => {
            const { transition, state } = event;
            this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition, 'from'), state);
        };
        this.onTransitionAliasChanged = (event) => {
            const { transition, alias } = event;
            this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition, 'alias'), alias);
        };
        this.fsm.on('stateAdded', this.onStateAdded);
        this.fsm.on('stateRemoved', this.onStateRemoved);
        this.fsm.on('transitionAdded', this.onTransitionAdded);
        this.fsm.on('transitionRemoved', this.onTransitionRemoved);
        this.fsm.on('activeStateChanged', this.onActiveStateChanged);
        this.fsm.on('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.on('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.on('transitionAliasChanged', this.onTransitionAliasChanged);
        this.fsm.on('transitionPayloadChanged', this.onTransitionPayloadChanged);
        this.fsm.on('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.on('transitionFromStateChanged', this.onTransitionFromStateChanged);
        let hasSDBData;
        try {
            const data = this.doc.traverse(this.path);
            if (data) {
                hasSDBData = true;
            }
            else {
                hasSDBData = false;
            }
        }
        catch (_a) {
            hasSDBData = false;
        }
        if (hasSDBData) {
            this.syncSDBToFSM();
        }
        else {
            this.syncFSMToSDB();
        }
    }
    ;
    syncFSMToSDB() {
        const data = {
            startState: this.fsm.getStartState(),
            states: {},
            transitions: {}
        };
        this.fsm.getStates().forEach((stateName) => {
            const payload = this.fsm.getStatePayload(stateName);
            const active = this.fsm.getActiveState() === stateName;
            data.states[stateName] = { payload, active };
        });
        this.fsm.getTransitions().forEach((transitionName) => {
            const from = this.fsm.getTransitionFrom(transitionName);
            const to = this.fsm.getTransitionTo(transitionName);
            const payload = this.fsm.getTransitionPayload(transitionName);
            const alias = this.fsm.getTransitionAlias(transitionName);
            data.transitions[transitionName] = { from, to, payload, alias };
        });
        this.doc.submitObjectReplaceOp(this.path, data);
    }
    ;
    syncSDBToFSM() {
        const data = this.doc.traverse(this.path);
        lodash_1.each(data.states, (state, label) => {
            const { payload } = state;
            this.fsm.addState(payload, label);
        });
        lodash_1.each(data.transitions, (transition, label) => {
            const { from, to, payload, alias } = transition;
            this.fsm.addTransition(from, to, alias, payload, label);
        });
    }
    ;
}
exports.SDBBinding = SDBBinding;
;
//# sourceMappingURL=sharedb_binding.js.map