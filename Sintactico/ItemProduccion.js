
export class ItemProduccion
{
    constructor( tipo = 0 , token = "" , lexema = "" , numeroLinea = 0 , accionSemantica = 0 , accionCodigo = 0 )
    {
        this.tipo = tipo;      // TERMINAL o NO_TERMINAL
        this.token = token;     // cuando es NO_TERMINAL aqui se coloca el nombre
        this.lexema = lexema;
        this.numeroLinea = numeroLinea;
        this.accionSemantica = accionSemantica;   // LOS VALORES ESTAN EN EL ARCHIVO Acciones.js
        this.accionCodigo = accionCodigo;  // LOS VALORES ESTAN EN EL ARCHIVO AccionesCodigo.js
    }
 
    static NO_TERMINAL = 0;
    static TERMINAL = 1;
}