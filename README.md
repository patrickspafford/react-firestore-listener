# React Firestore Listener

## Description

A simple React hook for listening to Firestore documents.

## Installation

- If it's not installed already, install Firebase (modular, v9).
- Then run `npm i --save react-firestore-listener`

## Configuration

### Props

| Prop        | Type                                              | Description                                                                                                                          | Required |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| collection  | string                                            | Name of the collection to listen to (if specified in options)                                                                        | Yes      |
| dataMapping | (data: Doc) => Doc or (data: Doc) => Promise<Doc> | Map the data from each document with your own function. Document id (as `docId`), metadata, and ref are included by default in data. | No       |
| refresh     | any[]                                             | List of variables that if one or more are changed would force the listener to look again at Firestore                                | No       |
| options     | See below                                         | Object of options that help with the Firestore query                                                                                 | No       |

### Options

| Key           | Type        | Description                                                    | Required |
| ------------- | ----------- | -------------------------------------------------------------- | -------- |
| conditions    | Condition[] | An array of condition objects that specify the Firestore query | Yes      |
| orderBy       | OrderBy[]   | An array of order-by "clauses" that order the query            | No       |
| limit         | number      | Limit the size of the documents returned by the query          | No       |
| enableLogging | boolean     | Should log package errors or warnings                          | No       |

### Condition

| Index | Name     | Type               | Description                                  | Required |
| ----- | -------- | ------------------ | -------------------------------------------- | -------- |
| 0     | field    | Firestore field    | The field that you are querying on           | Yes      |
| 1     | operator | Firestore operator | The operator acts on the field and value     | Yes      |
| 2     | value    | any                | The value that you are looking to query with | Yes      |

### OrderBy

| Key   | Type            | Description                             | Required |
| ----- | --------------- | --------------------------------------- | -------- |
| field | Firestore field | The field that you are ordering by      | Yes      |
| desc  | boolean         | Whether to sort ascending or descending | Yes      |

## Usage

```tsx
import React from "react"
import useFirestoreListener from "react-firestore-listener"
import { getApp, initializeApp } from "firebase/app"

const config = {
  // insert your Firebase config here
}

/*
We need to make sure that Firebase is initialized before we can listen to documents.
*/
if (!getApp()) {
  initializeApp(config)
}

interface Hobby {
  name: string
}

const App = () => {
  const hobbies = useFirestoreListener<Hobby>({ collection: "hobbies" })
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
    </div>
  )
}
```

<a href="https://www.buymeacoffee.com/patrickspafford" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
