

export interface Iresponse<T = any, Z = any> {
    message?: boolean;
    data?: T;
    extra?: Z;
    status: number
}
