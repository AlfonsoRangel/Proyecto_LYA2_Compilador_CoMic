import { SimboloFuncion } from "../Semantico/SimboloFuncion.js"
import { ItemArduino } from "./itemArduino.js"

export class CodigoArduino {

    static OK = 1
    static OMITIR = 2

    constructor( clave = "" , ambito = 0 , bloque = "" , secuencia = [ new ItemArduino() ] , 
        funcion = new SimboloFuncion() , tipo = 0 , IDvariable = "" )
    {
        this.clave = clave
        this.ambito = ambito
        this.bloque = bloque
        this.secuencia = secuencia 
        this.funcion = funcion                // Funcion en la que se encuentra el codigo
        this.tipo = tipo                      // Tipo de Cuadruplo  ->  ejem: DECLARACION_NUEVA_CONSTANTE
        this.estatus = CodigoArduino.OK
        this.IDvariable = IDvariable
        if( true ){ this.contenido = null }
        else{ this.contenido = [ new CodigoArduino() ] }
    }


    clonar( ) 
    {
        let codA = new CodigoArduino()
        codA.clave = this.clave
        codA.ambito = this.ambito
        codA.bloque = this.bloque
        let itemsA = [ new ItemArduino() ]
        itemsA.pop()
        for(let i=0;  i<this.secuencia.length;  i++) {  itemsA.push( this.secuencia[i].clonar() )   }
        codA.secuencia = itemsA
        codA.funcion = this.funcion.clonar()
        codA.estatus = this.estatus
        codA.IDvariable = this.IDvariable
        codA.contenido = this.contenido
        codA.tipo = this.tipo
        return codA
    }




    addContenido( clave = "" , ambito = 0 , bloque = "" , secuencia = [ new ItemArduino() ] , 
        nombreFuncion = "" , tipo = 0)
    {
        //alert("aqii")
        if( this.contenido == null ) {
            this.contenido = [ new CodigoArduino(clave,ambito,bloque,secuencia,nombreFuncion,tipo) ]
            //alert( this.contenido[0].clave )
        }
        else {
            this.contenido.push( new CodigoArduino(clave,ambito,bloque,secuencia,nombreFuncion,tipo) )
        }
    }


    addContenido2( codigoArduino = new CodigoArduino() )
    {
        if( this.contenido == null ) {
            this.contenido = [ codigoArduino ]
        }
        else {
            this.contenido.push( codigoArduino )
        }
    }
}