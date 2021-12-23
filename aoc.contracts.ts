
export interface Day<T>
{
    parse(input: string): T

    compute(values: T): number;

    sampleExpectedValue: number;
}