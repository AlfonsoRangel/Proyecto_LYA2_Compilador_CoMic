import { ComponenteLexico } from "../ComponenteLexico.js";

export class SimboloVariable
{
    constructor( numeroLinea = 0 , nombre = "" , tipoDato = "" )
    {
        this.numeroLinea = numeroLinea;
        this.nombre = nombre;
        this.tipoDato = tipoDato;
        this.valor = [ new ComponenteLexico() ];    this.valor.pop();
        this.listaAmbitos = [ 0 ];    this.listaAmbitos.pop();
    }

    getValor( )
    {
        let valor = "";
        for( let i=0;  i<this.valor.length; i++ )
        {
            valor = valor + " " + this.valor[i].lexema;
        }
        return valor;
    }

    getAmbito( )
    {
        let ambito = "";
        for( let i=0;  i<this.listaAmbitos.length; i++ )
        {
            ambito = ambito + " > " + this.listaAmbitos[i];
        }
        return ambito;
    }

    getUltimoAmbito(){
        return this.listaAmbitos[ this.listaAmbitos.length - 1 ]
    }
}