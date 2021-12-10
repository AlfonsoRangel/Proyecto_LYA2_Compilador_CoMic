 
import { Produccion } from './Sintactico/Produccion.js';
import { ItemProduccion } from './Sintactico/ItemProduccion.js';
import { ComponenteLexico } from './ComponenteLexico.js'
import { ErrorSintactico } from './Sintactico/errorSintactico.js';
import { DebugSintactico } from './debug_sintactico.js';
import { Gramatica } from './Sintactico/Gramatica.js';

 export class AnalisisSintactico {
     
    static accionSintactica = "";
    static mensajeErrorSintactico = new ErrorSintactico(); 

    constructor()
    {
        //______________________________________________
        // PROPIEDADES
        //______________________________________________
        this.pila = [ new ItemProduccion() ];   this.pila.pop();
        this.entrada = [ new ComponenteLexico() ];    this.entrada.pop();
        this.prod_aplicadas = [ new Produccion() ];    this.prod_aplicadas.pop();
        this.indices_prod_aplicadas = [ 0 ];    this.indices_prod_aplicadas.pop();
        this.errorActivado = false;
        this.listaErrores = [ new ErrorSintactico() ];   this.listaErrores.pop();
        this.debug = [ new DebugSintactico() ];    this.debug.pop();
    }







    inicializarSintactico( entradaTokens = [ new ComponenteLexico() ] )
    {
        this.entrada = entradaTokens;
        this.limpiarArreglo( this.pila );
        this.limpiarArreglo( this.prod_aplicadas );
        this.limpiarArreglo( this.indices_prod_aplicadas );
        this.limpiarArreglo( this.listaErrores );
        this.limpiarArreglo( this.debug );
        this.errorActivado = false;
        this.pila.push( new ItemProduccion( ItemProduccion.NO_TERMINAL , "s" , "" ) );
        AnalisisSintactico.accionSintactica = "";
        AnalisisSintactico.mensajeErrorSintactico = new ErrorSintactico();
    }
















    

    nextSintactico( )
    {
        AnalisisSintactico.accionSintactica = "";
        AnalisisSintactico.mensajeErrorSintactico = new ErrorSintactico();
        let itemDebug = new DebugSintactico();

        // VERIFICAR SI LA ENTRADA DE TOKENS ES VACIA
        if( this.entrada.length == 0 ) 
        { 
            if( this.pila.length != 0 )
            {
                let tope = this.pila.length-1;
                let itemTope = this.pila[tope];
                itemDebug.entradaI = this.entrada.filter( (compLex) => true );
                itemDebug.pilaI = this.pila.filter( (itemP) => true );
                itemDebug.entradaF = this.entrada.filter( (compLex) => true );
                itemDebug.pilaF = this.pila.filter( (itemP) => true );

                if( itemTope.token == "s" )
                {
                    itemDebug.accion = "FIN";
                    AnalisisSintactico.mensajeErrorSintactico.descripcion = ""; 
                    itemDebug.mensajeError = AnalisisSintactico.mensajeErrorSintactico;
                    this.debug.push( itemDebug );
                    return false
                }
                AnalisisSintactico.accionSintactica = "FIN";
                AnalisisSintactico.mensajeErrorSintactico.descripcion =
                "Codigo Incompleto al final del programa."; 
                
                AnalisisSintactico.mensajeErrorSintactico.numeroLinea = 0
               
                // SUGERENCIA
                if( itemTope.tipo == ItemProduccion.NO_TERMINAL )
                {
                    let sugerencia = ""
                    switch( itemTope.token )
                    {
                        case "sentencia": 
                            sugerencia = 'Falta cerrar un bloque de codigo con un parentesis de cierre "}"'
                            break

                        default:
                            sugerencia = "Se esperaba uno de los siguientes elementos:\n" +
                            this.getPrimerosItemsProduccion( itemTope.token )
                            break
                    }
                    AnalisisSintactico.mensajeErrorSintactico.sugerencia = sugerencia
                }
                else {
                    // CUANDO ES TERMINAL
                    if( itemTope.lexema == "" )
                    {
                        AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                        'Se esperaba un "' + itemTope.token + '"'
                    }
                    else {
                        AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                        'Se esperaba un: \n\n' + itemTope.token + ' => "' + itemTope.lexema + '"'
                    }
                }
                itemDebug.accion = AnalisisSintactico.accionSintactica;
                itemDebug.mensajeError = AnalisisSintactico.mensajeErrorSintactico;
                this.debug.push( itemDebug );
                this.listaErrores.push( AnalisisSintactico.mensajeErrorSintactico );
            }
            // FINALIZAR ANALISIS
            return false; 
        }

        // CUANDO LA PILA ESTA VACIO PERO LA ENTRADA NO (fuera de la estrcutura)
        if( this.pila.length == 0 )
        { 
            if( this.entrada.length != 0 ) 
            { 
                //alert( "::"+ this.entrada.length )
                let tokenActual = this.entrada[0];
                itemDebug.entradaI = this.entrada.filter( (compLex) => true );
                itemDebug.pilaI = this.pila.filter( (itemP) => true );
                itemDebug.entradaF = this.entrada.filter( (compLex) => true );
                itemDebug.pilaF = this.pila.filter( (itemP) => true );
                AnalisisSintactico.accionSintactica = "FIN";
                
                AnalisisSintactico.mensajeErrorSintactico.descripcion =
                "La secuencia '" + tokenActual.lexema + "' se encuentra afuera de la estructura principal del codigo";
                
                AnalisisSintactico.mensajeErrorSintactico.numeroLinea = tokenActual.numeroLinea;
               
                AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                "Agrega tu secuencia '" + tokenActual.lexema + 
                "' ANTES de la ultima llave de cierre '}'";
                
                itemDebug.accion = AnalisisSintactico.accionSintactica;
                itemDebug.mensajeError = AnalisisSintactico.mensajeErrorSintactico;
                this.debug.push( itemDebug );
                this.listaErrores.push( AnalisisSintactico.mensajeErrorSintactico );
            }
            // FINALIZAR ANALISIS
            return false; 
        }

        let tokenActual = this.entrada[0];
        let sigToken = new ComponenteLexico();
        if( this.entrada.length > 1 ) { sigToken = this.entrada[1]; }
        else{ this.sigToken = null; }

        let tope = this.pila.length-1;
        let itemTope = this.pila[tope];

        itemDebug.entradaI = this.entrada.filter( (compLex) => true );
        itemDebug.pilaI = this.pila.filter( (itemP) => true );


        // EVALUAR SI LO QUE ESTA EN EL TOPE DE LA PILA ES TERMINAL o NO TERMINAL
        if( itemTope.tipo == ItemProduccion.NO_TERMINAL )
        {
            this.evaluarNOterminal( itemTope.token , tokenActual , sigToken , tope );
        }
        else
        {
            if( tokenActual.token == itemTope.token )
            {
                if( (tokenActual.token == "PALABRA_RESERVADA" && tokenActual.lexema == itemTope.lexema) || 
                tokenActual.token != "PALABRA_RESERVADA" )
                {
                    AnalisisSintactico.accionSintactica = 
                    "Remover el TOKEN de la entrada y el TERMINAL que esta en el tope de la pila";
                    this.entrada.shift();
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    //alert( this.prod_aplicadas[ this.prod_aplicadas.length-1].descripcion );
                    this.errorActivado = false;
                }
                else
                {
                    if( this.errorActivado == false )
                    {
                        AnalisisSintactico.mensajeErrorSintactico.descripcion =
                        "Secuencia inesperada '" + tokenActual.lexema + "' " +
                        "NO es valido al momento de definir la sintaxis de:\n" + 
                        this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion;
                        AnalisisSintactico.mensajeErrorSintactico.numeroLinea = tokenActual.numeroLinea;
                        if( itemTope.lexema == "")
                        {
                            AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                            "Se esperaba un tipo:\n" + itemTope.token;
                        }
                        else{
                            AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                            "Se esperaba un tipo:\n" + itemTope.token + ' => "' + itemTope.lexema + '"'
                        }
                        this.quitarProduccionActual( true );
                        this.errorActivado = true;
                    }
                    else{ 
                        AnalisisSintactico.accionSintactica = "Remover el TOKEN de la entrada"
                        this.entrada.shift(); 
                    }
                }  
            }
            else
            { 
                // TOKENS DIFERENTES
                if( this.errorActivado == false )
                {
                    AnalisisSintactico.mensajeErrorSintactico.descripcion =
                    "Secuencia inesperada '" + tokenActual.lexema + "' " +
                    "NO es valido al momento de definir la sintaxis de:\n" + 
                    this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion;
                    AnalisisSintactico.mensajeErrorSintactico.numeroLinea = tokenActual.numeroLinea;
                    if( itemTope.lexema == "")
                    {
                        AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                        "Se esperaba un tipo:\n" + itemTope.token;
                    }
                    else{
                        AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                        "Se esperaba un tipo:\n" + itemTope.token + ' => "' + itemTope.lexema + '"'
                    }
                    this.quitarProduccionActual( true );
                    this.errorActivado = true;
                }
                else{ 
                    AnalisisSintactico.accionSintactica = "Remover el TOKEN de la entrada"
                    this.entrada.shift(); 
                }
            }
        }
        itemDebug.entradaF = this.entrada.filter( (compLex) => true );
        itemDebug.pilaF = this.pila.filter( (itemP) => true );
        itemDebug.accion = AnalisisSintactico.accionSintactica;
        itemDebug.mensajeError = AnalisisSintactico.mensajeErrorSintactico;
        this.debug.push( itemDebug );

        if( AnalisisSintactico.mensajeErrorSintactico.descripcion != "" )
        {
            this.listaErrores.push( AnalisisSintactico.mensajeErrorSintactico );
        }
        return true;
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
                                console.log( "==============================");
                                console.log( "     PRODUCCION APLICADA " );
                                console.log( produccion.NO_terminal + " -> " + produccion.secuencia );
                                console.log( "==============================");
                                this.errorActivado = false;
                                AnalisisSintactico.accionSintactica = 
                                "Sustituir el NO Terminal <" + noTerminal + "> por la " +
                                "produccion -> " + produccion.getSecuencia();
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
                    console.log( "PRODS APLICADAS: " + this.prod_aplicadas.length )
                    //alert( this.prod_aplicadas[ this.prod_aplicadas.length-1 ].descripcion )
                    this.errorActivado = false;
                    AnalisisSintactico.accionSintactica = 
                    "Sustituir el NO Terminal <" + noTerminal + "> por la produccion:\n\n" + 
                    produccion.getSecuencia();
                    return;
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
            //alert( secuencia[0].token )
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
                        //alert("SI")
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
            AnalisisSintactico.accionSintactica = 
            "Remover el NO-TERMINAL que esta en el tope de la pila ya que acepta VACIO";
            return;
        }


        //alert( this.pila.length )
        // VERIFICAR SI EL TOKEN DE ENTRADA ES EL SIGUIENTE ITEM DE LA PILA
        if( this.pila.length > 1 && tokenActual.token == this.pila[ tope - 1 ].token )
        {
            //console.log( tokenActual.token + "==" + this.pila[ tope - 1 ].token )
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
                    AnalisisSintactico.accionSintactica = 
                    "Remover el NO-TERMINAL que esta en el tope de la pila";
                    return;  
                } 
                if( this.errorActivado == false )
                {
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    AnalisisSintactico.accionSintactica = 
                    "Remover el NO-TERMINAL que esta en el tope de la pila";

                    AnalisisSintactico.mensajeErrorSintactico.descripcion =
                    "Error previo a la secuencia '" + tokenActual.lexema + "' " +
                    "NO es valido al momento de definir la sintaxis de:\n" + 
                    //this.getDescripcion_NO_Terminal( noTerminal );
                    this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion

                    AnalisisSintactico.mensajeErrorSintactico.sugerencia =
                    "Debes agregar unos de los siguientes elementos antes de la secuencia '" +
                    tokenActual.lexema + "':\n" + this.getPrimerosItemsProduccion( noTerminal );

                    AnalisisSintactico.mensajeErrorSintactico.numeroLinea = tokenActual.numeroLinea;
                    
                    //alert( "ERROR" )
                    console.log( "==========================" )
                    console.log( "   ERROR ENCONTRADO" )
                    //console.log( error );
                    console.log( "\n\n\n\n" );
                    this.errorActivado = true;
                    //this.entrada.shift();
                }
                else
                { 
                    AnalisisSintactico.accionSintactica = 
                    "Remover el TOKEN de la entrada";
                    this.entrada.shift(); 
                }
                return;
            }
            
        }


        


        // CUANDO NINGUNA PRODUCCION ES APLICABLE
        if( this.errorActivado == false )
        {
            let descripcion = 'Secuencia inesperada "' + tokenActual.lexema + '" '

            if( this.pila[tope].token == "s" ) {
                descripcion += "al momento de definir la Estructura Principal del Codigo"
            }
            else {
                descripcion += "al momento de definir la sintaxis de:\n\n" + 
                this.prod_aplicadas[ this.prod_aplicadas.length - 1].descripcion
            }
            AnalisisSintactico.mensajeErrorSintactico.descripcion = descripcion

            AnalisisSintactico.mensajeErrorSintactico.sugerencia =
            "Para una sintaxis valida, debes colocar uno de los siguientes elementos:\n" + 
            this.getPrimerosItemsProduccion( noTerminal ) + 
            '\nEn lugar de "' + tokenActual.lexema + '"';

            AnalisisSintactico.mensajeErrorSintactico.numeroLinea = tokenActual.numeroLinea;
            this.quitarProduccionActual();
            this.errorActivado = true;
        }
        else
        { 
            AnalisisSintactico.accionSintactica = "Remover el TOKEN de la entrada (ERROR ACTIVADO)";
            this.entrada.shift(); 
        }
    }



    quitarProduccionActual( esTerminal = false )
    {
        if( this.indices_prod_aplicadas.length == 0 )
        { 
            AnalisisSintactico.accionSintactica = "Remover el TOKEN de la entrada";
            this.entrada.shift();
            return; 
        }
        let indiceLimite = this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ];
        let noTerminal = this.prod_aplicadas[ this.prod_aplicadas.length - 1 ].NO_terminal;
        let descripcionNoTerminal = this.prod_aplicadas[ this.prod_aplicadas.length - 1 ].descripcion; 
        let tope = this.pila.length - 1;
        let prods = Gramatica.G.filter( prod => prod.NO_terminal == this.pila[tope].token );
        if( esTerminal == true || prods[0].accionError == Produccion.QUITAR  )
        {
            if( descripcionNoTerminal == "Estructura de Control Repetitiva Ciclo" )
            {
                this.pila.pop();
                if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                {
                    this.indices_prod_aplicadas.pop();
                    this.prod_aplicadas.pop();
                }
                AnalisisSintactico.accionSintactica = "Remover el NO-TERMINAL que esta en el tope de la pila";
                return;
            }
            while( tope >= indiceLimite ) {  this.pila.pop(); tope--;  }
            this.pila.push( new ItemProduccion( ItemProduccion.NO_TERMINAL , noTerminal) );
            this.prod_aplicadas.pop();
            this.indices_prod_aplicadas.pop();
            AnalisisSintactico.accionSintactica = "Revertir la ultima regla de produccion aplicada";
        }
        else
        {
            AnalisisSintactico.accionSintactica = "Remover el TOKEN de la entrada";
            this.entrada.shift();
        }
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