
export class ErrorSemantico
{
    constructor( lineaErronea = 0 , descripcion = "" , sugerencia = "" )
    {
        this.numeroLinea = lineaErronea;
        this.descripcion = descripcion;
        this.sugerencia = sugerencia;
    }
}