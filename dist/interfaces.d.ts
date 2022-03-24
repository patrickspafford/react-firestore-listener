import firebase from "firebase";
import "firebase/firestore";
declare type Field<T> = keyof T;
declare type Operator = firebase.firestore.WhereFilterOp;
declare type Condition<T> = [Field<T>, Operator, any];
declare type OrderBy<T> = {
    field: Field<T>;
    descending: boolean;
};
interface IDoc {
    ref: firebase.firestore.DocumentReference;
    docId: string;
    metadata: firebase.firestore.SnapshotMetadata;
}
declare type ICustomDoc<T> = {
    [k in keyof T]: unknown;
} & IDoc;
declare type DocListener = undefined | (() => void);
interface IConfig<T> {
    collection: string;
    dataMapping?: ((data: ICustomDoc<T>) => ICustomDoc<T>) | ((data: ICustomDoc<T>) => Promise<ICustomDoc<T>>);
    refresh?: any[];
    options?: {
        isCollectionGroup?: boolean;
        conditions: Condition<T>[];
        orderBy?: OrderBy<T>[];
        limit?: number;
    };
}
export { IConfig, IDoc, ICustomDoc, Condition, DocListener };
