import { Cuadruplo } from "../Codigo_Intermedio/Cuadruplo.js";
import { DebugCodigoIntermedio } from "../Codigo_Intermedio/debug_codigo_intermedio.js";
import { ResultadoCuadruplo } from "../Codigo_Intermedio/ResultadoCuadruplo.js";
import { SimboloFuncion } from "../Semantico/SimboloFuncion.js";
import { SimboloParametro } from "../Semantico/SimboloParametro.js";
import { SimboloPin } from "../Semantico/SimboloPin.js";
import { SimboloVariable } from "../Semantico/SimboloVariable.js";
import { BloqueCodigoArduino } from "./BloqueCodigoArduino.js";
import { CodigoArduino } from "./CodigoArduino.js";
import { ItemArduino } from "./itemArduino.js";

export class CodigoObjeto 
{
    constructor()
    {
        this.listaCodigoObjeto = [ [ new CodigoArduino() ] ]
        this.listaDatosTemporales = [ new CodigoArduino() ]
        this.listaDatosConstantes = [ new CodigoArduino() ]
        this.listaVariables = [ new CodigoArduino() ]
        this.pila = [ new CodigoArduino() ]
        this.listaBloquesFuncion = [ new CodigoArduino() ]
    }



    //=======================================================================================
    //                          PROCESOS DE ANALISIS
    //=======================================================================================

    //=========================================
    //  ESTRUCTURA DEL CODIGO ARDUINO FINAL
    //=========================================
    getCodigoArduino()
    {
        this.limpiarLista( this.listaBloquesFuncion )
        // BLOQUE ANTERIOR
        let bloqueAnterior = "Funcion"

        // FUNCION ACTUAL
        let funcionActual = new CodigoArduino()
        funcionActual = null

        // BLOQUE SI ACTUAL
        let bloqueSI = new CodigoArduino()
        bloqueSI = null

        // BLOQUES DECLARADOS?
        let CICLO_declarado = false
        let SINO_declarado = false

        // LISTA DE BLOQUES DENTRO DE PRINCIPAL PENDIENTES
        let listaBloques = [ new CodigoArduino() ]
        this.limpiarLista( listaBloques )

        // LISTA DE BLOQUES DENTRO DE FUNCION PENDIENTES
        this.limpiarLista( this.listaBloquesFuncion )


        // BLOQUES PRINCIPALES
        let bloqueGlobal = new CodigoArduino()
        this.limpiarLista( bloqueGlobal.secuencia )
        let bloqueSetup = new CodigoArduino( "" , 0 , "" ,  
        [
            new ItemArduino( "void" , ItemArduino.PALABRA_RESERVADA ) ,
            new ItemArduino( "setup" , ItemArduino.ESPECIAL ) ,
            new ItemArduino( "() {" , ItemArduino.NORMAL )
        ])
        bloqueSetup.addContenido( "" , 0 , "" , 
        [
            new ItemArduino( "Serial.begin" , ItemArduino.LLAMADA_A_FUNCION ) ,
            new ItemArduino( "(9600);" , ItemArduino.NORMAL )
        ] )

        let bloqueLoop = new CodigoArduino( "" , 0 , "" , 
        [
            new ItemArduino( "void" , ItemArduino.PALABRA_RESERVADA ) ,
            new ItemArduino( "loop" , ItemArduino.ESPECIAL ) ,
            new ItemArduino( "() {" , ItemArduino.NORMAL )
        ])

        bloqueGlobal.addContenido( "" , 0 , "" ,
        [
            new ItemArduino( "int" , ItemArduino.PALABRA_RESERVADA ) ,
            new ItemArduino( "giro = 1 ;" , ItemArduino.NORMAL )
        ])
        // AGREGAR LIBRERIA SERVO
        /*
        bloqueGlobal.addContenido( "" , 0 , "" ,
        [
            new ItemArduino( "#include" , ItemArduino.ESPECIAL ) ,
            new ItemArduino( "<" , ItemArduino.NORMAL ) ,
            new ItemArduino( "Servo.h" , ItemArduino.LLAMADA_A_FUNCION ) ,
            new ItemArduino( ">" , ItemArduino.NORMAL ) ,
        ]) */

        // DECLARAR LA VARIABLE SERVO
        /*bloqueGlobal.addContenido( "" , 0 , "" ,
        [
            new ItemArduino( "Servo" , ItemArduino.LLAMADA_A_FUNCION ) ,
            new ItemArduino( "servomotor ;" , ItemArduino.NORMAL )
        ]) */

        // RECORRER TODOS LOS CODIGOS ARDUINOS OBTENIDOS
        for( let i=0;  i<this.listaCodigoObjeto.length;  i++ )
        {
            let listaCodigosA = this.listaCodigoObjeto[i]
            for( let k=0;  k<listaCodigosA.length;  k++ )
            {
                let codA = listaCodigosA[k]
                if( codA.estatus == CodigoArduino.OMITIR ) continue
                let instruccionEnFuncion = false
                if( codA.funcion.nombre != "N/A" )   instruccionEnFuncion = true
                switch( codA.bloque )
                {
                    case "Entradas":
                    case "Salidas":  //========================================================
                        // MANDAR CODIGO AL BLOQUE SETUP
                        bloqueSetup.addContenido2( codA.clonar() )
                        break

                    case "Configuracion":  //==================================================
                        // MANDAR VARIABLE AL BLOQUE GLOBAL
                        bloqueGlobal.addContenido2( codA.clonar() )
                        break

                    case "Funcion": //==========================================================   
                        funcionActual = this.gestionarInstruccionNoBloque( funcionActual , codA , bloqueGlobal )
                        CICLO_declarado = false
                        break
                
                    case "Principal": //========================================================
                        // FIN DE UN BLOQUE EN LOOP
                        if( codA.tipo == ResultadoCuadruplo.TIPO_GOTO && 
                            codA.secuencia[0].valor == "}" )
                        {
                            bloqueLoop.addContenido2( listaBloques[0].clonar() )
                            listaBloques.pop()
                            bloqueLoop.addContenido2( codA.clonar() )
                            console.log( "======= INSTRUCCION ADD AL LOOP ======")
                            console.log( bloqueLoop.clonar().contenido )
                        }
                        else
                        {  
                            bloqueLoop.addContenido2( codA.clonar() )  
                            console.log( "======= INSTRUCCION ADD AL LOOP ======" )
                            console.log( bloqueLoop.contenido.filter((item)=>true) )
                        }
                        CICLO_declarado = false
                        bloqueAnterior = "Principal"
                        break


                    case "Condicion Si": //======================================================
                        if( instruccionEnFuncion == true ) {
                            funcionActual = this.gestionarInstruccionBloque(funcionActual , codA )
                        }    
                        else {
                            listaBloques.push( codA.clonar() )
                            console.log( "====== NUEVO BLOQUE EN LOOP ======" )
                            console.log( listaBloques.filter((item)=>true) )
                        }  
                        CICLO_declarado = false
                        bloqueAnterior = "Condicion Si"  
                        break


                    case "Si": //===============================================================
                        if( instruccionEnFuncion == true ) {
                            this.gestionarInstruccionNoBloqueEnUnBloque( codA , this.listaBloquesFuncion )
                        }
                        else {
                            this.gestionarInstruccionNoBloqueEnUnBloque( codA , listaBloques )
                        }
                        bloqueAnterior = "Si"
                        break


                    case "Declaracion Sino": //======================================================
                        if( instruccionEnFuncion == true ) {
                            funcionActual = this.gestionarInstruccionBloque(funcionActual , codA )
                        }    
                        else {
                            listaBloques.push( codA.clonar() )
                            console.log( "====== NUEVO BLOQUE EN LOOP ======" )
                            console.log( listaBloques.filter((item)=>true) )
                        }  
                        CICLO_declarado = false
                        bloqueAnterior = "Declaracion Sino"  
                        break


                    case "Sino": //======================================================
                        if( instruccionEnFuncion == true ) {
                            this.gestionarInstruccionNoBloqueEnUnBloque( codA , this.listaBloquesFuncion )
                        }
                        else {
                            this.gestionarInstruccionNoBloqueEnUnBloque( codA , listaBloques )
                        }
                        bloqueAnterior = "Sino"
                        break


                    case "Condicion Ciclo": //======================================================
                        if( CICLO_declarado == true )
                        {
                            if( instruccionEnFuncion == true ) {
                                for( let k=0;  k<codA.secuencia.length;  k++ )
                                {
                                    let itemA = codA.secuencia[k].clonar()
                                    this.getUltimoBloque( this.listaBloquesFuncion ).secuencia.push( itemA )
                                }
                            }
                            else {
                                for( let k=0;  k<codA.secuencia.length;  k++ )
                                {
                                    let itemA = codA.secuencia[k].clonar()
                                    this.getUltimoBloque( listaBloques ).secuencia.push( itemA )
                                }
                            }
                        }
                        else
                        {
                            // cuando se encuentra la instruccion for
                            CICLO_declarado = true
                            if( instruccionEnFuncion == true ) {
                                funcionActual = this.gestionarInstruccionBloque(funcionActual , codA )
                            }    
                            else {
                                listaBloques.push( codA.clonar() )
                                console.log( "====== NUEVO BLOQUE EN LOOP ======" )
                                console.log( listaBloques.filter((item)=>true) )
                            } 
                        }
                        bloqueAnterior = "Condicion Ciclo"
                        break



                    case "Ciclo": //==============================================================
                        if( instruccionEnFuncion == true ) {
                            this.gestionarInstruccionNoBloqueEnUnBloque( codA , this.listaBloquesFuncion )
                        }
                        else {
                            this.gestionarInstruccionNoBloqueEnUnBloque( codA , listaBloques )
                        }
                        CICLO_declarado = false
                        bloqueAnterior = "Ciclo"
                        break
                }
            } //for
        } //for

        // ANALISIS DE LA ESTRUCTURA
        let listaI = [ [ new ItemArduino() ] ]
        this.limpiarLista( listaI )

        // BLOQUE GLOBAL
        this.compactarCodigo( listaI , bloqueGlobal )

        // BLOQUE SETUP
        this.compactarCodigo( listaI , bloqueSetup )
        listaI.push( [ new ItemArduino("}",ItemArduino.NORMAL) ] )

        // BLOQUE LOOP
        console.log( bloqueLoop )
        this.compactarCodigo( listaI , bloqueLoop )

        return listaI
    }


    //_____________________________
    //  INSTRUCCION ARDUINO DENTRO DE UNA FUNCION
    //  NV - RV - CALL - RET - G - FIN
    //_____________________________
    gestionarInstruccionNoBloque( 
        funcionActual = new CodigoArduino() , 
        instruccionArduino = new CodigoArduino() , 
        bloqueGLOBAL = new CodigoArduino()
    ) 
    {
        //_______________________
        // FUNCION NO EXISTENTE
        //_______________________
        if( funcionActual == null )
        {
            //_________________________
            // DECLARAR UNA NUEVA FUNCION  
            // (ejemplo) -> void leer(...) {
            //__________________________
            funcionActual = new CodigoArduino( 
                "" , 
                instruccionArduino.ambito , 
                instruccionArduino.bloque , 
                [] ,
                instruccionArduino.funcion ,
                instruccionArduino.tipo 
            )
            //_____________________
            // COVERTIR TIPO DATO
            //_____________________
            console.log( "========= PARAMETROS PARAMETROS ========")
            console.log( instruccionArduino.funcion )
            console.log( instruccionArduino )
            let tipoDatoRetorno = this.convertirTipoDato( instruccionArduino.funcion.tipoRetorno )
            if( tipoDatoRetorno == null )  tipoDatoRetorno.valor = "void"
            this.addSecuencia( 
                funcionActual.secuencia , 
                tipoDatoRetorno.valor , 
                ItemArduino.PALABRA_RESERVADA
            )
            this.addSecuencia( 
                funcionActual.secuencia , 
                instruccionArduino.funcion.nombre + "(" , 
                ItemArduino.NORMAL
            )
            this.addParametros( instruccionArduino.funcion.parametros , funcionActual.secuencia )
            this.addSecuencia( 
                funcionActual.secuencia , 
                ") {" , 
                ItemArduino.NORMAL
            )
            //_______________________________
            // AGREGAR LA INSTRUCCION ACTUAL
            //_______________________________
            if( instruccionArduino.tipo == ResultadoCuadruplo.TIPO_FIN_FUNCION && 
                instruccionArduino.secuencia[0].valor == "}" )  
            {
                bloqueGLOBAL.addContenido2( funcionActual.clonar() )
                bloqueGLOBAL.addContenido2( instruccionArduino.clonar() )
                funcionActual = null
                console.log( "======= FUNCION VACIA AGREGADA AL BLOQUE GLOBAL ======")
                console.log( bloqueGLOBAL.clonar().contenido )
            }
            else
            {
                funcionActual.addContenido2( instruccionArduino.clonar() )
                console.log( "======= NUEVA FUNCION ======")
                console.log( funcionActual.clonar().secuencia )
                console.log( funcionActual.clonar().contenido )
            }
        }

        //________________________
        // FIN DE UN BLOQUE EN FUNCION
        //________________________
        else if( instruccionArduino.tipo == ResultadoCuadruplo.TIPO_GOTO && 
                instruccionArduino.secuencia[0].valor == "}" ) 
        {
            this.eliminarBloqueEnFuncion( instruccionArduino , funcionActual )
        }

        //___________________________
        // FIN DE LA FUNCION
        //___________________________
        else if( instruccionArduino.tipo == ResultadoCuadruplo.TIPO_FIN_FUNCION && 
            instruccionArduino.secuencia[0].valor == "}" 
        ) 
        {
            //instruccionArduino.clave = "FIN"
            bloqueGLOBAL.addContenido2( funcionActual.clonar() )
            bloqueGLOBAL.addContenido2( instruccionArduino.clonar() )
            console.log( "======= FUNCION AGREGADA A GLOBAL ======")
            console.log( funcionActual.clonar().secuencia )
            console.log( funcionActual.clonar().contenido )
            funcionActual = null
        }

        else
        {
            funcionActual.addContenido2( instruccionArduino.clonar() )
            console.log( "======= INSTRUCCION ADD A LA FUNCION ======")
            console.log( funcionActual.clonar().secuencia )
            console.log( funcionActual.clonar().contenido )
        }
        
        return funcionActual
    }



    //_____________________________
    //  INSTRUCCION ARDUINO DENTRO DE UN
    //  BLOQUE DE UNA FUNCION
    //  NV - RV - CALL - RET - G    => if - ciclo - else
    //_____________________________
    gestionarInstruccionNoBloqueEnUnBloque(  
        instruccionArduino = new CodigoArduino() , 
        listaB = [ new CodigoArduino() ]
    ) 
    {
        //________________________
        // FIN DE UN BLOQUE EN FUNCION
        //________________________
        if( instruccionArduino.tipo == ResultadoCuadruplo.TIPO_GOTO && 
                instruccionArduino.secuencia[0].valor == "}" ) 
        {
            this.moverBloque( instruccionArduino , listaB  )
        }
        else
        {
            this.getUltimoBloque( listaB ).addContenido2( instruccionArduino.clonar() )
            console.log( "======= INSTRUCCION ADD A UN BLOQUE ======")
            console.log( listaB.filter((item)=>true) )
        }
    }



    eliminarBloqueEnFuncion( llaveFinFuncion = new CodigoArduino() , funcionActual = new CodigoArduino() )
    {
        if( this.listaBloquesFuncion.length > 1 )
        {
            this.getPenultimoBloque( this.listaBloquesFuncion ).addContenido2( this.getUltimoBloque( this.listaBloquesFuncion ).clonar() )
            this.listaBloquesFuncion.pop()     
            this.getUltimoBloque( this.listaBloquesFuncion ).addContenido2( llaveFinFuncion.clonar() )
            console.log( "========= BLOQUE ADD A UN BLOQUE  =======")
            console.log( this.listaBloquesFuncion.filter((item) => true ) )
        }
        else
        {
            funcionActual.addContenido2( this.listaBloquesFuncion[0].clonar() )
            this.listaBloquesFuncion.pop()
            //instruccionArduino.clave = "FIN"
            funcionActual.addContenido2( llaveFinFuncion.clonar() )
            console.log( "========= BLOQUE ADD A LA FUNCION ACTUAL  =======")
            console.log( funcionActual.secuencia )
            console.log( funcionActual.contenido )
        }
    }

    
    moverBloque( llaveFinFuncion = new CodigoArduino() , listaB = [new CodigoArduino()] )
    {
        if( listaB.length < 2) {
            alert( "moverBloque() incorrecto menos de 2 bloques detectados" )
            return
        }
        this.getPenultimoBloque( listaB ).addContenido2( this.getUltimoBloque( listaB ).clonar() )
        listaB.pop()     
        this.getUltimoBloque( listaB ).addContenido2( llaveFinFuncion.clonar() )
        console.log( "========= BLOQUE ADD A UN BLOQUE  =======")
        console.log( listaB.filter((item) => true ) )
    }


    getUltimoBloque( listaB = [new CodigoArduino() ] ) { return listaB[listaB.length - 1]  }
    getPenultimoBloque( listaB = [new CodigoArduino() ] ) { return  listaB[listaB.length - 2] }



    //_____________________________
    //  CUANDO UNA INSTRUCCION BLOQUE ARDUINO
    //  SE ENCUENTRA DENTRO DE UNA FUNCION
    //  if - for - else
    //_____________________________
    gestionarInstruccionBloque( 
        funcionActual = new CodigoArduino() , 
        instruccionArduino = new CodigoArduino()
    ) 
    {
        //________________________
        // CUANDO ESTA INSTRUCCION
        // DE BLOQUE ES LA PRIMERA
        //_________________________
        if( funcionActual == null )
        {
            //_________________________
            // DECLARAR UNA NUEVA FUNCION  
            // (ejemplo) -> void leer(...) {
            //__________________________
            funcionActual = new CodigoArduino( 
                "" , 
                instruccionArduino.ambito , 
                instruccionArduino.bloque , 
                [] ,
                instruccionArduino.funcion ,
                instruccionArduino.tipo 
            )
            //_____________________
            // COVERTIR TIPO DATO
            //_____________________
            let tipoDatoRetorno = this.convertirTipoDato( instruccionArduino.funcion.tipoRetorno )
            if( tipoDatoRetorno == null )  tipoDatoRetorno.valor = "void"
            //alert( tipoDatoRetorno.valor )
            this.addSecuencia( 
                funcionActual.secuencia , 
                tipoDatoRetorno.valor , 
                ItemArduino.PALABRA_RESERVADA
            )
            this.addSecuencia( 
                funcionActual.secuencia , 
                instruccionArduino.funcion.nombre + "(" , 
                ItemArduino.NORMAL
            )
            this.addParametros( instruccionArduino.funcion.parametros , funcionActual.secuencia )
            this.addSecuencia( 
                funcionActual.secuencia , 
                ") {" , 
                ItemArduino.NORMAL
            )
            //_______________________________
            // AGREGAR NUEVO BLOQUE
            //_______________________________
            this.listaBloquesFuncion.push( instruccionArduino.clonar() )
            console.log( "======== NUEVO BLOQUE EN LA FUNCION =======" )
            console.log( this.listaBloquesFuncion.filter((item) => true) )
        }
        
        //_______________________________
        // AGREGAR NUEVO BLOQUE
        //_______________________________
        else 
        {
            this.listaBloquesFuncion.push( instruccionArduino.clonar() )
            console.log( "======== NUEVO BLOQUE EN LA FUNCION =======" )
            console.log( this.listaBloquesFuncion.filter((item) => true) )
        }

        return funcionActual
    }





    //_____________________________
    //  ADD LOS PARAMETROS DE UNA FUNCION
    //  DECLARADA EN ARDUINO
    //_____________________________
    addParametros( listaP = [ new SimboloParametro() ] , secuencia = [ new ItemArduino() ] )
    {
        // RECORRER PARAMETROS
        if( listaP.length == 0 ) return
        for( let p=0;  p<listaP.length;  p++)
        {
            let parametro = listaP[p]
            //________________
            // CONVERTIR TIPO DATO
            //________________
            let tipoDato = this.convertirTipoDato( parametro.tipoDato )
            if( tipoDato == null ) continue
            this.addSecuencia( secuencia , tipoDato.valor , tipoDato.estilo )
            this.addSecuencia( secuencia , parametro.nombre , ItemArduino.NORMAL )
            this.addSecuencia( secuencia , "," , ItemArduino.NORMAL )
        }
        if( secuencia[ secuencia.length - 1 ].valor == "," ) secuencia.pop()
    }




    //_____________________________
    //  CONVERTIR UN TIPO DE DATO COMIC 
    //  EN UN TIPO DE DATO ARDUINO
    //_____________________________
    convertirTipoDato( tipoDatoCOMIC = "" )
    {
        switch( tipoDatoCOMIC )
        {
            case "Entero":
            case "Pin":
                return new ItemArduino( "int" , ItemArduino.PALABRA_RESERVADA )

            case "Booleano":
                return new ItemArduino( "boolean" , ItemArduino.PALABRA_RESERVADA )

            case "Nada":
                return new ItemArduino( "void" , ItemArduino.PALABRA_RESERVADA )

            default:
                alert( "TIPO DE PARAMETRO NO IDENTIFICADO (codigo objeto): " + tipoDatoCOMIC )
                return null
        }
    }


    compactarCodigo( 
        listaItemsArduino = [ [ new ItemArduino() ] ] , 
        codigoArduino = new CodigoArduino() , nivelTAB = 0 )
    {
        //alert( codigoArduino.secuencia )
        //if( codigoArduino.contenido == null ){ return }
        let nuevoNivelTAB = nivelTAB + 1
        let existeSecuencia = false
        if( codigoArduino.secuencia.length != 0 ) 
        {
            existeSecuencia = true
            let item = codigoArduino.secuencia[0]
            item.valor = ("\t").repeat(nivelTAB) + item.valor
            listaItemsArduino.push( codigoArduino.secuencia )
        }
        if( codigoArduino.contenido == null ){ return }
        for( let i=0;  i<codigoArduino.contenido.length;  i++ )
        {
            let codA = codigoArduino.contenido[i]
            if( codA.clave == "FIN" ) this.compactarCodigo( listaItemsArduino , codA , nivelTAB )
            else  this.compactarCodigo( listaItemsArduino , codA , nuevoNivelTAB )
        }
    }
























    //===================================================================================
    //              PROCESO DE CODIGO GENERACION DE OJETO
    //===================================================================================
    generarCodigoObjeto( listaInstrucciones = [ new DebugCodigoIntermedio() ] )
    {
        this.limpiarLista( this.listaCodigoObjeto )
        this.limpiarLista( this.listaDatosTemporales )
        this.limpiarLista( this.listaDatosConstantes )
        this.limpiarLista( this.pila )
        this.limpiarLista( this.listaVariables )
        //______________________________
        // RECORRIDO DE INSTRUCCIONES
        //______________________________
        for(let i=0;  i<listaInstrucciones.length;  i++)
        {
            let instruccion = listaInstrucciones[i] 
            let listaCodigo = [ new CodigoArduino() ]
            this.limpiarLista( listaCodigo )
            //____________________________
            // RECORRIDO DE CUADRUPLOS
            //____________________________
            for(let c=0;  c<instruccion.listaCuadruplos.length;  c++)
            {
                let codObjeto = new CodigoArduino()
                let cuadruplo = instruccion.listaCuadruplos[c].clonar()
                codObjeto.clave = cuadruplo.resultado.clave
                codObjeto.ambito = cuadruplo.resultado.getAmbito()
                codObjeto.bloque = cuadruplo.resultado.getBloque()
                codObjeto.funcion = cuadruplo.resultado.funcion
                codObjeto.tipo = cuadruplo.resultado.tipo
                codObjeto.IDvariable = cuadruplo.resultado.ID
                //______________________________
                // CHECAR SI ES CUADRUPLO OMITIDO
                //______________________________
                if( cuadruplo.estatus == Cuadruplo.OMITIR && 
                    cuadruplo.resultado.tipo != ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE ) continue
                //______________________________
                // ANALIZAR TIPO DE CUADRUPLO
                //______________________________
                switch( cuadruplo.resultado.tipo )
                {
                    case ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA:  //(P)=======================
                        this.almacenarDatoPila( cuadruplo , codObjeto , listaCodigo )
                        break

                    case ResultadoCuadruplo.TIPO_LLAMADA_FUNCION: //(CALL)========================
                        this.generarLlamadaAFuncion( cuadruplo  , codObjeto )
                        break

                    case ResultadoCuadruplo.TIPO_LLAMADA_RETORNO_FUNCION: //(CALLRF)===============
                        this.generarRetornoFuncion( cuadruplo  , codObjeto )
                        break

                    case ResultadoCuadruplo.TIPO_DATO_TEMPORAL: //(T)==============================
                        this.almacenarDatoTemporal( cuadruplo , codObjeto , listaCodigo )
                        break

                    case ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE: //(NC)==============================
                        this.almacenarDatoConstante( cuadruplo , codObjeto , listaCodigo )
                        break
                    
                    case ResultadoCuadruplo.TIPO_NUEVA_VARIABLE: //(NV)================================ 
                        this.generarVariable( cuadruplo , codObjeto , listaCodigo )
                        break;

                    case ResultadoCuadruplo.TIPO_FIN_FUNCION:  //(RET)=============================
                        this.generarFinFuncion( cuadruplo , codObjeto , listaCodigo )        
                        break;
            
                    case ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE:  //(RV)=======================
                        this.generarReasignacionDeVariable( cuadruplo , codObjeto , listaCodigo )
                        break;
            
                    case ResultadoCuadruplo.TIPO_GOTO: //(G)=======================================
                        this.evaluarGOTO( cuadruplo , codObjeto , listaCodigo )
                        break;
            
                    case ResultadoCuadruplo.FIN_PROGRAMA: //(FIN)===========================================
                        codObjeto.secuencia = [
                            new ItemArduino( "}" , ItemArduino.NORMAL )
                        ]
                        break;

                } // switch tipo

                if( cuadruplo.estatus != Cuadruplo.OMITIR )  listaCodigo.push( codObjeto )
            } // for cuadruplos

            // EMPAQUETAR LISTA DE CODIGOS OBJETO EN UN ARRAY
            this.listaCodigoObjeto.push( listaCodigo )
        }  // for instrucciones
    }













    







    //=======================================================================================
    //                         EVALUACION DE LOS CUADRUPLOS
    //=======================================================================================
    
    //====================================
    // CALL  -->   ; __ nombreF __ null __ CALL
    //====================================
    generarLlamadaAFuncion( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        //_________________________________________
        // EVALUAR EL NOMBRE DEL METODO A LLAMAR
        //_________________________________________
        let operando1 = cuadruplo.operando1
        let agregarArg = true
        switch( operando1.lexema )
        {
            case "modoPin": //=============================================================
                // pinMode(pin, mode)
                this.addSecuencia( secuencia , "pinMode" , ItemArduino.LLAMADA_A_FUNCION )
                this.addSecuencia( secuencia , "(" , ItemArduino.NORMAL )
                this.addSecuencia( secuencia , this.pila[0].secuencia[0].valor , ItemArduino.NORMAL )
                this.addSecuencia( secuencia , "," , ItemArduino.NORMAL )
                if( this.pila[1].secuencia[0].valor == "true" ){
                    this.addSecuencia( secuencia , "INPUT" , ItemArduino.PALABRA_RESERVADA )
                }
                else{
                    this.addSecuencia( secuencia , "OUTPUT" , ItemArduino.PALABRA_RESERVADA )
                }
                this.addSecuencia( secuencia , ");" , ItemArduino.NORMAL )
                this.limpiarLista( this.pila )
                agregarArg = false
                break

            case "leer": //=============================================================
                // digitalRead(pin)
                this.addSecuencia( secuencia , "digitalRead" , ItemArduino.LLAMADA_A_FUNCION )
                break

            case "establecerPinDigital": //===================================================
                // digitalWrite(pin, boolean)
                this.addSecuencia( secuencia , "digitalWrite" , ItemArduino.LLAMADA_A_FUNCION )
                break

            case "establecerPinAnalogico": //===================================================
                // digitalWrite(pin, boolean)
                this.addSecuencia( secuencia , "analogWrite" , ItemArduino.LLAMADA_A_FUNCION )
                break

            case "esperar": //=============================================================
                // delay(num)  -> ms
                this.addSecuencia( secuencia , "delay" , ItemArduino.LLAMADA_A_FUNCION )
                break

            default: //========================================================================
                //  LLAMADA A METODO DE COMIC
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.LLAMADA_A_FUNCION )
                break
        } 
        if( agregarArg ) 
        {
            this.addSecuencia( secuencia , "(" , ItemArduino.NORMAL )
            this.agregarArgumentos( secuencia )
            this.addSecuencia( secuencia , ");" , ItemArduino.NORMAL )
        }
        codigoArduino.secuencia = secuencia
    }



    //====================================
    // CALLRF  -->   ; __ nombreF __ null __ CALLRF
    //====================================
    generarRetornoFuncion( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        //_________________________________________
        // EVALUAR EL NOMBRE DEL METODO A LLAMAR
        //_________________________________________
        let operando1 = cuadruplo.operando1
        let agregarArg = true
        switch( operando1.lexema )
        {
            case "leer": //=============================================================
                // digitalRead(pin)
                this.addSecuencia( secuencia , "digitalRead" , ItemArduino.LLAMADA_A_FUNCION )
                break
/*
            case "encender": //=============================================================
                // digitalWrite(pin, boolean)
                this.addSecuencia( secuencia , "digitalWrite" , ItemArduino.LLAMADA_A_FUNCION )
                break

            case "esperar": //=============================================================
                // delay(num)  -> ms
                this.addSecuencia( secuencia , "delay" , ItemArduino.LLAMADA_A_FUNCION )
                break */

            default: //========================================================================
                //  LLAMADA A METODO DE COMIC
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.LLAMADA_A_FUNCION )
                break
        } 
        if( agregarArg ) 
        {
            this.addSecuencia( secuencia , "(" , ItemArduino.NORMAL )
            this.agregarArgumentos( secuencia )
            this.addSecuencia( secuencia , ")" , ItemArduino.NORMAL )
        }
        codigoArduino.secuencia = secuencia
        codigoArduino.estatus = CodigoArduino.OMITIR
    }



    //====================================
    // G
    //====================================
    evaluarGOTO( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() ,
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        //________________________
        // EVALUAR EL OPERADOR
        //________________________
        let operando1 = cuadruplo.operando1
        switch( cuadruplo.operador.lexema )
        {
            case "Si": //=============================================================
                this.addSecuencia( secuencia , "if" , ItemArduino.ESPECIAL )
                this.addSecuencia( secuencia , "(" ,  ItemArduino.NORMAL )
                //__________________________
                // EVALUAR EL OPERANDO 1
                //__________________________
                switch( operando1.token )
                {
                    case "PALABRA_RESERVADA": //==================================================
                        switch( operando1.lexema ) 
                        {
                            case "Verdadero":
                                this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )   
                                break

                            case "Falso":
                                this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )    
                                break

                            default: 
                                alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                                operando1.token + "<>" + operando1.lexema )
                        }
                        break

                    case "IDENTIFICADOR":  //==================================================
                        let itemsC = this.getValorConstante( operando1.lexema )
                        if( itemsC == null ) {
                            // ID QUE NO ES CONSTANTE
                            this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                        }
                        else 
                        {
                            // ID CONSTANTE
                            for( let i=0; i<itemsC.length;  i++ ) {
                                this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                            }
                        }
                        break

                    case "TIPO_DATO_TEMPORAL":  //========================================================
                        let itemsT = this.getTemporal( operando1.lexema )
                        if( itemsT == null ) 
                        {
                            alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                            operando1.token + "<>" + operando1.lexema )
                        }
                        else 
                        {
                            for( let i=0; i<itemsT.length;  i++ ) {
                                this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                            }
                        }
                        break

                    case "OPERANDO_FUNCION": //=========================================================
                        let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                        if( secuenciaB != null )
                        {
                            for( let i=0; i<secuenciaB.length;  i++ ) {
                                this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                            }
                        }
                        else {
                            alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                            operando1.token + "<>" + operando1.lexema )
                        }
                        break

                    default: //==========================================================================
                        alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                        operando1.token + "<>" + operando1.lexema )
                        break
                }  
                this.addSecuencia( secuencia , ") {" , ItemArduino.NORMAL)
                break

            case "Salir": //=============================================================
                switch( operando1.token )
                {
                    case "TIPO_DATO_TEMPORAL":  //================================================
                        let itemsT = this.getTemporal( operando1.lexema )
                        if( itemsT == null ) 
                        {
                            alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                            operando1.token + "<>" + operando1.lexema )
                        }
                        else 
                        {
                            for( let i=0; i<itemsT.length;  i++ ) {
                                this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                            }
                        }
                        break

                    default:  //==========================================================
                        alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                        operando1.token + "<>" + operando1.lexema )
                        break
                }
                this.addSecuencia( secuencia , ";" , ItemArduino.NORMAL )
                break

            case "Romper": //=============================================================
                this.addSecuencia( secuencia , "break" , ItemArduino.ESPECIAL )
                this.addSecuencia( secuencia , ";" , ItemArduino.NORMAL )
                break

            case "Sino": //=============================================================
                this.addSecuencia( secuencia , "else" , ItemArduino.ESPECIAL )
                this.addSecuencia( secuencia , "{" , ItemArduino.NORMAL )
                break

            case "}": //=============================================================
                secuencia.push( new ItemArduino( "}" , ItemArduino.NORMAL ))
                break

            default: //========================================================================
                alert( "GOTO NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                cuadruplo.operador.lexema )
                break
        } 
        codigoArduino.secuencia = secuencia
    }



    //====================================
    // NV  -->   = __ T3 __ null __ NV
    //====================================
    generarVariable( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() , 
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )

        if( cuadruplo.operador.lexema == "Ciclo" ){
            this.addSecuencia( secuencia , "for" , ItemArduino.ESPECIAL )
            this.addSecuencia( secuencia , "(" , ItemArduino.NORMAL )
        }
        //____________________________
        // EVALUAR EL TIPO DE DATO
        //____________________________
        let cuadruploR = cuadruplo.resultado
        switch( cuadruploR.tipoDato )
        {
            case "Booleano": //=============================================================
                this.addSecuencia( secuencia , "boolean" , ItemArduino.PALABRA_RESERVADA )
                break

            case "Entero": //=============================================================
                this.addSecuencia( secuencia , "int" , ItemArduino.PALABRA_RESERVADA )
                break

            default: //========================================================================
                alert( "Tipo de Dato NO identificado (NV): " + cuadruploR.tipoDato )
                break
        }

        this.addSecuencia( secuencia , cuadruploR.ID , ItemArduino.NORMAL )
        this.listaVariables.push( new CodigoArduino(
            codigoArduino.clave ,
            codigoArduino.ambito ,
            codigoArduino.bloque ,
            [ new ItemArduino( cuadruploR.ID , ItemArduino.NORMAL ) ]
        ) )
        this.addSecuencia( secuencia , "=" , ItemArduino.NORMAL)
        //__________________________
        // EVALUAR EL OPERANDO 1
        //__________________________
        let operando1 = cuadruplo.operando1
        switch( operando1.token )
        {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )    
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( operando1.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )   
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    case "Nada":
                        this.addSecuencia( secuencia , "void" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    default: 
                        alert( "OPERANDO 1 NO EVALUADO (NV): " + operando1.lexema )
                }
                break

            case "IDENTIFICADOR":  //=============================================================
                let itemsC = this.getValorConstante( operando1.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
                break

            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando1.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 1 NO EVALUADO (NV): " + operando1.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break

            case "OPERANDO_FUNCION": //=========================================================
                let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                }
                break

            default: //==========================================================================
                alert( "OPERANDO 1 NO EVALUADO (NV): " + operando1.lexema )
                break
        }  
        this.addSecuencia( secuencia , ";" , ItemArduino.NORMAL )
        codigoArduino.secuencia = secuencia
    }



    //====================================
    // RV  -->   = __ T __ null __ RV
    //====================================
    generarReasignacionDeVariable( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() , 
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia ) 
        let cuadruploR = cuadruplo.resultado
        this.addSecuencia( secuencia , cuadruploR.ID + " =" , ItemArduino.NORMAL )
        //__________________________
        // EVALUAR EL OPERANDO 1
        //__________________________
        let operando1 = cuadruplo.operando1
        switch( operando1.token )
        {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )    
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( operando1.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )   
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    default: 
                        alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                        operando1.token + "<>" + operando1.lexema )
                }
                break

            case "IDENTIFICADOR":  //=============================================================
                let itemsC = this.getValorConstante( operando1.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
                break

            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando1.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break

            case "OPERANDO_FUNCION": //=========================================================
                let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                }
                break

            default: //==========================================================================
                alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                operando1.token + "<>" + operando1.lexema )
                break
        }  
        //____________________________
        // EVALUAR EL OPERADOR
        //____________________________
        if( cuadruplo.operador.lexema == "Saltos" )  this.addSecuencia( secuencia , ") {" , ItemArduino.NORMAL )
        else this.addSecuencia( secuencia , ";" , ItemArduino.NORMAL )
        codigoArduino.secuencia = secuencia
    }



    //====================================
    // RET  -->   }   |   Devolver exp;  |  Devolver Nada;
    //====================================
    generarFinFuncion( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() ,
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        //________________________________
        // EVALUAR EL TIPO DE FINALIZACION 
        // DE FUNCION
        //________________________________
        if( cuadruplo.operador.lexema == '}' ) {
            this.addSecuencia( secuencia , "}" , ItemArduino.NORMAL )
        }    
        else 
        {
            //DEVOLVER
            this.addSecuencia( secuencia , "return" , ItemArduino.ESPECIAL )
            //__________________
            // EVALUAR OPERANDO 1
            //__________________
            let operando1 = cuadruplo.operando1
            switch( operando1.token )
            {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( operando1.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )
                        break

                    case "Nada": 
                        break

                    default: 
                        alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                        operando1.token + "<>" + operando1.lexema )
                }
                break

            case "IDENTIFICADOR":  //===========================================================
                let itemsC = this.getValorConstante( operando1.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
                break
                
            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando1.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break

            case "OPERANDO_FUNCION": //=========================================================
                let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                }
                break

            default:
                alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                break

            }
            this.addSecuencia( secuencia , ";" , ItemArduino.NORMAL ) 
        }
        codigoArduino.secuencia = secuencia
    }




    //====================================
    // P  -->   ejem.  = _ 3 _ null _ P 
    //====================================
    almacenarDatoPila( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() ,
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        //______________________________
        // EVALUAR EL OPERANDO 1
        //______________________________
        let operando1 = cuadruplo.operando1
        switch( operando1.token )
        {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( cuadruplo.operando1.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )
                        break

                    case "Nada":
                        this.addSecuencia( secuencia , "void" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    default: 
                        alert( "OPERANDO 1 NO EVALUADO (P): " + operando1.lexema )
                }
                break

            case "IDENTIFICADOR":
                let itemsC = this.getValorConstante( operando1.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
                break

            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando1.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break

            case "OPERANDO_FUNCION": //=========================================================
                let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                }
                break

            default:
                alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                break
        } 

        codigoArduino.secuencia = secuencia
        codigoArduino.estatus = CodigoArduino.OMITIR
        this.pila.push( codigoArduino )
        console.log( "===== (P) ADD A LA PILA =====" )
        console.log( codigoArduino )
    }



    //====================================
    // T  -->   ejem.  + __ 2 __ 4 __ T
    //====================================
    almacenarDatoTemporal( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() ,
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        this.addSecuencia( secuencia , "(" , ItemArduino.NORMAL )
        //____________________________
        // EVALUAR EL OPERANDO 1
        //____________________________
        let operando1 = cuadruplo.operando1
        switch( operando1.token )
        {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )    
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( operando1.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )   
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    case "Nada":
                        this.addSecuencia( secuencia , "void" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    default: 
                        alert( "OPERANDO 1 NO EVALUADO (T): " + operando1.lexema )
                }
                break

            case "IDENTIFICADOR":  //=============================================================
                let itemsC = this.getValorConstante( operando1.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
            break

            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando1.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 1 NO EVALUADO (T): " + operando1.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break

            case "OPERANDO_FUNCION": //=========================================================
                //alert( operando1.lexema + "<.>" + operando1.id )
                let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                }
                break

            default: //==========================================================================
                alert( "OPERANDO 1 NO EVALUADO (T): " + operando1.lexema )
                break
        } 
        //____________________________
        // EVALUAR EL OPERADOR
        //____________________________
        let operador = cuadruplo.operador
        switch( operador.lexema )
        {
            case "+":
            case "-":
            case "*":
            case "/":
            case "==":
            case ">":
            case "<":
            case "<=":
            case ">=":
            case "!=": //=============================================================
                this.addSecuencia( secuencia , operador.lexema , ItemArduino.NORMAL )
                break

            case "Y": //==============================================================
                this.addSecuencia( secuencia , "&&" , ItemArduino.NORMAL )
                break

            case "O": //==============================================================
                this.addSecuencia( secuencia , "||" , ItemArduino.NORMAL )
                break

            case "=": //==============================================================
                this.addSecuencia( secuencia , ")" , ItemArduino.NORMAL )
                if( secuencia.length == 3 ){
                    secuencia.pop()
                    secuencia.shift()
                }
                codigoArduino.secuencia = secuencia
                codigoArduino.estatus = CodigoArduino.OMITIR
                this.listaDatosTemporales.push( codigoArduino )
                return

            default:
                alert( "OPERADOR NO EVALUADO (T): " + operador.lexema )
                break
        } 
        //____________________________
        // EVALUAR EL OPERANDO 2
        //____________________________
        let operando2 = cuadruplo.operando2
        switch( operando2.token )
        {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando2.lexema , ItemArduino.NORMAL )    
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( operando2.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )   
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    case "Nada":
                        this.addSecuencia( secuencia , "void" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    default: 
                        alert( "OPERANDO 2 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                        operando2.token + "<>" + operando2.lexema )
                }
                break

            case "IDENTIFICADOR":  //=============================================================
                let itemsC = this.getValorConstante( operando2.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando2.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
                break

            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando2.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 2 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                        operando2.token + "<>" + operando2.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break

            case "OPERANDO_FUNCION": //=========================================================
                let secuenciaB = this.buscarSecuencia( operando2.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 2 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando2.token + "<>" + operando2.lexema )
                }
                break

            default: //==========================================================================
                alert( "OPERANDO 2 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                operando2.token + "<>" + operando2.lexema )
                break
        } 

        this.addSecuencia( secuencia , ")" , ItemArduino.NORMAL )
        if( secuencia.length == 3 ){
            secuencia.pop()
            secuencia.shift()
        }
        codigoArduino.secuencia = secuencia
        codigoArduino.estatus = CodigoArduino.OMITIR
        this.listaDatosTemporales.push( codigoArduino )
    }



    //====================================
    // T  -->   ejem.  + __ 2 __ 4 __ T
    //====================================
    almacenarDatoConstante( cuadruplo = new Cuadruplo() , codigoArduino = new CodigoArduino() ,
        listaCodigo = [ new CodigoArduino() ] )
    {
        let secuencia = [ new ItemArduino() ]
        this.limpiarLista( secuencia )
        this.addSecuencia( secuencia , "(" , ItemArduino.NORMAL )
        //____________________________
        // EVALUAR EL OPERANDO 1
        //____________________________
        let operando1 = cuadruplo.operando1
        switch( operando1.token )
        {
            case "NUMERO": //=============================================================
                this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )    
                break

            case "PALABRA_RESERVADA": //==========================================================
                switch( operando1.lexema ) 
                {
                    case "Verdadero":
                        this.addSecuencia( secuencia , "true" , ItemArduino.PALABRA_RESERVADA )   
                        break

                    case "Falso":
                        this.addSecuencia( secuencia , "false" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    case "Nada":
                        this.addSecuencia( secuencia , "void" , ItemArduino.PALABRA_RESERVADA )    
                        break

                    default: 
                        alert( "OPERANDO 1 NO EVALUADO (T): " + operando1.lexema )
                }
                break

            case "IDENTIFICADOR":  //=============================================================
                let itemsC = this.getValorConstante( operando1.lexema )
                if( itemsC == null ) {
                    // ID QUE NO ES CONSTANTE
                    this.addSecuencia( secuencia , operando1.lexema , ItemArduino.NORMAL )
                }
                else 
                {
                    // ID CONSTANTE
                    for( let i=0; i<itemsC.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsC[i].valor , itemsC[i].estilo )
                    }
                }
                break


            case "TIPO_DATO_TEMPORAL":  //========================================================
                let itemsT = this.getTemporal( operando1.lexema )
                if( itemsT == null ) 
                {
                    alert( "OPERANDO 1 NO EVALUADO (T): " + operando1.lexema )
                    break
                }
                else 
                {
                    for( let i=0; i<itemsT.length;  i++ ) {
                        this.addSecuencia( secuencia , itemsT[i].valor , itemsT[i].estilo )
                    }
                }
                break


            case "OPERANDO_FUNCION": //=========================================================
                //alert( operando1.lexema + "<.>" + operando1.id )
                let secuenciaB = this.buscarSecuencia( operando1.lexema , listaCodigo ) 
                if( secuenciaB != null )
                {
                    for( let i=0; i<secuenciaB.length;  i++ ) {
                        this.addSecuencia( secuencia , secuenciaB[i].valor , secuenciaB[i].estilo )
                    }
                }
                else {
                    alert( "OPERANDO 1 NO EVALUADO (" + cuadruplo.resultado.clave + "): " + 
                    operando1.token + "<>" + operando1.lexema )
                }
                break


            default: //==========================================================================
                alert( "OPERANDO 1 NO EVALUADO (T): " + operando1.lexema )
                break     
        } 

        this.addSecuencia( secuencia , ")" , ItemArduino.NORMAL )
        if( secuencia.length == 3 ) {
            secuencia.pop()
            secuencia.shift()
        }
        codigoArduino.secuencia = secuencia
        codigoArduino.estatus = CodigoArduino.OMITIR
        this.listaDatosConstantes.push( codigoArduino )
    }























    //=======================================================================================
    //                          RECURSOS
    //=======================================================================================

    getTemporal( claveTemporal = "" )
    {
        let codigoA = [ new ItemArduino() ]
        for( let i=0;  i<this.listaDatosTemporales.length;  i++ )
        {
            let codA = this.listaDatosTemporales[i]
            if( codA.clave == claveTemporal ) {
                //alert( codA.clave + "==" + claveTemporal + "  SI" )
                codigoA = codA.secuencia
                return codigoA
            }
        }
        codigoA = null
        return codigoA
    }


    getVariable( claveTemporal = "" )
    {
        let codigoA = [ new ItemArduino() ]
        for( let i=0;  i<this.listaVariables.length;  i++ )
        {
            let codA = this.listaVariables[i]
            if( codA.clave == claveTemporal ) {
                //alert( codA.clave + "==" + claveTemporal + "  SI" )
                codigoA = codA.secuencia
                return codigoA
            }
        }
        codigoA = null
        return codigoA
    }


    limpiarLista( lista = [] )
    {
        while( lista.length > 0 ) {  lista.pop();  }
    }


    addSecuencia( secuencia = [ new ItemArduino() ] , valor = "" , estilo = 0 )
    {
        secuencia.push( new ItemArduino( valor , estilo ) )
    }


    agregarArgumentos( secuencia = [ new ItemArduino() ] )
    {
        //_______________________
        // RECORRER LOS ARGUMENTOS
        //________________________
        while( this.pila.length > 0 ) 
        {
            let argumento = this.pila[0]
            for( let i=0; i<argumento.secuencia.length;  i++ ) 
            {
                this.addSecuencia( 
                    secuencia , 
                    argumento.secuencia[i].valor , 
                    argumento.secuencia[i].estilo 
                )
            }
            this.addSecuencia( secuencia , "," , ItemArduino.NORMAL )
            this.pila.shift()
        }
        if( secuencia[ secuencia.length - 1 ].valor == ',' )  secuencia.pop()
    }



    buscarSecuencia( clave = "" , listaCodigo = [ new CodigoArduino() ] )
    {
        //____________________________
        // RECORRER CODIGOS GENERADOS 
        // EN LA INSTRUCCION ACTUAL
        //_____________________________
        for( let i=0;  i<listaCodigo.length;  i++ )
        {
            let codA = listaCodigo[i]
            if( codA.clave == clave ) return codA.secuencia
        }
        return null
    }




    getValorConstante( ID = "" )
    {
        let codigoA = [ new ItemArduino() ]
        for( let i=0;  i<this.listaDatosConstantes.length;  i++ )
        {
            let codA = this.listaDatosConstantes[i]
            if( codA.IDvariable == ID ) {
                //alert( codA.clave + "==" + claveTemporal + "  SI" )
                codigoA = codA.secuencia
                return codigoA
            }
        }
        codigoA = null
        return codigoA
    }

}