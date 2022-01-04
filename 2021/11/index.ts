import { Day } from "../../aoc.contracts";

export const day: Day<{ values: number[], stride: number }> = {
    parse(input)
    {
        var lines = input.split('\n');
        return {
            values: lines.map(v => v.split('').map(Number)).flat(), stride: lines[0].length
        };
    },
    compute(input)
    {
        var values = input.values;
        var flashes = 0;
        const totalRows = values.length / input.stride;
        for (var step = 0; step < 10000; step++)
        {
            // if (step < 10 || step % 10 == 0 || step > 190)
            // {
            //     console.log(step);
            //     displayGrid({ values, stride: input.stride });
            // }
            values = values.map(v => ++v);
            var flash: number[] = values.map((v, i) => v == 10 ? i : undefined).filter(v => typeof v != 'undefined') as number[];
            var flashesInStep = 0;
            while (flash.length)
            {
                var newflash = [];
                // if (flash.length == values.length)
                // {
                //     console.log(step);
                //     displayGrid({ values, stride: input.stride });
                //     return step;
                // }
                // console.log(`${flash.length} substep-flashes`)
                // displayGrid({ values, stride: input.stride });
                flashesInStep += flash.length;
                for (var j = 0; j < flash.length; j++)
                {
                    const i = flash[j];
                    values[i]++;

                    let row = Math.floor(i / input.stride);
                    let col = i % input.stride;
                    if (col - 1 >= 0) //left
                    {
                        values[i - 1]++;
                        if (values[i - 1] == 10)
                            newflash.push(i - 1);
                    }
                    if (col + 1 < input.stride) //right
                    {
                        values[i + 1]++;
                        if (values[i + 1] == 10)
                            newflash.push(i + 1);
                    }
                    if (row > 0) //top
                    {
                        values[i - input.stride]++;
                        if (values[i - input.stride] == 10)
                            newflash.push(i - input.stride);
                    }
                    if (row + 1 < totalRows) //bottom
                    {
                        values[i + input.stride]++;
                        if (values[i + input.stride] == 10)
                            newflash.push(i + input.stride);
                    }
                    if (row > 0 && col > 0) //top left
                    {
                        values[i - input.stride - 1]++;
                        if (values[i - input.stride - 1] == 10)
                            newflash.push(i - input.stride - 1);

                    }
                    if (row > 0 && col + 1 < input.stride) //top right
                    {
                        values[i - input.stride + 1]++;
                        if (values[i - input.stride + 1] == 10)
                            newflash.push(i - input.stride + 1);

                    }
                    if (col > 0 && row + 1 < totalRows) //bottom left
                    {
                        values[i + input.stride - 1]++;
                        if (values[i + input.stride - 1] == 10)
                            newflash.push(i + input.stride - 1);

                    }
                    if (col + 1 < input.stride && row + 1 < totalRows) //bottom right
                    {
                        values[i + input.stride + 1]++;
                        if (values[i + input.stride + 1] == 10)
                            newflash.push(i + input.stride + 1);

                    }
                }
                flash = newflash;
            }

            flashes += flashesInStep;
            // console.log(`${flashesInStep} flashes`)

            values = values.map(v => (v > 9) ? 0 : v);
            if (values.filter(v => v === 0).length == values.length)
                return step + 1;
        }
        return 0;
    },

    sampleExpectedValue: 195
}

export default day;

function displayGrid(input: { values: number[]; stride: number; })
{
    for (var i = 0; i < input.values.length / input.stride; i++)
        console.log(input.values.slice(i * input.stride, (i + 1) * input.stride).join(''));
}
