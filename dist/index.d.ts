import { IConfig, ICustomDoc } from "./interfaces";
declare const useFirestoreListener: <T>(config: IConfig<T>) => ICustomDoc<T>[];
export default useFirestoreListener;
