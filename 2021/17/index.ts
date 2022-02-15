import { Day } from "../../aoc.contracts";

export const day: Day<{ x: [number, number], y: [number, number] }> = {
    parse(input)
    {
        var xrangeInput = input.match(/x=(-?\d+)\.\.(-?\d+)/);
        var yrangeInput = input.match(/y=(-?\d+)\.\.(-?\d+)/);
        if (!xrangeInput || !yrangeInput)
            throw new Error('Parse error');
        return { x: [Number(xrangeInput[1]), Number(xrangeInput[2])], y: [Number(yrangeInput[1]), Number(yrangeInput[2])] };
    },
    compute(values)
    {
        console.log(values);
        var target = [];
        for (var x = values.x[0]; x < values.x[1]; x++)
            for (var y = values.y[0]; y < values.y[1]; y++)
                target.push({ x, y });

        //a(x-b)2 + c
        var highestY = values.y[0];

        var probe = { x: 0, y: 0 };
        var velocities: { x: number, y: number, target: { x: number, y: number }, step: number }[] = [];
        for (var vely = Math.max(0, values.y[0]); vely < values.x[1]; vely++)
        {
            var stepsMax = Math.abs(values.x[1]);
            var stepsMinY = Math.abs(values.y[1]);
            var velMinX = Math.ceil((-1 + Math.sqrt(1 + 8 * values.x[0])) / 2);
            var minX = velMinX * (velMinX + 1) / 2
            if (minX > values.x[1])
                continue;
            var stepsMin = stepsMinY;

            for (var velx = velMinX; velx < stepsMax * Math.sign(values.x[1]); velx += Math.sign(values.x[1]))
            {
                probe = { x: 0, y: 0 };
                var velocity = { x: velx, y: vely };
                for (var step = 0; probe.x < values.x[1] && probe.y > values.y[0]; step++)
                {
                    probe.x += velocity.x;
                    probe.y += velocity.y;
                    if (velocity.x > 0)
                        velocity.x--;
                    else if (velocity.x < 0)
                        velocity.x++;
                    velocity.y--;
                    if (probe.x < values.x[0] && velocity.x == 0 || probe.x > values.x[1] && velocity.x == 0)
                        break;
                    if (probe.y < values.y[0] && Math.sign(values.y[0]) == -1)
                        break;
                    if (probe.x >= values.x[0] && probe.x <= values.x[1] && probe.y >= values.y[0] && probe.y <= values.y[1])
                    {
                        velocities.push({ x: velx, y: vely, target: probe, step });
                        break;
                    }
                }
            }
        }
        console.log(velocities);
        velocities.sort((a, b) => b.y - a.y)
        //part 1
        return velocities.filter(v => v.y == velocities[0].y).reduce((prev, v) =>
        {
            var highestY = 0;
            var velocity = Object.assign({}, v);
            var y = 0;
            for (var step = 0; step <= v.step; step++)
            {
                y += velocity.y;
                if (velocity.y < 0)
                    return highestY;
                if (highestY < y)
                    highestY = y;
                if (velocity.x > 0)
                    velocity.x--;
                else if (velocity.x < 0)
                    velocity.x++;
                velocity.y--;
            }
            return Math.max(prev, highestY);
        }, highestY)

        return 0;
    },

    sampleExpectedValue: 45
}

export default day;