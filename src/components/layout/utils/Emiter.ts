export enum EventType {
  MarginBottom = "MarginBottom",
}

export class EventEmitter extends EventTarget {
  #marginBottom;
  constructor() {
    super();
    this.#marginBottom = 0;
  }

  setMarginBottom(marginBottom: number) {
    this.#marginBottom = marginBottom;
    this.dispatchEvent(new Event(EventType.MarginBottom));
  }

  getMarginBottom() {
    return this.#marginBottom;
  }
}

export const eventEmitter = new EventEmitter();
