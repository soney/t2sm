"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FSM_1 = require("../state_machine/FSM");
const lodash_1 = require("lodash");
;
class SDBBinding {
    constructor(doc, path, fsm = null) {
        this.doc = doc;
        this.path = path;
        this.fsm = fsm;
        this.ignoreFSMChanges = false;
        this.ignoreSDBChanges = false;
        this.onDocEvent = (eventType, ops, source) => {
            if (!this.ignoreSDBChanges) {
                if (eventType === null) {
                    this.initialize();
                }
                else if (eventType === 'op') {
                    ops.forEach((op) => {
                        const { p } = op;
                        if (lodash_1.isEqual(p.slice(0, this.path.length), this.path)) {
                            const extraPath = p.slice(this.path.length);
                            this.ignoreFSMChanges = true;
                            if (lodash_1.isEqual(extraPath, [])) {
                                this.syncSDBToFSM();
                            }
                            else if (extraPath[0] === 'states') {
                                const label = extraPath[1];
                                if (extraPath.length === 2) {
                                    if (lodash_1.has(op, 'od')) {
                                        this.fsm.removeState(label);
                                    }
                                    if (lodash_1.has(op, 'oi')) {
                                        const { oi } = op;
                                        const { payload, active } = oi;
                                        this.fsm.addState(payload, label);
                                        if (active) {
                                            this.fsm.setActiveState(label);
                                        }
                                    }
                                }
                                else if (extraPath.length === 3) {
                                    if (extraPath[2] === 'payload') {
                                        if (lodash_1.has(op, 'oi')) {
                                            const { oi } = op;
                                            this.fsm.setStatePayload(label, oi);
                                        }
                                    }
                                    else if (extraPath[2] === 'active') {
                                        if (lodash_1.has(op, 'oi')) {
                                            const { oi } = op;
                                            if (oi === true) {
                                                this.fsm.setActiveState(label);
                                            }
                                        }
                                    }
                                }
                            }
                            else if (extraPath[0] === 'transitions') {
                                const label = extraPath[1];
                                if (extraPath.length === 2) {
                                    if (lodash_1.has(op, 'oi')) {
                                        const { oi } = op;
                                        const { from, to, payload, alias } = oi;
                                        this.fsm.addTransition(from, to, alias, payload, label);
                                    }
                                    if (lodash_1.has(op, 'od')) {
                                        this.fsm.removeTransition(label);
                                    }
                                }
                                else if (extraPath.length === 3) {
                                    if (extraPath[2] === 'from') {
                                        if (lodash_1.has(op, 'oi')) {
                                            const { oi } = op;
                                            this.fsm.setTransitionFrom(label, oi);
                                        }
                                    }
                                    else if (extraPath[2] === 'to') {
                                        if (lodash_1.has(op, 'oi')) {
                                            const { oi } = op;
                                            this.fsm.setTransitionTo(label, oi);
                                        }
                                    }
                                    else if (extraPath[2] === 'alias') {
                                        if (lodash_1.has(op, 'oi')) {
                                            const { oi } = op;
                                            this.fsm.setTransitionAlias(label, oi);
                                        }
                                    }
                                    else if (extraPath[2] === 'payload') {
                                        if (lodash_1.has(op, 'oi')) {
                                            const { oi } = op;
                                            this.fsm.setTransitionPayload(label, oi);
                                        }
                                    }
                                }
                            }
                            else {
                                console.log(extraPath);
                            }
                            this.ignoreFSMChanges = false;
                        }
                    });
                }
            }
        };
        this.onStateAdded = (event) => {
            if (!this.ignoreFSMChanges) {
                const { state, payload } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectInsertOp(this.path.concat('states', state), { payload, active: this.fsm.getActiveState() === state });
                this.ignoreSDBChanges = false;
            }
        };
        this.onStateRemoved = (event) => {
            if (!this.ignoreFSMChanges) {
                const { state } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectDeleteOp(this.path.concat('states', state));
                this.ignoreSDBChanges = false;
            }
        };
        this.onActiveStateChanged = (event) => {
            if (!this.ignoreFSMChanges) {
                const { state, oldActiveState } = event;
                this.ignoreSDBChanges = true;
                if (oldActiveState) {
                    this.doc.submitObjectReplaceOp(this.path.concat('states', oldActiveState, 'active'), false);
                }
                this.doc.submitObjectReplaceOp(this.path.concat('states', state, 'active'), true);
                this.ignoreSDBChanges = false;
            }
        };
        this.onTransitionAdded = (event) => {
            if (!this.ignoreFSMChanges) {
                const { transition, from, to, payload, alias } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectInsertOp(this.path.concat('transitions', transition), { from, to, payload, alias });
                this.ignoreSDBChanges = false;
            }
        };
        this.onStatePayloadChanged = (event) => {
            if (!this.ignoreFSMChanges) {
                const { state, payload } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectReplaceOp(this.path.concat('states', state, 'payload'), payload);
                this.ignoreSDBChanges = false;
            }
        };
        this.onTransitionPayloadChanged = (event) => {
            if (!this.ignoreFSMChanges) {
                const { transition, payload } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'payload'), payload);
                this.ignoreSDBChanges = false;
            }
        };
        this.onTransitionRemoved = (event) => {
            if (!this.ignoreFSMChanges) {
                const { transition } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition));
                this.ignoreSDBChanges = false;
            }
        };
        this.onTransitionToStateChanged = (event) => {
            if (!this.ignoreFSMChanges) {
                const { transition, state } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'to'), state);
                this.ignoreSDBChanges = false;
            }
        };
        this.onTransitionFromStateChanged = (event) => {
            if (!this.ignoreFSMChanges) {
                const { transition, state } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'from'), state);
                this.ignoreSDBChanges = false;
            }
        };
        this.onTransitionAliasChanged = (event) => {
            if (!this.ignoreFSMChanges) {
                const { transition, alias } = event;
                this.ignoreSDBChanges = true;
                this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'alias'), alias);
                this.ignoreSDBChanges = false;
            }
        };
        this.fsmProvided = !!this.fsm;
        if (this.fsm) {
            this.fsmProvided = true;
        }
        else {
            this.fsm = new FSM_1.FSM();
            this.fsmProvided = false;
        }
        this.subscribeToSDB();
    }
    ;
    destroy() {
        this.fsm.removeListener('stateAdded', this.onStateAdded);
        this.fsm.removeListener('stateRemoved', this.onStateRemoved);
        this.fsm.removeListener('transitionAdded', this.onTransitionAdded);
        this.fsm.removeListener('transitionRemoved', this.onTransitionRemoved);
        this.fsm.removeListener('activeStateChanged', this.onActiveStateChanged);
        this.fsm.removeListener('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.removeListener('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.removeListener('transitionAliasChanged', this.onTransitionAliasChanged);
        this.fsm.removeListener('transitionPayloadChanged', this.onTransitionPayloadChanged);
        this.fsm.removeListener('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.removeListener('transitionFromStateChanged', this.onTransitionFromStateChanged);
        this.unsubscribeFromSDB();
    }
    ;
    getFSM() {
        return this.fsm;
    }
    ;
    unsubscribeFromSDB() {
        this.doc.unsubscribe(this.onDocEvent);
        // this.doc.destroy();
        this.ignoreSDBChanges = true;
    }
    ;
    subscribeToSDB() {
        this.doc.subscribe(this.onDocEvent);
    }
    ;
    initialize() {
        if (this.fsmProvided) {
            this.syncFSMToSDB();
        }
        else {
            this.syncSDBToFSM();
        }
        this.fsm.on('stateAdded', this.onStateAdded);
        this.fsm.on('stateRemoved', this.onStateRemoved);
        this.fsm.on('transitionAdded', this.onTransitionAdded);
        this.fsm.on('transitionRemoved', this.onTransitionRemoved);
        this.fsm.on('activeStateChanged', this.onActiveStateChanged);
        this.fsm.on('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.on('transitionAliasChanged', this.onTransitionAliasChanged);
        this.fsm.on('transitionPayloadChanged', this.onTransitionPayloadChanged);
        this.fsm.on('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.on('transitionFromStateChanged', this.onTransitionFromStateChanged);
    }
    ;
    syncFSMToSDB() {
        const data = this.fsm.serialize();
        this.ignoreSDBChanges = true;
        this.doc.submitObjectReplaceOp(this.path, data);
        this.ignoreSDBChanges = false;
    }
    ;
    syncSDBToFSM() {
        const data = this.doc.traverse(this.path);
        if (data) {
            this.ignoreFSMChanges = true;
            FSM_1.FSM.deserialize(data, this.fsm);
            this.ignoreFSMChanges = false;
        }
    }
    ;
}
exports.SDBBinding = SDBBinding;
;
//# sourceMappingURL=sharedb_binding.js.map