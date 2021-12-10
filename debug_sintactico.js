import { ComponenteLexico } from "./ComponenteLexico.js";
import { ErrorSintactico } from "./Sintactico/errorSintactico.js";
import { ItemProduccion } from "./Sintactico/ItemProduccion.js";

export class DebugSintactico
{
    constructor( 
        entradaInicial = [ new ComponenteLexico() ] ,
        entradaFinal = [ new ComponenteLexico() ] , 
        pilaInicial = [ new ItemProduccion() ] ,
        pilaFinal = [ new ItemProduccion() ] , 
        accion = "" , 
        mensajeError = new ErrorSintactico() 
    ) {
        this.entradaI = entradaInicial
        this.entradaF = entradaFinal
        this.pilaI = pilaInicial
        this.pilaF = pilaFinal
        this.accion = accion
        this.mensajeError = mensajeError
    }
}