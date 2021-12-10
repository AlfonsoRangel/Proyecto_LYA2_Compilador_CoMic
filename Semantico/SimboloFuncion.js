import { SimboloParametro } from "./SimboloParametro.js";

export class SimboloFuncion
{

    static ARDUINO = 1;
    static COMIC = 2;

    constructor( numeroLinea = 0 , nombre = "" , tipoRetorno = "" , origen = 0 )
    {
        this.numeroLinea = numeroLinea;
        this.nombre = nombre;
        this.tipoRetorno = tipoRetorno;
        this.origen = origen     // ARDUINO o COMIC
        this.parametros = [ new SimboloParametro() ];   this.parametros.pop();
    }


    clonar()
    {
        let sf = new SimboloFuncion()
        sf.numeroLinea = this.numeroLinea
        sf.nombre = this.nombre
        sf.tipoRetorno = this.tipoRetorno
        sf.origen = this.origen
        sf.parametros = this.parametros
        return sf
    }


    addParametro( nombre = "" , tipoDato = "" , min = 0 , max = 0 )
    {
        this.parametros.push( new SimboloParametro( nombre , tipoDato , min , max ) ); 
    }


    existeParametro( nombre = "" )
    {
        let busqueda = this.parametros.filter( sp => sp.nombre == nombre );
        if( busqueda.length == 0 ){ return false; }
        else{ return true; }
    }

    getParametros()
    {
        let p = "("
        for( let i=0;  i<this.parametros.length; i++ ) {
            p += this.parametros[i].tipoDato + " " + this.parametros[i].nombre + " , ";
        }
        if( p.length != 1 ){ p = p.substring(0 , p.length - 3) }
        p += ")"
        return p;
    }


    getTiposParametros()
    {
        let p = "(";
        for( let i=0;  i<this.parametros.length; i++ )
        {
            p += this.parametros[i].tipoDato + ","
        }
        if( p.charAt( p.length - 1 ) == "," ){ p = p.substring(0 , p.length-1) }
        p += ")"
        return p;
    }

}