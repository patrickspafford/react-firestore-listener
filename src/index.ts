import firebase from "firebase"
import { useEffect, useState } from "react"
import { IConfig, ICustomDoc, Condition, DocListener } from "./interfaces"

const useFirestoreListener = <T>(config: IConfig<T>) => {
  const [docState, setDocState] = useState<ICustomDoc<T>[]>([])

  useEffect(() => {
    if (!firebase.apps.length) return
    let docListener: DocListener
    try {
      const firestore = firebase.firestore()
      // cr => collection reference
      let cr = !config.options?.isCollectionGroup
        ? firestore.collection(config.collection)
        : firestore.collectionGroup(config.collection)
      if (config.options?.conditions) {
        config.options?.conditions.forEach((condition: Condition<T>) => {
          const [field, operator, value] = condition
          if (typeof field !== "number" && typeof field !== "symbol") {
            cr = cr.where(field, operator, value)
          } else throw new Error("Field must be a string.")
        })
      }
      if (config.options?.orderBy) {
        config.options?.orderBy?.forEach((order) => {
          const { field, descending } = order
          if (typeof field !== "number" && typeof field !== "symbol") {
            cr = cr.orderBy(field, descending ? "desc" : "asc")
          } else throw new Error("Field must be a string.")
        })
      }
      if (config.options?.limit) {
        cr = cr.limit(config.options?.limit)
      }
      docListener = cr.onSnapshot(async (snapshots) => {
        if (snapshots.empty) {
          setDocState([])
        } else {
          if (config.dataMapping) {
            const newDocs: ICustomDoc<T>[] = []
            for await (const doc of snapshots.docs) {
              const baseDocData: T = doc.data() as T
              const docData: ICustomDoc<T> = {
                ...baseDocData,
                docId: doc.id,
                ref: doc.ref,
                metadata: doc.metadata,
              }
              const docMapped = await config.dataMapping(docData)
              newDocs.push(docMapped)
            }
            setDocState(newDocs)
            return
          }
          setDocState(
            snapshots.docs.map(
              (snapshot: firebase.firestore.QueryDocumentSnapshot) => {
                const snapshotData: T = snapshot.data() as T
                return {
                  ...snapshotData,
                  docId: snapshot.id,
                  ref: snapshot.ref,
                  metadata: snapshot.metadata,
                }
              }
            )
          )
        }
      })
    } catch (err) {
      console.error(`useFirestoreListener error: ${err}`)
    }
    return () => {
      docListener?.()
    }
  }, config.refresh ?? [])

  return docState
}

export default useFirestoreListener
