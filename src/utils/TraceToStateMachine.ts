import { FSM } from '../state_machine/FSM';

type Pair<E> = [E, E];
export type EqualityCheck<E> = (i1:E, i2:E) => boolean;
export type SimilarityScore<E> = (i1:E, i2:E) => number;
const defaultEqualityCheck:EqualityCheck<any> = (a:any, b:any) => a===b;
const defaultSimilarityScore:SimilarityScore<any> = (a:any, b:any) => a===b ? 1 : 0;

/**
 * Merge two states together
 */
export function mergeStates(fsm: FSM<any, any>, removeState:string, mergeInto:string, removeStaleStates:boolean=true, transitionsEqual: EqualityCheck<any> = defaultEqualityCheck):void {
    const mergeIntoOutgoingTransitions = fsm.getOutgoingTransitions(mergeInto);
    const outgoingTransitionTargets = new Set<string>();

    let outgoingTransitions: string[];

    do {
        outgoingTransitions = fsm.getOutgoingTransitions(removeState);
        if (outgoingTransitions.length > 0) {
            const t = outgoingTransitions[0];
            const tPayload = fsm.getTransitionPayload(t);
            let hasConflict: boolean = false;
            for (let i in mergeIntoOutgoingTransitions) {
                const t2 = mergeIntoOutgoingTransitions[i];
                const t2Payload = fsm.getTransitionPayload(t2);

                if (transitionsEqual(tPayload, t2Payload)) {
                    hasConflict = true;
                    break;
                }
            }

            if (hasConflict) {
                if (removeStaleStates) {
                    outgoingTransitionTargets.add(fsm.getTransitionTo(t));
                }
                fsm.removeTransition(t);
            } else {
                fsm.setTransitionFrom(t, mergeInto);
            }
        }
    } while (outgoingTransitions.length > 0);

    let incomingTransitions: string[];

    do {
        incomingTransitions = fsm.getIncomingTransitions(removeState);
        if (incomingTransitions.length > 0) {
            const t = incomingTransitions[0];
            fsm.setTransitionTo(t, mergeInto);
        }
    } while (incomingTransitions.length > 0);

    fsm.removeState(removeState);

    if (removeStaleStates) {
        outgoingTransitionTargets.forEach((state) => {
            if (fsm.getIncomingTransitions(state).length === 0) {
                fsm.removeState(state);
            }
        });
    }
};

// export class FSM<S,T> extends StateContainer<S,T> {
//     constructor(private transitionsEqual:EqualityCheck<T>=defaultEqualityCheck,
//                 private transitionSimilarityScore:SimilarityScore<T>=defaultSimilarityScore,
//                 private stateSimilarityScore:SimilarityScore<S>=defaultSimilarityScore) {
//         super();
//     };


//     /**
//      * Iterate and merge the best candidates
//      */
//     public iterateMerge():void {
//         const similarityScores = this.computeSimilarityScores();
//         const sortedStates = Array.from(similarityScores.entries()).sort((a, b) => b[1]-a[1]);
//         console.log(sortedStates);

//         if(sortedStates.length > 0) {
//             const [toMergeS1, toMergeS2] = sortedStates[0][0];
//             this.mergeStates(toMergeS1, toMergeS2);
//         }
//     };

//     /**
//      * @returns every possible pairing of states
//      */
//     private getStatePairs():Pair<AbstractState<S,T>>[] {
//         const rv:Pair<AbstractState<S,T>>[] = [];
//         const states = Array.from(this.states.values());
//         for(let i:number = 0; i<states.length; i++) {
//             const si = states[i];
//             for(let j:number = i+1; j<states.length; j++) {
//                 const sj = states[j];
//                 rv.push([si, sj]);
//             }
//         }
//         return rv;
//     };

//     /**
//      * Compute a similarity score of every pair of states
//      */
//     private computeSimilarityScores():Map<Pair<AbstractState<S,T>>, number> {
//         const numCommonTransitions = new HashMap<Pair<AbstractState<S,T>>, number>((p1, p2) => { return p1[0]===p2[0] && p1[1]===p2[1]; }, (p)=>{ return this.getStateLabel(p[0]) + this.getStateLabel(p[1]); });
//         const statePairs = this.getStatePairs();
//         const equivalentOutgoingTransitions:Map<Pair<AbstractState<S,T>>, Pair<Transition<S,T>>[]> = new Map<Pair<AbstractState<S,T>>, Pair<Transition<S,T>>[]>();
//         statePairs.forEach((p) => {
//             const [state1, state2] = p;
//             const et:Pair<Transition<S,T>>[] = this.equivalentTransitions(state1._getOutgoingTransitions(), state2._getOutgoingTransitions());
//             equivalentOutgoingTransitions.set(p, et);
//             numCommonTransitions.set(p, et.length);
//         });
//         const rv = new Map<Pair<AbstractState<S,T>>, number>();
//         statePairs.forEach((p) => {
//             const equivalentTransitions = equivalentOutgoingTransitions.get(p);
//             equivalentTransitions.forEach((et) => {
//                 const [t1, t2] = et;

//                 const t1Dest = t1.getToState();
//                 const t2Dest = t2.getToState();
//                 const similarityScore:number = numCommonTransitions.get([t1Dest, t2Dest]) || numCommonTransitions.get([t2Dest, t1Dest]);
//                 rv.set(p, numCommonTransitions.get(p) + similarityScore);
//             });
//         });
//         numCommonTransitions.clear();
//         return rv;
//     };

//     /**
//      * Get a list of equivalent transitions from two sets of transitions
//      * @param transitionSet1 The first set of transitions
//      * @param transitionSet2 The second set of transitions
//      * @returns A list of pairs of transitions that are common between transitionSet1 and transitionSet2
//      */
//     private equivalentTransitions(transitionSet1:Transition<S,T>[], transitionSet2:Transition<S,T>[]):Pair<Transition<S,T>>[] {
//         const rv:Pair<Transition<S,T>>[] = [];
//         for(let i:number = 0; i<transitionSet1.length; i++) {
//             const t1 = transitionSet1[i];
//             for(let j:number = 0; j<transitionSet2.length; j++) {
//                 const t2 = transitionSet2[j];
//                 if(this.transitionsEqual(t1.getPayload(), t2.getPayload())) {
//                     rv.push([t1, t2]);
//                     break;
//                 }
//             }
//         }
//         return rv;
//     };

//     /**
//      * Add a new "trace" through a program
//      */
//     public addTrace(trace:[T,S][]):void {
//         let currentState = this.getStartState();
//         trace.forEach((item) => {
//             const [t,s] = item;

//             const outgoingTransitions = this.getState(currentState)._getOutgoingTransitions();
//             let transitionExists:boolean = false;
//             let existingState:AbstractState<S,T>;
//             for(let i = 0; i<outgoingTransitions.length; i++) {
//                 const outgoingTransition = outgoingTransitions[i];
//                 if(this.transitionsEqual(outgoingTransition.getPayload(), t)) {
//                     transitionExists = true;
//                     existingState = outgoingTransition.getToState();
//                     break;
//                 }
//             }

//             if(transitionExists) {
//                 currentState = this.getStateLabel(existingState);
//             } else {
//                 const newState = this.addState(s);
//                 this.addTransition(currentState, newState, `${t}`, t);
//                 currentState = newState;
//             }
//         });
//     };

// };