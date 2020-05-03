// TODO remove this type when extended-promise has been migrated to typescript
declare module "@braintree/extended-promise" {
  namespace ExtendedPromise {}
  class ExtendedPromise {
    then: Function;
    catch: Function;
    resolve: Function;
    reject: Function;
  }
  export = ExtendedPromise;
}
