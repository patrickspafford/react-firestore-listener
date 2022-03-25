import firebase from "firebase"
import "firebase/firestore"

type Field<T> = keyof T
type Operator = firebase.firestore.WhereFilterOp

/*
interface Condition {
  field: Field
  operator: Operator
  value: any
}
*/
type Condition<T> = [Field<T>, Operator, any]

type OrderBy<T> = {
  field: Field<T>
  descending: boolean
}

interface IDoc {
  ref: firebase.firestore.DocumentReference
  docId: string
  metadata: firebase.firestore.SnapshotMetadata
}

type ICustomDoc<T> = T & IDoc

type DocListener = undefined | (() => void)

interface IConfig<T> {
  collection: string
  dataMapping?:
    | ((data: ICustomDoc<T>) => ICustomDoc<T>)
    | ((data: ICustomDoc<T>) => Promise<ICustomDoc<T>>)
  refresh?: any[]
  options?: {
    isCollectionGroup?: boolean
    conditions: Condition<T>[]
    orderBy?: OrderBy<T>[]
    limit?: number
  }
}

export { IConfig, IDoc, ICustomDoc, Condition, DocListener }
