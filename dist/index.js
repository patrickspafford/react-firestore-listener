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
const firebase_1 = require("firebase");
const react_1 = require("react");
const useFirestoreListener = (config) => {
    var _a;
    const [docState, setDocState] = react_1.useState([]);
    react_1.useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!firebase_1.default.apps.length)
            return;
        const firestore = firebase_1.default.firestore();
        // cr => collection reference
        let cr = !((_a = config.options) === null || _a === void 0 ? void 0 : _a.isCollectionGroup)
            ? firestore.collection(config.collection)
            : firestore.collectionGroup(config.collection);
        if ((_b = config.options) === null || _b === void 0 ? void 0 : _b.conditions) {
            (_c = config.options) === null || _c === void 0 ? void 0 : _c.conditions.forEach((condition) => {
                const [field, operator, value] = condition;
                cr = cr.where(field, operator, value);
            });
        }
        if ((_d = config.options) === null || _d === void 0 ? void 0 : _d.orderBy) {
            (_f = (_e = config.options) === null || _e === void 0 ? void 0 : _e.orderBy) === null || _f === void 0 ? void 0 : _f.forEach((order) => {
                const { field, descending } = order;
                cr = cr.orderBy(field, descending ? "desc" : "asc");
            });
        }
        if ((_g = config.options) === null || _g === void 0 ? void 0 : _g.limit) {
            cr = cr.limit((_h = config.options) === null || _h === void 0 ? void 0 : _h.limit);
        }
        const docListener = cr.onSnapshot((snapshots) => __awaiter(void 0, void 0, void 0, function* () {
            var e_1, _j;
            if (snapshots.empty) {
                setDocState([]);
            }
            else {
                if (config.dataMapping) {
                    const newDocs = [];
                    try {
                        for (var _k = __asyncValues(snapshots.docs), _l; _l = yield _k.next(), !_l.done;) {
                            const doc = _l.value;
                            const docData = Object.assign(Object.assign({}, doc.data()), { docId: doc.id, ref: doc.ref, metadata: doc.metadata });
                            const docMapped = yield config.dataMapping(docData);
                            newDocs.push(docMapped);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_l && !_l.done && (_j = _k.return)) yield _j.call(_k);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    setDocState(newDocs);
                    return;
                }
                setDocState(snapshots.docs.map((snapshot) => {
                    return Object.assign(Object.assign({}, snapshot.data()), { docId: snapshot.id, ref: snapshot.ref, metadata: snapshot.metadata });
                }));
            }
        }));
        return () => {
            docListener();
        };
    }, (_a = config.refresh) !== null && _a !== void 0 ? _a : []);
    return docState;
};
exports.default = useFirestoreListener;
