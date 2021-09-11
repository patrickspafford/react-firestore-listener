import firebase from "firebase"
import { useEffect, useState } from "react"
import { IConfig, IDoc } from "./interfaces"

const useFirestoreListener = (config: IConfig) => {
  const [docState, setDocState] = useState<IDoc[]>([])

  useEffect(() => {
    if (!firebase.apps.length) return
    const firestore = firebase.firestore()
    // cr => collection reference
    let cr = !config.options?.isCollectionGroup
      ? firestore.collection(config.collection)
      : firestore.collectionGroup(config.collection)
    if (config.options?.conditions) {
      config.options?.conditions.forEach((condition) => {
        const { field, operator, value } = condition
        cr = cr.where(field, operator, value)
      })
    }
    if (config.options?.orderBy) {
      config.options?.orderBy?.forEach((order) => {
        const { field, descending } = order
        cr = cr.orderBy(field, descending ? "desc" : "asc")
      })
    }
    if (config.options?.limit) {
      cr = cr.limit(config.options?.limit)
    }
    const docListener = cr.onSnapshot(async (snapshots) => {
      if (snapshots.empty) {
        setDocState([])
      } else {
        if (config.dataMapping) {
          const newDocs: IDoc[] = []
          for await (const doc of snapshots.docs) {
            const docData = {
              ...doc.data(),
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
              return {
                ...snapshot.data(),
                docId: snapshot.id,
                ref: snapshot.ref,
                metadata: snapshot.metadata,
              }
            }
          )
        )
      }
    })
    return () => {
      docListener()
    }
  }, config.refresh ?? [])

  return docState
}

export default useFirestoreListener
