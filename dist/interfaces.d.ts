import firebase from "firebase";
import "firebase/firestore";
declare type Field = string | firebase.firestore.FieldPath;
declare type Operator = firebase.firestore.WhereFilterOp;
interface Condition {
    field: Field;
    operator: Operator;
    value: any;
}
declare type OrderBy = {
    field: Field;
    descending: boolean;
};
interface IDoc {
    [key: string]: any;
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
