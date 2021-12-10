
export class SimboloPin
{
    static ENTRADA = 0;
    static SALIDA = 1;

    constructor( numeroLinea = 0 , nombre = "" , tipoPin = 0 , numeroPin = 0 )
    {
        this.numeroLinea = numeroLinea;
        this.nombre = nombre;
        this.tipoPin = tipoPin;   // ENTRADA o SALIDA
        this.numeroPin = numeroPin;
    }
}