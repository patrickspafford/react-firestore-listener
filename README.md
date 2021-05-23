# React Firestore Listener

## Installation

- If it's not installed already, run `npm install firebase`
- Then run `npm install --save react-firestore-listener`

Notes:

- Works just as well with React Native!

## Configuration

### Props

| Prop        | Type                 | Description                                                                                             | Required |
| ----------- | -------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| collection  | string               | Name of the collection or collection group to listen to (if specified in options)                       | Yes      |
| dataMapping | (data: IDoc) => IDoc | Filter the information kept from each document. Document id, metadata, and ref are included by default. | No       |
| refresh     | any[]                | List of variables that if one or more are changed would force the listener to look again at Firestore   | No       |
| options     | See below            | Object of options that help with the Firestore query                                                    | No       |

### Options

| Key               | Type        | Description                                                    | Required |
| ----------------- | ----------- | -------------------------------------------------------------- | -------- |
| isCollectionGroup | boolean     | Specify whether to listen to a collection group or collection  | No       |
| conditions        | Condition[] | An array of condition objects that specify the Firestore query | Yes      |
| orderBy           | OrderBy[]   | An array of order-by "clauses" that order the query            | No       |
| limit             | number      | Limit the size of the documents returned by the query          | No       |

### Condition

| Key      | Type               | Description                                  | Required |
| -------- | ------------------ | -------------------------------------------- | -------- |
| field    | Firestore field    | The field that you are querying on           | Yes      |
| operator | Firestore operator | The operator acts on the field and value     | Yes      |
| value    | any                | The value that you are looking to query with | Yes      |

### OrderBy

| Key   | Type            | Description                             | Required |
| ----- | --------------- | --------------------------------------- | -------- |
| field | Firestore field | The field that you are ordering by      | Yes      |
| desc  | boolean         | Whether to sort ascending or descending | Yes      |

## Usage

```javascript
import React from "react"
import useFirestoreListener from "react-firestore-listener"

const config = {
  // insert your Firebase config here
}

const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}

const App = () => {
  const hobbies = useFirestoreListener({ collection: "hobbies" })
  const sports = useFirestoreListener({
    collection: "hobbies",
    options: {
      conditions: [
        {
          field: "type",
          operator: "==",
          value: "sport",
        },
      ],
    },
  })

  return (
    <div>
      <h1>Welcome to my app</h1>
      <br />
      <div>My Hobbies</div>
      <ul>
        {hobbies.map((hobby) => {
          return <li>{hobby.name}</li>
        })}
      </ul>
      <div>The Sports I Play</div>
      <ul>
        {sports.map((sport) => {
          return <li>{sport.name}</li>
        })}
      </ul>
    </div>
  )
}
```
