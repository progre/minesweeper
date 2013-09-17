interface EventEmitter2Configuration {
    delimiter?: string;
    maxListeners?: number;
    wildcard?: string;
    newListener?: Function;
}

declare class EventEmitter2 {
    constructor(conf?: EventEmitter2Configuration);
    addListener(event: string, listener: Function): EventEmitter2;
    on(event: string, listener: Function): EventEmitter2;
    onAny(listener: Function): EventEmitter2;
    offAny(listener: Function): EventEmitter2;
    once(event: string, listener: Function): EventEmitter2;
    many(event: string, timesToListen: number, listener: Function): EventEmitter2;
    removeListener(event: string, listener: Function): EventEmitter2;
    off(event: string, listener: Function): EventEmitter2;
    removeAllListeners(event?: string): EventEmitter2;
    setMaxListeners(n: number): void;
    listeners(event: string): Function[];
    listenersAny(): Function[];
    emit(event: string, ...args: any[]);
}
