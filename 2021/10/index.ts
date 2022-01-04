import { Day } from "../../aoc.contracts";

const score = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
}

export const day: Day<string[][]> = {
    parse(input)
    {
        return input.split('\n').map(v => v.split(''));
    },
    compute(values)
    {
        var map = values.map(values =>
        {
            var openings: { char: string, index: number }[] = [];

            if (values.reduce((isValid, v, j) =>
            {
                if (isValid > 0)
                    return isValid;
                // console.log(values.join(''));
                // console.log('^'.padStart(j + 1, ' '))
                switch (v)
                {
                    case ')':
                        if (openings[openings.length - 1].char != '(')
                            return score[v];

                        openings.pop();
                        return 0;
                    case ']':
                        if (openings[openings.length - 1].char != '[')
                            return score[v];

                        openings.pop();
                        return 0;
                    case '}':
                        if (openings[openings.length - 1].char != '{')
                            return score[v]

                        openings.pop();
                        return 0;
                    case '>':
                        if (openings[openings.length - 1].char != '<')
                            return score[v]
                        openings.pop();
                        return 0;
                    default:
                        openings.push({ char: v, index: j });
                        return 0
                }
            }, 0) == 0)
                return openings.reduceRight((prev, v) =>
                {
                    return prev * 5 + score[v.char as '{'];
                }, 0);
            return undefined;
        });

        map = (map.filter(v => v) as number[]).sort((a, b) => a - b);
        return map[(map.length - 1) / 2] as number;
    },

    sampleExpectedValue: 288957
}

export default day;