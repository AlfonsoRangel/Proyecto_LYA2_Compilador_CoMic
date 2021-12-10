
export class SimboloParametro
{
    constructor( nombre = "" , tipoDato = "" , min = 0 , max = 0 )
    {
        this.nombre = nombre;
        this.tipoDato = tipoDato;
        this.max = max;  // PARA PARAMETRO ENTERO
        this.min = min;   // PARA PARAMETRO ENTERO
        this.valor = "";
        this.numeroLinea = 0;
    }
}