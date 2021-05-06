export class StringBuilder {
  separator: string;
  buffer: string[];

  constructor (separator: string) {
    this.separator = separator;
    this.buffer = [];
  }

  append (next: string) {
    this.buffer = [...this.buffer, next];
  }

  pop () {
    this.buffer = this.buffer.slice(-1, 1);
  }

  concatenate () {
    return this.buffer.join(this.separator);
  }

  clear () {
    this.buffer = [];
  }
}