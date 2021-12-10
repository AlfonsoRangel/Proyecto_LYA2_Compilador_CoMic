import { ArbolDeExpresion } from "../ArbolDeExpresion.js";
import { ComponenteLexico } from "../ComponenteLexico.js";
import { ItemProduccion } from "../Sintactico/ItemProduccion.js";
import { AnalisisSemantico } from "./AnalisisSemantico.js";
import { DebugSemantico } from "./debug_semantico.js";
import { ErrorSemantico } from "./ErrorSemantico.js";
import { SimboloFuncion } from "./SimboloFuncion.js";
import { SimboloParametro } from "./SimboloParametro.js";
import { SimboloPin } from "./SimboloPin.js";
import { SimboloVariable } from "./SimboloVariable.js";

export class AccionSemantica
{

    static accion = "";
    static mensajeError = new ErrorSemantico(); 

    // REFERENCIAS A ACCIONES
    static NUEVO_AMBITO = 1;
    static REGRESAR_AMBITO_ANTERIOR = 2;

    static SET_TIPO_DATO = 3;
    static SET_ID = 4;

    static SET_NOMBRE_FUNCION = 5;
    static ADD_PARAMETRO = 6;
    static ADD_FUNCION = 8;
    static SET_RETORNO_FUNCION = 9

    static AGREGAR_PIN = 11;
    static AGREGAR_CONSTANTE = 12;
    static AGREGAR_VARIABLE = 13;
    static CAMBIAR_VALOR_DE_VARIABLE = 14;

    static ADD_EXPRESION = 15;
    static FIN = 16;
    static MOV_SINTACTICO = 17;
    static VERIFICAR_EXPRESION_BOOLEANO = 18;
    static VERIFICAR_EXPRESION_ENTERO = 19

    static SET_NOMBRE_PROGRAMA = 20;
    
    static ROMPER_BUCLE = 21
    static ACTIVAR_ROMPER_BUCLE = 22
    static DESACTIVAR_ROMPER_BUCLE = 23

    static FIN_FUNCION = 24
    static RETORNAR_NADA = 25
    static RETORNAR_VALOR = 26

    static SET_NOMBRE_FUNCION_CALL = 27;
    static ADD_ARGUMENTO = 28;
    static LLAMAR_A_FUNCION = 29;
    static ADD_FUNCION_A_EXPRESION = 30;


    constructor( AnalisisSem = new AnalisisSemantico() )
    {
        this.semantico = AnalisisSem;
        this.listaVariables = [ new SimboloVariable() ];    this.listaVariables.pop();
        this.listaConstantes = [ new SimboloVariable() ];    this.listaConstantes.pop();
        this.listaFunciones = [ new SimboloFuncion() ];     this.listaFunciones.pop();
        this.listaPines = [ new SimboloPin() ];             this.listaPines.pop();
        this.listaErrores = [ new ErrorSemantico() ];       this.listaErrores.pop();
        this.debug = [ new DebugSemantico() ];              this.debug.pop();
        this.listaAmbitos = [ 0 ];   this.listaAmbitos.pop();
        this.contadorAmbitos = 0;
        this.proxVariable = new SimboloVariable();
        this.proxVariableP = new SimboloVariable();
        this.proxFuncion = new SimboloFuncion();
        this.proxFuncionCALL = new SimboloFuncion();
        this.nombreDelPrograma = ""
        this.romperActivado = 0
        this.funcionActivado = false
        this.funcionCALL_activado = false
    }


    inicializar()
    {
        this.limpiarLista( this.listaVariables );
        this.limpiarLista( this.listaConstantes );
        this.limpiarLista( this.listaFunciones );
        this.addFuncionesARDUINO()
        this.limpiarLista( this.listaPines );
        this.limpiarLista( this.debug );
        this.limpiarLista( this.listaErrores );
        this.limpiarLista( this.listaAmbitos );
        this.contadorAmbitos = 0;
        this.proxVariable = new SimboloVariable();
        this.proxVariableP = new SimboloVariable();
        this.proxFuncion = new SimboloFuncion();
        this.proxFuncionCALL = new SimboloFuncion();
        this.nombreDelPrograma = ""
        this.romperActivado = 0
        this.funcionActivado = false
        this.funcionCALL_activado = false
    }


    addFuncionesARDUINO()
    {
        // FUNCION  leer(Pin)   ->  DigitalRead( 4 )
        let leer = new SimboloFuncion( 0 , "leer" , "Booleano" , SimboloFuncion.ARDUINO )
        leer.addParametro( "pin" , "Pin" )

        // FUNCION  establecerPinDigital(Pin,Booleano)   ->  DigitalWrite( 4 , true )
        let establecerPinDigital = new SimboloFuncion( 0 , "establecerPinDigital" , "Nada" , SimboloFuncion.ARDUINO )
        establecerPinDigital.addParametro( "ID_pin" , "Pin" )
        establecerPinDigital.addParametro( "valor" , "Booleano" )

        // FUNCION  establecerPinDigital(Pin,Entero)   ->  analogWrite( 4 , 100 )
        let establecerPinAnalogico = new SimboloFuncion( 0 , "establecerPinAnalogico" , "Nada" , SimboloFuncion.ARDUINO )
        establecerPinAnalogico.addParametro( "ID_pin" , "Pin" )
        establecerPinAnalogico.addParametro( "valor" , "Entero" )

        // FUNCION  esperar(Entero)   ->  delay( 100 )
        let esperar = new SimboloFuncion( 0 , "esperar" , "Nada" , SimboloFuncion.ARDUINO )
        esperar.addParametro( "tiempoMS" , "Entero" )

        // FUNCION  esperar(Entero)   ->  delay( 100 )
        let modoPin = new SimboloFuncion( 0 , "modoPin" , "Nada" , SimboloFuncion.ARDUINO )
        modoPin.addParametro( "numeroPin" , "Entero" )
        modoPin.addParametro( "modo" , "Booleano" )

        // FUNCIONES DE ARDUINO
        this.listaFunciones.push( leer )
        this.listaFunciones.push( establecerPinDigital )
        this.listaFunciones.push( establecerPinAnalogico )
        this.listaFunciones.push( esperar )
        this.listaFunciones.push( modoPin )

        // VARIABLES GLOBALES PREDETERMINADAS
        let variableGIRO = new SimboloVariable( 0 , "giro" , "Entero")
        variableGIRO.listaAmbitos = [1]
        this.listaVariables.push( variableGIRO )
    }


    limpiarLista( lista = [] ) {
        while( lista.length > 0 ) {  lista.pop();  }
    }


    ejecutar( accion = 0 , entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
    pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , movSintactico = "" ,
    tokenEntrada = new ComponenteLexico() )
    {
        let itemDebug = new DebugSemantico();
        switch( accion )
        {
            case AccionSemantica.SET_NOMBRE_PROGRAMA: //===========================================
                this.nombreDelPrograma = this.proxVariable.nombre
                this.proxVariable = new SimboloVariable()
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Establecer Nombre del Programa y Aumentar el Ambito"
                );
                this.contadorAmbitos++
                this.listaAmbitos.push( Number(this.contadorAmbitos) )
                this.debug.push( itemDebug )
                //alert( "SET NOMBRE DEL PROGRAMA:  " + this.nombreDelPrograma )
                break

            case AccionSemantica.NUEVO_AMBITO: //===========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Aumentar el Ambito" 
                );
                this.contadorAmbitos++;
                this.listaAmbitos.push( Number(this.contadorAmbitos) )
                this.debug.push( itemDebug );
                break

            case AccionSemantica.REGRESAR_AMBITO_ANTERIOR: //=========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Volver al Ambito Anterior" 
                )
                this.listaAmbitos.pop()
                this.debug.push( itemDebug ); 
                break

            case AccionSemantica.SET_TIPO_DATO: //===========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Establecer el tipo de dato del proximo ID" 
                );
                if( tokenEntrada.lexema == "Iniciar" ){ this.proxVariable.tipoDato = "Entero" }
                else { this.proxVariable.tipoDato = tokenEntrada.lexema }
                this.debug.push( itemDebug ); 
                break

            case AccionSemantica.SET_ID:  //===================================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar la referencia del proximo ID " );
                this.proxVariable.nombre = tokenEntrada.lexema;
                this.proxVariable.numeroLinea = tokenEntrada.numeroLinea;
                this.debug.push( itemDebug );
                //alert( "SET ID:  " + this.proxVariable.nombre )
                break

            case AccionSemantica.ADD_EXPRESION: //=============================================
                this.proxVariable.valor.push( tokenEntrada );
                break

            case AccionSemantica.AGREGAR_PIN:  //=============================================
                this.agregarPin(   entradaI , entradaF , pilaI , pilaF , movSintactico )   
                break

            case AccionSemantica.SET_NOMBRE_FUNCION: //=========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar la referencia de la proxima funcion a declarar" 
                )
                this.proxFuncion = new SimboloFuncion()
                this.proxFuncion.nombre = tokenEntrada.lexema;
                this.proxFuncion.numeroLinea = tokenEntrada.numeroLinea;
                this.debug.push( itemDebug );
                //console.log( "****** ADD NOMBRE FUNCION *******" );
                //console.log( this.proxFuncion ); 
                break

            case AccionSemantica.SET_NOMBRE_FUNCION_CALL: //=========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar la referencia de la proxima funcion a llamar" 
                )
                this.proxFuncionCALL = new SimboloFuncion()
                this.proxFuncionCALL.nombre = tokenEntrada.lexema;
                this.proxFuncionCALL.numeroLinea = tokenEntrada.numeroLinea;
                
                if( this.funcionCALL_activado )
                {
                    let errorCALL =  new ErrorSemantico(
                        tokenEntrada.numeroLinea , 
                        'La llamada a la funcion "' + tokenEntrada.lexema + '" ' +
                        'NO es valido como argumento de una funcion' ,
                        "Los valores pasados a las funciones no deben incluir llamadas a funciones"
                    )
                    this.listaErrores.push( errorCALL );
                    itemDebug.mensajeError = errorCALL;
                    return
                }
                this.funcionCALL_activado = true
                this.proxVariableP.nombre = this.proxVariable.nombre
                this.proxVariableP.numeroLinea = this.proxVariable.numeroLinea
                this.proxVariableP.listaAmbitos = this.proxVariable.listaAmbitos
                this.proxVariableP.tipoDato = this.proxVariable.tipoDato
                this.proxVariableP.valor = this.proxVariable.valor.slice(0,this.proxVariable.valor.length)
                this.proxVariable = new SimboloVariable()
                
                this.debug.push( itemDebug );
                break
            
            case AccionSemantica.ADD_PARAMETRO: //=============================================
                this.addParametro( entradaI , entradaF , pilaI , pilaF , movSintactico , tokenEntrada ) 
                break

            case AccionSemantica.ADD_ARGUMENTO: //=============================================
                this.addArgumento( entradaI , entradaF , pilaI , pilaF , movSintactico , tokenEntrada ) 
                break

            case AccionSemantica.SET_RETORNO_FUNCION: //=============================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Establecer el tipo de retorno de una funcion" 
                )
                this.proxFuncion.tipoRetorno = tokenEntrada.lexema;
                this.debug.push( itemDebug );
                //console.log( "****** ADD NOMBRE FUNCION *******" );
                //console.log( this.proxFuncion ); 
                break

            case AccionSemantica.ADD_FUNCION: //=============================================
                //alert( tokenEntrada.lexema )
                this.addFuncion( entradaI , entradaF , pilaI , pilaF , movSintactico , tokenEntrada ) 
                this.contadorAmbitos++
                this.listaAmbitos.push( Number(this.contadorAmbitos) )
                this.agregarParametroComoVariable( entradaI , entradaF , pilaI , pilaF , movSintactico )
                console.log( "****** ADD FUNCION *******" );
                console.log( this.listaFunciones ); 
                break

            case AccionSemantica.AGREGAR_CONSTANTE:  //=============================================
                this.agregarConstante( entradaI , entradaF , pilaI , pilaF , movSintactico  )
                break

            case AccionSemantica.AGREGAR_VARIABLE: //===========================================
                this.agregarVariable( entradaI , entradaF , pilaI , pilaF , movSintactico ) 
                break

            case AccionSemantica.CAMBIAR_VALOR_DE_VARIABLE: //=====================================
                this.asignarValorAVariable( entradaI , entradaF , pilaI , pilaF , movSintactico ) 
                break

            case AccionSemantica.LLAMAR_A_FUNCION: //===================================
                this.utilizarFuncion( entradaI , entradaF , pilaI , pilaF , movSintactico ) 
                this.funcionCALL_activado = false
                break

            case AccionSemantica.ADD_FUNCION_A_EXPRESION: //===================================
                this.addArgumento( entradaI , entradaF , pilaI , pilaF , movSintactico , tokenEntrada )     
                this.addFuncionAExpresion( entradaI , entradaF , pilaI , pilaF , movSintactico ) 
                this.funcionCALL_activado = false
                //alert(this.proxVariable.getValor())
                break

            case AccionSemantica.VERIFICAR_EXPRESION_BOOLEANO: //==========================================
                this.comprobarExpresionBooleano( entradaI , entradaF , pilaI , pilaF , movSintactico ) 
                break

            case AccionSemantica.VERIFICAR_EXPRESION_ENTERO: //==========================================
                this.comprobarExpresionEntero( entradaI , entradaF , pilaI , pilaF , movSintactico ) 
                break

            case AccionSemantica.ROMPER_BUCLE: //===================================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Romper bucle" 
                )
                if( this.romperActivado == 0 )
                {
                    let errorRomper =  new ErrorSemantico(
                        tokenEntrada.numeroLinea , 
                        'La instruccion "Romper" se encuentra fuera de un Ciclo' ,
                        "Coloque esta instruccion dentro de un bloque Ciclo"
                    )
                    this.listaErrores.push( errorRomper );
                    itemDebug.mensajeError = errorRomper;
                }
                this.debug.push( itemDebug ); 
                break
                   
            case AccionSemantica.ACTIVAR_ROMPER_BUCLE: //=========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Permitir la instruccion Romper" 
                )
                this.romperActivado++
                this.debug.push( itemDebug ); 
                break

            case AccionSemantica.DESACTIVAR_ROMPER_BUCLE: //=========================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , 
                    "NO permitir la instruccion Romper y volver al Ambito Anterior" 
                )
                this.romperActivado--
                this.listaAmbitos.pop()
                this.debug.push( itemDebug ); 
                break

            case AccionSemantica.FIN_FUNCION: //================================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Finalizar funcion y volver al Ambito Anterior" 
                )
                this.listaAmbitos.pop()
                this.funcionActivado = false
                this.proxFuncion = new SimboloFuncion()
                this.debug.push( itemDebug ); 
                break

            case AccionSemantica.RETORNAR_NADA: //================================================
                itemDebug = new DebugSemantico( 
                    entradaI , entradaF , pilaI , pilaF , movSintactico , "Finalizar Funcion sin devolver nada" 
                )
                if( this.funcionActivado )
                {
                    if( this.proxFuncion.tipoRetorno != "Nada" )
                    {
                        let errorRetNADA1 =  new ErrorSemantico(
                            tokenEntrada.numeroLinea , 
                            'La palabra reservada "Nada" NO es aplicable en la instruccion "Devolver" ' ,
                            'La instruccion "Devolver" debe regresar un tipo de dato (' + this.proxFuncion.tipoRetorno + ')'
                        )
                        this.listaErrores.push( errorRetNADA1 );
                        itemDebug.mensajeError = errorRetNADA1;
                    }
                }
                else {
                    let errorRetNADA =  new ErrorSemantico(
                        tokenEntrada.numeroLinea , 
                        'La instruccion "Devolver Nada" se encuentra fuera de una Funcion' ,
                        "Coloque esta instruccion dentro de una funcion"
                    )
                    this.listaErrores.push( errorRetNADA );
                    itemDebug.mensajeError = errorRetNADA;
                }
                this.debug.push( itemDebug ); 
                break

            case AccionSemantica.RETORNAR_VALOR: //================================================   
                this.retornarValor()
                break

            case AccionSemantica.FIN:   
                itemDebug = new DebugSemantico( 
                    this.semantico.entradaInicial , this.semantico.entradaFinal ,
                    this.semantico.pilaInicial , this.semantico.pilaFinal , 
                    this.semantico.movimientoSintactico , "FIN" );
                this.debug.push( itemDebug );
                break;
            case AccionSemantica.MOV_SINTACTICO:
                itemDebug = new DebugSemantico(  entradaI , entradaF , pilaI , pilaF , movSintactico , "" );
                this.debug.push( itemDebug );
                break;
        }
    }













    //=================================================================
    //    LISTA DE ACCIONES SEMANTICAS
    //=================================================================

    //____________________
    // AGREGAR UN PARAMETRO A LA FUNCION TEMPORAL
    //____________________
    addParametro(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar un parametro a la proxima funcion" 
        )

        // VERFIFICAR SI HAY PARAMETRO
        if( this.proxVariable.nombre == "" ){  return }

        // VERIFICAR SI EXISTE PARAMETRO PREVIAMENTE EN LA FUNCION
        if( this.proxFuncion.existeParametro( this.proxVariable.nombre ) )
        {
            // ERROR CUANDO YA EXISTE
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = this.proxVariable.numeroLinea
            errorSem.descripcion = 'El parametro "' + this.proxVariable.nombre + '" ya existe ' +
            "previamente como parametro en la funcion"
            errorSem.sugerencia = "Utilice otro nombre como referencia de Parametro"; 
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return  
        }
        // NOMBRE DE PARAMETRO NUEVO
        let nuevoParametro = new SimboloParametro()
        nuevoParametro.tipoDato = this.proxVariable.tipoDato
        nuevoParametro.nombre = this.proxVariable.nombre
        nuevoParametro.numeroLinea = this.proxVariable.numeroLinea
        this.proxFuncion.parametros.push( nuevoParametro )

        this.proxVariable = new SimboloVariable()
        this.debug.push( itemDebug );
        //console.log( "PROXIMA FUNCION ****************" );
        //console.log( this.proxFuncion );
    }



    //____________________
    // AGREGAR UN ARGUMENTO A LA FUNCION TEMPORAL DE LLAMADA
    //____________________
    addArgumento(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar un argumento a la proxima funcion a llamar" 
        )

        //alert( this.proxVariable.valor.length )
        // VERFIFICAR SI HAY PARAMETRO
        if( this.proxVariable.valor.length == 0 ){  return }

        // COMPROBAR LA EXPRESION DEL ARGUMENTO
        let arbol = new ArbolDeExpresion( this.proxVariable.valor );
        arbol.ejecutar( this.listaAmbitos , this.listaPines , this.listaVariables , this.listaConstantes );
        if( arbol.tipoDatoExpresion == "" )
        {
            this.listaErrores.push( arbol.errorSem );
            this.proxVariable = new SimboloVariable();
            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = arbol.errorSem;
            this.debug.push( itemDebug );
            return
        }

        // AGREGAR ARGUMENTO A LA FUNCION
        let nuevoArgumento = new SimboloParametro()
        nuevoArgumento.tipoDato = arbol.tipoDatoExpresion
        nuevoArgumento.numeroLinea = this.proxVariable.valor[0].numeroLinea
        this.proxFuncionCALL.parametros.push( nuevoArgumento )

        this.proxVariable = new SimboloVariable()
        this.debug.push( itemDebug );
    }



    //____________________
    // AGREGAR UNA NUEVA FUNCION A LA TABLA
    //____________________
    addFuncion(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar un parametro a la proxima funcion y aumentar ambito" 
        )

        // VERFIFICAR SI EXISTE LA FUNCION EN LA TABLA
        for(let f=0;  f<this.listaFunciones.length;  f++)
        {
            let funcion = this.listaFunciones[f]
            if( funcion.nombre == this.proxFuncion.nombre )
            {
                if( funcion.parametros.length == this.proxFuncion.parametros.length )
                {
                    let parametrosIguales = true
                    for(let p=0;  p<funcion.parametros.length;  p++)
                    {
                        let pFuncion = funcion.parametros[p]
                        let pProxFuncion = this.proxFuncion.parametros[p]
                        if( pFuncion.tipoDato != pProxFuncion.tipoDato )
                        {  
                            parametrosIguales = false
                            break
                        }
                    }
                    if( parametrosIguales )
                    {
                        // ERROR ( FUNCION QUE YA EXISTE )
                        let errorSem = new ErrorSemantico();
                        errorSem.numeroLinea = this.proxFuncion.numeroLinea
                        errorSem.descripcion = 'La funcion "' + this.proxFuncion.nombre + '"' +
                        " con los parametros " + this.proxFuncion.getTiposParametros() + " ya existe"
                        errorSem.sugerencia = "Utilice otro nombre para la funcion, diferente cantidad de " +
                        "parametros o tipos de parametros en diferente orden"; 
                        this.listaErrores.push( errorSem );
                        this.proxFuncion = new SimboloFuncion()
    
                        itemDebug.tablaP = this.listaPines.filter( sp => true );
                        itemDebug.tablaV = this.listaVariables.filter( sp => true );
                        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                        itemDebug.mostrarTS = true;
                        itemDebug.mensajeError = errorSem;
                        this.debug.push( itemDebug )
                        return  
                    }
                }
            }
        }

        // NUEVA FUNCION
        if( this.proxFuncion.origen == 0 ){ this.proxFuncion.origen = SimboloFuncion.COMIC }
        this.listaFunciones.push( this.proxFuncion )
        //this.proxFuncion = new SimboloFuncion()
        this.debug.push( itemDebug );
        this.funcionActivado = true
        //console.log( "PROXIMA FUNCION ****************" );
        //console.log( this.proxFuncion );
    }



    //____________________
    // VERIFICAR SI LA FUNCION A UTILIZAR EN UNA EXPRESION ES CORRECTA
    //____________________
    addFuncionAExpresion(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    )
    {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Comprobar la llamada a una funcion en expresion" 
        )

        // VERFIFICAR SI EXISTE LA FUNCION EN LA TABLA
        for(let f=0;  f<this.listaFunciones.length;  f++)
        {
            let funcion = this.listaFunciones[f]
            if( funcion.nombre == this.proxFuncionCALL.nombre )
            {
                // VERIFICAR QUE LA CANTIDAD DE PARAMETROS SEA IGUAL
                if( funcion.parametros.length == this.proxFuncionCALL.parametros.length )
                {
                    let parametrosIguales = true
                    // VERIFICAR LOS TIPOS DE DATOS DE LOS PARAMETROS
                    for(let p=0;  p<funcion.parametros.length;  p++)
                    {
                        let pFuncion = funcion.parametros[p]
                        let pProxFuncion = this.proxFuncionCALL.parametros[p]
                        //alert( pFuncion.tipoDato + "!=" + pProxFuncion.tipoDato )
                        if( pFuncion.tipoDato != pProxFuncion.tipoDato )
                        {  
                            parametrosIguales = false
                            break
                        }
                    }
                    if( parametrosIguales )
                    {
                        // LLAMADA A FUNCION CORRECTA PERO TIPO DATO INCORRECTO
                        if( funcion.tipoRetorno == "Nada" )
                        {
                            let errorSem = new ErrorSemantico();
                            errorSem.numeroLinea = this.proxFuncionCALL.numeroLinea;
        
                            errorSem.descripcion = 'La funcion utilizada en la expresion llamada "' + 
                            this.proxFuncionCALL.nombre + this.proxFuncionCALL.getTiposParametros() + '" ' +
                            "NO devuleve ningun valor"
        
                            errorSem.sugerencia = "Utilice funciones que regresen algun valor ya sea Entero o Booleano"; 
        
                            this.listaErrores.push( errorSem );
            
                            itemDebug.tablaP = this.listaPines.filter( sp => true );
                            itemDebug.tablaV = this.listaVariables.filter( sp => true );
                            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                            itemDebug.mostrarTS = true;
                            itemDebug.mensajeError = errorSem;
                            this.debug.push( itemDebug );
                            this.proxFuncionCALL = new SimboloFuncion()
                            return;
                        }
                        // FUNCION CORRECTA COMO OPERANDO
                        let cpFuncion = new ComponenteLexico( "OPERANDO_FUNCION" , "" , 
                            funcion.nombre + funcion.getTiposParametros() ,  this.proxFuncionCALL.numeroLinea 
                        )
                        cpFuncion.tipoDato = funcion.tipoRetorno
                        //alert(cpFuncion.tipoDato)
                        this.proxVariableP.valor.push( cpFuncion )
                        this.proxVariable.nombre = this.proxVariableP.nombre
                        this.proxVariable.numeroLinea = this.proxVariableP.numeroLinea
                        this.proxVariable.listaAmbitos = this.proxVariableP.listaAmbitos
                        this.proxVariable.tipoDato = this.proxVariableP.tipoDato
                        this.proxVariable.valor = this.proxVariableP.valor.slice(0,this.proxVariableP.valor.length)
                        this.proxVariableP = new SimboloVariable()
                        itemDebug.tablaP = this.listaPines.filter( sp => true );
                        itemDebug.tablaV = this.listaVariables.filter( sp => true );
                        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                        itemDebug.mostrarTS = true;
                        this.debug.push( itemDebug );
                        return       
                    }
                }
            }
        }

        // LLAMADA A FUNCION INCORRECTA
        let errorSem = new ErrorSemantico();
        errorSem.numeroLinea = this.proxFuncionCALL.numeroLinea;
        
        errorSem.descripcion = 'La funcion que se intenta utilizar en la expresion llamada "' + 
        this.proxFuncionCALL.nombre + this.proxFuncionCALL.getTiposParametros() + '" NO existe'
        
        errorSem.sugerencia = "Verifique que el nombre de la funcion sea correcto. De ser asi, " +
        "verifique que la lista de valores coincida con los tipos de datos de los parametros"; 
        
        this.listaErrores.push( errorSem );
            
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        itemDebug.mensajeError = errorSem;
        this.debug.push( itemDebug );
        return;
    }


    //____________________
    // VERIFICAR SI LA FUNCION A UTILIZAR EN UNA EXPRESION ES CORRECTA
    //____________________
    utilizarFuncion(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Comprobar la llamada a una funcion" 
        )

        // VERFIFICAR SI EXISTE LA FUNCION EN LA TABLA
        for(let f=0;  f<this.listaFunciones.length;  f++)
        {
            let funcion = this.listaFunciones[f]
            if( funcion.nombre == this.proxFuncionCALL.nombre )
            {
                // VERIFICAR QUE LA CANTIDAD DE PARAMETROS SEA IGUAL
                if( funcion.parametros.length == this.proxFuncionCALL.parametros.length )
                {
                    let parametrosIguales = true
                    // VERIFICAR LOS TIPOS DE DATOS DE LOS PARAMETROS
                    for(let p=0;  p<funcion.parametros.length;  p++)
                    {
                        let pFuncion = funcion.parametros[p]
                        let pProxFuncion = this.proxFuncionCALL.parametros[p]
                        //alert( pFuncion.tipoDato + "!=" + pProxFuncion.tipoDato )
                        if( pFuncion.tipoDato != pProxFuncion.tipoDato )
                        {  
                            parametrosIguales = false
                            break
                        }
                    }
                    if( parametrosIguales )
                    {
                        // FUNCION CORRECTA
                        this.proxFuncionCALL = new SimboloFuncion()
                        itemDebug.tablaP = this.listaPines.filter( sp => true );
                        itemDebug.tablaV = this.listaVariables.filter( sp => true );
                        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                        itemDebug.mostrarTS = true;
                        this.debug.push( itemDebug );
                        return       
                    }
                }
            }
        }

        // LLAMADA A FUNCION INCORRECTA
        let errorSem = new ErrorSemantico();
        errorSem.numeroLinea = this.proxFuncionCALL.numeroLinea;
        
        errorSem.descripcion = 'La funcion que se intenta utilizar llamada "' + 
        this.proxFuncionCALL.nombre + this.proxFuncionCALL.getTiposParametros() + '" NO existe'
        
        errorSem.sugerencia = "Verifique que el nombre de la funcion sea correcto. De ser asi, " +
        "verifique que la lista de valores coincida con los tipos de datos de los parametros"; 
        
        this.listaErrores.push( errorSem );
            
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        itemDebug.mensajeError = errorSem;
        this.debug.push( itemDebug );
        return;
    }




    //____________________
    //  AGREGAR LA CONFIGURACION DE UN PIN 
    //____________________
    agregarPin(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        console.log( "********** PROXIMO PIN ****************" );
        console.log( this.proxVariable );

        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar la configuracion de un Pin" 
        );
        let pin = new SimboloPin()
        pin.numeroLinea = this.proxVariable.numeroLinea;
        pin.numeroPin = Number( this.proxVariable.valor[0].lexema )
        pin.nombre = this.proxVariable.nombre;
        if( this.getAmbitoActual() == 3 ) 
        {  
            pin.tipoPin = SimboloPin.ENTRADA; 
            // VERIFICAR SI EL PIN ESTA DENTRO DEL RANGO   ( 0-1-2-4-7-8-12-13)
            let posiblesValores = [0,1,2,4,7,8,12,13]
            let valorOK = false
            for( let p=0;  p<posiblesValores.length;  p++ )
            {
                if( posiblesValores[p] == pin.numeroPin ) {
                    valorOK = true
                    break
                }
            }
            if (valorOK == false )
            {
                let errorSem = new ErrorSemantico();
                errorSem.numeroLinea = pin.numeroLinea
                errorSem.descripcion = 'La referencia "' + pin.nombre + '" ' +
                "NO almacena un numero de pin valido"
                errorSem.sugerencia = "Configure un Pin como Entrada con alguno de los siguientes valores:\n\n" +
                "0 , 1 , 2 , 4 , 7 , 8 , 12 , 13" 
                this.listaErrores.push( errorSem );
                this.proxVariable = new SimboloVariable();
                itemDebug.tablaP = this.listaPines.filter( sp => true );
                itemDebug.tablaV = this.listaVariables.filter( sp => true );
                itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                itemDebug.mostrarTS = true;
                itemDebug.mensajeError = errorSem;
                this.debug.push( itemDebug )
                return  
            }
        }
        else
        { 
            pin.tipoPin = SimboloPin.SALIDA;
            // VERIFICAR SI EL PIN ESTA DENTRO DEL RANGO   ( 3-5-6-9-10-11 )
            let posiblesValores = [3,5,6,9,10,11]
            let valorOK = false
            for( let p=0;  p<posiblesValores.length;  p++ )
            {
                if( posiblesValores[p] == pin.numeroPin ) {
                    valorOK = true
                    break
                }
            }
            if (valorOK == false )
            {
                let errorSem = new ErrorSemantico();
                errorSem.numeroLinea = pin.numeroLinea
                errorSem.descripcion = 'La referencia "' + pin.nombre + '" ' +
                "NO almacena un numero de pin valido"
                errorSem.sugerencia = "Configure un Pin como Salida con alguno de los siguientes valores:\n\n" +
                "3 , 5 , 6 , 9 , 10 , 11" 
                this.listaErrores.push( errorSem );
                this.proxVariable = new SimboloVariable();
                itemDebug.tablaP = this.listaPines.filter( sp => true );
                itemDebug.tablaV = this.listaVariables.filter( sp => true );
                itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                itemDebug.mostrarTS = true;
                itemDebug.mensajeError = errorSem;
                this.debug.push( itemDebug )
                return  
            }
        }

        // VERIFICAR SI EL ID YA EXISTE
        if( this.esPin(pin) ){  return  }
        if( this.elPinEsVariable(pin) ){  return  }
        //if( this.elPinEsFuncion(pin) ){  return  }
        if( this.esNumeroPinRepetido(pin) ) { return }

        // AGREGAR LA CONFIGURACION DEL PIN A LA TABLA DE PINES
        this.proxVariable = new SimboloVariable()
        this.listaPines.push( pin );
        console.log( "****** PIN AGREGADO ********" );
        console.log( this.listaPines );
        
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        this.debug.push( itemDebug );
    }



    //____________________
    //  AGREGAR LA DECLARACION DE UNA CONSTANTE
    //____________________
    agregarConstante(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        console.log( "********** PROXIMO CONSTANTE ****************" );
        console.log( this.proxVariable );

        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar la declaracion de Nueva Constante" 
        )
        if( this.getAmbitoActual() == 2 ) { 
            this.proxVariable.listaAmbitos = [1]   // AMBITO PRINCIPAL
        } 
        else{
            // AMBITO POR DEFECTO
            this.proxVariable.listaAmbitos = this.listaAmbitos.filter( n => true );
        }

        // AGREGAR LA DECLARACION DE LA CONSTANTE A LA TABLA DE CONSTANTES
        let constante = new SimboloVariable();
        constante.numeroLinea = this.proxVariable.numeroLinea;
        constante.nombre = this.proxVariable.nombre;
        constante.tipoDato = this.proxVariable.tipoDato;
        constante.valor = this.proxVariable.valor.filter( cl => true );
        constante.listaAmbitos = this.proxVariable.listaAmbitos

        // VERIFICAR SI EL ID YA EXISTE
        if( this.esConstante(this.proxVariable) ){  return  }
        if( this.laConstanteEsPin(this.proxVariable) ){  return  }
        if( this.laConstanteEsVariable(this.proxVariable) ) { return }
        if( constante.valor.length == 0 ) return
        if( this.esExpresionValida( constante , itemDebug ) == false ){ return }

        this.listaConstantes.push( constante )
        this.proxVariable = new SimboloVariable()
        console.log( "****** CONSTANTE AGREGADO ********" );
        console.log( this.listaConstantes);
        
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        this.debug.push( itemDebug );
    }



    //____________________
    //  AGREGAR LA DECLARACION DE UNA VARIABLE
    //____________________
    agregarVariable(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Agregar una nueva Variable" 
        )
        let variable = new SimboloVariable();
        variable.numeroLinea = this.proxVariable.numeroLinea;
        variable.nombre = this.proxVariable.nombre;
        variable.tipoDato = this.proxVariable.tipoDato;
        variable.valor = this.proxVariable.valor.filter( cl => true );
        variable.listaAmbitos = this.listaAmbitos.filter( n => true );
        if( this.getAmbitoActual() == 2 ) { 
            variable.listaAmbitos = [1]   // AMBITO PRINCIPAL
        } 
        else{
            // AMBITO POR DEFECTO
            variable.listaAmbitos = this.listaAmbitos.filter( n => true );
        }

        // VERIFICAR SI YA EXISTE
        if( this.laVariableEsPin( variable ) ){ return }
        if( this.laVariableEsConstante( variable ) ){ return }
        if( this.esVariable( variable ) ){ return }
        if( variable.valor.length == 0 ) return
        if( this.esExpresionValida( variable , itemDebug ) == false ){ return }

        // AGREGAR LA NUEVA VARIABLE
        this.proxVariable = new SimboloVariable();
        this.listaVariables.push( variable );
        
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        this.debug.push( itemDebug );
    }



    //____________________
    //  AGREGAR LA DECLARACION DE UN
    //  PARAMETRO COMO VARIABLE
    //____________________
    agregarParametroComoVariable(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        // RECORRER PARAMETROS DE LA FUNCION
        for(let p=0;  p<this.proxFuncion.parametros.length;  p++)
        {
            let parametro = this.proxFuncion.parametros[p]
            let variable = new SimboloVariable();
            variable.numeroLinea = parametro.numeroLinea
            variable.nombre = parametro.nombre
            variable.tipoDato = parametro.tipoDato
            variable.listaAmbitos = this.listaAmbitos.filter( n => true );

            // VERIFICAR SI YA EXISTE
            if( this.laVariableEsPin( variable ) ){ return }
            if( this.laVariableEsConstante( variable ) ){ return }
            if( this.esVariable( variable ) ){ return }

            // AGREGAR LA NUEVA VARIABLE
            this.listaVariables.push( variable );
        }
    }

    


    //____________________
    //  CAMBIAR EL VALOR DE UNA VARIABLE
    //____________________
    asignarValorAVariable(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    )
    {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico , "Cambiar el valor de una variable" 
        )
        let variable = new SimboloVariable();
        variable.numeroLinea = this.proxVariable.numeroLinea;
        variable.nombre = this.proxVariable.nombre;
        variable.valor = this.proxVariable.valor;
        variable.listaAmbitos = this.listaAmbitos.slice(0 , this.listaAmbitos.length )
        this.proxVariable = new SimboloVariable()

        if( variable.nombre == "" ) return
        if( this.elIDEsPin( variable ) ) return
        if( this.elIDEsConstante( variable ) ) return

        
        // VERIFICAR SI EXISTE LA VARIABLE EN LA TABLA DE VARIABLES EN EL MISMO AMBITO
        let varLocalizada = this.getVariable( variable , itemDebug )
        if( varLocalizada == null ) return

        // COMPROBAR LOS TIPOS Y OPERACIONES DE LA EXPRESION
        variable.tipoDato = varLocalizada.tipoDato
        if( variable.valor.length == 0 ) return 
        if( this.esExpresionValida( variable , itemDebug ) == false )  return

        // CAMBIAR EL VALOR DEL ID
        varLocalizada.valor = variable.valor
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        itemDebug.mostrarArbol = true;
        let arbol = new ArbolDeExpresion( variable.valor );
        arbol.ejecutar( variable.listaAmbitos , this.listaPines , this.listaVariables , this.listaConstantes );
        itemDebug.arbol = arbol;
        this.debug.push( itemDebug );
    }



    //____________________
    //  EVALUAR SI UNA EXPRESION BOOLEANA ES CORRECTA
    //____________________
    comprobarExpresionBooleano(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico ,"Validar una condicion" 
        )
        if( this.proxVariable.valor.length == 0 ) return
        let variable = new SimboloVariable();
        variable.numeroLinea = this.proxVariable.valor[0].numeroLinea;
        variable.valor = this.proxVariable.valor.slice( 0 , this.proxVariable.valor.length )
        variable.listaAmbitos = this.listaAmbitos.slice( 0 , this.listaAmbitos.length )

        this.proxVariable = new SimboloVariable()

        let arbol = new ArbolDeExpresion( variable.valor );
        arbol.ejecutar( variable.listaAmbitos , this.listaPines , this.listaVariables , this.listaConstantes);
        if( arbol.tipoDatoExpresion == "" )
        {
            this.listaErrores.push( arbol.errorSem );
            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = arbol.errorSem;
            this.debug.push( itemDebug );
            return;
        }
        if( arbol.tipoDatoExpresion != "Booleano" )
        {
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = variable.numeroLinea;
            errorSem.descripcion = "El tipo de dato resultante de la condicion es incompatible";
            errorSem.sugerencia = "El valor devuelto por la condicion es de tipo (" + arbol.tipoDatoExpresion + ")\n" +
            "Se esperaba un tipo de dato (Booleano)"; 
            
            this.listaErrores.push( errorSem );
            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug );
            return;
        }
    }



    //____________________
    //  EVALUAR SI UNA EXPRESION ENTERO ES CORRECTA
    //____________________
    comprobarExpresionEntero(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico ,"Validar una condicion" 
        )
        if( this.proxVariable.valor.length == 0 ) return
        let variable = new SimboloVariable();
        variable.numeroLinea = this.proxVariable.valor[0].numeroLinea;
        variable.valor = this.proxVariable.valor.slice( 0 , this.proxVariable.valor.length )
        variable.listaAmbitos = this.listaAmbitos.slice( 0 , this.listaAmbitos.length )

        this.proxVariable = new SimboloVariable()

        let arbol = new ArbolDeExpresion( variable.valor );
        arbol.ejecutar( variable.listaAmbitos , this.listaPines , this.listaVariables , this.listaConstantes );
        if( arbol.tipoDatoExpresion == "" )
        {
            this.listaErrores.push( arbol.errorSem );
            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = arbol.errorSem;
            this.debug.push( itemDebug );
            return;
        }
        if( arbol.tipoDatoExpresion != "Entero" )
        {
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = variable.numeroLinea;
            errorSem.descripcion = "El tipo de dato resultante de la expresion es incompatible";
            errorSem.sugerencia = "El valor devuelto por la expresion es de tipo (" + arbol.tipoDatoExpresion + ")\n" +
            "Se esperaba un tipo de dato (Entero)"; 
            
            this.listaErrores.push( errorSem );
            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug );
            return;
        }
    }



    //____________________
    //  VERIFICAR SI LA INSTRUCCION DEVOLVER <exp>; ES CORRECTO
    //____________________
    retornarValor(
        entradaI = [ new ComponenteLexico() ] , entradaF = [ new ComponenteLexico() ] ,
        pilaI = [ new ItemProduccion() ] , pilaF = [ new ItemProduccion() ] , 
        movSintactico = "" , tokenEntrada = new ComponenteLexico() 
    ) {
        let itemDebug = new DebugSemantico( 
            entradaI , entradaF , pilaI , pilaF , movSintactico ,"Finalizar Funcion devolviendo un valor" 
        )

        // VERIFICAR SI ESTAMOS DENTRO DE UNA FUNCION
        if( this.funcionActivado )
        {
            // VALIDAR EXPRESION DE RETORNO
            if( this.proxVariable.valor.length == 0 ) return
            let valorR = new SimboloVariable();
            valorR.numeroLinea = this.proxVariable.valor[0].numeroLinea;
            valorR.valor = this.proxVariable.valor.slice( 0 , this.proxVariable.valor.length )
            valorR.listaAmbitos = this.listaAmbitos.slice( 0 , this.listaAmbitos.length )

            this.proxVariable = new SimboloVariable()

            let arbol = new ArbolDeExpresion( valorR.valor );
            arbol.ejecutar( valorR.listaAmbitos , this.listaPines , this.listaVariables , this.listaConstantes );
            if( arbol.tipoDatoExpresion == "" )
            {
                this.listaErrores.push( arbol.errorSem );
                itemDebug.mostrarArbol = true;
                itemDebug.arbol = arbol;
                itemDebug.mensajeError = arbol.errorSem;
                this.debug.push( itemDebug );
                return;
            }
            //alert( arbol.tipoDatoExpresion + "!=" + this.proxFuncion.tipoRetorno )
            if( arbol.tipoDatoExpresion != this.proxFuncion.tipoRetorno )
            {
                let errorR =  new ErrorSemantico(
                    tokenEntrada.numeroLinea , 
                    'La expresion "' + valorR.getValor() + '" NO es aplicable en la instruccion "Devolver" ' ,
                    'La instruccion "Devolver" debe regresar un tipo de dato (' + this.proxFuncion.tipoRetorno + ')'
                )
                this.listaErrores.push( errorR );
                itemDebug.mostrarArbol = true;
                itemDebug.arbol = arbol;
                itemDebug.mensajeError = errorR;
                this.debug.push( itemDebug );
                return;
            }
        }
        else 
        {
            let errorR =  new ErrorSemantico(
                tokenEntrada.numeroLinea , 
                'La instruccion "Devolver" se encuentra fuera de una Funcion' ,
                "Coloque esta instruccion dentro de una funcion"
            )
            this.listaErrores.push( errorR );
            itemDebug.mensajeError = errorR;
        }

        
    }

























    //====================================================================================
    // UTILERIAS
    //====================================================================================
    
    //_____________________
    // OBTENER EL AMBITO ACTUAL
    //_____________________
    getAmbitoActual( )
    {
        return this.listaAmbitos[ this.listaAmbitos.length - 1 ]
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE PINES
    //________________________________________________
    esPin( proxPin = new SimboloPin() )
    {
        let busqueda = this.listaPines.filter( sp => sp.nombre == proxPin.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxPin.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxPin.nombre + '" del Pin que se intenta ' +
            "configurar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Pin"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE PINES
    //________________________________________________
    esNumeroPinRepetido( proxPin = new SimboloPin() )
    {
        let busqueda = this.listaPines.filter( sp => sp.numeroPin == proxPin.numeroPin );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxPin.numeroLinea
            errorSem.descripcion = 'El numero de Pin "' + proxPin.numeroPin + '" ya esta ' +
            "configurado en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro numero de Pin disponible"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE VARIABLES
    //________________________________________________
    elPinEsVariable( proxPin = new SimboloPin() )
    {
        let busqueda = this.listaVariables.filter( sv => sv.nombre == proxPin.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxPin.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxPin.nombre + '" del Pin que se intenta ' +
            "configurar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Pin"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE FUNCIONES
    //________________________________________________
    elPinEsFuncion( proxPin = new SimboloPin() )
    {
        let busqueda = this.listaFunciones.filter( sf => sf.nombre == proxPin.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxPin.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxPin.nombre + '" del Pin que se intenta ' +
            "configurar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Pin"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }



    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE CONSTANTES
    //________________________________________________
    esConstante( proxC = new SimboloVariable() )
    {
        let busqueda = this.listaConstantes.filter( sc => sc.nombre == proxC.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxC.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxC.nombre + '" de la Constante que se intenta ' +
            "declarar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Constante"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE VARIABLES
    //________________________________________________
    laConstanteEsVariable( proxC = new SimboloPin() )
    {
        let busqueda = this.listaVariables.filter( sv => sv.nombre == proxC.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxC.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxC.nombre + '" de la Constante que se intenta ' +
            "declarar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Constante"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }



    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE VARIABLES
    //________________________________________________
    laConstanteEsPin( proxC = new SimboloPin() )
    {
        let busqueda = this.listaPines.filter( sp => sp.nombre == proxC.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxC.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxC.nombre + '" de la Constante que se intenta ' +
            "declarar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Constante"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }



    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE 
    // VARIABLES EN EL MISMO AMBITO
    //________________________________________________
    esVariable( proxV = new SimboloVariable() )
    {
        for( let i=0;  i<this.listaVariables.length;  i++ )
        {
            let v = this.listaVariables[i];
            if( v.nombre == proxV.nombre  && v.getUltimoAmbito() == proxV.getUltimoAmbito() )
            {
                let errorSem = new ErrorSemantico();
                errorSem.numeroLinea = proxV.numeroLinea;
                errorSem.descripcion = 'El identificador "' + proxV.nombre + '" ya existe en la ' +
                "linea " + v.numeroLinea;
                errorSem.sugerencia = "Utilice otro identificador para la Variable"; 
            
                this.listaErrores.push( errorSem );
                this.proxVariable = new SimboloVariable();
                let itemDebug = new DebugSemantico()
                itemDebug.tablaP = this.listaPines.filter( sp => true );
                itemDebug.tablaV = this.listaVariables.filter( sp => true );
                itemDebug.tablaF = this.listaFunciones.filter( sp => true );
                itemDebug.mostrarTS = true;
                itemDebug.mensajeError = errorSem;
                this.debug.push( itemDebug );
                return true;
            }
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE VARIABLES
    //________________________________________________
    laVariableEsConstante( proxV = new SimboloPin() )
    {
        let busqueda = this.listaConstantes.filter( sc => sc.nombre == proxV.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxV.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxV.nombre + '" de la Variable que se intenta ' +
            "declarar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Variable"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" YA ESTA EN LA TABLA DE VARIABLES
    //________________________________________________
    laVariableEsPin( proxV = new SimboloPin() )
    {
        let busqueda = this.listaPines.filter( sp => sp.nombre == proxV.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxV.numeroLinea
            errorSem.descripcion = 'La referencia "' + proxV.nombre + '" de la Variable que se intenta ' +
            "declarar ya existe en la linea " + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice otro nombre como referencia de Variable"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }




    //________________________________________________
    // VERIFICAR SI EL "ID" ESTA EN LA TABLA DE CONSTANTES
    //________________________________________________
    elIDEsConstante( proxV = new SimboloPin() )
    {
        let busqueda = this.listaConstantes.filter( sc => sc.nombre == proxV.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxV.numeroLinea
            errorSem.descripcion = 'NO es posible cambiar el valor del identificador "' + proxV.nombre + '" ' +
            'debido a que es un valor Constante. Se encuentra ubicado en la linea ' + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice un identificador que haga referencia a un tipo de valor variable"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }


    //________________________________________________
    // VERIFICAR SI EL "ID" ESTA EN LA TABLA DE PINES
    //________________________________________________
    elIDEsPin( proxV = new SimboloPin() )
    {
        let busqueda = this.listaPines.filter( sp => sp.nombre == proxV.nombre );
        if( busqueda.length != 0 ) 
        {  
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = proxV.numeroLinea
            errorSem.descripcion = 'NO es posible cambiar el valor del identificador "' + proxV.nombre + '" ' +
            'debido a que es un valor de tipo Pin. Se encuentra ubicado en la linea ' + busqueda[0].numeroLinea;
            errorSem.sugerencia = "Utilice un identificador que haga referencia a un tipo de valor variable"; 
            
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            let itemDebug = new DebugSemantico()
            itemDebug.tablaP = this.listaPines.filter( sp => true );
            itemDebug.tablaV = this.listaVariables.filter( sp => true );
            itemDebug.tablaF = this.listaFunciones.filter( sp => true );
            itemDebug.mostrarTS = true;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug )
            return true  
        }
        return false
    }



    //________________________________________________
    // VERIFICAR LOS TIPOS Y OPERACIONES DE UNA EXPRESION
    //________________________________________________
    esExpresionValida( simV = new SimboloVariable() , itemDebug = new DebugSemantico() )
    {
        let arbol = new ArbolDeExpresion( simV.valor );
        arbol.ejecutar( simV.listaAmbitos , this.listaPines , this.listaVariables , this.listaConstantes );
        if( arbol.tipoDatoExpresion == "" )
        {
            this.listaErrores.push( arbol.errorSem );
            this.proxVariable = new SimboloVariable();

            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = arbol.errorSem;
            this.debug.push( itemDebug );
            return false;
        }
        if( arbol.tipoDatoExpresion != simV.tipoDato )
        {
            let errorSem = new ErrorSemantico();
            errorSem.numeroLinea = simV.numeroLinea;
            errorSem.descripcion = "El tipo de dato resultante de la expresion que se intenta asignar " +
            'al identificador "' + simV.nombre + '" es incompatible';
            errorSem.sugerencia = "El valor devuelto por la expresion es de tipo (" + arbol.tipoDatoExpresion + ")\n" +
            "Se esperaba un tipo de dato (" + simV.tipoDato + ")"; 
            
            this.listaErrores.push( errorSem );
            this.proxVariable = new SimboloVariable();
            
            itemDebug.mostrarArbol = true;
            itemDebug.arbol = arbol;
            itemDebug.mensajeError = errorSem;
            this.debug.push( itemDebug );
            return false;
        }
        return true
    }



    //________________________________________________
    // OBTENER LA VARIABLE A BUSCAR EN LA TABLA DE VARIABLES
    //________________________________________________
    getVariable( varB = new SimboloVariable() , itemDebug = new DebugSemantico() )
    {
        // RECORRER AMBITO POR AMBITO
        for( let a=varB.listaAmbitos.length-1;  a>=0;  a-- )
        {
            // RECORRER LA LISTA DE VARIABLES
            for( let i=0;  i<this.listaVariables.length;  i++ )
            {
                let v = this.listaVariables[i];
                if( v.nombre == varB.nombre && v.getUltimoAmbito() == varB.listaAmbitos[a] ) {
                    return v
                }
            }
        }
        let errorSem = new ErrorSemantico();
        errorSem.numeroLinea = varB.numeroLinea;
        errorSem.descripcion = 'El identificador "' + varB.nombre + '" NO ha sido declarado'
        errorSem.sugerencia = 'Debes declarar previamente la variable "' + varB.nombre + '" ' +
        'mediante la siguiente sintaxis:\n\n[tipo de dato] ' + varB.nombre + ' = [exp] ;' 
        this.listaErrores.push( errorSem );
        this.proxVariable = new SimboloVariable();
            
        itemDebug.tablaP = this.listaPines.filter( sp => true );
        itemDebug.tablaV = this.listaVariables.filter( sp => true );
        itemDebug.tablaF = this.listaFunciones.filter( sp => true );
        itemDebug.mostrarTS = true;
        itemDebug.mensajeError = errorSem;
        this.debug.push( itemDebug );
        return null;
    }
    
}