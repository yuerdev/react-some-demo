import { useAccess } from '@querycap/access';
import { AxiosRequestConfig } from '@querycap/request';
import { RequestActor } from "@reactorx/request";
import { Dictionary, every, forEach, map } from 'lodash';
import { lazy, ReactNode, Suspense, useLayoutEffect, useRef, useState } from 'react';

interface Stringer {
    toString(): string
}

export interface ShouldRender {
    (permissions: Dictionary<boolean>): boolean
    ac?: Stringer;
}
export type ResolveShouldRender = () => Promise<ShouldRender>;

export interface ShouldEnterResolver {
    requestConfig?: () => AxiosRequestConfig;
    resolveShouldRender?: ResolveShouldRender;
}

const shoulderFromRequest = (request: RequestActor): ShouldRender => {
    const shoulderRender: ShouldRender = (permissions: Dictionary<boolean>) => {
        return permissions[request.name]
    }
    shoulderRender.ac = () => request.name;
    return shoulderRender;
}

const WithAc = (...requests: Array<ShouldEnterResolver>) => {
    const shoulders: ResolveShouldRender[] = [];
    forEach(requests, (request, index) => {
        if (!request) {
            throw new Error(`not action of  ${index}`);
        }
        if (request instanceof RequestActor) {
            shoulders.push(() => Promise.resolve(shoulderFromRequest(request)))
        } else if (request.resolveShouldRender) {
            shoulders.push(request.resolveShouldRender)
        }
    })
    const createShouldRender = (ac: string): Promise<ShouldRender> => {
        return Promise.all(map(shoulders, (call) => call())).then(renders => {
            const shoulderRender = (permissions: Dictionary<boolean>) => {
                return every(renders, (render: ShouldRender) => {
                    return render ? render(permissions) : true
                })
            }
            shoulderRender.ac = {
                toString: () => {
                    return ac
                }
            }
            return shoulderRender
        })

    }
    return function <TFn extends Function>(Component: TFn): TFn | null {

        const L = lazy(() =>
            createShouldRender("AccessControl").then((shouldRender) => {
                const ac = `@`;
                const AccessControl = ({ children }: { children: ReactNode }): JSX.Element | null => {
                    const { permissions } = useAccess();

                    return (
                        <>
                            <HTMLComment text={ac} />
                            {shouldRender(permissions || {}) && children}
                        </>
                    );
                };

                return {
                    default: AccessControl,
                };
            }),
        );

        const AC = (props: any) => {
            return (
                <Suspense fallback={<>获取权限...</>}>
                    <L>
                        <Component {...props} />
                    </L>
                </Suspense>
            );
        };

        AC.resolveShouldRender = createShouldRender;

        return AC as any as TFn;
    }
}

const HTMLComment = ({ text }: { text: string }) => {
    const [ready, SetReady] = useState<boolean>();
    const ref = useRef<HTMLSpanElement>(null)
    useLayoutEffect(() => {
        if (!ref) {
            return
        }
        const currentDom = ref.current;
        const parentDom = currentDom?.parentNode;
        if (!parentDom) {
            return
        }
        const desDom = document.createComment(text)
        try {
            parentDom.insertBefore(desDom, currentDom)
        } catch (err) {
            console.error(err)
        }
        SetReady(true)
        return () => {
            if (desDom) {
                try { desDom.remove(); } catch (err) {
                    console.error(err)
                }
            }
        }
    }, [])
    return <>{ready ? null : <span css={{ display: 'none' }} ref={ref}></span>}</>
}

export const allof = (...requests: Array<ShouldEnterResolver>) => WithAc(...requests) 