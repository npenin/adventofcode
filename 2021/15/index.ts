import { Day } from "../../aoc.contracts";

export const day: Day<{ grid: number[], stride: number }> = {
    parse(input)
    {
        const lines = input.split('\n');
        return { grid: lines.map(l => l.split('').map(Number)).flat(), stride: lines[0].length };
    },
    compute(values)
    {
        var stride = values.stride;
        // const grid = values.grid;
        const originalTotalRows = values.grid.length / values.stride - 1;
        const grid = [];
        for (var y = 0; y < 5; y++)
            for (let yy = 0; yy <= originalTotalRows; yy++)
                for (var x = 0; x < 5; x++)
                {
                    grid.push(...values.grid.slice(yy * stride, yy * stride + stride).map(v => (v + x + y - 1) % 9 + 1))
                }
        stride = stride * 5;
        const totalRows = grid.length / stride - 1;
        // displayGrid({ values: grid, stride });
        var path = grid.map(() => -1);
        path[0] = 0;
        do
        {
            var changed = false;
            for (let i = 0; i < grid.length; i++)
            {
                const col = i % stride;
                const row = (i - col) / stride;
                if (col > 0) //left
                    if (path[i - 1] == -1 || path[i - 1] > path[i] + grid[i - 1])
                    {
                        path[i - 1] = path[i] + grid[i - 1];
                        changed = true;
                    }
                if (row > 0) //up
                    if (path[i - stride] == -1 || path[i - stride] > path[i] + grid[i - stride])
                    {
                        path[i - stride] = path[i] + grid[i - stride];
                        changed = true;
                    }
                if (col < stride - 1) //right
                    if (path[i + 1] == -1 || path[i + 1] > path[i] + grid[i + 1])
                    {
                        path[i + 1] = path[i] + grid[i + 1];
                        changed = true;
                    }
                if (row < totalRows) //down
                    if (path[i + stride] == -1 || path[i + stride] > path[i] + grid[i + stride])
                    {
                        path[i + stride] = path[i] + grid[i + stride];
                        changed = true;
                    }
            }
        }
        while (changed);
        displayGrid({ values: grid.slice((totalRows - 2) * stride), stride });

        return path[path.length - 1];
    },

    sampleExpectedValue: 315
}

function displayGrid(input: { values: number[]; stride: number; })
{
    for (var i = 0; i < input.values.length / input.stride; i++)
        console.log(input.values.slice(i * input.stride, (i + 1) * input.stride).join(','));
}

export default day;
