import { WhereFilterOp, DocumentReference, SnapshotMetadata } from "firebase/firestore";
declare type Field<T> = keyof T;
declare type Operator = WhereFilterOp;
declare type Condition<T> = [Field<T>, Operator, any];
declare type OrderBy<T> = {
    field: Field<T>;
    descending: boolean;
};
interface IDoc {
    ref: DocumentReference;
    docId: string;
    metadata: SnapshotMetadata;
}
declare type ICustomDoc<T> = T & IDoc;
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
