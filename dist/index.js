"use strict";
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
                const { field, operator, value } = condition;
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
        const docListener = cr.onSnapshot((snapshots) => {
            if (snapshots.empty) {
                setDocState([]);
            }
            else {
                setDocState(snapshots.docs.map((snapshot) => {
                    if (config.dataMapping) {
                        return config.dataMapping(Object.assign(Object.assign({}, snapshot.data()), { docId: snapshot.id, ref: snapshot.ref, metadata: snapshot.metadata }));
                    }
                    return Object.assign(Object.assign({}, snapshot.data()), { docId: snapshot.id, ref: snapshot.ref, metadata: snapshot.metadata });
                }));
            }
        });
        return () => {
            docListener();
        };
    }, (_a = config.refresh) !== null && _a !== void 0 ? _a : []);
    return docState;
};
exports.default = useFirestoreListener;
