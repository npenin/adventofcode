import { Day } from "../../aoc.contracts";

export const day: Day<string> = {
    parse(input)
    {
        var value = input.split('').map(c => Number.parseInt(c, 16).toString(2).padStart(4, '0')).reduce((prev, c) => prev + c, '');

        return value;
    },
    compute(values)
    {
        var packet = parsePacket(values);
        // console.log(JSON.stringify(packet));
        return processPacket(packet);
        // return sumVersion(packet);
    },

    sampleExpectedValue: 3
}

function sumVersion(packet: Packet | LiteralPacket): number
{
    if (packet.type == 4)
        return packet.version;
    const compoPacket = packet as Packet;
    return compoPacket.packets.reduce((prev, v) => prev + sumVersion(v), compoPacket.version)
}


function processPacket(packet: Packet | LiteralPacket): number
{
    const compoPacket = packet as Packet;
    switch (packet.type)
    {
        case 0:
            return compoPacket.packets.reduce((prev, v) => prev + processPacket(v), 0);
        case 1:
            return compoPacket.packets.reduce((prev, v) => prev * processPacket(v), 1);
        case 2:
            return compoPacket.packets.reduce((prev, v) =>
            {
                const value = processPacket(v);
                return (prev < value) ? prev : value
            }, Infinity);
        case 3:
            return compoPacket.packets.reduce((prev, v) =>
            {
                const value = processPacket(v);
                return (prev > value) ? prev : value
            }, -Infinity);
        case 4:
            return (packet as LiteralPacket).value;
        case 5:
            return processPacket(compoPacket.packets[0]) > processPacket(compoPacket.packets[1]) ? 1 : 0;
        case 6:
            return processPacket(compoPacket.packets[0]) < processPacket(compoPacket.packets[1]) ? 1 : 0;
        case 7:
            return processPacket(compoPacket.packets[0]) == processPacket(compoPacket.packets[1]) ? 1 : 0;
        default:
            throw new Error(`Unsupported packet type: ${packet.type}`);
    }


}

type LiteralPacket = { version: number, type: 4, value: number, length: number }
type Packet = { version: number, type: number, packets: (Packet | LiteralPacket)[], length: number }

function parsePacket(values: string): LiteralPacket | Packet
{
    var version = Number.parseInt(values.substring(0, 3), 2);
    values = values.slice(3);
    var type = Number.parseInt(values.substring(0, 3), 2);
    values = values.slice(3);
    if (type == 4)
    {
        var value = ''
        var length = 6;
        while (values[0] == '1')
        {
            value += values.substring(1, 5);
            values = values.slice(5);
            length += 5
        }
        value += values.substring(1, 5);
        values = values.slice(5);
        length += 5
        // console.log(Number.parseInt(value, 2));
        return { version, type, value: Number.parseInt(value, 2), length };
    }
    else
    {
        var count: number;
        if (values[0] == '0')
        {
            const count = Number.parseInt(values.slice(1, 16), 2);
            values = values.slice(16, count + 16);
            var packets = [];
            var length = 0;
            while (count > length)
            {
                packets.push(parsePacket(values));
                values = values.slice(packets[packets.length - 1].length);
                length += packets[packets.length - 1].length;
            }

            return { version, type, packets, length: count + 6 + 16 };
        }
        else
        {
            count = Number.parseInt(values.slice(1, 12), 2);
            values = values.slice(12);
            var packets = [];
            for (var i = 0; i < count; i++)
            {
                packets.push(parsePacket(values));
                values = values.slice(packets[packets.length - 1].length);
            }
            return { version, type, packets, length: packets.reduce((prev, p) => prev + p.length, 6 + 12) };
        }
    }
}

export default day;