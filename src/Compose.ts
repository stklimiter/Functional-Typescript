export type Fn<T, K> = (value: T) => K

export const identity = <T>(value: T) => value

type ComposeArgs<T extends any[], From = any> = T extends [Fn<From, infer To>] ? T :
    T extends [Fn<From, infer To>, ...infer Rest] ?
        [Fn<From, To>, ...ComposeArgs<Rest, To>]
        : never;

type ComposeResult<T extends any[]> =
    T extends [Fn<infer From, any>, ...infer Rest, Fn<any, infer To>] ?
        Fn<From, To> : never

export const compose = <A, B, C>(first: Fn<A, B>, second: Fn<B, C>) : Fn<A, C>  =>  (value: A) => second(first(value))


// type Arguments = Parameters<any>

/**
 * Obtain the parameters of a function type in a tuple
 */
// type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
//
//
// type ParameterDn<T extends (...args: any) => any> = T extends (...args: infer P) => any ?
//
//     P extends [Fn<infer From, infer To>, ...infer L] ?
//         L extends [Fn<To, infer To2>] ?
//             (...args: P) => Fn<From, To2>
//             : never
//         : never
//     : never;
//
//
// type ComposeFnType<T extends []> =  (...args: any) => any extends (...args: infer A) => infer Result ?
//     A extends [Fn<infer From, infer To>, ...infer L] ?
//         Result extends ()
//         : never
//     : never
//
// const compose2: ParameterDn<any> = <A,B>(...ar: []): Fn<A, B> => {}
//
// function composeFn<From, To>(...a: ComposeType<From, To>) {
//
//
//     const sn: Fn<string, number> = a => 2
//     const nn: Fn<number, number> = a => a
//     composeFn(sn, nn)
//     compose2(sn, nn)
// }
//
// export const compose = <A, B, C, D, E>(ab: Fn<A, B>, bc: Fn<B, C>, de: Fn<D, E> = ((a: D) => E)) =>


// type ComposeType2<func extends Fn<any, any>[], counter extends [...any[]], firstA, previousOutput> =
//     counter["length"] extends func["length"] ?
//         (func: func) => (from: firstA) => previousOutput :
//         ReturnType<func[counter["length"]]> extends previousOutput ?
//             ComposeType2<func, [any, ...counter], firstA, Parameters<func[counter["length"]]>[0]>
//             : never


// type ComposableFnList<Previous, FnList extends Fn<any, any>[], Counter extends [...any[]]> =
//     Counter["length"] extends FnList["length"] ? FnList :
//         ReturnType<FnList[Counter["length"]]> extends Previous ?
//             ComposableFnList<Parameters<FnList[Counter["length"]]>[0], FnList, [any, ...Counter]>
//             : never


// type ComposableFnFirst<FnList extends Fn<any, any>[]> = ComposableFnList<ReturnType<FnList[0]>[0], FnList, [any]>
//
// type ToCompose<From, To> = [] extends [Fn<From, To>] | [Fn<From, infer To2>, ...Composable<To2, To>] ?
// type Composable = [] extends [Fn<infer L, infer K>] ? [Fn<L, K>] : never

// type Head<T extends any[]> =
//     T extends [infer H, ...infer _]
//         ? H
//         : never;

// type Last<T extends any[]> =
//     T extends [infer _]
//         ? never : T extends [...infer _, infer Tl]
//             ? Tl
//             : never;
//
// type Compose<T, From = any> =
//     T extends [Fn<infer From1, infer To>, ...infer Rest]
//         ? From1 extends From ?
//             Rest["length"] extends 0 ?
//                 T : [Fn< From1,  To>, ...Compose<Rest, To>]
//             : never
//         : [];

