"use strict";
exports.__esModule = true;
exports.prisma = void 0;
var client_1 = require("@prisma/client");
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
    var int = Number.parseInt(this.toString());
    return int !== null && int !== void 0 ? int : this.toString();
};
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: ['query']
    });
if (process.env.NODE_ENV !== 'production')
    global.prisma = exports.prisma;
// prisma.$on('query', (e: any) => {
//   console.log('Query: ' + e.query)
//   console.log('Params: ' + e.params)
//   console.log('Duration: ' + e.duration + 'ms')
// })
exports["default"] = exports.prisma;
