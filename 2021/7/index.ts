import { Day } from "../../aoc.contracts";

function countMoves(values: number[], target: number)
{
    return values.reduce((prev, value) => prev + consume(Math.abs(value - target)), 0);
}

function consume(steps: number)
{
    return steps * (steps + 1) / 2;
}

function max(values: number[])
{
    return values.reduce((prev, v) => v > prev ? v : prev, 0);
}

function min(values: number[])
{
    return values.reduce((prev, v) => v < prev ? v : prev, 99999999999999);
}

export const day: Day<any> = {
    parse(input): number[]
    {
        return input.split(',').map(Number);
    },
    compute(values: number[])
    {
        var maxValue = max(values);
        var result = [];
        for (let i = 0; i < maxValue; i++)
        {
            result[i] = countMoves(values, i);
        }
        // console.log(result);
        return min(result);
    },

    sampleExpectedValue: 168
}

export default day;