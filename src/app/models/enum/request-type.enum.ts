export enum REQUESTTYPE{
    GET = 'get',
    POST = 'post'
}
export type ResponseData<T> = {
    success:boolean,
    message:string,
    data:T
}