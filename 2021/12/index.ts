import { Day } from "../../aoc.contracts";

type X = { links: [left: string, right: string][], nodes: { [key: string]: boolean }, paths: { [key: string]: string[], start: string[], end: string[] } };

function walkPaths(map: X, node: string, path: string[], smallCave?: string): string[][]
{
    if (node == 'end')
        return [path];

    return map.paths[node].map(n =>
    {
        if (map.nodes[n])
        {
            if (!smallCave && n !== 'start' && n !== 'end' && path.indexOf(n) == -1)
                return walkPaths(map, n, path.concat(n), n).concat(walkPaths(map, n, path.concat(n), smallCave))
            if (path.indexOf(n) >= 0 && smallCave !== n || path.indexOf(n, path.indexOf(n) + 1) !== -1)
                return undefined;
        }

        return walkPaths(map, n, path.concat(n), smallCave);
    }).filter(path => path).flat(1) as string[][];
}

export const day: Day<X> = {
    parse(input)
    {
        var links = input.split('\n').map(v =>
        {
            const indexOfDash = v.indexOf('-');
            return [v.substring(0, indexOfDash), v.substring(indexOfDash + 1)] as [string, string]
        });
        var paths: { [key: string]: string[] } = {};
        links.forEach(l =>
        {
            paths[l[0]] = paths[l[0]] || [];
            paths[l[0]].push(l[1]);

            paths[l[1]] = paths[l[1]] || [];
            paths[l[1]].push(l[0]);
        })

        var nodes = Object.fromEntries(links.reduce((prev, l) => 
        {
            switch (l[1])
            {
                case 'start':
                case 'end':
                    break;
                default:
                    if (prev.indexOf(l[1]) == -1)
                        return prev + ',' + l[1]
            }
            return prev;
        }, '').split(',').filter(v => v).concat(['start', 'end']).map(n => [n, n.toLowerCase() == n]));
        return { links, nodes, paths: paths as any }
    },
    compute(values)
    {
        console.log(values);
        var currentPath: string[] = ['start'];
        var possiblePaths = walkPaths(values, 'start', currentPath);
        // console.log(possiblePaths);
        return possiblePaths.map(p => p.join(',')).reduce((prev, p, i, paths) =>
        {
            if (paths.slice(0, i).indexOf(p) == -1)
                return prev + 1;
            return prev;
        }, 0)
        return possiblePaths.length;

    },

    sampleExpectedValue: 3509
}

export default day;