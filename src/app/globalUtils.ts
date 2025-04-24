export function capitalize(value:string){
    const firstCharOfValue=value.charAt(0).toUpperCase();
    const remainCharsOfValue=value.slice(1).toLowerCase();
    return firstCharOfValue+remainCharsOfValue;
}