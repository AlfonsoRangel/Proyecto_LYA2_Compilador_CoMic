import { Cuadruplo } from "../Codigo_Intermedio/Cuadruplo.js";
import { DebugCodigoIntermedio } from "../Codigo_Intermedio/debug_codigo_intermedio.js";
import { ResultadoCuadruplo } from "../Codigo_Intermedio/ResultadoCuadruplo.js";
import { ComponenteLexico } from "../ComponenteLexico.js";

export class CodigoOptimizado 
{
    constructor()
    {
        this.listaInstrucciones = [ new DebugCodigoIntermedio() ]
        this.listaCuadruplos = [ new DebugCodigoIntermedio() ]
        this.listaInstruccionesOptimizado = [ new DebugCodigoIntermedio() ]
        this.listaTemporales = [ new Cuadruplo() ]
        this.listaConstantes = [ new Cuadruplo() ]
        this.listaVariables = 
        [ 
            {
                cuadruplo: new Cuadruplo() ,
                utilizada: false
            }
        ]
    }

    inicializar( listaInstrucciones = [ new DebugCodigoIntermedio() ] , 
    listaCuadruplos = [ new Cuadruplo() ] )
    {
        this.listaInstrucciones = listaInstrucciones
        this.listaCuadruplos = listaCuadruplos
        this.limpiarLista( this.listaInstruccionesOptimizado )
        this.limpiarLista( this.listaTemporales )
        this.limpiarLista( this.listaConstantes )
        this.limpiarLista( this.listaVariables )
        let variableGIRO = new Cuadruplo( 
            new ComponenteLexico( "OPERADOR_ASIGNACION" , "" , "=" ) ,
            new ComponenteLexico( "NUMERO" , "" , "1" ) , null ,
            new ResultadoCuadruplo( ResultadoCuadruplo.TIPO_NUEVA_VARIABLE , 1 , [1] , 
                "Entero" , "giro" ) 
        )
        this.listaVariables.push( { cuadruplo: variableGIRO ,  utilizada: false  } )
    }

 

    generarCodigoOptimizado()
    {
        // RECORRIDO DE INSTRUCCIONES
        for(let i=0;  i<this.listaInstrucciones.length;  i++)
        {
            let instruccion = this.listaInstrucciones[i] 
            let nuevaIntruccion = new DebugCodigoIntermedio()
            let listaNuevosCuadruplos = [ new Cuadruplo() ]
            this.limpiarLista( listaNuevosCuadruplos )
            
            // RECORRIDO DE CUADRUPLOS
            for(let c=0;  c<instruccion.listaCuadruplos.length;  c++)
            {
                let cuadruplo = instruccion.listaCuadruplos[c].clonar()

                // ANALIZAR TIPO
                switch( cuadruplo.resultado.tipo )
                {
                    case ResultadoCuadruplo.TIPO_LLAMADA_FUNCION: //(CALL)==================================
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;

                    case ResultadoCuadruplo.TIPO_LLAMADA_RETORNO_FUNCION: //(CALLRF)==================================
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;
                    
                    case ResultadoCuadruplo.TIPO_FIN_FUNCION:  //(RET)=====================================
                        if( cuadruplo.operando1 != null ) this.sustituirTemporal( cuadruplo.operando1 , cuadruplo )
                        if( cuadruplo.operando2 != null ) this.sustituirTemporal( cuadruplo.operando2 , cuadruplo )    
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;
            
                    case ResultadoCuadruplo.TIPO_NUEVA_VARIABLE: //(NV)=================================== 
                        if( cuadruplo.operando1 != null ) this.sustituirTemporal( cuadruplo.operando1 , cuadruplo )
                        if( cuadruplo.operando2 != null ) this.sustituirTemporal( cuadruplo.operando2 , cuadruplo )    
                        listaNuevosCuadruplos.push( cuadruplo )
                        this.listaVariables.push(
                            {
                                cuadruplo: cuadruplo , 
                                utilizada: false
                            }
                        )
                        break;
            
                
                    case ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE:  //(NC)==================================
                        //cuadruplo.estatus = Cuadruplo.OMITIR
                        if( cuadruplo.operando1 != null ) this.sustituirTemporal( cuadruplo.operando1 , cuadruplo )
                        if( cuadruplo.operando2 != null ) this.sustituirTemporal( cuadruplo.operando2 , cuadruplo )
                        listaNuevosCuadruplos.push( cuadruplo )
                        this.listaConstantes.push( cuadruplo )
                        break;
            
                    case ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE:  //(RV)===============================
                        if( cuadruplo.operando1 != null ) this.sustituirTemporal( cuadruplo.operando1 , cuadruplo )
                        if( cuadruplo.operando2 != null ) this.sustituirTemporal( cuadruplo.operando2 , cuadruplo )    
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;
            
                    case ResultadoCuadruplo.TIPO_DATO_TEMPORAL: //(T)=====================================
                        if( cuadruplo.operando1 != null ) this.sustituirTemporal( cuadruplo.operando1 , cuadruplo )
                        if( cuadruplo.operando2 != null ) this.sustituirTemporal( cuadruplo.operando2 , cuadruplo )
                        listaNuevosCuadruplos.push( cuadruplo )
                        this.listaTemporales.push( cuadruplo )
                        this.simplificarT( cuadruplo , listaNuevosCuadruplos )
                        break;
            
                    case ResultadoCuadruplo.TIPO_GOTO:  //(G)=============================================
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;
            
                    case ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA:  //(P)===============================
                        if( cuadruplo.operando1 != null ) this.sustituirTemporal( cuadruplo.operando1 , cuadruplo )
                        if( cuadruplo.operando2 != null ) this.sustituirTemporal( cuadruplo.operando2 , cuadruplo )    
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;
            
                    case ResultadoCuadruplo.FIN_PROGRAMA: //(FIN)===========================================
                        listaNuevosCuadruplos.push( cuadruplo )
                        break;

                } // switch tipo
            } // for cuadruplos

            nuevaIntruccion.lineaCodigo = instruccion.lineaCodigo
            nuevaIntruccion.listaCuadruplos = listaNuevosCuadruplos
            this.listaInstruccionesOptimizado.push( nuevaIntruccion )
        }  // for instrucciones

        // OMITIR VARIABLES NO USADAS
        for(let i=0;  i<this.listaInstruccionesOptimizado.length;  i++)
        {
            let itemDebug = this.listaInstruccionesOptimizado[i] 
            let listaCuadruplosOp = itemDebug.listaCuadruplos

            // RECORRIDO DE CUADRUPLOS
            for(let c=0;  c<listaCuadruplosOp.length;  c++)
            {
                let cuadruplo = listaCuadruplosOp[c]

                // ANALIZAR TIPO
                switch( cuadruplo.resultado.tipo )
                {
                    case ResultadoCuadruplo.TIPO_NUEVA_VARIABLE: //(NV)=================================== 
                        if( this.esVariableUtilizada( cuadruplo ) == false ) cuadruplo.estatus = Cuadruplo.OMITIR
                        break
            
                    case ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE:  //(RV)===============================
                        if( this.esVariableUtilizada( cuadruplo ) == false ) cuadruplo.estatus = Cuadruplo.OMITIR
                        break
                }
            }
        }
        console.log( "====== LISTA DE TEMPORALES ======"  )
        console.log( this.listaTemporales.length )
        console.log( "====== LISTA DE VARIABLES ======"  )
        console.log( this.listaVariables )
    }

    


    buscarIDconstante( instruccionInicial = -1 , cuadruploInicial = -1 , 
        cuadruploR = new ResultadoCuadruplo() , comLex = new ComponenteLexico() )
    {
        let testeoInicial = true
        // RECORRIDO DE INSTRUCCIONES
        for(let i=instruccionInicial;  i>=0;  i--)
        {
            let instruccion = this.listaInstrucciones[i]
            // RECORRIDO DE CUADRUPLOS
            let c = -1
            if( testeoInicial )
            { 
                c = cuadruploInicial
                testeoInicial = false
            }
            else{ c = instruccion.listaCuadruplos.length - 1 }
            
            for(c;  c>=0;  c--)
            {
                let cuadruplo = instruccion.listaCuadruplos[c].clonar()
                let coincideAmbito = cuadruploR.ambito.filter( 
                    (ambito) => ambito == cuadruplo.resultado.getAmbito()  )
                
                // ANALIZAR TIPO
                switch( cuadruplo.resultado.tipo )
                {   
                    case ResultadoCuadruplo.TIPO_NUEVA_VARIABLE:
                    case ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE:
                        if( coincideAmbito.length != 0 && comLex.lexema == cuadruplo.resultado.ID )
                        {
                            return null
                        }
                        break;

                    case ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE:
                        if( coincideAmbito.length != 0 && comLex.lexema == cuadruplo.resultado.ID )
                        {
                            return cuadruplo.operando1
                        }
                        break;
                } // switch tipo
            } // for cuadruplos
        }  // for instrucciones
        return null
    }
 


    //______________________
    // SIMPLIFICAR CUADRUPLO (T)
    //______________________
    simplificarT( cuadruplo = new Cuadruplo() , listaC = [ new Cuadruplo() ] )
    {
        //_________________
        // EVALUAR OPERADOR
        //_________________
        let operador = cuadruplo.operador
        let operando1 = cuadruplo.operando1
        let operando2 = cuadruplo.operando2
        let R = ""
        let temporal1 = new Cuadruplo()
        let temporal2 = new Cuadruplo()
        switch( operador.token )
        {
            // OPERADOR ARTIMETICO __________________________________________________________
            case 'OPERADOR_SUMAR':
            case 'OPERADOR_RESTAR':
            case 'OPERADOR_MULTIPLICACION':
            case 'OPERADOR_DIVISION':
                if( operando1 == null || operando2 == null )
                {
                    alert( "(ERROR al optimizar codigo) operando NULL en Cuadruplo (T)" )
                    return
                }
                if( operando1.token == "NUMERO" && operando2.token == "NUMERO" )
                {
                    R = this.realizarOperacionAritmetica( operador.token , operando1.lexema , operando2.lexema)
                    this.addCuadruplo( cuadruplo , R , listaC , "NUMERO")
                    return
                }
                if( operando1.token == "NUMERO" && operando2.token == "TIPO_DATO_TEMPORAL" )
                {
                    let T = this.getT( operando2.lexema )
                    if( T != null && T.operando1.token == "NUMERO" )
                    {
                        R = this.realizarOperacionAritmetica( operador.token , operando1.lexema , T.operando1.lexema)
                        this.addCuadruplo( cuadruplo , R , listaC , "NUMERO" )
                        return
                    }
                }
                if( operando1.token == "TIPO_DATO_TEMPORAL" && operando2.token == "NUMERO" )
                {
                    let T = this.getT( operando1.lexema )
                    if( T != null && T.operando1.token == "NUMERO" )
                    {
                        R = this.realizarOperacionAritmetica( operador.token , T.operando1.lexema , operando2.lexema )
                        this.addCuadruplo( cuadruplo , R , listaC , "NUMERO" )
                        return
                    }
                }
                if( operando1.token == "TIPO_DATO_TEMPORAL" && operando2.token == "TIPO_DATO_TEMPORAL" )
                {
                    let T = this.getT( operando1.lexema )
                    let T2 = this.getT( operando2.lexema )
                    if( ( T != null && T.operando1.token == "NUMERO" ) && ( T2 != null && T2.operando1.token == "NUMERO" ) )
                    {
                        R = this.realizarOperacionAritmetica( operador.token , T.operando1.lexema , T2.operando1.lexema )
                        this.addCuadruplo( cuadruplo , R , listaC , "NUMERO" )
                        return
                    }
                }

                if( (operando1.token == "IDENTIFICADOR" || operando1.token == "OPERANDO_FUNCION") &&
                    operando2.token == "NUMERO" )
                {
                    if( (operador.token == "OPERADOR_SUMAR" || operador.token == "OPERADOR_RESTAR" ) && 
                    operando2.lexema == "0" )
                    {
                        // ID +- 0  => ID
                        this.addCuadruplo( cuadruplo , operando1.lexema , listaC , "IDENTIFICADOR" )
                        return
                    }
                    if( operador.token == "OPERADOR_MULTIPLICACION" && operando2.lexema == "0" )
                    {
                        // ID * 0  => 0
                        let nuevoCuadruplo = cuadruplo.clonar()
                        nuevoCuadruplo.operador.lexema = "="
                        nuevoCuadruplo.operador.numeroLinea = 0
                        nuevoCuadruplo.operador.token = "OPERADOR_ASIGNACION"
                        nuevoCuadruplo.operando2 = null
                
                        nuevoCuadruplo.operando1.token = "NUMERO"
                        nuevoCuadruplo.operando1.lexema = "0"
                        nuevoCuadruplo.operando1.numeroLinea = 0
                        listaC.push( nuevoCuadruplo )
                        this.listaTemporales.pop()
                        this.listaTemporales.push( nuevoCuadruplo )
                        cuadruplo.estatus = Cuadruplo.OMITIR
                        return
                    }
                    if( operador.token == "OPERADOR_MULTIPLICACION" && operando2.lexema == "1" )
                    {
                        // ID * 1  => ID
                        this.addCuadruplo( cuadruplo , operando1.lexema , listaC , "IDENTIFICADOR" )
                        return
                    }
                }

                //_________________
                // NUM - ID
                //__________________
                if( (operando2.token == "IDENTIFICADOR" || operando2.token == "OPERANDO_FUNCION") &&
                    operando1.token == "NUMERO" )
                {
                    if( operador.token == "OPERADOR_SUMAR" &&  operando1.lexema == "0" )
                    {
                        // 0 + ID  => ID
                        this.addCuadruplo( cuadruplo , operando2.lexema , listaC , "IDENTIFICADOR")
                        return
                    }
                    if( operador.token == "OPERADOR_MULTIPLICACION" && operando1.lexema == "0" )
                    {
                        // ID * 0  => 0
                        let nuevoCuadruplo = cuadruplo.clonar()
                        nuevoCuadruplo.operador.lexema = "="
                        nuevoCuadruplo.operador.numeroLinea = 0
                        nuevoCuadruplo.operador.token = "OPERADOR_ASIGNACION"
                        nuevoCuadruplo.operando2 = null
                
                        nuevoCuadruplo.operando1.token = "NUMERO"
                        nuevoCuadruplo.operando1.lexema = "0"
                        nuevoCuadruplo.operando1.numeroLinea = 0
                        listaC.push( nuevoCuadruplo )
                        this.listaTemporales.pop()
                        this.listaTemporales.push( nuevoCuadruplo )
                        cuadruplo.estatus = Cuadruplo.OMITIR
                        return
                    }
                    if( operador.token == "OPERADOR_MULTIPLICACION" && operando1.lexema == "1" )
                    {
                        // ID * 1  => ID
                        this.addCuadruplo( cuadruplo , operando2.lexema , listaC , "IDENTIFICADOR" )
                        return
                    }
                }
                break



            //===============================================================================
            // OPERADOR Y
            //===============================================================================
            case 'OPERADOR_AND':
            case 'OPERADOR_OR':
            case 'OPERADOR_MENOR_QUE':
            case 'OPERADOR_MAYOR_QUE':
            case 'OPERADOR_IGUAL_QUE':
            case 'OPERADOR_NO_ES_IGUAL_QUE':
            case 'OPERADOR_MENOR_IGUAL_QUE':
            case 'OPERADOR_MAYOR_IGUAL_QUE':
                if( operando1 == null || operando2 == null )
                {
                    alert( "(ERROR al optimizar codigo) operando NULL en Cuadruplo (T)" )
                    return
                }
                //_______________________
                // OPERANDO 1 ES BOOLEANO
                //_______________________
                if( operando1.token == "PALABRA_RESERVADA" &&
                    (operando1.lexema == "Falso" || operando1.lexema == "Verdadero")
                ) {
                    //_______________________
                    // OPERANDO 2 ES BOOLEANO
                    //_______________________
                    if( operando2.token == "PALABRA_RESERVADA" &&
                        (operando2.lexema == "Falso" || operando2.lexema == "Verdadero") 
                    )
                    {
                        R = this.realizarOperacionBooleana( operador.token , operando1.lexema , operando2.lexema )
                        this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA" )
                        return
                    }
                    //_______________________
                    // OPERANDO 2 ES T
                    //_______________________
                    if( operando2.token == "TIPO_DATO_TEMPORAL" )
                    {
                        let T = this.getT( operando2.lexema )
                        if( T != null && T.operando1.token == "PALABRA_RESERVADA" && 
                            ( T.operando1.lexema == "Falso" || T.operando1.lexema == "Verdadero" ) 
                        )
                        {
                            R = this.realizarOperacionBooleana( operador.token , operando1.lexema , T.operando1.lexema)
                            this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA")
                            return
                        }
                    }
                }

                //_______________________
                // OPERANDO 1 ES T
                //_______________________
                if( operando1.token == "TIPO_DATO_TEMPORAL" )
                {
                    let T = this.getT( operando1.lexema )
                    //alert( operador.token + "<>" + T.operando1.token + "<>" + T.operando1.lexema )
                    if( T != null && T.operando1.token == "PALABRA_RESERVADA" && 
                        ( T.operando1.lexema == "Falso" || T.operando1.lexema == "Verdadero" ) 
                    )
                    {
                        alert( T.operando1.lexema )
                        if( operando2.token == "PALABRA_RESERVADA" && 
                        ( operando2.lexema == "Falso" || operando2.lexema == "Verdadero" )  )
                        {
                            alert(operando2.lexema)
                            R = this.realizarOperacionBooleana( operador.token , T.operando1.lexema , operando2.lexema)
                            this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA" )
                            return
                        }
                        if( operando2.token == "TIPO_DATO_TEMPORAL" )
                        {
                            let T2 = this.getT( operando2.lexema )
                            if( T2 != null && T2.operando1.token == "PALABRA_RESERVADA" && 
                                ( T2.operando1.lexema == "Falso" || T2.operando1.lexema == "Verdadero" ) 
                            )
                            {
                                R = this.realizarOperacionBooleana( operador.token , T.operando1.lexema , T2.operando1.lexema)
                                this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA" )
                                return
                            }
                        }
                    }
                }

                //_______________________
                // COMPARACIONES ENTRE NUMEROS
                //_______________________
                if( operando1.token == "NUMERO" && operando2.token == "NUMERO" )
                {
                    R = this.realizarComparacion( operador.token , operando1.lexema , operando2.lexema)
                    this.addCuadruplo( cuadruplo , R , listaC  , "PALABRA_RESERVADA")
                    return
                }
                if( operando1.token == "NUMERO" && operando2.token == "TIPO_DATO_TEMPORAL" )
                {
                    let T = this.getT( operando2.lexema )
                    if( T != null && T.operando1.token == "NUMERO" )
                    {
                        R = this.realizarComparacion( operador.token , operando1.lexema , T.operando1.lexema)
                        this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA" )
                        return
                    }
                }
                if( operando1.token == "TIPO_DATO_TEMPORAL" && operando2.token == "NUMERO" )
                {
                    let T = this.getT( operando1.lexema )
                    if( T != null && T.operando1.token == "NUMERO" )
                    {
                        R = this.realizarComparacion( operador.token , T.operando1.lexema , operando2.lexema )
                        this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA" )
                        return
                    }
                }
                if( operando1.token == "TIPO_DATO_TEMPORAL" && operando2.token == "TIPO_DATO_TEMPORAL" )
                {
                    let T = this.getT( operando1.lexema )
                    let T2 = this.getT( operando2.lexema )
                    if( ( T != null && T.operando1.token == "NUMERO" ) && ( T2 != null && T2.operando1.token == "NUMERO" ) )
                    {
                        R = this.realizarComparacion( operador.token , T.operando1.lexema , T2.operando1.lexema )
                        this.addCuadruplo( cuadruplo , R , listaC , "PALABRA_RESERVADA" )
                        return
                    }
                }
                break
            
        } // FIN SWITCH
    }






    //__________________________
    // GET CUADRUPLO TEMPORAL
    //__________________________
    getT( clave = "" )
    {
        for( let i=0;  i<this.listaTemporales.length;  i++ )
        {
            let T = this.listaTemporales[i]
            if( T.resultado.clave == clave )
            {
                if( T.operando2 == null )  return T
            }
        }
        return null
    }

    //__________________________
    // GET CUADRUPLO CONSTANTE
    //__________________________
    getConstante( ID = "" )
    {
        for( let i=0;  i<this.listaConstantes.length;  i++ )
        {
            let C = this.listaConstantes[i]
            if( C.resultado.ID == ID )return C
        }
        return null
    }


    realizarOperacionAritmetica( token = "" , operando1 = "" , operando2 = "" )
    {
        switch( token )
        {
            case 'OPERADOR_SUMAR':
                return parseInt( ( Number(operando1) + Number(operando2) ) , 10 ) + ""

            case 'OPERADOR_RESTAR':
                return parseInt( ( Number(operando1) - Number(operando2) ) , 10 ) + ""

            case 'OPERADOR_MULTIPLICACION':
                return parseInt( ( Number(operando1) * Number(operando2) ) , 10 ) + ""

            case 'OPERADOR_DIVISION':
                return parseInt( ( Number(operando1) / Number(operando2) ) , 10 ) + ""
                
        }
    }

    realizarOperacionBooleana( token = "" , operando1 = "" , operando2 = "" )
    {
        let op1 = true
        let op2 = true
        let R = true
        if( operando1 == "Falso" ) op1 = false
        if( operando2 == "Falso" ) op2 = false
        switch( token )
        {
            case 'OPERADOR_AND':
                R = op1 && op2
                break

            case 'OPERADOR_AND':
                R = op1 || op2
                break

            case 'OPERADOR_MENOR_QUE':
                R = op1 < op2
                break

            case 'OPERADOR_MAYOR_QUE':
                R = op1 > op2
                break

            case 'OPERADOR_IGUAL_QUE':
                R = op1 == op2
                break

            case 'OPERADOR_NO_ES_IGUAL_QUE':
                R = op1 != op2
                break

            case 'OPERADOR_MENOR_IGUAL_QUE':
                R = op1 <= op2
                break

            case 'OPERADOR_MAYOR_IGUAL_QUE':
                R = op1 >= op2
                break
        }
        if( R == false ) return "Falso"
        return "Verdadero" 
    }

    realizarComparacion( token = "" , operando1 = "" , operando2 = "" )
    {
        let R = true
        switch( token )
        {
            case 'OPERADOR_MENOR_QUE':
                R = Number(operando1) < Number(operando2)
                break

            case 'OPERADOR_MAYOR_QUE':
                R = Number(operando1) > Number(operando2)
                break

            case 'OPERADOR_IGUAL_QUE':
                R = Number(operando1) == Number(operando2)
                break

            case 'OPERADOR_NO_ES_IGUAL_QUE':
                R = Number(operando1) != Number(operando2)
                break

            case 'OPERADOR_MENOR_IGUAL_QUE':
                R = Number(operando1) <= Number(operando2)
                break

            case 'OPERADOR_MAYOR_IGUAL_QUE':
                R = Number(operando1) >= Number(operando2)
                break
        }
        if( R == false ) return "Falso"
        return "Verdadero" 
    }


    addCuadruplo( cuadruplo = new Cuadruplo() , valor = "" , listaC = [ new Cuadruplo() ] , token = "" )
    {
        let nuevoCuadruplo = cuadruplo.clonar()
        nuevoCuadruplo.operador.lexema = "="
        nuevoCuadruplo.operador.numeroLinea = 0
        nuevoCuadruplo.operador.token = "OPERADOR_ASIGNACION"
        nuevoCuadruplo.operando2 = null

        nuevoCuadruplo.operando1.lexema = valor
        nuevoCuadruplo.operando1.numeroLinea = 0
        nuevoCuadruplo.operando1.token = token
        listaC.push( nuevoCuadruplo )
        this.listaTemporales.pop()
        this.listaTemporales.push( nuevoCuadruplo )
        cuadruplo.estatus = Cuadruplo.OMITIR
        console.log( "====== LISTAC ======")
        console.log( this.listaTemporales[this.listaTemporales.length-1].resultado.clave )
    }

    limpiarLista( lista = [] )
    {
        while( lista.length > 0 ) {  lista.pop();  }
    }


    sustituirTemporal( operando = new ComponenteLexico() , cuadruplo = new Cuadruplo() )
    {
        let T = new Cuadruplo()
        //_________________________
        // OPERANDO TEMPORAL 
        //_________________________
        if( operando.token == "TIPO_DATO_TEMPORAL" )
        {
            T = this.getT( operando.lexema )
            if( T != null )
            {
                if(T.operando1.token == "NUMERO")
                {
                    operando.lexema = T.operando1.lexema
                    operando.token = "NUMERO"
                } 
                else if( T.operando1.token == "PALABRA_RESERVADA" && 
                    (T.operando1.lexema == "Falso" || T.operando1.lexema == "Verdadero") )
                {
                    operando.lexema = T.operando1.lexema
                    operando.token = "PALABRA_RESERVADA"
                } 
                else if( T.operando1.token == "IDENTIFICADOR" )
                {
                    operando.lexema = T.operando1.lexema
                    operando.token = "IDENTIFICADOR"
                }
            }
        }
        //_________________________
        // OPERANDO ID
        //_________________________
        else if( operando.token == "IDENTIFICADOR" )
        {
            let C = new Cuadruplo()
            C = this.getConstante( operando.lexema )
            //_________________________
            // CUANDO EL ID ES CONSTANTE
            //_________________________
            if( C != null )
            {
                if(C.operando1.token == "NUMERO")
                {
                    operando.lexema = C.operando1.lexema
                    operando.token = "NUMERO"
                } 
                else if( C.operando1.token == "PALABRA_RESERVADA" && 
                    (C.operando1.lexema == "Falso" || C.operando1.lexema == "Verdadero") )
                {
                    operando.lexema = C.operando1.lexema
                    operando.token = "PALABRA_RESERVADA"
                } 
                else if( C.operando1.token == "IDENTIFICADOR" )
                {
                    operando.lexema = C.operando1.lexema
                    operando.token = "IDENTIFICADOR"
                }
                else if( C.operando1.token == "TIPO_DATO_TEMPORAL" )
                {
                    operando.lexema = C.operando1.lexema
                    operando.token = "TIPO_DATO_TEMPORAL"
                    T = this.getT( operando.lexema )
                    if( T != null )
                    {
                        if(T.operando1.token == "NUMERO")
                        {
                            operando.lexema = T.operando1.lexema
                            operando.token = "NUMERO"
                        } 
                        else if( T.operando1.token == "PALABRA_RESERVADA" && 
                            (T.operando1.lexema == "Falso" || T.operando1.lexema == "Verdadero") )
                        {
                            operando.lexema = T.operando1.lexema
                            operando.token = "PALABRA_RESERVADA"
                        } 
                        else if( T.operando1.token == "IDENTIFICADOR" )
                        {
                            operando.lexema = T.operando1.lexema
                            operando.token = "IDENTIFICADOR"
                        }
                    }
                } // else-if
                return
            }
            //_________________________
            // CUANDO EL ID ES VARIABLE
            //_________________________
            let listaAmbitos = cuadruplo.resultado.ambito
            for( let i=listaAmbitos.length-1;  i>=0;  i-- )
            {
                let amb = listaAmbitos[i];
                let busqueda = this.listaVariables.filter( obj => 
                    obj.cuadruplo.resultado.ID == operando.lexema  &&  
                    obj.cuadruplo.resultado.getAmbito() == amb 
                )
                if( busqueda.length != 0 )  // ID encontrado
                {        
                    busqueda[0].utilizada = true
                    return
                }
            }
        }
    }


    esVariableUtilizada( cuadruplo = new Cuadruplo() )
    {
        let listaAmbitos = cuadruplo.resultado.ambito
        for( let i=listaAmbitos.length-1;  i>=0;  i-- )
        {
            let amb = listaAmbitos[i];
            let busqueda = this.listaVariables.filter( obj => 
                obj.cuadruplo.resultado.ID == cuadruplo.resultado.ID  &&  
                obj.cuadruplo.resultado.getAmbito() == amb 
            )
            if( busqueda.length != 0 )  // ID encontrado
            {        
                return busqueda[0].utilizada
            }
        }
        return false
    }
}