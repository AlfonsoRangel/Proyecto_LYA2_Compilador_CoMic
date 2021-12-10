
import { ItemProduccion } from './ItemProduccion.js'

export class Produccion
{
    constructor(    NOterminal = "" , secuencia = [ new ItemProduccion() ] , 
                    tipo = 0 , accionError = 0 , descripcion = "" , esReversible = true )
    {
        this.NO_terminal = NOterminal;
        this.secuencia = secuencia;
        this.tipo = tipo;   // ERROR o OK
        this.accionError = accionError;   // PERMANECER | QUITAR | VACIO
        this.descripcion = descripcion;
        this.esReversible = esReversible;
    }
 
    // VALORES PASABLES AL PARAMETRO "TIPO"
    static ERROR = 0;
    static OK = 1;

    // VALORES PASABLES AL PARAMETRO accionError
    static PERMANECER = 0;
    static QUITAR = 1;
    static VACIO = 2;

    getSecuencia()
    {
        let sec = "";
        for( let i=0; i<this.secuencia.length;  i++ )
        {
            let item = this.secuencia[i];
            if( item.tipo == ItemProduccion.TERMINAL )
            {
                sec = sec + " " + item.token;
            }
            else
            {
                sec = sec + " <" + item.token + ">";
            }
        }
        return sec;
    }
}

