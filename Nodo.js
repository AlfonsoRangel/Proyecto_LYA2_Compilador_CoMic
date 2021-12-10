import { ComponenteLexico } from "./ComponenteLexico.js";

export class Nodo
{
    constructor( token = new ComponenteLexico() )
    {
        if( token == null ){  this.dato = null; }
        else{  this.dato = token;  }
        this.nodoIzq = null;    // TIPO NODO
        this.nodoDer = null;    // TIPO NODO
    }
}