export class Snapshot {
  static #count = 0;

  static get count() {
    return this.#count;
  }

  static getSnapshot() {
    this.#count++;
  }
}
