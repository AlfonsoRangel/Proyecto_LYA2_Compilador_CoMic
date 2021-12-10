import { ComponenteLexico } from "./ComponenteLexico.js"


export class DebugArbol
{
    constructor( 
        notacionPosfija = [ new ComponenteLexico() ] ,
        pilaInicial = [ new ComponenteLexico() ] ,
        pilaFinal = [ new ComponenteLexico() ] , 
        accionRealizada = ""
    ) {
        this.notacionPos = notacionPosfija;
        this.pilaI = pilaInicial
        this.pilaF = pilaFinal
        this.accionR = accionRealizada
    }
}