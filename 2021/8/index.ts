import assert from "assert";
import { Day } from "../../aoc.contracts";

enum Segments
{
    top
    , topLeft = 2
    , topRight = 4
    , middle = 8
    , bottomLeft = 16
    , bottomRight = 32
    , bottom = 64
}

type SegmentMapping = { [key in Segments]: string };

const standardMapping: SegmentMapping = {
    [Segments.top]: 'a'
    , [Segments.topLeft]: 'b'
    , [Segments.topRight]: 'c'
    , [Segments.middle]: 'd'
    , [Segments.bottomLeft]: 'e'
    , [Segments.bottomRight]: 'f'
    , [Segments.bottom]: 'g'
}

function getSegments(v: string, mapping: SegmentMapping)
{
    return v.split('').map(s => Number((Object.keys(mapping) as unknown as Segments[]).find(sm => mapping[sm] == s)) as Segments);
}

const numbers = [
    getSegments('abcefg', standardMapping),
    getSegments('cf', standardMapping),
    getSegments('acdeg', standardMapping),
    getSegments('acdfg', standardMapping),
    getSegments('bcdf', standardMapping),
    getSegments('abdfg', standardMapping),
    getSegments('abdefg', standardMapping),
    getSegments('acf', standardMapping),
    getSegments('abcdefg', standardMapping),
    getSegments('abcdfg', standardMapping)]

function removeMappedSegments(v: string, segments: Segments[], mapping: SegmentMapping)
{
    return v.replace(new RegExp('[' + segments.map(s => mapping[s]).join('') + ']', 'g'), '');
}

function removeSegments(v: string, segments: string)
{
    return v.replace(new RegExp('[' + segments + ']', 'g'), '');
}

function display(mapping: SegmentMapping)
{
    console.log(` ${mapping[Segments.top]}${mapping[Segments.top]}${mapping[Segments.top]}${mapping[Segments.top]} `);
    console.log(`${mapping[Segments.topLeft]}    ${mapping[Segments.topRight]}`);
    console.log(`${mapping[Segments.topLeft]}    ${mapping[Segments.topRight]}`);
    console.log(`${mapping[Segments.topLeft]}    ${mapping[Segments.topRight]}`);
    console.log(`${mapping[Segments.topLeft]}    ${mapping[Segments.topRight]}`);
    console.log(` ${mapping[Segments.middle]}${mapping[Segments.middle]}${mapping[Segments.middle]}${mapping[Segments.middle]} `);
    console.log(`${mapping[Segments.bottomLeft]}    ${mapping[Segments.bottomRight]}`);
    console.log(`${mapping[Segments.bottomLeft]}    ${mapping[Segments.bottomRight]}`);
    console.log(`${mapping[Segments.bottomLeft]}    ${mapping[Segments.bottomRight]}`);
    console.log(`${mapping[Segments.bottomLeft]}    ${mapping[Segments.bottomRight]}`);
    console.log(` ${mapping[Segments.bottom]}${mapping[Segments.bottom]}${mapping[Segments.bottom]}${mapping[Segments.bottom]}  `);
}

function getNumber(v: string, mapping: SegmentMapping)
{
    switch (v.length)
    {
        case 2:
            return 1;
        case 3:
            return 7;
        case 4:
            return 4;
        case 7:
            return 8;
    }
    for (var i = 0; i < numbers.length; i++)
    {
        if (getSegments(v, mapping).reduce((prev, v) => prev + v, 0) == numbers[i].reduce((prev, v) => prev + v, 0))
            return i;
    }
    return -1;
}

function guessSegments(values: string[]): SegmentMapping
{
    values = values.map(v => v.split('').sort((a, b) => b.charCodeAt(0) - a.charCodeAt(0)).join(''));
    var numbers: string[] = new Array(10);
    numbers[1] = values.find(v => v.length == 2) as string;
    numbers[4] = values.find(v => v.length == 4) as string;
    numbers[7] = values.find(v => v.length == 3) as string;
    numbers[8] = values.find(v => v.length == 7) as string;
    var segments: Partial<SegmentMapping> = {};
    segments[Segments.top] = removeSegments(numbers[7], numbers[1]);

    numbers[9] = values.filter(v => v.length == 6).find(v => removeSegments(removeSegments(v, numbers[7]), numbers[4]).length == 1) as string;
    segments[Segments.bottom] = removeSegments(removeSegments(numbers[9], numbers[7]), numbers[4]) as string;
    numbers[3] = values.filter(v => v.length == 5).find(v => v.length - removeSegments(v, numbers[1]).length == 2) as string;
    segments[Segments.topLeft] = removeSegments(numbers[9], numbers[3]);

    numbers[5] = values.filter(v => v.length == 5 && v !== numbers[3]).find(v => v.length - removeSegments(v, segments[Segments.topLeft] as string).length == 1) as string;
    numbers[2] = values.find(v => v.length == 5 && v !== numbers[3] && v !== numbers[5]) as string;

    segments[Segments.topRight] = removeSegments(numbers[3], numbers[5]);
    segments[Segments.bottomLeft] = removeSegments(numbers[2], numbers[3]);
    segments[Segments.bottomRight] = removeSegments(numbers[1], numbers[2]);
    numbers[6] = removeSegments(numbers[8], segments[Segments.topRight] as string);
    numbers[0] = values.filter(v => v.length == 6).find(v => v != numbers[9] && v != numbers[6]) as string;
    segments[Segments.middle] = removeSegments(numbers[8], numbers[0]);

    Object.keys(segments).forEach(s => assert.strictEqual(segments[Number(s) as Segments]?.length, 1, `${Segments[Number(s)]} is not properly defined: ${segments[Number(s) as Segments]}`));
    return segments as any;
}

export const day: Day<{ digits: string[], numbers: string[] }[]> = {
    parse(input)
    {
        return input.split('\n').map(l => l.split(' | ')).map(l => ({ digits: l[0].split(' '), numbers: l[1].split(' ') }));
    },
    compute(values)
    {
        return values.reduce((prev, v, i) =>
        {
            // console.log(i);
            var mapping = guessSegments(v.digits);
            // display(mapping);
            // var reverseMapping = Object.fromEntries(Object.keys(mapping).map(k => [mapping[k as unknown as Segments] as unknown as string, Number(k)]))
            var ns = v.numbers.map(n =>
            {
                return getNumber(n, mapping)
            });
            var res = ns.reduce((prev, v, i) => prev + v * Math.pow(10, ns.length - i - 1), 0);
            // console.log(res);
            return prev + res;
        }, 0);
    },

    sampleExpectedValue: 61229
}

export default day;