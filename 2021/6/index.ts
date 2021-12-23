import { Day } from "../../aoc.contracts";

export const day: Day<any> = {
    parse(input)
    {
        return input.split(',').map(Number);
    },
    compute(values: number[])
    {
        // console.log(values);
        var timers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var counts = timers.map((t) => values.reduce((prev, v) => prev + (t == v ? 1 : 0), 0));
        // console.log(`init: ${counts}`)
        for (let day = 0; day < 256; day++)
        {
            var toAdd = counts.shift() as number;
            counts[6] += toAdd;
            counts[8] = toAdd;
            // console.log(`${day}: ${counts}`)
        }
        return counts.reduce((prev, v) => v + prev, 0);
    },

    sampleExpectedValue: 5934
}

export default day;