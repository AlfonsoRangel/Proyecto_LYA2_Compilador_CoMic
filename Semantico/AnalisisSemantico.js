 
import { Produccion } from '../Sintactico/Produccion.js'
import { ItemProduccion } from '../Sintactico/ItemProduccion.js'
import { ComponenteLexico } from '../ComponenteLexico.js'
import { AccionSemantica } from './Acciones.js';
import { Gramatica } from '../Sintactico/Gramatica.js';
import { SimboloFuncion } from './SimboloFuncion.js';

export class AnalisisSemantico {

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
        this.accion = new AccionSemantica( this );
        this.movSintactico = "";
        this.tokensFuncionesCOMIC = [ new ComponenteLexico() ]
        this.funcionesCOMIC_agregadas = false
    }


    inicializarSemantico( entradaTokens = [ new ComponenteLexico() ] , 
        tokensFuncionesCOMIC = [ new ComponenteLexico() ] 
    ) {
        this.entrada = entradaTokens;
        this.tokensFuncionesCOMIC = tokensFuncionesCOMIC
        this.funcionesCOMIC_agregadas = false
        this.limpiarArreglo( this.pila );
        this.limpiarArreglo( this.prod_aplicadas );
        this.limpiarArreglo( this.indices_prod_aplicadas );
        this.errorActivado = false;
        this.pila.push( new ItemProduccion( ItemProduccion.NO_TERMINAL , "s" , "" ) );
        this.accion.inicializar();
        this.movSintactico = ""
    }











    

    nextSemantico( )
    {
        this.movSintactico = ""
        let entradaInicial = this.entrada.filter( cp => true );
        let pilaInicial = this.pila.filter( ip => true );
        let entradaFinal = this.entrada.filter( cp => true );
        let pilaFinal = this.pila.filter( ip => true );

        // VERIFICAR SI LA ENTRADA DE TOKENS ES VACIA
        if( this.entrada.length == 0 ) 
        { 
            if( this.pila.length != 0 )
            {
                this.movSintactico = "FIN";
                this.accion.ejecutar( AccionSemantica.FIN );
            }
            // FINALIZAR ANALISIS
            return false; 
        }

        // CUANDO LA PILA ESTA VACIO PERO LA ENTRADA NO (fuera de la estrcutura)
        if( this.pila.length == 0 )
        { 
            if( this.entrada.length != 0 ) 
            { 
                this.movSintactico = "FIN";
                this.accion.ejecutar( AccionSemantica.FIN );
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


        // EVALUAR SI LO QUE ESTA EN EL TOPE DE LA PILA ES TERMINAL o NO TERMINAL
        if( itemTope.tipo == ItemProduccion.NO_TERMINAL )
        {
            // SE AGREGAN LOS TOKENS DE LAS FUNCIONES PREDETERMINADAS A LA ENTRADA
            if( itemTope.token == "funcion" && this.funcionesCOMIC_agregadas == false )
            {
                for( let w=this.tokensFuncionesCOMIC.length-1;  w>=0;  w-- ) {
                    this.entrada.unshift( this.tokensFuncionesCOMIC[w] )
                }
                this.funcionesCOMIC_agregadas = true
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
                    this.movSintactico = "Remover el TOKEN de la entrada y el TERMINAL que esta en el tope de la pila"
                    this.entrada.shift()
                    this.pila.pop()
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    this.errorActivado = false;
                    entradaFinal = this.entrada.filter( cp => true );
                    pilaFinal = this.pila.filter( ip => true );
                    this.accion.ejecutar( 
                        itemTope.accionSemantica , entradaInicial , entradaFinal ,
                        pilaInicial , pilaFinal , this.movSintactico , tokenActual 
                    );
                    return true
                }
                else
                {
                    if( this.errorActivado == false )
                    {
                        this.quitarProduccionActual( true );
                        this.errorActivado = true;
                    }
                    else{ 
                        this.movSintactico = "Remover el TOKEN de la entrada"
                        this.entrada.shift(); 
                    }
                }  
            }
            else
            {
                if( this.errorActivado == false )
                {
                    this.quitarProduccionActual( true );
                    this.errorActivado = true;
                }
                else{ 
                    this.movSintactico = "Remover el TOKEN de la entrada"
                    this.entrada.shift(); 
                }
            }
        }
        entradaFinal = this.entrada.filter( cp => true );
        pilaFinal = this.pila.filter( ip => true );
        this.accion.ejecutar( 
            AccionSemantica.MOV_SINTACTICO , entradaInicial , entradaFinal ,
            pilaInicial , pilaFinal , this.movSintactico , tokenActual  
        );
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
                                this.errorActivado = false;
                                this.movSintactico = 
                                "Sustituir el NO Terminal <" + noTerminal + "> por la " +
                                "produccion ...\n\n" + produccion.getSecuencia();
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
                    this.errorActivado = false;
                    this.movSintactico = 
                    "Sustituir el NO Terminal <" + noTerminal + "> por la " +
                    "produccion ->\n\n" + produccion.getSecuencia();
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
                        // NO-TERMINAL SUSTITUIBLE POR UNA REGLA DE PRODUCCION
                        let produccion = prods[i];
                        if( produccion.esReversible == true )
                        {
                            this.prod_aplicadas.push( produccion );
                            this.indices_prod_aplicadas.push( tope );
                        }
                        this.pila.pop();
                        for( let t = secuencia.length-1; t>=0;  t-- )  {  this.pila.push( secuencia[t] ) }
                        this.movSintactico = 
                        "Sustituir el NO Terminal <" + noTerminal + "> por la " +
                        "produccion ->\n\n" + produccion.getSecuencia();
                        return
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
            this.movSintactico = 
            "Remover el NO-TERMINAL que esta en el tope de la pila ya que acepta VACIO";
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
                ) {  
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    this.movSintactico = "Remover el NO-TERMINAL que esta en el tope de la pila"
                    return  
                } 
                if( this.errorActivado == false )
                {
                    this.pila.pop();
                    if( tope-1 < this.indices_prod_aplicadas[ this.indices_prod_aplicadas.length - 1 ] )
                    {
                        this.indices_prod_aplicadas.pop();
                        this.prod_aplicadas.pop();
                    }
                    this.movSintactico = "Remover el NO-TERMINAL que esta en el tope de la pila"
                    this.errorActivado = true
                }
                else
                { 
                    this.movSintactico = "Remover el TOKEN de la entrada (ERROR ACTIVADO)"
                    this.entrada.shift(); 
                }
                return;
            }
        }



        // CUANDO NINGUNA PRODUCCION ES APLICABLE
        if( this.errorActivado == false )
        {
            this.quitarProduccionActual();
            this.errorActivado = true;
        }
        else
        { 
            this.movSintactico = "Remover el TOKEN de la entrada (ERROR ACTIVADO)";
            this.entrada.shift()
        }
    }




    quitarProduccionActual( esTerminal = false )
    {
        if( this.indices_prod_aplicadas.length == 0 )
        { 
            this.movSintactico = "Remover el TOKEN de la entrada";
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
                this.movSintactico = "Remover el TOKEN del tope de la pila";
                return;
            }
            while( tope >= indiceLimite ) {  this.pila.pop(); tope--;  }
            this.pila.push( new ItemProduccion( ItemProduccion.NO_TERMINAL , noTerminal) );
            this.prod_aplicadas.pop();
            this.indices_prod_aplicadas.pop();
            this.movSintactico = "Revertir la ultima regla de produccion aplicada";
        }
        else
        {
            this.movSintactico = "Remover el TOKEN de la entrada";
            this.entrada.shift();
        }
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


    limpiarArreglo( arreglo = [] )
    {
        while( arreglo.length > 0 ) {  arreglo.pop();  }
    }


    /*
    addProduccion(  NOterminal = "" , secuencia = [ new ItemProduccion() ] , 
                    tipo = 0 , accionError = 0 , descripcion = "" , esRevertible = true )
    {
        Gramatica.G.push( 
            new Produccion( NOterminal , secuencia , tipo , accionError , descripcion , esRevertible ) );
    } 


    getPrimerosItemsProduccion( noTerminal = "" )
    {
        let items = "";
        let producciones = Gramatica.G.filter( prod => prod.NO_terminal == noTerminal );
        for( let i=0;  i<producciones.length; i++)
        {
            let item = producciones[i].secuencia[0];
            if( item.lexema == "" )
            {
                if( items.indexOf( item.token ) == -1 ) { items = items + item.token + "\n"; }
            }
            else
            {
                if( items.indexOf( item.lexema ) == -1 ) { items = items + item.token + " => '" + item.lexema + "'\n"; }
            }
        }
        
        return items;
    } */
}