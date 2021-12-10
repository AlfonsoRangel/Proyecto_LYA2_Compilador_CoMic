import { ArbolDeExpresion } from "../ArbolDeExpresion.js";
import { ComponenteLexico } from "../ComponenteLexico.js";
import { SimboloFuncion } from "../Semantico/SimboloFuncion.js";
import { SimboloPin } from "../Semantico/SimboloPin.js";
import { SimboloVariable } from "../Semantico/SimboloVariable.js";
import { Cuadruplo } from "./Cuadruplo.js";
import { DebugCodigoIntermedio } from "./debug_codigo_intermedio.js";
import { ResultadoCuadruplo } from "./ResultadoCuadruplo.js";

export class AccionCodigo
{

    static accion = "";

    // CONSTANTES
    static CONFIGURACION = 1;
    static ENTRADAS = 2;
    static SALIDAS = 3;
    static MAIN = 4;
    static SI = 5;
    static CONDICION_SI = 6;
    static CICLO = 7;
    static CONDICION_CICLO = 8;
    static SINO = 9;
    static DECLARACION_SINO = 10;
    static FUNCION = 11;


    // REFERENCIAS A ACCIONES
    static ADD_BLOQUE_ENTRADAS = 1;
    static ADD_BLOQUE_SALIDAS = 2;
    static ADD_BLOQUE_MAIN = 3;
    static ADD_BLOQUE_SI = 4;
    static ADD_BLOQUE_CONDICION_SI = 5;
    static ADD_BLOQUE_CICLO = 6;
    static ADD_BLOQUE_SINO = 7;
    static ADD_BLOQUE_CONFIGURACION = 8;
    
    static FIN_BLOQUE = 9;
    static FIN_BLOQUE_SI = 10

    static SET_ID = 11;
    static SET_TIPO_DATO = 12;
    static SET_OPERADOR = 13;
    static ADD_EXPRESION = 14;

    static DECLARACION_PIN = 15;
    static DECLARACION_CONSTANTE = 16;
    static DECLARACION_VARIABLE = 17;
    static REASIGNACION_VARIABLE = 18;
    static EVALUAR_CONDICION_SI = 19;
    static DECLARACION_ITERADOR_CICLO = 20;
    static DECLARACION_CONDICION_CICLO = 21;
    static DECLARACION_SALTOS_CICLO = 22;

    static FIN_CODIGO = 23;
    static FIN_BLOQUE_SINO = 24;
    static FIN_BLOQUE_CICLO = 25;
    static SET_OPERADOR_SECUNDARIO = 26;

    static ADD_BLOQUE_FUNCION = 27;
    static SET_RETORNO_FUNCION = 29;
    static FIN_BLOQUE_FUNCION = 30;

    static SET_NOMBRE_FUNCION_A_LLAMAR = 31;
    static ADD_PARAMETRO = 32
    static ADD_ARGUMENTO = 33
    static FIN_FUNCION_A_LLAMAR = 34
    static ADD_FUNCION_A_EXPRESION = 35

    static DECLARACION_DEVOLVER = 36
    static DECLARACION_DEVOLVER_NADA = 37
    static DECLARACION_ROMPER = 38

    static AUMENTAR_AMBITO = 39
    static REGRESAR_AL_AMBITO_ANTERIOR = 40




    constructor( )
    {
        this.debug = [ new DebugCodigoIntermedio() ]; 
        this.listaBloques = [ 0 ]; 
        this.listaAmbitos = [ 0 ];
        this.contadorAmbitos = 1;
        this.id = new ComponenteLexico();
        this.tipoDato = new ComponenteLexico();
        this.variableCICLO = new ComponenteLexico();
        this.operadorMain = new ComponenteLexico();
        this.operadorSecundario = new ComponenteLexico();
        this.expresion = [ new ComponenteLexico() ];

        this.gotosSiEsFalso = [ new ResultadoCuadruplo() ]
        this.gotosSiEsVerdadero = [ new ResultadoCuadruplo() ]
        this.SIfalso = false
        this.SIverdadero = false

        this.iteradorCicloID = [ new ResultadoCuadruplo() ]
        this.gotosCICLO = [ new ResultadoCuadruplo() ]
        this.saltosCICLO = [ new DebugCodigoIntermedio() ]
        this.finesDeCiclos = [ new ResultadoCuadruplo() ]
        this.cicloFinalizado = false

        this.id_funcion = new SimboloFuncion(0,"N/A");
        this.id_funcion_call = new ComponenteLexico();
        this.listaArgumentos = [ [ new ComponenteLexico() ] ]

        this.gotosRomper = [ new ResultadoCuadruplo() ]
        this.ROMPER_activado = false

        this.listaCuadruplosP = [ new Cuadruplo() ]
        this.proxFuncion = new SimboloFuncion()
        this.expresionP = [ new ComponenteLexico() ]
    }

 
    inicializar()
    {
        this.limpiarLista( this.debug )
        this.limpiarLista( this.listaBloques )
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.contadorAmbitos = 0;
        this.limpiarLista( this.listaAmbitos )
        this.id = null
        this.tipoDato = null
        this.operadorMain = null
        this.operadorSecundario = null
        this.limpiarLista( this.gotosSiEsFalso )
        this.limpiarLista( this.gotosSiEsVerdadero )
        this.SIfalso = false
        this.SIverdadero = false
        this.limpiarLista( this.iteradorCicloID )
        this.limpiarLista( this.gotosCICLO )
        this.limpiarLista( this.saltosCICLO )
        this.cicloFinalizado = false
        this.limpiarLista( this.finesDeCiclos )
        this.id_funcion = null
        this.id_funcion_call = null
        this.limpiarLista( this.listaArgumentos )
        this.limpiarLista( this.gotosRomper )
        this.ROMPER_activado = false
        this.limpiarLista(this.listaCuadruplosP)
        this.proxFuncion = new SimboloFuncion()
    }


    


    ejecutar( 
        accion = 0 , cp = new ComponenteLexico() , tablaVariables = [ new SimboloVariable() ] ,
        tablaConstantes = [ new SimboloVariable() ] , tablaFunciones = [ new SimboloFuncion() ] ,
        tablaPines = [ new SimboloPin() ]
    ) {
        let itemDebug = new DebugCodigoIntermedio();
        switch( accion )
        {
            case AccionCodigo.AUMENTAR_AMBITO: //================================================
                this.contadorAmbitos++
                this.listaAmbitos.push( this.contadorAmbitos )
                //alert(this.listaAmbitos)
                break

            case AccionCodigo.REGRESAR_AL_AMBITO_ANTERIOR: //=====================================
                this.listaAmbitos.pop()
                break

            case AccionCodigo.ADD_BLOQUE_CONFIGURACION: //========================================
                this.listaBloques.push( AccionCodigo.CONFIGURACION )
                break

            case AccionCodigo.ADD_BLOQUE_ENTRADAS: //========================================
                this.listaBloques.push( AccionCodigo.ENTRADAS )
                break

            case AccionCodigo.ADD_BLOQUE_SALIDAS: //========================================
                this.listaBloques.push( AccionCodigo.SALIDAS )
                break

            case AccionCodigo.ADD_BLOQUE_MAIN: //========================================
                this.listaBloques.push( AccionCodigo.MAIN )
                this.listaAmbitos.pop()
                break

            case AccionCodigo.ADD_BLOQUE_CONDICION_SI: //======================================== 
                this.listaBloques.push( AccionCodigo.CONDICION_SI );
                this.operadorMain = new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea )
                break

            case AccionCodigo.ADD_BLOQUE_CICLO: //========================================
                this.listaBloques.push( AccionCodigo.CONDICION_CICLO )
                this.contadorAmbitos++
                this.listaAmbitos.push( this.contadorAmbitos )
                break;

            case AccionCodigo.ADD_BLOQUE_SINO:  //========================================
                this.listaBloques.push( AccionCodigo.DECLARACION_SINO )
                this.declaracionSINO(  new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) )
                this.listaBloques.pop()
                this.listaBloques.push( AccionCodigo.SINO )
                this.contadorAmbitos++
                this.listaAmbitos.push( this.contadorAmbitos )
                break

            case AccionCodigo.FIN_BLOQUE_SINO: //==============================================
                this.finSINO( new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) );   
                break

            case AccionCodigo.FIN_BLOQUE: //===================================================
                this.listaBloques.pop()
                this.listaAmbitos.pop()
                break

            case AccionCodigo.SET_TIPO_DATO: //================================================
                this.tipoDato = new ComponenteLexico( "" , "" , cp.lexema , cp.numeroLinea )
                break

            case AccionCodigo.SET_ID:  //======================================================
                this.id = new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea )
                break

            case AccionCodigo.SET_OPERADOR: //=================================================
                this.operadorMain = new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea )
                break

            case AccionCodigo.SET_OPERADOR_SECUNDARIO://=================================================
                this.operadorSecundario = new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea )
                break;

            case AccionCodigo.ADD_EXPRESION:  //===============================================
                this.expresion.push( new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) );
                break;

            case AccionCodigo.DECLARACION_PIN:  //==============================================
                this.agregarPin( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break;
                
            case AccionCodigo.DECLARACION_CONSTANTE: //============================================== 
                this.agregarConstante( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break;

            case AccionCodigo.DECLARACION_VARIABLE: //==============================================
                this.agregarVariable( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break;

            case AccionCodigo.REASIGNACION_VARIABLE: //==============================================
                this.reasignarVariable( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break

            case AccionCodigo.EVALUAR_CONDICION_SI: //==============================================
                this.condicionSI( tablaVariables , tablaConstantes , tablaPines , tablaFunciones ) 
                break

            case AccionCodigo.DECLARACION_ROMPER:  //=========================================
                this.romper()  
                break

            case AccionCodigo.DECLARACION_DEVOLVER_NADA:  //=========================================
                this.devolverNada();   
                break

            case AccionCodigo.DECLARACION_DEVOLVER:  //=========================================
                this.devolver( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break

            case AccionCodigo.FIN_BLOQUE_SI: //==================================================
                this.finSI( new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) );   
                break

            case AccionCodigo.DECLARACION_ITERADOR_CICLO:  //====================================
                this.iteradorCiclo( tablaVariables , tablaConstantes , tablaPines , tablaFunciones )
                break

            case AccionCodigo.DECLARACION_CONDICION_CICLO: //====================================
                this.condicionCiclo( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break;

            case AccionCodigo.DECLARACION_SALTOS_CICLO:  //====================================
                this.saltosCiclo( tablaVariables , tablaConstantes , tablaPines , tablaFunciones );   
                break;

            case AccionCodigo.FIN_BLOQUE_CICLO:  
                this.finCICLO( new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) );   
                break;

            case AccionCodigo.ADD_BLOQUE_FUNCION: //=============================================
                this.listaBloques.push( AccionCodigo.FUNCION );
                this.contadorAmbitos++
                this.listaAmbitos.push( this.contadorAmbitos )
                this.id_funcion = new SimboloFuncion( cp.numeroLinea , cp.lexema )
                break

            case AccionCodigo.SET_RETORNO_FUNCION: //=============================================
                this.id_funcion.tipoRetorno = cp.lexema
                break

            case AccionCodigo.FIN_BLOQUE_FUNCION: //============================================= 
                this.finFuncion( new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) );   
                break;

            case AccionCodigo.SET_NOMBRE_FUNCION_A_LLAMAR: //========================================
                this.id_funcion_call = new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea )
                this.proxFuncion = new SimboloFuncion()
                this.proxFuncion.nombre = cp.lexema
                this.expresionP = this.clonarExpresion( this.expresion )
                this.limpiarLista( this.expresion )
                break;
  
            case AccionCodigo.ADD_PARAMETRO: //===================================================
                if( this.id != null && this.tipoDato != null ) {
                    this.id_funcion.addParametro( this.id.lexema , this.tipoDato.lexema )
                }
                this.id = null 
                this.tipoDato = null
                break

            case AccionCodigo.ADD_ARGUMENTO: //=================================================
                this.addArgumento( tablaVariables , tablaConstantes , tablaPines , tablaFunciones ) 
                break

            case AccionCodigo.ADD_FUNCION_A_EXPRESION: //========================================
                this.addArgumento( tablaVariables , tablaConstantes , tablaPines , tablaFunciones )     
                this.addFuncionAExpresion( tablaVariables , tablaConstantes , tablaPines , tablaFunciones ) 
                //this.funcionCALL_activado = false
                //alert(this.proxVariable.getValor())
                break

            case AccionCodigo.FIN_FUNCION_A_LLAMAR: //==========================================
                this.finLlamarFuncion( 
                    new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) ,
                    tablaVariables , tablaConstantes , tablaPines , tablaFunciones
                )
                break

            case AccionCodigo.FIN_CODIGO:  
                this.finCODIGO( new ComponenteLexico( cp.token , "" , cp.lexema , cp.numeroLinea ) );   
                break;
        }
    }


















    //=================================================================
    //    LISTA DE ACCIONES SEMANTICAS
    //=================================================================
    
    //____________________
    //  AGREGAR LA CONFIGURACION DE UN PIN   ( Pin ID @ num )
    //____________________
    agregarPin( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = this.tipoDato.lexema + " " + this.id.lexema + " @ " + this.getExpresion() + " ;"
        
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.expresion.filter( (cp) => true ) )
        if( arbolExp.obtenerCuadruplos( 
            this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC 
            ) == false )
        {
            alert( "obtener cuadruplos de expresion incorrecto :(" )
            return
        }
        lista_cuadruplos = arbolExp.listaCuadruplos.filter( (c) => true )
        //______________________
        // CUADRUPLO DE CONSTANTE
        //______________________
        lista_cuadruplos.push( new Cuadruplo(
            this.operadorMain , arbolExp.getResultadoExpresion(
                this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
            ) , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE , this.getBloqueActual() , 
                this.getAmbitos() , this.tipoDato.lexema , this.id.lexema
            )
        ))
        //______________________
        // CUADRUPLO DE PARAMETROS ( num , bool )
        //______________________
        let modo = new ComponenteLexico( "PALABRA_RESERVADA" , "" , "Verdadero" ) // ENTRADA
        if( this.getBloqueActual() == AccionCodigo.SALIDAS ){  modo.lexema = "Falso" }
        
        lista_cuadruplos.push( new Cuadruplo(
            new ComponenteLexico( "OPERADOR_ASIGNACION" , "" , "=" ) , this.expresion[0] , null , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA , this.getBloqueActual() , 
                this.getAmbitos() , "Entero"
            )
        ))
        lista_cuadruplos.push( new Cuadruplo(
            new ComponenteLexico( "OPERADOR_ASIGNACION" , "" , "=" ) , modo , null , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA , this.getBloqueActual() , 
                this.getAmbitos() , "Booleano"
            )
        ))
        //______________________
        // LLAMADA AL METODO modoPin( num , bool )
        //______________________
        let funcionAbuscar = new SimboloFuncion( 0 , "modoPin")
        funcionAbuscar.addParametro( "" , "Entero" )
        funcionAbuscar.addParametro( "" , "Booleano" )
        funcionAbuscar.tipoRetorno = this.getTipoRetornoFuncion( funcionAbuscar , listaF )
        if( funcionAbuscar.tipoRetorno == "" ) return
        lista_cuadruplos.push( new Cuadruplo(
            new ComponenteLexico( "FIN_SENTENCIA" , "" , ";" ) , 
            new ComponenteLexico( "IDENTIFICADOR" , "" , "modoPin" ) , null , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_LLAMADA_FUNCION , this.getBloqueActual() , 
                this.getAmbitos() , funcionAbuscar.tipoRetorno , "N/A" , "?" , this.getFuncion() ,
                funcionAbuscar
            )
        ))

        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        this.limpiarLista( this.expresion )
        this.id = null
        this.tipoDato = null
        this.operadorMain = null
        console.log( lista_cuadruplos )
    }


    
    //____________________
    //  AGREGAR LA CONFIGURACION DE UNA CONSTANTE   ( tipoDato ID @ exp )
    //____________________
    agregarConstante( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    )
    {
        let lineaCodigo =   this.tipoDato.lexema + " " + this.id.lexema + " @ " + this.getExpresion() + " ;"
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.expresion.filter( (cp) => true ) )
        if( arbolExp.obtenerCuadruplos
            (  this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "obtener cuadruplos de expresion incorrecto :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando1 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )

        //_________________________
        // CUADRUPLO DE CONSTANTE
        //_________________________
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain ,  operando1 , null ,  new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE , this.getBloqueActual() , 
                this.getAmbitos() , this.tipoDato.lexema , this.id.lexema , "N/A" , 
                this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))
        //console.log( this.listaCuadruplosP )
        // AGREGAR AL DEBUG
        //alert( "SIZE CUADRUPLOS P: "+this.listaCuadruplosP.length )
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        console.log( listaCUADRUPLOS )
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.id = null
        this.tipoDato = null
        this.operadorMain = null
        this.id_funcion_call = null
        //console.log( lista_cuadruplos )
    }



    //____________________
    //  AGREGAR LA CONFIGURACION DE UNA CONSTANTE   ( tipoDato ID @ exp )
    //____________________
    agregarVariable( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    )
    {
        let lineaCodigo =   this.tipoDato.lexema + " " + this.id.lexema + " = " + this.getExpresion() + " ;"
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos
            (  this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "obtener cuadruplos de expresion incorrecto :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando1 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )
        //_________________________
        // CUADRUPLO DE VARIABLE
        //_________________________
        let ambitos = this.getAmbitos() 
        if( this.getBloqueActual() == AccionCodigo.CONFIGURACION ){ ambitos = [1] }
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain ,  operando1 , null ,  new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_NUEVA_VARIABLE , this.getBloqueActual() , 
                ambitos , this.tipoDato.lexema , this.id.lexema , "N/A" ,
                this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))

        // AGREGAR AL DEBUG
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        console.log( listaCUADRUPLOS )
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.id = null
        this.tipoDato = null
        this.operadorMain = null
        this.id_funcion_call = null
        //console.log( lista_cuadruplos )
    }



    //____________________
    //  AGREGAR LA REASIGNACION DE UNA VARIABLE   ( ID = exp )
    //____________________
    reasignarVariable( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    )
    {
        let lineaCodigo = this.id.lexema + " = " + this.getExpresion() + " ;"
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos
            (  this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "obtener cuadruplos de expresion incorrecto :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando1 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )

        //_________________________
        // CUADRUPLO DE REASIGNACION DE VARIABLE
        //_________________________
        let tipoDato = this.getTipoDatoVariable( this.id.lexema , this.getAmbitos() , listaV )
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain ,  operando1 , null ,  new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE , this.getBloqueActual() , 
                this.getAmbitos() , tipoDato , this.id.lexema , "N/A" ,
                this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        console.log( listaCUADRUPLOS )
        //_________________________
        // MANEJO DE LOS SI-CICLO-ROMPER
        //_________________________
        /*
        this.manejo_SIfalso( listaCUADRUPLOS )
        this.manejo_SIverdadero( listaCUADRUPLOS )
        this.manejo_cicloFinalizado( listaCUADRUPLOS )
        this.manejo_ROMPER_activado( listaCUADRUPLOS )  */

        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.id = null
        this.tipoDato = null
        this.operadorMain = null
        this.id_funcion_call = null
    }



    //____________________
    //  AGREGAR CUADRUPLOS DE UN ARGUMENTO DE FUNCION
    //____________________
    addArgumento( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
        if( this.expresion.length == 0 ) return
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos( 
            this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC 
            ) == false )
        {
            alert( "obtener cuadruplos de expresion argumento incorrecto :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        //______________________
        // CUADRUPLO DE PARAMETRO
        //______________________
        let operando1 = arbolExp.getResultadoExpresion( 
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )
        this.listaCuadruplosP.push( new Cuadruplo(
            new ComponenteLexico( "OPERADOR_ASIGNACION" , "" , "=" ) , 
            operando1 , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA , this.getBloqueActual() , 
                this.getAmbitos() , operando1.tipoDato , "N/A" , "N/A" , this.getFuncion()
            )
        ))
        //______________________
        // GUARDAR TIPO DE PARAMETRO
        //______________________
        this.proxFuncion.addParametro( "" , operando1.tipoDato )
        console.log(operando1)
        //alert( "ARGUMENTO: " + operando1.tipoDato )
        this.limpiarLista( this.expresion )   
    }



    //____________________
    // VERIFICAR SI LA FUNCION A UTILIZAR EN UNA EXPRESION ES CORRECTA
    //____________________
    addFuncionAExpresion(
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
        // VERFIFICAR SI EXISTE LA FUNCION EN LA TABLA
        for(let f=0;  f<listaF.length;  f++)
        {
            let funcion = listaF[f]
            if( funcion.nombre == this.proxFuncion.nombre )
            {
                // VERIFICAR QUE LA CANTIDAD DE PARAMETROS SEA IGUAL
                if( funcion.parametros.length == this.proxFuncion.parametros.length )
                {
                    let parametrosIguales = true
                    // VERIFICAR LOS TIPOS DE DATOS DE LOS PARAMETROS
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
                        // LLAMADA A FUNCION CORRECTA PERO TIPO DATO INCORRECTO
                        if( funcion.tipoRetorno == "Nada" )
                        {
                            let errorCI = '(error en la generacion de codigo)\n\nLa funcion ' +
                            'utilizada en la expresion llamada "' + this.proxFuncion.nombre + 
                            this.proxFuncion.getTiposParametros() + '" NO devuleve ningun valor'
                            this.proxFuncion = new SimboloFuncion()
                            alert( errorCI )
                            return;
                        }
                        // FUNCION CORRECTA COMO OPERANDO
                        let cpFuncion = new ComponenteLexico( "OPERANDO_FUNCION" , "" , 
                            funcion.nombre ,  this.id_funcion_call.numeroLinea 
                        )
                        cpFuncion.tipoDato = funcion.tipoRetorno
                        //alert( "OPERANDO FUNCION (tipoDato): " + cpFuncion.tipoDato)
                        let callF = new SimboloFuncion( 
                            cpFuncion.numeroLinea , cpFuncion.lexema , cpFuncion.tipoDato , 
                            funcion.origen
                        )
                        callF.parametros = this.proxFuncion.parametros
                        this.listaCuadruplosP.push( new Cuadruplo(
                            new ComponenteLexico( "FIN_SENTENCIA" , "" , ";" ) , 
                            cpFuncion , null , new ResultadoCuadruplo(
                                ResultadoCuadruplo.TIPO_LLAMADA_RETORNO_FUNCION , 
                                this.getBloqueActual() , this.getAmbitos() , cpFuncion.tipoDato , "N/A" ,
                                "N/A" , this.getFuncion() , callF
                            )
                        ))
                        cpFuncion.id = this.listaCuadruplosP[ this.listaCuadruplosP.length - 1].resultado.clave
                        //alert( cpFuncion.id )
                        this.expresionP.push( cpFuncion )
                        this.expresion = this.expresionP.slice(0 , this.expresionP.length)
                        this.limpiarLista( this.expresionP )
                        return       
                    }
                }
            }
        }

        // LLAMADA A FUNCION INCORRECTA
        let errorF = '(error en la generacion de codigo)\n\nLa funcion que se intenta utilizar '+ 
        'en la expresion llamada "' + this.proxFuncion.nombre + 
        this.proxFuncion.getTiposParametros() + '" NO existe'
        alert( errorF )
        return;
    }




    //____________________
    //  AGREGAR LA CONDICION DE UNA ESTRUCTURA CONDICIONAL SI   Si( exp )
    //____________________
    condicionSI( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    )
    {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Si( " + this.getExpresion() + " ){ ... }"
        //_______________________
        //CUADUPLOS DE LA EXP
        //_______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos (  
            this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC
        ) == false )
        {
            alert( "obtener cuadruplos de condicion Si incorrecto :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando1 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )
        //____________________________________
        // CUADRUPLO DE SI   (exp == Falso)
        //____________________________________
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain , operando1 , new ComponenteLexico( "PALABRA_RESERVADA" , "" , "Falso" ) , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" , this.getFuncion()
            )
        ))
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        
        /*this.manejo_SIfalso( listaCUADRUPLOS )
        this.manejo_SIverdadero( listaCUADRUPLOS )
        this.manejo_cicloFinalizado( listaCUADRUPLOS )
        this.manejo_ROMPER_activado( listaCUADRUPLOS ) */

        this.listaBloques.pop()
        this.listaBloques.push( AccionCodigo.SI )
        //this.gotosSiEsFalso.push( listaCUADRUPLOS[ listaCUADRUPLOS.length - 1 ].resultado )

        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.operadorMain = null
    }



    //____________________
    //  EVALUAR EL CIERRE DE UNA ESTRUCTURA CONDICIONAL SI   }
    //____________________
    finSI( cp = new ComponenteLexico() )
    {
        this.listaBloques.pop()
        this.listaAmbitos.pop()
        this.SIfalso = true
        this.SIverdadero = true

        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Si ... }"

        // CUADRUPLO DE FIN BLOQUE SI   ( } )
        lista_cuadruplos.push( new Cuadruplo(
            cp , null , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" , this.getFuncion()
            )
        ))
        this.gotosSiEsVerdadero.push( lista_cuadruplos[0].resultado )
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        
    }
 
    

    //____________________
    //  DECLARACION SINO
    //____________________
    declaracionSINO( cp = new ComponenteLexico() )
    {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Sino {"

        // CUADRUPLO DE SINO
        lista_cuadruplos.push( new Cuadruplo(
            cp , null , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" , this.getFuncion()
            )
        ))
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
    }



    //____________________
    //  EVALUAR EL CIERRE DE UNA ESTRUCTURA CONDICIONAL SI   }
    //____________________
    finSINO( cp = new ComponenteLexico() )
    {
        this.listaBloques.pop()
        this.listaAmbitos.pop()

        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Sino ... }"

        // CUADRUPLO DE FIN BLOQUE SI   ( } )
        lista_cuadruplos.push( new Cuadruplo(
            cp , null , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" , this.getFuncion()
            )
        ))
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        
    }



    //____________________
    //  AGREGAR LA DECLARACION DEL ID DEL CICLO   ( Iniciar ID = exp ; )
    //____________________
    iteradorCiclo( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
    
        let lineaCodigo = "Iniciar " + this.id.lexema + " = " + this.getExpresion() + " ;"
        this.variableCICLO = this.id.clonar()
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos(  
            this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "ERROR al obtener cuadruplos de expresion de la variable CICLO :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando1 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )
        //_________________________
        // CUADRUPLO DE VARIABLE CICLO
        //_________________________
        this.listaCuadruplosP.push( new Cuadruplo(
            new ComponenteLexico( "PALABRA_RESERVADA" , "" , "Ciclo" ) ,  operando1 , null ,  
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_NUEVA_VARIABLE , this.getBloqueActual() , this.getAmbitos() , 
                "Entero" , this.id.lexema , "N/A" , this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))
        //_________________________
        // ACTUALIZACION DE DATOS
        //_________________________
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        
        // ALAMACENAR ESTE ID PARA UTILIZARLO EN LA CONDICION Y SALTO
        /*
        this.iteradorCicloID.push( listaCUADRUPLOS[ listaCUADRUPLOS.length - 1 ].resultado )
        this.manejo_SIfalso( listaCUADRUPLOS )
        this.manejo_SIverdadero( listaCUADRUPLOS )
        this.manejo_cicloFinalizado( listaCUADRUPLOS )
        this.manejo_ROMPER_activado( listaCUADRUPLOS ) */
    
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.id = null
        this.tipoDato = null
        this.operadorMain = null
        this.id_funcion_call = null

    }



    //____________________
    //  AGREGAR LA CONDICION DE UNA ESTRUCTURA CONDICIONAL CICLO ( Salir opComp exp ; )
    //____________________
    condicionCiclo( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
    
        let lineaCodigo = "Salir " + this.operadorMain.lexema + " " + this.getExpresion() + " ;"
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos(  
            this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "ERROR al obtener cuadruplos de expresion de la condicion CICLO :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando2 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )
        //_________________________
        // CUADRUPLO DE COMPARACION    varCICLO opComp exp 
        //_________________________
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain ,  this.variableCICLO ,  operando2 ,  new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_DATO_TEMPORAL , this.getBloqueActual() , this.getAmbitos() , 
                "Booleano" , "N/A" , "N/A" , this.getFuncion()
            )
        ))
        //_________________________
        // CUADRUPLO DE CONDICION CICLO   (Salir )  --> ==
        //_________________________
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorSecundario , 
            new ComponenteLexico( "TIPO_DATO_TEMPORAL" , "" ,
                this.listaCuadruplosP[ this.listaCuadruplosP.length - 1 ].resultado.clave )  ,
            new ComponenteLexico( "PALABRA_RESERVADA" , "" , "Verdadero" ) , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" , this.getFuncion()
            )
        ))
        //_________________________
        // ACTUALIZACION DE DATOS
        //_________________________
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        
        // ALAMCENAR LA REFERENCIA DE LA CONDICION DE SALIDA
        //this.finesDeCiclos.push( listaCUADRUPLOS[ listaCUADRUPLOS.length - 1 ].resultado )
    
        // ALMACENAR RETORNO DE UN CICLO
        //this.gotosCICLO.push( listaCUADRUPLOS[0].resultado )

        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.tipoDato = null
        this.id = null
        this.operadorMain = null
        this.id_funcion_call = null
        this.operadorSecundario = null
    }



    //____________________
    //  AGREGAR LA INSTRUCCION DE STEP EN CICLO      Saltos num )
    //____________________
    saltosCiclo( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
    
        let lineaCodigo = "Saltos " + this.getExpresion() + " )"
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos(  
            this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "ERROR al obtener cuadruplos de expresion de los saltos CICLO :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando2 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )
        //_________________________
        // CUADRUPLO DE INCREMENTO    T = varCICLO + exp 
        //_________________________
        this.listaCuadruplosP.push( new Cuadruplo(
            new ComponenteLexico( "OPERADOR_SUMAR" , "" , "+") ,  
            this.variableCICLO.clonar() , operando2 ,  new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_DATO_TEMPORAL , this.getBloqueActual() , this.getAmbitos() , 
                "Numero" , "N/A" , "N/A" , this.getFuncion()
            )
        ))
        //_________________________
        // CUADRUPLO DE SALTOS CICLO   ( Saltos .. T ... null )
        //_________________________
        let tipoDato = this.getTipoDatoVariable( this.variableCICLO.lexema , this.getAmbitos() , listaV )
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain , 
            new ComponenteLexico( "TIPO_DATO_TEMPORAL" , "" ,
                this.listaCuadruplosP[ this.listaCuadruplosP.length - 1 ].resultado.clave )  ,
            null , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE , this.getBloqueActual() , 
                this.getAmbitos() , tipoDato , this.variableCICLO.lexema , "N/A" , this.getFuncion()
            )
        ))
        //_________________________
        // ACTUALIZACION DE DATOS
        //_________________________
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        
        // ALMACENAR RETORNO DE UN CICLO
        //this.saltosCICLO.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) )
        //this.iteradorCicloID.pop()

        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.variableCICLO = null
        this.tipoDato = null
        this.id = null
        this.operadorMain = null
        this.id_funcion_call = null
        this.operadorSecundario = null

        this.listaBloques.pop()
        this.listaBloques.push( AccionCodigo.CICLO )
    }




    //____________________
    //  EVALUAR EL CIERRE DE UNA ESTRUCTURA CONDICIONAL CICLO   }
    //____________________
    finCICLO( cp = new ComponenteLexico() )
    {
        this.listaBloques.pop()
        this.listaAmbitos.pop()

        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Ciclo ... }"

        // CUADRUPLOS DE LA ITERACION SALTO DEL CICLO   ( } )
        //this.debug.push( this.saltosCICLO[ this.saltosCICLO.length - 1 ] )
        //this.saltosCICLO.pop()

        // CUADRUPLO DE FIN BLOQUE CICLO   ( } )
        lista_cuadruplos.push( new Cuadruplo(
            cp , null , null , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" /*this.gotosCICLO[ this.gotosCICLO.length - 1 ].clave */ , 
                this.getFuncion()
            )
        ))
        //this.gotosCICLO.pop()

        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        
        this.cicloFinalizado = true
        this.ROMPER_activado = true
    }



    //____________________
    //  SENTENCIA ->   Devolver Nada ;
    //____________________
    devolverNada( )
    {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Devolver Nada ;"

        // CUADRUPLO DE DEVOLVER NADA
        lista_cuadruplos.push( new Cuadruplo(
            this.operadorMain , this.id , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_FIN_FUNCION , this.getBloqueActual() , 
                this.getAmbitos() , "Nada" , "N/A" , "N/A" , this.getFuncion() ,
                new SimboloFuncion(0,"N/A")
            )
        ))
/*
        this.manejo_SIfalso( lista_cuadruplos )
        this.manejo_SIverdadero(lista_cuadruplos )
        this.manejo_cicloFinalizado( lista_cuadruplos )
        this.manejo_ROMPER_activado( lista_cuadruplos )*/

        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        
        this.id = null
        this.operadorMain = null
    }



    //____________________
    //  AGREGAR LA CONDICION DE UNA ESTRUCTURA CONDICIONAL SI   Si( exp )
    //____________________
    devolver( 
        listaV = [ new SimboloVariable() ] ,  listaC = [ new SimboloVariable() ] ,
        listaP = [ new SimboloPin() ] , listaF = [ new SimboloFuncion() ] 
    ) {
        
        let lineaCodigo = "Devolver " + this.getExpresion() + " ;"
        //______________________
        //CUADUPLOS DE LA EXP
        //______________________
        let arbolExp = new ArbolDeExpresion( this.clonarExpresion( this.expresion ) )
        if( arbolExp.obtenerCuadruplos
        (  this.getBloqueActual() , this.getAmbitos() , this.getFuncion() , 
            new SimboloFuncion(0,"N/A") , listaP , listaV , listaC ) == false )
        {
            alert( "obtener cuadruplos de expresion incorrecto :(" )
            return
        }
        let cArbol = arbolExp.listaCuadruplos.filter( (c) => true )
        for( let c=0;  c<cArbol.length;  c++ ) {
            this.listaCuadruplosP.push( cArbol[c] )
        }
        let operando1 = arbolExp.getResultadoExpresion(
            this.getBloqueActual() , this.getAmbitos() , listaP , listaV , listaC 
        )

        //_________________________
        // CUADRUPLO DE DEVOLVER exp
        //_________________________
        /*
        lista_cuadruplos.push( new Cuadruplo(
            this.operadorMain , operando1 , null , 
            new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA , this.getBloqueActual() , 
                this.getAmbitos() , "pendiente" , "N/A" , "N/A" , metodo , metodoRET
            )
        ))*/
        this.listaCuadruplosP.push( new Cuadruplo(
            this.operadorMain , operando1 , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_FIN_FUNCION , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "N/A" , this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))
        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
        console.log( listaCUADRUPLOS )
        //_________________________
        // MANEJO DE LOS SI-CICLO-ROMPER
        //_________________________
        /*
        this.manejo_SIfalso( listaCUADRUPLOS )
        this.manejo_SIverdadero( listaCUADRUPLOS )
        this.manejo_cicloFinalizado( listaCUADRUPLOS )
        this.manejo_ROMPER_activado( listaCUADRUPLOS )  */

        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) );
        this.limpiarLista( this.expresion )
        this.limpiarLista( this.expresionP )
        this.limpiarLista( this.listaCuadruplosP )
        this.operadorMain = null
        this.id_funcion_call = null
    }



    //____________________
    //  AGREGAR LA DECLARACION DE UNA DECLARACION ROMPER ;
    //____________________
    romper( )
    {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Romper ;"

        // CUADRUPLO DE ROMPER 
        lista_cuadruplos.push( new Cuadruplo(
            this.operadorMain , null , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_GOTO , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "?" , this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))

        //MANEJO DEL BLOQUE SI
        /*
        this.manejo_SIfalso( lista_cuadruplos )
        this.manejo_SIverdadero( lista_cuadruplos )
        this.manejo_cicloFinalizado( lista_cuadruplos )
        this.manejo_ROMPER_activado( lista_cuadruplos )

        this.gotosRomper.push( lista_cuadruplos[0].resultado ) */
        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        this.operadorMain = null
        //console.log( lista_cuadruplos )
    }



    //____________________
    //  EVALUAR EL CIERRE DE UNA DECLARACION DE FUNCION   }
    //____________________
    finFuncion( cp = new ComponenteLexico() )
    {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "Funcion ... }"

        // CUADRUPLO DE FIN BLOQUE CICLO   ( } )
        lista_cuadruplos.push( new Cuadruplo(
            cp , null , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.TIPO_FIN_FUNCION , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "N/A" , this.getFuncion() , new SimboloFuncion(0,"N/A")
            )
        ))
        this.listaBloques.pop()
        this.listaAmbitos.pop()
        this.id_funcion = null

        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        
    }



    //____________________
    //  EVALUAR EL CIERRE DE UNA LLAMADA A UNA FUNCION   ;
    //____________________
    finLlamarFuncion( 
        cp = new ComponenteLexico() , listaV = [ new SimboloVariable() ] ,  
        listaC = [ new SimboloVariable() ] , listaP = [ new SimboloPin() ] , 
        listaF = [ new SimboloFuncion() ] 
    ) {
        // VERFIFICAR SI EXISTE LA FUNCION EN LA TABLA
        for(let f=0;  f<listaF.length;  f++)
        {
            let funcion = listaF[f]
            if( funcion.nombre == this.proxFuncion.nombre )
            {
                // VERIFICAR QUE LA CANTIDAD DE PARAMETROS SEA IGUAL
                if( funcion.parametros.length == this.proxFuncion.parametros.length )
                {
                    let parametrosIguales = true
                    // VERIFICAR LOS TIPOS DE DATOS DE LOS PARAMETROS
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
                        // LLAMADA A FUNCION CORRECTA
                        let cpFuncion = new ComponenteLexico( "" , "" , 
                            funcion.nombre ,  this.id_funcion_call.numeroLinea 
                        )
                        cpFuncion.tipoDato = funcion.tipoRetorno
                        //alert( "OPERANDO FUNCION (tipoDato): " + cpFuncion.tipoDato)
                        let callF = new SimboloFuncion(
                            cpFuncion.numeroLinea , cpFuncion.lexema , cpFuncion.tipoDato ,
                            funcion.origen
                        )
                        callF.parametros = this.proxFuncion.parametros
                        this.listaCuadruplosP.push( new Cuadruplo(
                            cp , cpFuncion , null , new ResultadoCuadruplo(
                                ResultadoCuadruplo.TIPO_LLAMADA_FUNCION , this.getBloqueActual() , 
                                this.getAmbitos() , cpFuncion.tipoDato , "N/A" , "?" , 
                                this.getFuncion() , callF
                            )
                        ))
                        //____________________
                        // GENERAR DEBUG
                        //____________________
                        let lineaCodigo = callF.nombre + callF.getTiposParametros() + " ;"
                        let listaCUADRUPLOS = this.clonarListaCuadruplosP()
                        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , listaCUADRUPLOS ) )
                        this.id_funcion_call = null
                        this.limpiarLista( this.expresion )
                        this.limpiarLista( this.listaCuadruplosP )
/*
                        this.manejo_SIfalso( listaCUADRUPLOS )
                        this.manejo_SIverdadero( listaCUADRUPLOS )
                        this.manejo_cicloFinalizado( listaCUADRUPLOS )
                        this.manejo_ROMPER_activado( listaCUADRUPLOS )  */
                        return
                        
                        // BUSCAR EL 1º CUADRUPLO DE LA FUNCION A LLAMAR COMO GOTO
                        /*if( funcion.origen == SimboloFuncion.COMIC )
                        {
                            // BUSCAR EL 1º CUADRUPLO DE LA FUNCION
                            let listaC = this.getCuadruplos()
                            for( let k=0; k<listaC.length;  k++ )
                            {
                                let cuadruplo = listaC[k]
                                //alert( cuadruplo.resultado.nombreMetodo + "<>" + this.id_funcion_call.lexema )
                                if( cuadruplo.resultado.nombreMetodo == this.id_funcion_call.lexema )
                            {
                            lista_cuadruplos[ lista_cuadruplos.length - 1 ].resultado.refGOTO = cuadruplo.resultado.clave
                            break
                        } */
              
                    }
                }
            }
        }

        // LLAMADA A FUNCION INCORRECTA
        let errorF = '(error en la generacion de codigo)\n\nLa funcion que se intenta utilizar '+ 
        'en la expresion llamada "' + this.proxFuncion.nombre + 
        this.proxFuncion.getTiposParametros() + '" NO existe'
        alert( errorF )
        return;
        
        
    }





    //____________________
    //  EVALUAR EL CIERRE DEL PROGRAMA   }
    //____________________
    finCODIGO( cp = new ComponenteLexico() )
    {
        let lista_cuadruplos = [ new Cuadruplo() ]
        this.limpiarLista( lista_cuadruplos )
        let lineaCodigo = "FIN ... }"
        // CUADRUPLO DE FIN
        lista_cuadruplos.push( new Cuadruplo(
            cp , null , null , new ResultadoCuadruplo(
                ResultadoCuadruplo.FIN_PROGRAMA , this.getBloqueActual() , this.getAmbitos() , 
                "N/A" , "N/A" , "N/A" , this.getFuncion()
            )
        ))
        //MANEJO DEL BLOQUE SI
        /*
        for( let i=this.gotosSiEsFalso.length-1;  i>=0;  i-- )
        {
            let ref = this.gotosSiEsFalso[i]
            ref.refGOTO = lista_cuadruplos[0].resultado.clave
            this.gotosSiEsFalso.pop()
        }
        for( let i=this.gotosSiEsVerdadero.length-1;  i>=0;  i-- )
        {
            let ref = this.gotosSiEsVerdadero[i]
            ref.refGOTO = lista_cuadruplos[0].resultado.clave
            this.gotosSiEsVerdadero.pop()
        }
        for( let i=this.finesDeCiclos.length-1;  i>=0;  i-- )
        {
            let ref = this.finesDeCiclos[i]
            ref.refGOTO = lista_cuadruplos[0].resultado.clave
            this.finesDeCiclos.pop()
        }
        for( let i=this.gotosRomper.length-1;  i>=0;  i-- )
        {
            let ref = this.gotosRomper[i]
            ref.refGOTO = lista_cuadruplos[0].resultado.clave
            this.gotosRomper.pop()
        }
        */

        // AGREGAR AL DEBUG
        this.debug.push( new DebugCodigoIntermedio( lineaCodigo , lista_cuadruplos ) );
        
    }



















//MANEJO DEL BLOQUE SI
    manejo_SIfalso( listaC = [ new Cuadruplo() ] )
    {
        if( this.SIfalso )
        {
            this.SIfalso = false
            for( let i=this.gotosSiEsFalso.length-1;  i>=0;  i-- )
            {
                let ref = this.gotosSiEsFalso[i]
                ref.refGOTO = listaC[0].resultado.clave
                this.gotosSiEsFalso.pop()
                if( ref.getAmbito() == this.listaAmbitos[ this.listaAmbitos.length - 1 ] ) {  break }
            }
        }
    }



    manejo_SIverdadero( listaC = [ new Cuadruplo() ] )
    {
        if( this.SIverdadero )
        {
            this.SIverdadero = false
            for( let i=this.gotosSiEsVerdadero.length-1;  i>=0;  i-- )
            {
                let ref = this.gotosSiEsVerdadero[i]
                ref.refGOTO = listaC[0].resultado.clave
                this.gotosSiEsVerdadero.pop()
                if( ref.getAmbito() == this.listaAmbitos[ this.listaAmbitos.length - 1 ] ) {  break }
            }       
        }
    }


    manejo_cicloFinalizado( listaC = [ new Cuadruplo() ] )
    {
        if( this.cicloFinalizado )
        {
            this.cicloFinalizado = false
            for( let i=this.finesDeCiclos.length-1;  i>=0;  i-- )
            {
                let ref = this.finesDeCiclos[i]
                ref.refGOTO = listaC[0].resultado.clave
                this.finesDeCiclos.pop()
                if( ref.getAmbito() == this.listaAmbitos[ this.listaAmbitos.length - 2 ] ) {  break }
            }
        }
    }


    manejo_ROMPER_activado( listaC = [ new Cuadruplo() ])
    {
        if( this.ROMPER_activado )
        {
            this.ROMPER_activado = false
            for( let i=this.gotosRomper.length-1;  i>=0;  i-- )
            {
                let ref = this.gotosRomper[i]
                if( ref.getAmbito() == this.listaAmbitos[ this.listaAmbitos.length - 1 ] ) {  break }
                ref.refGOTO = listaC[0].resultado.clave
                this.gotosRomper.pop()
            }
        }
    }

















    //=================================================================
    //                              RECURSOS
    //=================================================================
    getExpresion( )
    {
        let exp = "";
        for( let i=0;  i<this.expresion.length; i++ )
        {
            exp = exp + this.expresion[i].lexema + " ";
        }
        return exp.substring( 0 , exp.length - 1 );
    }

    getBloqueActual()
    {
        return this.listaBloques[ this.listaBloques.length - 1 ]
    }

    getAmbitos()
    {
        return this.listaAmbitos.slice( 0 , this.listaAmbitos.length )
    }

    //_____________________
    // OBTENER EL AMBITO ACTUAL
    //_____________________
    getAmbitoActual( )
    {
        return this.listaAmbitos[ this.listaAmbitos.length - 1 ]
    }

    limpiarLista( lista = [] )
    {
        while( lista.length > 0 ) {  lista.pop();  }
    }



    getCuadruplos( )
    {
        let listaC = [ new Cuadruplo() ]
        this.limpiarLista( listaC )
        // LISTA DE INSTRUCCIONES
        for( let i=0;  i<this.debug.length;  i++ )
        {
            let instruccion = this.debug[i]
            // LISTA DE CUADRUPLOS
            for(let k=0; k<instruccion.listaCuadruplos.length;  k++)
            {
                let cuadruplo = instruccion.listaCuadruplos[k]
                // TRANSFERIR CUADRUPLO
                listaC.push( cuadruplo.clonar() )
            }
        }
        return listaC
    }


    //_____________________
    //  BUSCAR FUNCION
    //_____________________
    getTipoRetornoFuncion( simF = new SimboloFuncion() , tablaF = [ new SimboloFuncion() ] )
    {
        // RECORRER FUNCIONES
        for(let f=0;  f<tablaF.length;  f++)
        {
            let funcion = tablaF[f]
            if( funcion.nombre == simF.nombre )
            {
                if( funcion.parametros.length == simF.parametros.length )
                {
                    let parametrosIguales = true
                    for(let p=0;  p<funcion.parametros.length;  p++)
                    {
                        let pFuncion = funcion.parametros[p]
                        let pFuncionB = simF.parametros[p]
                        if( pFuncion.tipoDato != pFuncionB.tipoDato )
                        {  
                            parametrosIguales = false
                            break
                        }
                    }
                    if( parametrosIguales )
                    {
                        // FUNCION ENCONTRADA
                        return funcion.tipoRetorno
                    }
                }
            }
        }
        alert( "(error en generacion de codigo) NO se encuentro la funcion" + simF.nombre + simF.getTiposParametros() )
        return ""
    }



    getTipoDatoTemporalPila( operando = new ComponenteLexico() )
    {
        switch( operando.token )
        {
            case "TIPO_DATO_TEMPORAL": 
                return this.listaCuadruplosP[ this.listaCuadruplosP.length - 1 ].resultado.tipoDato
            
            case "NUMERO": 
                return "Entero"

            case "PALABRA_RESERVADA": 
                if( operando.lexema == "Verdadero" || operando.lexema == "Falso" ) return "Booleano"
                alert("TIPO DE DATO PILA NO RECONOCIDO: " + operando.lexema)
                return "N/A"

            
        }
    }



    clonarListaCuadruplosP()
    {
        let listaCUADRUPLOS = [ new Cuadruplo() ]
        listaCUADRUPLOS.pop()
        for(let c=0;  c<this.listaCuadruplosP.length;  c++)
        {
            listaCUADRUPLOS.push( this.listaCuadruplosP[c].clonar() )
        }
        return listaCUADRUPLOS
    }


    clonarExpresion( exp = [ new ComponenteLexico() ] )
    {
        let listaCP = [ new ComponenteLexico() ]
        listaCP.pop()
        for(let c=0;  c<exp.length;  c++)
        {
            listaCP.push( exp[c].clonar() )
        }
        return listaCP
    }


    getFuncion()
    {
        let funcion = new SimboloFuncion(0,"N/A")
        if( this.id_funcion != null )  {  funcion = this.id_funcion.clonar()  }
        //alert( funcion.nombre )
        return funcion
    }


    getTipoDatoVariable( ID = "" , listaAmbitos = [0] , listaVariables = [ new SimboloVariable() ] )
    {
        // BUSCAR EL ID EN LA TABLA DE VARIABLES EN AMBITO VALIDO
        for( let i=listaAmbitos.length-1; i>=0; i-- )
        {
            let amb = listaAmbitos[i];
            let busqueda = listaVariables.filter( simV => 
                simV.nombre == ID  &&  simV.getUltimoAmbito() == amb );
            if( busqueda.length != 0 )  return busqueda[0].tipoDato
        }
        let mensajeID = "Identificador '" + ID + "' NO declarado" 
        alert( "(error en generacion de codigo)\n\n" + mensajeID )
        return "N/A"
    }

}