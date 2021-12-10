
export class ErrorSintactico
{
    constructor( lineaErronea = 0 , descripcion = "" , sugerencia = "" )
    {
        this.numeroLinea = lineaErronea;
        this.descripcion = descripcion;
        this.sugerencia = sugerencia;
    }

    /*getID()
    {
        let idSplit = this.id.split('_');
        return Number(idSplit[1]);
    }*/
}