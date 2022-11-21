"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveImg = exports.changeStr = exports.removeDir = exports.makeDirFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const makeDirFile = async ({ dirLoc }) => {
    const fsMkdir = util_1.default.promisify(fs_1.default.mkdir);
    const dir = path_1.default.join(process.cwd(), dirLoc);
    if (!fs_1.default.existsSync(dir))
        await fsMkdir(dir, { recursive: true }).catch((err) => {
            throw new Error("Failed make directory");
        });
    return { pictureDir: dirLoc };
};
exports.makeDirFile = makeDirFile;
const removeDir = async (pictureDir) => {
    const fsRmdir = util_1.default.promisify(fs_1.default.rm);
    const dir = path_1.default.join(process.cwd(), pictureDir);
    if (fs_1.default.existsSync(dir))
        await fsRmdir(dir, { recursive: true });
};
exports.removeDir = removeDir;
const changeStr = (str) => str.replace(/([^a-z0-9 ]+)/gi, "-").replace(/\s/g, "-");
exports.changeStr = changeStr;
const saveImg = async ({ file, pictureDir }) => {
    var _a, e_1, _b, _c;
    const { filename, mimetype, encoding, createReadStream } = await file;
    //validate file type
    if (!["image/png", "image/jpeg"].includes(mimetype))
        throw new Error("File type not valid");
    //invoke readstream
    const stream = createReadStream();
    let { ext, name } = path_1.default.parse(filename);
    name = (0, exports.changeStr)(name);
    const pathFile = path_1.default.join(process.cwd(), `${pictureDir}${new Date().getTime()}_${name}${ext}`);
    //write every stream buffer that comes
    const writeStream = fs_1.default.createWriteStream(pathFile);
    stream.pipe(writeStream);
    //validate stream size
    let byteLength = 0;
    try {
        for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = await stream_1.next(), _a = stream_1_1.done, !_a;) {
            _c = stream_1_1.value;
            _d = false;
            try {
                const chunk = _c;
                byteLength += chunk.byteLength;
                if (byteLength > 2000000) {
                    fs_1.default.unlink(pathFile, (err) => {
                        if (err)
                            throw err;
                    });
                    throw new Error("File truncated as it exceeds the size limit");
                }
            }
            finally {
                _d = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = stream_1.return)) await _b.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { pathFile };
};
exports.saveImg = saveImg;
