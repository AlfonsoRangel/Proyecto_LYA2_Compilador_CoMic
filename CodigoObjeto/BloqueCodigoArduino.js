import { CodigoArduino } from "./CodigoArduino.js";
import { ItemArduino } from "./itemArduino.js";

export class BloqueCodigoArduino 
{
    constructor( bloque = "" , instruccionI = [ new ItemArduino() ] , instruccionF = [ new ItemArduino() ] )
    {
        this.bloque = bloque
        this.instruccionI = instruccionI
        this.instruccionF = instruccionF
        this.contenido = [ new CodigoArduino() ]
        this.contenido.pop()
    }
}