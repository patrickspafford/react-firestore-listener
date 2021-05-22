import firebase from "firebase"
import "firebase/firestore"

type Field = string | firebase.firestore.FieldPath
type Operator = firebase.firestore.WhereFilterOp

interface Condition {
  field: Field
  operator: Operator
  value: any
}

type OrderBy = {
  field: Field
  descending: boolean
}

interface IDoc {
  [key: string]: any
}

interface IConfig {
  collection: string
  dataMapping?(data: IDoc): IDoc
  options?: {
    isCollectionGroup?: boolean
    conditions: Condition[]
    orderBy?: OrderBy[]
    limit?: number
  }
}

export { IConfig, IDoc }
