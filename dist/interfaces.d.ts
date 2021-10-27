import firebase from "firebase";
import "firebase/firestore";
declare type Field = string | firebase.firestore.FieldPath;
declare type Operator = firebase.firestore.WhereFilterOp;
declare type Condition = [Field, Operator, any];
declare type OrderBy = {
    field: Field;
    descending: boolean;
};
interface IDoc {
    [key: string]: any;
    ref: firebase.firestore.DocumentReference;
    docId: string;
    metadata: firebase.firestore.SnapshotMetadata;
}
interface IConfig {
    collection: string;
    dataMapping?: ((data: IDoc) => IDoc) | ((data: IDoc) => Promise<IDoc>);
    refresh?: any[];
    options?: {
        isCollectionGroup?: boolean;
        conditions: Condition[];
        orderBy?: OrderBy[];
        limit?: number;
    };
}
export { IConfig, IDoc };
