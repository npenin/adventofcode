import { Day } from "../../aoc.contracts";
import debug from 'debug';

debug.enable('aoc');
const log = debug('aoc');

export const day: Day<{ template: string, reactions: { [key: string]: string[] } }> = {
    parse(input)
    {
        const lines = input.split('\n');
        return {
            template: lines[0], reactions: Object.fromEntries(lines.slice(2).map(l =>
            {
                return [l.substring(0, 2), [l[0] + l[6], l[6] + l[1]]];
            }))
        }
    },
    compute(values)
    {
        var polymer = values.template;
        var pairs = getPairs(polymer);
        const groups = groupElements(pairs);
        for (let i = 0; i < pairs.length; i++)
        {
            const pair = pairs[i];
            groups[pair] = (groups[pair] || 0) + 1;
        }

        for (let step = 0; step < 40; step++)
        {
            log('step ' + (step + 1))
            const adds: typeof groups = {};
            Object.keys(groups).filter(v => v.length > 1 && groups[v] > 0).forEach(pair =>
            {
                const reaction = values.reactions[pair];
                if (reaction)
                {
                    adds[pair] = (adds[pair] || groups[pair]) - groups[pair];
                    adds[reaction[0]] = ((typeof adds[reaction[0]] == 'undefined' ? groups[reaction[0]] : adds[reaction[0]]) || 0) + groups[pair];
                    adds[reaction[1]] = ((typeof adds[reaction[1]] == 'undefined' ? groups[reaction[1]] : adds[reaction[1]]) || 0) + groups[pair];
                    adds[reaction[0][1]] = (adds[reaction[0][1]] || groups[reaction[0][1]] || 0) + groups[pair];
                    // if (adds[pair] === adds[reaction[0]] || adds[pair] !== adds[reaction[1]])
                    // else if (!adds[pair])
                    //     adds[pair] = groups[pair];
                }
            });
            Object.assign(groups, adds);
            // log(Object.fromEntries(Object.entries(groups).filter(v => v[1] > 0).sort((a, b) =>
            // {
            //     if (a[0] > b[0])
            //         return 1;
            //     if (a[0] < b[0])
            //         return -1;
            //     return 0;
            // })));

            // pairs = pairs.map(p => values.reactions[p] || [p]).flat();



            // for (let i = 0; i < pairs.length; i++)
            // {
            //     const pair = pairs[i];

            //     const reaction = reaction;
            //     if (reaction)
            //         reactingPair.push({ index: i, elementToAdd: reaction, pair, pairs: [pair[0] + reaction, reaction + pair[1]] });
            // }

            // log(`${reactingPair.length} replacements to perform`);


            // reactingPair.sort((a, b) => a.index - b.index);
            // log('sort1 completed')

            // var bulkReactingPairs: { index: number, elementToAdd?: string, pair: string, elementsToAdd: string[], length: number }[] = [];
            // var lastEqual = -1;
            // //optimize replacements
            // for (let i = 0; i < reactingPair.length; i++)
            // {
            //     const pair = reactingPair[i];
            //     if (i == reactingPair.length - 1 || pair.index != reactingPair[i + 1].index - 1)
            //     {
            //         if (lastEqual == -1)
            //             bulkReactingPairs.push({ ...pair, length: 1, elementsToAdd: [pair.pair[0] + pair.elementToAdd, pair.elementToAdd + pair.pair[1]] });
            //         else
            //             bulkReactingPairs.push({
            //                 index: reactingPair[lastEqual].index,
            //                 // elementToAdd: reactingPair.slice(lastEqual, i).reduce((prev, v) => prev + v.elementToAdd + v.pair[1], '') + pair.elementToAdd,
            //                 elementsToAdd: reactingPair.slice(lastEqual, i + 1).map(p => [p.pair[0] + p.elementToAdd, p.elementToAdd + p.pair[1]]).flat(),
            //                 pair: reactingPair[lastEqual].pair[0] + pair.pair[1],
            //                 length: i - lastEqual + 1
            //             });
            //         lastEqual = -1;
            //     }
            //     else if (lastEqual == -1)
            //         lastEqual = i
            // }

            // log(`${bulkReactingPairs.length} actual replacements to perform`);

            // if (bulkReactingPairs.length == 1)
            // {
            //     const rp = bulkReactingPairs[0];
            //     if (rp.index == 0 && rp.length == pairs.length)
            //         pairs = rp.elementsToAdd;
            //     else
            //         pairs = pairs.slice(0, rp.index).concat(rp.elementsToAdd, pairs.slice(rp.index + rp.length));

            // }
            // else
            //     throw new Error('unsupported');
            // for (let i = 0; i < bulkReactingPairs.sort((a, b) => b.index - a.index).length; i++)
            // {
            //     const rp = bulkReactingPairs[i];
            //     pairs = pairs.slice(0, rp.index).concat(rp.elementsToAdd, pairs.slice(rp.index + rp.length));
            //     // pairs.splice(rp.index, rp.elementToAdd.length, ...getPairs(rp.pair[0] + rp.elementToAdd + rp.pair[1]));
            // };

            // console.log(pairs.reduce((prev, v) => prev + v[1], pairs[0][0]));
        }


        const groupEntries = Object.entries(groups).filter(e => e[0].length == 1);
        log(Object.fromEntries(groupEntries))
        return groupEntries.reduce((prev, v) => (v[1] > prev) ? v[1] : prev, 0) - groupEntries.reduce((prev, v) => (v[1] < prev) ? v[1] : prev, 99999999999999999)
    },

    sampleExpectedValue: 2188189693529
}

function groupElements(values: string[])
{
    var group: { [key: string]: number } = {};
    for (let index = 0; index < values.length; index++)
    {
        if (typeof group[values[index][0]] == 'undefined')
            group[values[index][0]] = 1;
        else
            group[values[index][0]]++;
    }
    group[values[values.length - 1][1]] = (group[values[values.length - 1][1]] || 0) + 1;
    return group;
}

export default day;

function getPairs(polymer: string)
{
    var array = [];
    for (let index = 1; index < polymer.length; index++)
        array.push(polymer[index - 1] + polymer[index]);
    return array;
}
