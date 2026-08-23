/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/** a pending insertion offset tracked by {@link InsertionText} */
interface InsertionOffset {
  pos: number;
  len: number;
}

const WHITE_RE = /[ \f\n\r\t\v\u00A0\u2028\u2029]/;

class InsertionText {
  declare text: string;
  declare origLength: number;
  declare offsets: InsertionOffset[];
  declare consumeBlanks: boolean | undefined;
  declare startPos: number;
  declare endPos: number;

  constructor(text: string, consumeBlanks?: boolean) {
    this.text = text;
    this.origLength = text.length;
    this.offsets = [];
    this.consumeBlanks = consumeBlanks;
    this.startPos = this.findFirstNonBlank();
    this.endPos = this.findLastNonBlank();
  }

  findFirstNonBlank(): number {
    let pos = -1;
    const text = this.text;
    const len = text.length;
    let i;
    for (i = 0; i < len; i += 1) {
      if (!text.charAt(i).match(WHITE_RE)) {
        pos = i;
        break;
      }
    }
    return pos;
  }

  findLastNonBlank(): number {
    const text = this.text;
    const len = text.length;
    let pos = text.length + 1;
    let i;
    for (i = len - 1; i >= 0; i -= 1) {
      if (!text.charAt(i).match(WHITE_RE)) {
        pos = i;
        break;
      }
    }
    return pos;
  }

  originalLength(): number {
    return this.origLength;
  }

  insertAt(col: number, str: string, insertBefore?: boolean, consumeBlanks?: boolean): this {
    consumeBlanks = typeof consumeBlanks === "undefined" ? this.consumeBlanks : consumeBlanks;
    col = col > this.originalLength() ? this.originalLength() : col;
    col = col < 0 ? 0 : col;

    if (consumeBlanks) {
      if (col <= this.startPos) {
        col = 0;
      }
      if (col > this.endPos) {
        col = this.origLength;
      }
    }

    const len = str.length;
    const offset = this.findOffset(col, len, insertBefore);
    const realPos = col + offset;
    const text = this.text;
    this.text = text.substring(0, realPos) + str + text.substring(realPos);
    return this;
  }

  findOffset(pos: number, len: number, insertBefore?: boolean): number {
    const offsets = this.offsets;
    let offsetObj: InsertionOffset | undefined;
    let cumulativeOffset = 0;
    let i: number;

    for (i = 0; i < offsets.length; i += 1) {
      offsetObj = offsets[i];
      if (offsetObj.pos < pos || (offsetObj.pos === pos && !insertBefore)) {
        cumulativeOffset += offsetObj.len;
      }
      if (offsetObj.pos >= pos) {
        break;
      }
    }
    if (offsetObj && offsetObj.pos === pos) {
      offsetObj.len += len;
    } else {
      offsets.splice(i, 0, { pos, len });
    }
    return cumulativeOffset;
  }

  wrap(
    startPos: number,
    startText: string,
    endPos: number,
    endText: string,
    consumeBlanks?: boolean,
  ): this {
    this.insertAt(startPos, startText, true, consumeBlanks);
    this.insertAt(endPos, endText, false, consumeBlanks);
    return this;
  }

  wrapLine(startText: string, endText: string): void {
    this.wrap(0, startText, this.originalLength(), endText);
  }

  toString(): string {
    return this.text;
  }
}

export default InsertionText;
