import { ArbolDeExpresion } from "../ArbolDeExpresion.js";
import { ComponenteLexico } from "../ComponenteLexico.js";
import { ItemProduccion } from "../Sintactico/ItemProduccion.js";
import { ErrorSemantico } from "./ErrorSemantico.js";
import { SimboloFuncion } from "./SimboloFuncion.js";
import { SimboloPin } from "./SimboloPin.js";
import { SimboloVariable } from "./SimboloVariable.js";

export class DebugSemantico
{
    constructor( 
        entradaInicial = [ new ComponenteLexico() ] ,
        entradaFinal = [ new ComponenteLexico() ] , 
        pilaInicial = [ new ItemProduccion() ] ,
        pilaFinal = [ new ItemProduccion() ] , 
        movimiento = "" ,
        accion = "" 
    ) {
        this.entradaI = entradaInicial
        this.entradaF = entradaFinal
        this.pilaI = pilaInicial
        this.pilaF = pilaFinal
        this.tablaP = [ new SimboloPin() ]
        this.tablaV = [ new SimboloVariable() ]
        this.tablaF = [ new SimboloFuncion() ]
        this.movimiento = movimiento
        this.accion = accion
        this.mensajeError = new ErrorSemantico() 
        this.mostrarTS = false
        this.mostrarArbol = false
        this.arbol = new ArbolDeExpresion()
    }
}