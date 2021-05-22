import firebase from "firebase"
import { useEffect, useState } from "react"
import "firebase/storage"
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
    const docListener = cr.onSnapshot((snapshots) => {
      if (snapshots.empty) {
        setDocState([])
      } else {
        setDocState(
          snapshots.docs.map(
            (snapshot: firebase.firestore.QueryDocumentSnapshot) => {
              if (config.dataMapping) {
                return config.dataMapping({
                  ...snapshot.data(),
                  docId: snapshot.id,
                  ref: snapshot.ref,
                  metadata: snapshot.metadata,
                })
              }
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
  }, [])

  return docState
}

export default useFirestoreListener
