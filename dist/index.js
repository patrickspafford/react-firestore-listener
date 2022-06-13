"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const firestore_1 = require("firebase/firestore");
const app_1 = require("firebase/app");
const useFirestoreListener = (config) => {
    var _a;
    const [docState, setDocState] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!app_1.getApp || !(0, app_1.getApp)()) {
            if ((_a = config.options) === null || _a === void 0 ? void 0 : _a.enableLogging)
                console.warn(`useFirestoreListener: A default app has not been initialized.`);
            return;
        }
        let docListener;
        try {
            const db = (0, firestore_1.getFirestore)();
            const queryConditions = [];
            (_b = config.options) === null || _b === void 0 ? void 0 : _b.conditions.forEach((condition) => {
                const [field, operator, value] = condition;
                if (typeof field === "string") {
                    queryConditions.push((0, firestore_1.where)(field, operator, value));
                }
                else
                    throw new Error("Field must be a string.");
            });
            // cr => collection reference
            (_d = (_c = config.options) === null || _c === void 0 ? void 0 : _c.orderBy) === null || _d === void 0 ? void 0 : _d.forEach((order) => {
                const { field, descending } = order;
                if (typeof field !== "number" && typeof field !== "symbol") {
                    queryConditions.push((0, firestore_1.orderBy)(field, descending ? "desc" : "asc"));
                }
                else
                    throw new Error("Field must be a string.");
            });
            if ((_e = config.options) === null || _e === void 0 ? void 0 : _e.limit) {
                queryConditions.push((0, firestore_1.limit)((_f = config.options) === null || _f === void 0 ? void 0 : _f.limit));
            }
            const cr = (0, firestore_1.query)((0, firestore_1.collection)(db, config.collection), ...queryConditions);
            docListener = (0, firestore_1.onSnapshot)(cr, (snapshots) => __awaiter(void 0, void 0, void 0, function* () {
                var e_1, _h;
                if (snapshots.empty) {
                    setDocState([]);
                    return;
                }
                if (config.dataMapping) {
                    const newDocs = [];
                    try {
                        for (var _j = __asyncValues(snapshots.docs), _k; _k = yield _j.next(), !_k.done;) {
                            const doc = _k.value;
                            const baseDocData = doc.data();
                            const docData = Object.assign(Object.assign({}, baseDocData), { docId: doc.id, ref: doc.ref, metadata: doc.metadata });
                            const docMapped = yield config.dataMapping(docData);
                            newDocs.push(docMapped);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_k && !_k.done && (_h = _j.return)) yield _h.call(_j);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    setDocState(newDocs);
                    return;
                }
                setDocState(snapshots.docs.map((snapshot) => {
                    const snapshotData = snapshot.data();
                    return Object.assign(Object.assign({}, snapshotData), { docId: snapshot.id, ref: snapshot.ref, metadata: snapshot.metadata });
                }));
            }), (err) => {
                var _a;
                if ((_a = config.options) === null || _a === void 0 ? void 0 : _a.enableLogging)
                    console.error(`useFirestoreListener: `, err);
            });
        }
        catch (err) {
            if ((_g = config.options) === null || _g === void 0 ? void 0 : _g.enableLogging)
                console.error(`useFirestoreListener error: `, err);
        }
        return () => {
            docListener === null || docListener === void 0 ? void 0 : docListener();
        };
    }, (_a = config.refresh) !== null && _a !== void 0 ? _a : []);
    return docState;
};
exports.default = useFirestoreListener;
