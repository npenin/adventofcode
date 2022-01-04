import { Day } from "../../aoc.contracts";

function computeLineSize(input: { values: number[], stride: number }, index: number, directions: { up?: boolean, down?: boolean, left?: boolean, right?: boolean })
{
    var indexes = [index];
    var row = Math.floor(index / input.stride);
    var col = index % input.stride;

    if (directions.left)
        if (col - 1 >= 0) //go left
            if (input.values[index - 1] < 9)
                indexes = indexes.concat(computeLineSize(input, index - 1, { left: directions.left, up: directions.up, down: directions.down, right: false }));

    if (directions.right)
        // for (var i = 1; input.stride - i - index >= 0; i++) //go right
        if (col + 1 < input.stride) //go right
            if (input.values[1 + index] < 9)
                indexes = indexes.concat(computeLineSize(input, index + 1, { left: false, up: directions.up, down: directions.down, right: directions.right }));

    if (directions.up)
        // for (var i = row - 1; i >= 0; i--) //go up
        if (row - 1 >= 0) //go up
            if (input.values[index - input.stride] < 9)
                indexes = indexes.concat(computeLineSize(input, index - input.stride, { left: !directions.left, right: !directions.right, up: directions.up, down: false, }));

    if (directions.down)
        // for (var i = 1; i + row <= input.values.length; i++) //go down
        if (index + input.stride < input.values.length)
            if (input.values[index + input.stride] < 9)
                indexes = indexes.concat(computeLineSize(input, index + input.stride, { left: directions.left, right: directions.right, down: directions.down, up: false }));



    return distinct(indexes);
}

function distinct(array: number[]): number[]
{
    var result: number[] = [];
    array.sort((a, b) => a - b).reduce((prev, a) => { if (a !== prev) result.push(a); return a; }, Number.NaN);
    return result;
}

export const day: Day<{ values: number[], stride: number }> = {
    parse(input)
    {
        var lines = input.split('\n');
        return { values: lines.map(l => l.split('').map(Number)).flat(2), stride: lines[0].length };
    },
    compute(input)
    {
        const values = input.values;
        const lowPoints: { index: number, risk: number, basin: number[], size?: number }[] = []
        for (var i = 0; i < values.length; i++)
        {
            if (i % input.stride !== 0 && values[i - 1] <= values[i])
                continue;
            if ((i + 1) % input.stride !== 0 && values[i + 1] <= values[i])
                continue;
            if (i >= input.stride && values[i - input.stride] <= values[i])
                continue;
            if (i + input.stride <= values.length - 1 && values[i + input.stride] <= values[i])
                continue;

            lowPoints.push({ index: i, risk: values[i] + 1, basin: [] });
        }
        var size = 0;
        for (var lowpoint of lowPoints)
        {
            lowpoint.basin = computeLineSize(input, lowpoint.index, { down: true, up: true, left: true, right: true })
            // for (var i = lowpoint.index; i % input.stride !== 0; i--)
            // {
            //     if (i % input.stride !== 0 && values[i - 1] == 9)
            //         break;
            //     if ((i + 1) % input.stride !== 0 && values[i + 1] == 9)
            //         break;
            //     if (i >= input.stride && values[i - input.stride] == 9)
            //         break;
            //     if (i + input.stride <= values.length - 1 && values[i + input.stride] < 9)
            //         break;

            //     if (lowpoint.basin.indexOf(i) !== -1)
            //         lowpoint.basin.push(i);
            // }
        }
        lowPoints.sort((b, a) => a.basin.length - b.basin.length);
        // console.log(lowPoints);
        return lowPoints.slice(0, 3).reduce((prev, v) => prev * v.basin.length, 1);
    },

    sampleExpectedValue: 1134
}

export default day;