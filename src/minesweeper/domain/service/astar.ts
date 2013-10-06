import BigInteger = require('jsbn');
import Enumerable = require('../../../lib/linq');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export = findPath;
function findPath(from: Coord, to: Coord, landform: any): Coord[] {
    var openList: Node[] = [{ coord: from, parent: null, cost: 0, heuristic: 0 }];
    var closeList: Node[] = [];
    while (openList.length > 0) {
        var lowNodeIdx = minCostIndex(openList); // コストの一番安いノード
        if (openList[lowNodeIdx].coord.equals(to)) {
            return createPath(closeList, openList[lowNodeIdx]);// 経路完成
        }
        var lowNode = removeAt(openList, lowNodeIdx);
        closeList.push(lowNode);
        getAround(lowNode.coord).forEach((around: Coord) => {
            if (contains(openList, around) || contains(closeList, around)) // 他、障害物などの場合もcontinue
                return;// continue
            openList.push({
                coord: around,
                parent: lowNode.coord,
                cost: lowNode.cost + 1,
                heuristic: around.distance(to)
            });
        });
    }
    return [];
}

function minCostIndex(list: Node[]) {
    var min = Number.MAX_VALUE;
    var minIndex = -1;
    for (var i = 0, len = list.length; i < len; i++) {
        var totalScore = list[i].cost + list[i].heuristic;
        if (min > totalScore) {
            min = totalScore;
            minIndex = i;
        }
    }
    return minIndex;
}

function createPath(closeList: Node[], lastNode: Node) {
    var path = [];
    var node = lastNode;
    for (; ;) {
        if (node.parent == null)
            return path;
        path.unshift(node.coord);
        node = Enumerable.from(closeList).firstOrDefault(x => x.coord.equals(node.parent));
        if (node == null)
            throw new Error('fuck');
    }
}

function removeAt<T>(array: T[], index: number): T {
    return array.splice(index, 1)[0];
}

function getAround(coord: Coord) {
    return [new Coord(coord.x.subtract(BigInteger.ONE), coord.y.subtract(BigInteger.ONE)),
        new Coord(coord.x, coord.y.subtract(BigInteger.ONE)),
        new Coord(coord.x.add(BigInteger.ONE), coord.y.subtract(BigInteger.ONE)),
        new Coord(coord.x.subtract(BigInteger.ONE), coord.y),
        new Coord(coord.x.add(BigInteger.ONE), coord.y),
        new Coord(coord.x.subtract(BigInteger.ONE), coord.y.add(BigInteger.ONE)),
        new Coord(coord.x, coord.y.add(BigInteger.ONE)),
        new Coord(coord.x.add(BigInteger.ONE), coord.y.add(BigInteger.ONE))];
}

function contains(array: Node[], value: Coord) {
    return array.some(x => x.coord.equals(value));
}

interface Node {
    coord: Coord;
    parent: Coord;
    cost: number;
    heuristic: number;
}