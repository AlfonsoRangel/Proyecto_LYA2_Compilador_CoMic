 
import { ComponenteLexico } from '../ComponenteLexico.js';
import { SimboloFuncion } from '../Semantico/SimboloFuncion.js';
import { Gramatica } from '../Sintactico/Gramatica.js';
import { ItemProduccion } from '../Sintactico/ItemProduccion.js';
import { Produccion } from '../Sintactico/Produccion.js';
import { AccionCodigo } from './AccionesCodigo.js';
import { ResultadoCuadruplo } from './ResultadoCuadruplo.js';


export class CodigoIntermedio {

    static ITERACION_OK = 1;
    static FIN_ANALISIS = 2;
    static ERROR_ANALISIS = 3;

    constructor()
    {
        //______________________________________________
        // PROPIEDADES
        //______________________________________________
        this.pila = [ new ItemProduccion() ];   
        this.entrada = [ new ComponenteLexico() ];   
        this.prod_aplicadas = [ new Produccion() ];   
        this.indices_prod_aplicadas = [ 0 ];   
        this.accion = new AccionCodigo();
        this.tokenEntrada = new ComponenteLexico();
        this.tokensFuncionesCOMIC = [ new ComponenteLexico() ]
        this.funcionesCOMIC_agregadas = false
        this.tablaFunciones = [
            new SimboloFuncion( 0 , "Apagar" , "Nada" , SimboloFuncion.ARDUINO ) ,
            new SimboloFuncion( 0 , "Avanzar" , "Nada" , SimboloFuncion.COMIC ) ,
            new SimboloFuncion( 0 , "Encender" , "Nada" , SimboloFuncion.ARDUINO ) ,
            new SimboloFuncion( 0 , "GirarIzquierda" , "Nada" , SimboloFuncion.COMIC ) ,
            new SimboloFuncion( 0 , "GirarDerecha" , "Nada" , SimboloFuncion.COMIC ) ,
            new SimboloFuncion( 0 , "Retroceder" , "Nada" , SimboloFuncion.COMIC ) ,
            new SimboloFuncion( 0 , "Leer" , "Pin" , SimboloFuncion.ARDUINO ) 
        ]
    }


    inicializar( entradaTokens = [ new ComponenteLexico() ] ,
        tokensFuncionesCOMIC = [ new ComponenteLexico() ] )
    {
        this.limpiarArreglo( this.pila );
        this.entrada = entradaTokens;
        this.tokensFuncionesCOMIC = tokensFuncionesCOMIC
        this.limpiarArreglo( this.prod_aplicadas );
        this.limpiarArreglo( this.indices_prod_aplicadas );
        this.pila.push( new ItemProduccion( ItemProduccion.NO_TERMINAL , "s" , "" ) );
        this.accion.inicializar();
        this.tokenEntrada = null
        ResultadoCuadruplo.limpiarContadores()
        this.funcionesCOMIC_agregadas = false
    }




    
    // GENERAR CODIGO INTERMEDIO NO OPTIMIZADO
    generarCodigo( )
    {
        // VERIFICAR SI LA ENTRADA DE TOKENS ES VACIA
        if( this.entrada.length == 0 ) 
        { 
            if( this.pila.length != 0 ) 
            {  
                alert( "(corregir fases) PILA NO VACIA EN GENERACION DE CODIGO" ); 
                return CodigoIntermedio.ERROR_ANALISIS; 
            }
            return CodigoIntermedio.FIN_ANALISIS; 
        }

        // CUANDO LA PILA ESTA VACIO PERO LA ENTRADA NO (fuera de la estrcutura)
        if( this.pila.length == 0 )
        { 
            if( this.entrada.length != 0 ) { alert( "(corregir fases) PILA VACIA EN GENERACION DE CODIGO" ); }
            return CodigoIntermedio.ERROR_ANALISIS; 
        }

        let tokenActual = this.entrada[0];
        this.tokenEntrada = tokenActual;
        let sigToken = new ComponenteLexico();
        if( this.entrada.length > 1 ) { sigToken = this.entrada[1]; }
        else{ this.sigToken = null; }

        let tope = this.pila.length-1;
        let itemTope = this.pila[tope];


        // EVALUAR SI LO QUE ESTA EN EL TOPE DE LA PILA ES TERMINAL o NO TERMINAL
        if( itemTope.tipo == ItemProduccion.NO_TERMINAL )
        {
            // SE AGREGAN LOS TOKENS DE LAS FUNCIONES PREDETERMINADAS A LA ENTRADA
            if( itemTope.token == "funcion" && this.funcionesCOMIC_agregadas == false )
            {
                for( let w=this.tokensFuncionesCOMIC.length-1;  w>=0;  w-- )
                {
                    this.entrada.unshift( this.tokensFuncionesCOMIC[w] )
                }
                this.funcionesCOMIC_agregadas = true
                return CodigoIntermedio.ITERACION_OK
            }
            return this.evaluarNOterminal( itemTope.token , tokenActual , sigToken , tope );
        }
        else
        {
            if( tokenActual.token == itemTope.token )
            {
                this.entrada.shift();
                this.pila.pop();
                tope--
                if( tope < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                {
                    this.indices_prod_aplicadas.pop();
                    this.prod_aplicadas.pop();
                }
                this.accion.ejecutar( itemTope.accionCodigo , tokenActual , [] , this.tablaFunciones );
                return CodigoIntermedio.ITERACION_OK;
            }
            else
            {
                alert( tokenActual.token + "\n" + itemTope.token )
                alert( "(corregir fases) LOS TERMINALES NO COINCIDEN EN GENERACION DE CODIGO" );
                return CodigoIntermedio.ERROR_ANALISIS; ;
            }
        }
    }




    //______________________________
    // METODO QUE DETERMINA QUE HACER
    // CUANDO EL TOPE DE LA PILA ES NO-TERMINAL
    //______________________________
    evaluarNOterminal( noTerminal = "" , tokenActual = new ComponenteLexico() , 
                    sigToken = new ComponenteLexico() , tope = -1 )
    {
        // CUANDO EXISTEN 2 TOKENS EN LA ENTRADA
        if( sigToken.token != "" )
        {
            // BUSCAR UNA PRODUCCION QUE EMPIECE CON AMBOS TOKENS
            let prods = Gramatica.G.filter( prod => 
                prod.NO_terminal == noTerminal &&
                prod.secuencia.length > 1
            );
            for( let i=0;  i<prods.length;  i++ )
            {
                let secuencia = prods[i].secuencia;
                let item2 = [new ItemProduccion()];    item2.pop();
                if( secuencia[1].tipo == ItemProduccion.TERMINAL ){ item2.push(secuencia[1] ); }
                else{ item2 = this.getPrimerTerminal( noTerminal ); }

                for(let k=0;  k<item2.length;  k++)
                {
                    if( tokenActual.token == secuencia[0].token &&
                        sigToken.token == item2[k].token )
                    {
                        if( 
                            (tokenActual.token == 'PALABRA_RESERVADA' && tokenActual.lexema == secuencia[0].lexema ) ||  
                            (tokenActual.token != 'PALABRA_RESERVADA'))
                        {
                            if( 
                                (sigToken.token == 'PALABRA_RESERVADA' && sigToken.lexema == item2[k].lexema ) ||  
                                (sigToken.token != 'PALABRA_RESERVADA'))
                            {
                                // NO-TERMINAL SUSTITUIBLE POR UNA REGLA DE PRODUCCION
                                let produccion = prods[i];
                                if( produccion.esReversible == true )
                                {
                                    this.prod_aplicadas.push( produccion );
                                    this.indices_prod_aplicadas.push( tope );
                                }
                                this.pila.pop();
                                for( let t = produccion.secuencia.length-1; t>=0;  t-- )
                                {
                                    this.pila.push( produccion.secuencia[t] );
                                }
                                return CodigoIntermedio.ITERACION_OK;
                            }
                        }
                    }
                }
            }
        } // FIN - 2 TOKENS DE LA ENTRADA


        // BUSCAR LA PRODUCCION QUE EMPIECE CON ESE TERMINAL DE LA ENTRADA
        let prods = Gramatica.G.filter( prod =>  prod.NO_terminal == noTerminal );
        for( let i=0;  i<prods.length;  i++ )
        {
            let secuencia = prods[i].secuencia;
            if( tokenActual.token == secuencia[0].token )
            {
                if( 
                    (tokenActual.token == 'PALABRA_RESERVADA' && tokenActual.lexema == secuencia[0].lexema ) ||  
                    (tokenActual.token != 'PALABRA_RESERVADA'))
                {
                    let produccion = prods[i];
                    if( produccion.esReversible == true )
                    {
                        this.prod_aplicadas.push( produccion );
                        this.indices_prod_aplicadas.push( tope );
                    }
                    this.pila.pop();
                    for( let k = produccion.secuencia.length-1; k>=0;  k-- )
                    {
                        this.pila.push( produccion.secuencia[k] );
                    }
                    return CodigoIntermedio.ITERACION_OK;
                }
            }
        }



        // BUSCAR PRODUCCION QUE EMPIECE CON NO-TERMINAL Y COMPARAR CON EL DE LA ENTRADA
        for( let i=0;  i<prods.length;  i++ )
        {
            let secuencia = prods[i].secuencia;
            if( secuencia[0].tipo == ItemProduccion.TERMINAL ){ continue }

            //console.log( "PRODS QUE EMPIEZA CON NO-TERMINAL:" )
            //console.log( prods[i] )
            // SECUENCIA QUE EMPIEZA CON NO-TERMINAL
            let itemsP = this.getPrimerTerminal( secuencia[0].token );
            //console.log( "PRIMEROS TERMINALES DEL NO-TERMINAL (" + secuencia[0].token + "):" )
            //console.log(  itemsP )
            for(let k=0;  k<itemsP.length;  k++)
            {
                if( tokenActual.token == itemsP[k].token )
                {
                    if( 
                        (tokenActual.token == 'PALABRA_RESERVADA' && tokenActual.lexema == itemsP[k].lexema ) ||  
                        (tokenActual.token != 'PALABRA_RESERVADA'))
                    {
                        //console.log( itemsP[k] )
                        //alert( tokenActual.token + '<>' + tokenActual.lexema + "\n" +
                        //itemsP[k].token + '<>' + itemsP[k].lexema )
                        // NO-TERMINAL SUSTITUIBLE POR UNA REGLA DE PRODUCCION
                        let produccion = prods[i];
                        if( produccion.esReversible == true )
                        {
                            this.prod_aplicadas.push( produccion );
                            this.indices_prod_aplicadas.push( tope );
                        }
                        this.pila.pop();
                        for( let t = secuencia.length-1; t>=0;  t-- )
                        {  
                            //console.log( secuencia[t] )
                            this.pila.push( secuencia[t] )  
                        }
                        //alert("aq")
                        return CodigoIntermedio.ITERACION_OK;
                    }
                }
            }
        }


        // CUANDO NINGUNA PRODUCCION ES APLICABLE PERO ACEPTA VACIO
        let prod = Gramatica.G.filter( prod =>  prod.NO_terminal == noTerminal );
        if( prod[0].accionError == Produccion.VACIO )
        {
            this.pila.pop();
            if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
            {
                this.indices_prod_aplicadas.pop();
                this.prod_aplicadas.pop();
            }
            return CodigoIntermedio.ITERACION_OK;
        }



        // VERIFICAR SI EL TOKEN DE ENTRADA ES EL SIGUIENTE ITEM DE LA PILA
        if( this.pila.length > 1 && tokenActual.token == this.pila[ tope - 1 ].token )
        {
            if( 
                (tokenActual.token == 'PALABRA_RESERVADA' && tokenActual.lexema == this.pila[ tope - 1 ].lexema ) ||  
                (tokenActual.token != 'PALABRA_RESERVADA'))
            {
                if( this.pila[ tope ].token == "sentencia" || 
                    this.pila[ tope ].token == "confpines" || 
                    this.pila[ tope ].token == "datosGlobales" || 
                    this.pila[ tope ].token == "pines" ||
                    this.pila[ tope ].token == "funcion" ) 
                {  
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    return CodigoIntermedio.ITERACION_OK  
                } 
                else
                { 
                    alert( tokenActual.token + '<>' + tokenActual.lexema + "\n" +
                    this.pila[ tope - 1 ].token + '<>' + this.pila[ tope - 1 ].lexema )
                    alert( "(corregir fases) ERROR EN NO-TERMINAL NO SUSTITUIBLE EN GENERACION DE CODIGO" )
                    return CodigoIntermedio.ERROR_ANALISIS
                }
            }
        }

        alert( tokenActual.token + '<>' + tokenActual.lexema + "\n" +
        this.pila[ tope - 1 ].token + '<>' + this.pila[ tope - 1 ].lexema )
        // CUANDO NINGUNA PRODUCCION ES APLICABLE
        alert( "(corregir fases) ERROR NO-TERMINAL NO SUSTITUIBLE EN GENERACION DE CODIGO :(" )
        return CodigoIntermedio.ERROR_ANALISIS
    }





    
    limpiarArreglo( arreglo = [] )
    {
        while( arreglo.length > 0 ) {  arreglo.pop();  }
    }


    getPrimerTerminal( noTerminal = "" )
    {
        let terminales = [ new ItemProduccion() ];   terminales.pop();
        let prods = Gramatica.G.filter( prod => prod.NO_terminal == noTerminal );
        for( let i=0;  i<prods.length;  i++ )
        {
            let item = prods[i].secuencia[0] 
            if( item.tipo == ItemProduccion.TERMINAL ){ terminales.push( item ) }
            else{ this.getPrimerTerminal( item.token ) }
        }
        return terminales;
    }
}