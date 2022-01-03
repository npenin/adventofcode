import { Day } from "../../aoc.contracts";

export const day: Day<{ points: [number, number][], instructions: [number | undefined, number | undefined][] }> = {
    parse(input)
    {
        var lines = input.split('\n');
        for (var i = 0; i < lines.length; i++)
        {
            if (lines[i] == '')
                break;
        }
        return {
            points: lines.slice(0, i).map(l => l.split(',').map(Number) as [number, number]), instructions: lines.slice(i + 1).map(l =>
            {
                switch (l.substring(0, 'fold along x='.length))
                {
                    case 'fold along x=':
                        return [Number(l.substring('fold along x='.length)), undefined];
                    case 'fold along y=':
                        return [undefined, Number(l.substring('fold along x='.length))];
                    default:
                        throw new Error('instruction not supported: ' + l);
                }
            })
        }
    },
    compute(input)
    {
        var paper = input.points;
        // displayGrid(pointsToGrid(paper));

        for (let i = 0; i < input.instructions.length; i++)
        {
            const instruction = input.instructions[i];
            console.log('step ' + i + ': folding along ' + instruction);

            if (typeof instruction[0] != 'undefined')
                paper.forEach(p => p[0] > (instruction[0] as number) ? p[0] = (instruction[0] as number) + ((instruction[0] as number) - p[0]) : p[0]);
            else if (typeof instruction[1] != 'undefined')
                paper.forEach(p => p[1] > (instruction[1] as number) ? p[1] = (instruction[1] as number) + ((instruction[1] as number) - p[1]) : p[1]);
        }
        displayGrid(pointsToGrid(paper));

        return Object.keys(pointsToGrid(paper)).length;
    },

    sampleExpectedValue: 17
}

function pointsToGrid(points: [number, number][])
{
    return Object.fromEntries(points.map(p => [p[0] + ',' + p[1], '#']))
}

function parseCoordinates(s: string)
{
    var indexOfComma = s.indexOf(',');
    return { x: Number(s.substring(0, indexOfComma)), y: Number(s.substring(indexOfComma + 1)) }
}

function displayGrid(grid: { [key: string]: string })
{
    var maxSize = Object.keys(grid).reduce((prev, v) =>
    {
        var c = parseCoordinates(v);
        return { x: Math.max(c.x, prev.x), y: Math.max(c.y, prev.y) };
    }, { x: 0, y: 0 })

    for (var y = 0; y <= maxSize.y; y++)
    {
        var line = '';
        for (var x = 0; x <= maxSize.x; x++)
        {
            if (typeof (grid[x + ',' + y]) == 'undefined')
                line += ' ';
            else
                line += grid[x + ',' + y];
        }
        console.log(line);
    }
}

export default day;