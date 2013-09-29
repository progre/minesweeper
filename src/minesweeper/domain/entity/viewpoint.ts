export enum Landform {
    None,
    Bomb
}

export enum Status {
    Close,
    Flag,
    Open
}

export class ViewPoint {
    constructor(
        public landform: Landform,
        public status: Status) {
    }
}

/** 16x16‚Ì’nŒ`‚ğì¬‚·‚é */
export function createViewPointChunk(): ViewPoint[][] {
    var chunk = [];
    for (var y = 0; y < 16; y++) {
        var line = [];
        for (var x = 0; x < 16; x++) {
            line.push(new ViewPoint(
                Math.random() < 0.4 ? Landform.Bomb : Landform.None,
                Status.Close));
        }
        chunk.push(line);
    }
    return chunk;
}
