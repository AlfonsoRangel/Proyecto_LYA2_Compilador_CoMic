 
import { ComponenteLexico } from '../ComponenteLexico.js';
import { SimboloFuncion } from '../Semantico/SimboloFuncion.js';
import { SimboloPin } from '../Semantico/SimboloPin.js';
import { SimboloVariable } from '../Semantico/SimboloVariable.js';
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
        this.tablaFunciones = [ new SimboloFuncion() ]
        this.tablaVariables = [ new SimboloVariable() ]
        this.tablaConstantes = [ new SimboloVariable() ]
        this.tablaPines = [ new SimboloPin() ]
    }


    inicializar( entradaTokens = [ new ComponenteLexico() ] ,
        tokensFuncionesCOMIC = [ new ComponenteLexico() ] , listaF = [ new SimboloFuncion() ] ,
        listaV = [ new SimboloVariable() ] , listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] )
    {
        this.limpiarArreglo( this.pila )
        this.entrada = entradaTokens;
        this.tokensFuncionesCOMIC = tokensFuncionesCOMIC
        this.limpiarArreglo( this.prod_aplicadas );
        this.limpiarArreglo( this.indices_prod_aplicadas );
        this.pila.push( new ItemProduccion( ItemProduccion.NO_TERMINAL , "s" , "" ) );
        this.accion.inicializar();
        this.tokenEntrada = null
        ResultadoCuadruplo.limpiarContadores()
        this.funcionesCOMIC_agregadas = false
        this.tablaFunciones = listaF
        this.tablaVariables = listaV
        this.tablaConstantes = listaC
        this.tablaPines = listaP
    }




    
    // GENERAR CODIGO INTERMEDIO NO OPTIMIZADO
    generarCodigo( )
    {
        // VERIFICAR SI LA ENTRADA DE TOKENS ES VACIA
        if( this.entrada.length == 0 ) 
        { 
            if( this.pila.length != 0 )
            {
                let tope = this.pila.length-1;
                let itemTope = this.pila[tope];
                if( itemTope.token == "s" ) {  return CodigoIntermedio.FIN_ANALISIS  }
                let mensaje = "Codigo Incompleto al final del programa."
                if( itemTope.tipo == ItemProduccion.NO_TERMINAL )
                {
                    switch( itemTope.token )
                    {
                        case "sentencia": 
                            mensaje += '\n\nFalta cerrar un bloque de codigo con un parentesis de cierre "}"'
                            break

                        default:
                            mensaje += "\n\nSe esperaba uno de los siguientes elementos:\n" +
                            this.getPrimerosItemsProduccion( itemTope.token )
                            break
                    }
                }
                else {
                    // CUANDO ES TERMINAL
                    if( itemTope.lexema == "" )
                    {
                        mensaje += '\n\nSe esperaba un "' + itemTope.token + '"'
                    }
                    else {
                        mensaje += '\n\nSe esperaba un: \n' + itemTope.token + ' => "' + itemTope.lexema + '"'
                    }
                }
                alert( "ERROR INESPERADO (CODIGO INTERMEDIO)\n\n" + mensaje )
            }
            return CodigoIntermedio.FIN_ANALISIS 
        }

        // CUANDO LA PILA ESTA VACIO PERO LA ENTRADA NO (fuera de la estrcutura)
        if( this.pila.length == 0 )
        { 
            if( this.entrada.length != 0 ) 
            { 
                let tokenActual = this.entrada[0];
                let mensaje = "La secuencia '" + tokenActual.lexema +
                 "' se encuentra afuera de la estructura principal del codigo\n\n" +
                "Agrega tu secuencia '" + tokenActual.lexema + "' ANTES de la ultima llave de cierre '}'"
                alert(  "ERROR INESPERADO (CODIGO INTERMEDIO)\n\n" + mensaje )
            }
            return FIN_ANALISIS 
        }

        let tokenActual = this.entrada[0];
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
            else { 
                this.evaluarNOterminal( itemTope.token , tokenActual , sigToken , tope );
            }
        }
        else
        {
            if( tokenActual.token == itemTope.token )
            {
                if( (tokenActual.token == "PALABRA_RESERVADA" && tokenActual.lexema == itemTope.lexema) || 
                tokenActual.token != "PALABRA_RESERVADA" )
                {
                    this.entrada.shift();
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    this.accion.ejecutar( itemTope.accionCodigo , tokenActual , this.tablaVariables ,
                        this.tablaConstantes , this.tablaFunciones , this.tablaPines )
                }
                else
                {
                    let mensaje = "Secuencia inesperada '" + tokenActual.lexema + "' " +
                    "NO es valido al momento de definir la sintaxis de:\n" + 
                    this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion;
                    if( itemTope.lexema == "") {
                        mensaje += "\n\nSe esperaba un tipo:\n" + itemTope.token;
                    }
                    else{
                        mensaje += "\n\nSe esperaba un tipo:\n" + itemTope.token + ' => "' + itemTope.lexema + '"'
                    }
                    alert( "ERROR INESPERADO (CODIGO INTERMEDIO)\n\n" + mensaje )
                    return CodigoIntermedio.FIN_ANALISIS
                }  
            }
            else
            { 
                // TOKENS DIFERENTES
                let mensaje = "Secuencia inesperada '" + tokenActual.lexema + "' " +
                "NO es valido al momento de definir la sintaxis de:\n" + 
                this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion;
                if( itemTope.lexema == "") {
                    mensaje += "\n\nSe esperaba un tipo:\n" + itemTope.token;
                }
                else{
                    mensaje += "\n\nSe esperaba un tipo:\n" + itemTope.token + ' => "' + itemTope.lexema + '"'
                }
                alert( "ERROR INESPERADO (CODIGO INTERMEDIO)\n\n" + mensaje )
                return CodigoIntermedio.FIN_ANALISIS
            }
        }
        return CodigoIntermedio.ITERACION_OK;
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
                else{ item2 = this.getPrimerTerminal( secuencia[1].token ); }

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
                                return;
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
                    return;
                }
            }
        }


        // BUSCAR PRODUCCION QUE EMPIECE CON NO-TERMINAL Y COMPARAR CON EL DE LA ENTRADA
        for( let i=0;  i<prods.length;  i++ )
        {
            let secuencia = prods[i].secuencia;
            if( secuencia[0].tipo == ItemProduccion.TERMINAL ){ continue }
            let itemsP = this.getPrimerTerminal( secuencia[0].token );
            for(let k=0;  k<itemsP.length;  k++)
            {
                if( tokenActual.token == itemsP[k].token )
                {
                    if( 
                        (tokenActual.token == 'PALABRA_RESERVADA' && tokenActual.lexema == itemsP[k].lexema ) ||  
                        (tokenActual.token != 'PALABRA_RESERVADA'))
                    {
                        let produccion = prods[i];
                        if( produccion.esReversible == true )
                        {
                            this.prod_aplicadas.push( produccion );
                            this.indices_prod_aplicadas.push( tope );
                        }
                        this.pila.pop();
                        for( let t = secuencia.length-1; t>=0;  t-- ) { this.pila.push( secuencia[t] )  }
                        return true
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
            return;
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
                    this.pila[ tope ].token == "funcion" ||
                    this.pila[ tope ].token == "parametros" ||
                    this.pila[ tope ].token == "masParametros" ||
                    this.pila[ tope ].token == "masArgumentos" ||
                    this.pila[ tope ].token == "argumentos"
                ) 
                {  
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    return;  
                } 
                let mensaje = "Error previo a la secuencia '" + tokenActual.lexema + "' " +
                "NO es valido al momento de definir la sintaxis de:\n" + 
                this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion +
                "\n\nDebes agregar unos de los siguientes elementos antes de la secuencia '" +
                tokenActual.lexema + "':\n" + this.getPrimerosItemsProduccion( noTerminal )
                alert( "ERROR INESPERADO (CODIGO INTERMEDIO)\n\n" + mensaje )
                return;
            } 
        }


        // CUANDO NINGUNA PRODUCCION ES APLICABLE
        let mensaje = 'Secuencia inesperada "' + tokenActual.lexema + '" '
        if( this.pila[tope].token == "s" ) {
            mensaje += "al momento de definir la Estructura Principal del Codigo"
        }
        else {
            mensaje += "al momento de definir la sintaxis de:\n\n" + 
            this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion
        }
        mensaje += "\n\nPara una sintaxis valida, debes colocar uno de los siguientes elementos:\n" + 
        this.getPrimerosItemsProduccion( noTerminal ) + '\nEn lugar de "' + tokenActual.lexema + '"';
        alert( "ERROR INESPERADO (CODIGO INTERMEDIO)\n\n" + mensaje )
    }







    /*
    getPrimerTerminal( noTerminal = "" )
    {
        let terminales = [ new ItemProduccion() ];   terminales.pop();
        let prods = Gramatica.G.filter( prod => prod.NO_terminal == noTerminal );
        for( let i=0;  i<prods.length;  i++ )
        {
            terminales.push( prods[i].secuencia[0] );
        }
        return terminales;
    } */


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

    
    limpiarArreglo( arreglo = [] )
    {
        while( arreglo.length > 0 ) {  arreglo.pop();  }
    }


    getPrimerosItemsProduccion( noTerminal = "" )
    {
        let items = ""
        let contador = 1
        let producciones = Gramatica.G.filter( prod => prod.NO_terminal == noTerminal )
        for( let i=0;  i<producciones.length; i++)
        {
            let item = producciones[i].secuencia[0];
            if( item.lexema == "" )
            {
                if( items.indexOf( item.token ) == -1 ) { items += contador++ + ") " + item.token + "\n"  }
            }
            else
            {
                if( items.indexOf( item.lexema ) == -1 ) { items += contador++ + ") " + item.token + ' => "' + item.lexema + '"\n' }
            }
        }
        return items;
    }


    
}