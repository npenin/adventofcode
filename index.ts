import { Day } from "./aoc.contracts";
import 'source-map-support'
import program, { buildCliContext, buildCliContextFromProcess } from '@akala/cli'
import { promises as fs, constants } from 'fs'
import path from "path";
import assert from "assert";

async function run(input: 'sample' | 'complete', dayPath: string)
{
    const dayFile: { default: Day<any> } = await import('./' + dayPath);
    const day = dayFile.default;
    var inputContent = await fs.readFile(path.join(dayPath, input + '.txt'), 'utf8');
    var result = day.compute(day.parse(inputContent));
    if (input == 'sample')
        assert.strictEqual(result, day.sampleExpectedValue)
    return result;
}

program.command<{ day: string }>('sample <day>').action(async context =>
{
    console.log(await run('sample', context.options.day));
})

program.command<{ day: string }>('complete <day>').action(async context =>
{
    console.log(await run('complete', context.options.day));
})
program.command<{ day: string }>('new <day>').action(async context =>
{
    var templatePath = path.dirname(require.resolve('./template/day'));
    var files = await fs.readdir(templatePath);
    await fs.mkdir(context.options.day, { recursive: true });
    for (const file of files)
    {
        try
        {
            await fs.copyFile(path.join(templatePath, file), path.join(context.options.day, file), constants.COPYFILE_EXCL);
        }
        catch (e: any)
        {
            if (e.code !== 'EEXIST')
                throw e;
        }
    }
})

program.command<{ year: number }>('init [year]').action(async context =>
{
    if (!context.options.year)
        context.options.year = new Date().getFullYear();
    await fs.mkdir('./' + context.options.year, { recursive: true });
    for (let i = 1; i < 25; i++)
    {
        await program.process(buildCliContext(context.logger, 'new', context.options.year + '/' + i));
    }
})


program.process(buildCliContextFromProcess());