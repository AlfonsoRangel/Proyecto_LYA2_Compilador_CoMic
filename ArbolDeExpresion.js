import { Cuadruplo } from './Codigo_Intermedio/Cuadruplo.js';
import { ResultadoCuadruplo } from './Codigo_Intermedio/ResultadoCuadruplo.js';
import { ComponenteLexico } from './ComponenteLexico.js';
import { DebugArbol } from './debug_arbol.js';
import { Nodo } from './Nodo.js';
import { ErrorSemantico } from './Semantico/ErrorSemantico.js';
import { SimboloFuncion } from './Semantico/SimboloFuncion.js';
import { SimboloPin } from './Semantico/SimboloPin.js';
import { SimboloVariable } from './Semantico/SimboloVariable.js';

export class ArbolDeExpresion 
{
    constructor( expresion = [new ComponenteLexico()] )
    {
        this.notacionPrefija = [new ComponenteLexico()];   this.notacionPrefija.pop();
        this.notacionPosfija = [new ComponenteLexico()];   this.notacionPosfija.pop();
        this.expresionEntrada = expresion;
        this.pila = [new ComponenteLexico()];   this.pila.pop();
        this.raiz = new Nodo();
        this.errorSem = new ErrorSemantico();
        this.debug = [ new DebugArbol() ];   this.debug.pop();
        this.tipoDatoExpresion = "";
        this.listaCuadruplos = [ new Cuadruplo() ];
    }


    ejecutar( 
        listaAmbitos = [ 0 ] , listaPines = [ new SimboloPin() ] , 
        listaVariables = [ new SimboloVariable() ] , listaConstantes = [ new SimboloVariable() ] )
    {
        this.hacerArbol();
        this.recorridoPosfijo( this.raiz );
        this.analizarExpresion( listaAmbitos , listaPines , listaVariables , listaConstantes );
       /* alert( "PREFIJA:  " + this.getExpresion( this.notacionPrefija , true )
        + "\nNORMAL: " + this.getExpresion( this.expresionEntrada , false )
        + "\nPOSFIJA: " + this.getExpresion( this.notacionPosfija , false ) 
        + "\nTIPO DE DATO RESULTANTE: " + this.tipoDatoExpresion );*/
    }



    //==============================================================================
    //  METODO QUE GENERA LOS CUADRUPLOS DE UNA EXPRESION
    //==============================================================================
    obtenerCuadruplos( 
        bloque = 0 , listaAmbitos = [ 0 ] , funcion = new SimboloFuncion(0,"N/A") , 
        callFuncion = new SimboloFuncion(0,"N/A") , listaPines = [ new SimboloPin() ] , 
        listaVariables = [ new SimboloVariable() ] ,  listaConstantes = [ new SimboloVariable() ]
    ) {
        this.hacerArbol();
        this.recorridoPosfijo( this.raiz );

        // PROCESO DE OBTENCION
        let pilaSem = [ new ComponenteLexico() ];    pilaSem.pop();
        let expPosfija = this.notacionPosfija.slice( 0 , this.notacionPosfija.length );
        this.listaCuadruplos = [ new Cuadruplo() ];    this.listaCuadruplos.pop();

        while( expPosfija.length > 0 )
        {
            let operando1 = new ComponenteLexico();
            let operando2 = new ComponenteLexico();
            let ref = new ComponenteLexico();
            let tope = pilaSem.length - 1;
            let compLex = expPosfija[0].clonar()
            compLex.tipoDato = expPosfija[0].tipoDato
            expPosfija.shift();
            switch( compLex.token )
            {
                case '':
                    break;

                // OPERADOR ARITMETICO ______________________________________________________
                case 'OPERADOR_SUMAR':
                case 'OPERADOR_RESTAR':
                case 'OPERADOR_MULTIPLICACION':
                case 'OPERADOR_DIVISION':
                    if( tope < 0 )
                    {
                        alert( "(corregir arbol) no se encontro el operando 2 en generacion de codigo" )
                        return false;
                    }
                    operando2 = pilaSem[tope];
                    pilaSem.pop();
                    tope--;
                    if( tope < 0 )
                    {
                        alert( "(corregir arbol) no se encontro el operando 1 en generacion de codigo" )
                        return false;
                    }
                    operando1 = pilaSem[tope];
                    pilaSem.pop();
                    this.listaCuadruplos.push(  new Cuadruplo (
                        compLex , operando1 , operando2 , new ResultadoCuadruplo(
                            ResultadoCuadruplo.TIPO_DATO_TEMPORAL , bloque , listaAmbitos , 
                            "Entero" , "N/A" , "N/A" , funcion , callFuncion 
                        )
                    ))
                    ref = new ComponenteLexico( "TIPO_DATO_TEMPORAL" , "" , this.listaCuadruplos[ this.listaCuadruplos.length-1 ].resultado.clave )
                    ref.tipoDato = "Entero";
                    pilaSem.push( ref );
                    break


                // OPERADOR BOOLEANO ______________________________________________________
                case 'OPERADOR_AND':
                case 'OPERADOR_OR':
                    if( tope < 0 )
                    {
                        alert( "(corregir arbol) no se encontro el operando 2 en generacion de codigo" )
                        return false;
                    }
                    operando2 = pilaSem[tope];
                    pilaSem.pop();
                    tope--;
                    if( tope < 0 )
                    {
                        alert( "(corregir arbol) no se encontro el operando 1 en generacion de codigo" )
                        return false;
                    }
                    operando1 = pilaSem[tope];
                    pilaSem.pop();
                    this.listaCuadruplos.push(  new Cuadruplo(
                        compLex , operando1 , operando2 , new ResultadoCuadruplo(
                            ResultadoCuadruplo.TIPO_DATO_TEMPORAL , bloque , listaAmbitos , 
                            "Booleano" , "N/A" , "N/A" , funcion , callFuncion 
                        )
                    ))
                    ref = new ComponenteLexico( "TIPO_DATO_TEMPORAL" , "" , this.listaCuadruplos[ this.listaCuadruplos.length-1 ].resultado.clave )
                    ref.tipoDato = "Booleano";
                    pilaSem.push( ref );
                    break


                // OPERADOR COMPARACION ______________________________________________________
                case 'OPERADOR_MENOR_QUE':
                case 'OPERADOR_MAYOR_QUE':
                case 'OPERADOR_IGUAL_QUE':
                case 'OPERADOR_NO_ES_IGUAL_QUE':
                case 'OPERADOR_MENOR_IGUAL_QUE':
                case 'OPERADOR_MAYOR_IGUAL_QUE':
                    if( tope < 0 )
                    {
                        alert( "(corregir arbol) no se encontro el operando 2 en generacion de codigo" )
                        return false;
                    }
                    operando2 = pilaSem[tope];
                    pilaSem.pop();
                    tope--;
                    if( tope < 0 )
                    {
                        alert( "(corregir arbol) no se encontro el operando 1 en generacion de codigo" )
                        return false;
                    }
                    operando1 = pilaSem[tope];
                    pilaSem.pop();
                    this.listaCuadruplos.push(  new Cuadruplo(
                        compLex , operando1 , operando2 , new ResultadoCuadruplo(
                            ResultadoCuadruplo.TIPO_DATO_TEMPORAL , bloque , listaAmbitos , 
                            "Booleano" , "N/A" , "N/A" , funcion , callFuncion
                        )
                    ))
                    ref = new ComponenteLexico( "TIPO_DATO_TEMPORAL" , "" , this.listaCuadruplos[ this.listaCuadruplos.length-1 ].resultado.clave )
                    ref.tipoDato = "Booleano";
                    pilaSem.push( ref );
                    break


                // OPERANDO Entero ______________________________________________________
                case 'NUMERO':
                    compLex.tipoDato = "Entero";
                    pilaSem.push( compLex );
                    break


                // OPERANDO Booleano ______________________________________________________
                case 'PALABRA_RESERVADA':
                    switch( compLex.lexema )
                    {
                        case 'Verdadero':
                        case 'Falso':
                            compLex.tipoDato = "Booleano";
                            pilaSem.push( compLex );
                            break;
                    }
                    break


                // OPERANDO ID ______________________________________________________
                case 'IDENTIFICADOR':
                    // VERIFICAR SI EXISTE LA VARIABLE EN LA TABLA DE PINES)
                    let busqueda = listaPines.filter( sp => sp.nombre == compLex.lexema );
                    if( busqueda.length != 0 )   // si ID es PIN
                    {
                        compLex.tipoDato = "Pin";
                        pilaSem.push( compLex );
                        break
                    }

                    // VERIFICAR SI EXISTE EL ID EN LA TABLA DE CONSTANTES
                    let busqueda2 = listaConstantes.filter( sc => sc.nombre == compLex.lexema );
                    if( busqueda2.length != 0 )   // si ID es CONSTANTE
                    {
                        compLex.tipoDato = busqueda2[0].tipoDato
                        pilaSem.push( compLex )
                        break
                    }

                    // BUSCAR EL ID EN LA TABLA DE VARIABLES EN AMBITO VALIDO
                    let vaEncontrada = false;
                    for( let i=listaAmbitos.length-1; i>=0; i-- )
                    {
                        let amb = listaAmbitos[i];
                        let busqueda = listaVariables.filter( simV => 
                            simV.nombre == compLex.lexema  &&  simV.getUltimoAmbito() == amb );
                        if( busqueda.length != 0 )  // Si es ID valido
                        {        
                            compLex.tipoDato = busqueda[0].tipoDato
                            pilaSem.push( compLex )
                            vaEncontrada = true
                            break
                        }
                    }
                    if( vaEncontrada == false )
                    {
                        let mensajeID = "Identificador '" + compLex.lexema + "' NO declarado" 
                        alert( "(corregir arbol)\n\n" + mensajeID + "en generacion de codigo" )
                        return false
                    }
                    break


                // OPERANDO Funcion ______________________________________________________
                case 'OPERANDO_FUNCION':
                    compLex.lexema = compLex.id
                    pilaSem.push( compLex );
                    break

                default:
                    alert( "(corregir arbol)\n\nOperador u operando inesperado en generacion de codigo" )
                    return false;
            } // FIN SWITCH
        } // FIN CICLO

        return true
    }




    //==============================================================================
    //  METODO QUE GENERA LOS CUADRUPLOS DE UNA EXPRESION
    //==============================================================================
    getResultadoExpresion( 
        bloque = 0 , listaAmbitos = [ 0 ] , listaPines = [ new SimboloPin() ] , 
        listaVariables = [ new SimboloVariable() ] , listaConstantes = [ new SimboloVariable() ]
     )
    {
        let op = new ComponenteLexico()
        if( this.listaCuadruplos.length == 0 ) 
        {  
            op = this.expresionEntrada[0]  
            switch( op.token )
            {
                // OPERANDO Entero ______________________________________________________
                case 'NUMERO':
                    op.tipoDato = "Entero";
                    break

                // OPERANDO Booleano ______________________________________________________
                case 'PALABRA_RESERVADA':
                    switch( op.lexema )
                    {
                        case 'Verdadero':
                        case 'Falso':
                            op.tipoDato = "Booleano"
                            break
                    }
                    break

                // OPERANDO ID ______________________________________________________
                case 'IDENTIFICADOR':
                    // VERIFICAR SI EXISTE LA VARIABLE EN LA TABLA DE PINES)
                    let busqueda = listaPines.filter( sp => sp.nombre == op.lexema );
                    if( busqueda.length != 0 )   // si ID es PIN
                    {
                        op.tipoDato = "Pin";
                        break
                    }

                    // VERIFICAR SI EXISTE EL ID EN LA TABLA DE CONSTANTES
                    let busqueda2 = listaConstantes.filter( sc => sc.nombre == op.lexema );
                    if( busqueda2.length != 0 )   // si ID es CONSTANTE
                    {
                        op.tipoDato = busqueda2[0].tipoDato
                        break
                    }

                    // BUSCAR EL ID EN LA TABLA DE VARIABLES EN AMBITO VALIDO
                    let vaEncontrada = false;
                    for( let i=listaAmbitos.length-1; i>=0; i-- )
                    {
                        let amb = listaAmbitos[i];
                        let busqueda = listaVariables.filter( simV => 
                            simV.nombre == op.lexema  &&  simV.getUltimoAmbito() == amb );
                        if( busqueda.length != 0 )  // Si es ID valido
                        {        
                            op.tipoDato = busqueda[0].tipoDato
                            vaEncontrada = true
                            break
                        }
                    }
                    if( vaEncontrada == false )
                    {
                        let mensajeID = "Identificador '" + op.lexema + "' NO declarado" 
                        alert( "(corregir arbol)\n\n" + mensajeID + "en generacion de codigo" )
                    }
                    break
            }
        }
        else{ 
            op = new ComponenteLexico( "TIPO_DATO_TEMPORAL" , "" ,
                this.listaCuadruplos[ this.listaCuadruplos.length - 1 ].resultado.clave 
            )
            op.tipoDato = this.listaCuadruplos[ this.listaCuadruplos.length - 1].resultado.tipoDato 
        }
        return op
    }



    //==============================================================================
    //  METODO QUE ANALIZA LOS TIPOS DE DATOS DE LA EXPRESION  
    //==============================================================================
    analizarExpresion( 
        listaAmbitos = [ 0 ] , listaPines = [ new SimboloPin() ] , 
        listaVariables = [ new SimboloVariable() ] , listaConstantes = [ new SimboloVariable() ] )
    {
        let pilaSem = [ new ComponenteLexico() ];    pilaSem.pop();
        let expPosfija = this.notacionPosfija.slice( 0 , this.notacionPosfija.length );
        console.clear()
        //alert( expPosfija.length )
        while( expPosfija.length > 0 )
        {
            console.log( expPosfija.slice(0,expPosfija.length) )

            let itemDebug = new DebugArbol();
            itemDebug.notacionPos = expPosfija.slice( 0 , expPosfija.length );
            itemDebug.pilaI = pilaSem.slice( 0 , pilaSem.length );

            let operando1 = new ComponenteLexico();
            let operando2 = new ComponenteLexico();
            let tope = pilaSem.length - 1;
            let compLex = new ComponenteLexico( 
                expPosfija[0].token ,
                expPosfija[0].tipoToken ,
                expPosfija[0].lexema ,
                expPosfija[0].numeroLinea  );
            compLex.tipoDato = expPosfija[0].tipoDato
            expPosfija.shift();
            switch( compLex.token )
            {
                case '':
                    break;

                // OPERADOR ARITMETICO ______________________________________________________
                case 'OPERADOR_SUMAR':
                case 'OPERADOR_RESTAR':
                case 'OPERADOR_MULTIPLICACION':
                case 'OPERADOR_DIVISION':
                    if( tope < 0 )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "No se ha especificado el primer operando " +
                        "del operador '" + compLex.lexema;
                        this.errorSem.sugerencia = "Coloque un operando antes del operador '" 
                        + compLex.lexema + "' "; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    operando2 = pilaSem[tope];
                    pilaSem.pop();
                    tope--;
                    if( tope < 0 )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "No se ha especificado el segundo operando " +
                        "del operador '" + compLex.lexema;
                        this.errorSem.sugerencia = "Coloque un operando despues del operador '" 
                        + compLex.lexema + "' "; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    operando1 = pilaSem[tope];
                    pilaSem.pop();
                    if( operando1.tipoDato != "Entero" )  // ERROR
                    {
                        this.errorSem.numeroLinea = operando1.numeroLinea;
                        this.errorSem.descripcion = "La operacion aritmetica '" + compLex.lexema +
                        "' NO es posible debido a que el operando '" + operando1.lexema + "' NO " +
                        "es un numero entero";
                        this.errorSem.sugerencia = "Para realizar una operacion aritmetica '" + compLex.lexema +
                        "' correcta, debes cambiar tu operando '" + operando1.lexema + "' por un numero entero , " +
                        "un ID que almacene un dato entero o el resultado de una combinacion de operaciones de " +
                        "'+' , '-' , '*' o '/'"; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    if( operando2.tipoDato != "Entero" )  // ERROR
                    {
                        this.errorSem.numeroLinea = operando2.numeroLinea;
                        this.errorSem.descripcion = "La operacion aritmetica '" + compLex.lexema +
                        "' NO es posible debido a que el operando '" + operando2.lexema + "' NO " +
                        "es un numero entero";
                        this.errorSem.sugerencia = "Para realizar una operacion aritmetica '" + compLex.lexema +
                        "' correcta, debes cambiar tu operando '" + operando2.lexema + "' por un numero entero , " +
                        "un ID que almacene un dato entero o el resultado de una combinacion de operaciones de " +
                        "'+' , '-' , '*' o '/'"; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    compLex.lexema = "( " + operando1.lexema + " " + compLex.lexema + " " + operando2.lexema + " )";
                    compLex.tipoDato = "Entero";
                    pilaSem.push( compLex );
                    itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                    itemDebug.accionR = "Operacion aritmetica realizada"
                    this.debug.push ( itemDebug );
                    break;


                // OPERADOR BOOLEANO ______________________________________________________
                case 'OPERADOR_AND':
                case 'OPERADOR_OR':
                    if( tope < 0 )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "No se ha especificado el primer operando " +
                        "del operador '" + compLex.lexema;
                        this.errorSem.sugerencia = "Coloque un operando antes del operador '" 
                        + compLex.lexema + "' "; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    operando2 = pilaSem[tope];
                    pilaSem.pop();
                    tope--;
                    if( tope < 0 )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "No se ha especificado el segundo operando " +
                        "del operador '" + compLex.lexema;
                        this.errorSem.sugerencia = "Coloque un operando despues del operador '" 
                        + compLex.lexema + "' "; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    operando1 = pilaSem[tope];
                    pilaSem.pop();
                    if( operando1.tipoDato != "Booleano" )  // ERROR
                    {
                        this.errorSem.numeroLinea = operando1.numeroLinea;
                        this.errorSem.descripcion = "La operacion logica '" + compLex.lexema +
                        "' NO es posible debido a que el operando '" + operando1.lexema + "' NO " +
                        "es un valor booleano";
                        this.errorSem.sugerencia = "Para realizar una operacion logica '" + compLex.lexema +
                        "' correcta, debes cambiar tu operando '" + operando1.lexema + "' por: 'Verdadero' , 'Falso' , " +
                        "un ID que almacene un dato booleano, el resultado de una operacion de comparacion " +
                        "'==' , '!=' , '<' o '<=' , '>' , '>=' o de una operacion logica 'Y' , 'O' , 'No'"; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    if( operando2.tipoDato != "Booleano" )  // ERROR
                    {
                        this.errorSem.numeroLinea = operando2.numeroLinea;
                        this.errorSem.descripcion = "La operacion logica '" + compLex.lexema +
                        "' NO es posible debido a que el operando '" + operando2.lexema + "' NO " +
                        "es un valor booleano";
                        this.errorSem.sugerencia = "Para realizar una operacion logica '" + compLex.lexema +
                        "' correcta, debes cambiar tu operando '" + operando2.lexema + "' por: 'Verdadero' , 'Falso' , " +
                        "un ID que almacene un dato booleano, el resultado de una operacion de comparacion " +
                        "'==' , '!=' , '<' o '<=' , '>' , '>=' o de una operacion logica 'Y' , 'O' , 'No'"; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    compLex.lexema = "( " + operando1.lexema + " " + compLex.lexema + " " + operando2.lexema + " )";
                    compLex.tipoDato = "Booleano";
                    pilaSem.push( compLex );
                    itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                    itemDebug.accionR = "Operacion Logica realizada"
                    this.debug.push ( itemDebug );
                    break;


                // OPERADOR COMPARACION ______________________________________________________
                case 'OPERADOR_MENOR_QUE':
                case 'OPERADOR_MAYOR_QUE':
                case 'OPERADOR_IGUAL_QUE':
                case 'OPERADOR_NO_ES_IGUAL_QUE':
                case 'OPERADOR_MENOR_IGUAL_QUE':
                case 'OPERADOR_MAYOR_IGUAL_QUE':
                    if( tope < 0 )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "No se ha especificado el primer operando " +
                        "del operador '" + compLex.lexema;
                        this.errorSem.sugerencia = "Coloque un operando antes del operador '" 
                        + compLex.lexema + "' "; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    operando2 = pilaSem[tope];
                    pilaSem.pop();
                    tope--;
                    if( tope < 0 )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "No se ha especificado el segundo operando " +
                        "del operador '" + compLex.lexema;
                        this.errorSem.sugerencia = "Coloque un operando despues del operador '" 
                        + compLex.lexema + "' "; 
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    operando1 = pilaSem[tope];
                    pilaSem.pop();
                    if( operando1.tipoDato == "Entero" && operando2.tipoDato == "Entero" ||
                        operando1.tipoDato == "Booleano" && operando2.tipoDato == "Booleano" )
                    {
                        compLex.lexema = "( " + operando1.lexema + " " + compLex.lexema + " " + operando2.lexema + " )";
                        compLex.tipoDato = "Booleano";
                        pilaSem.push( compLex );
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "Operacion de Comparacion realizada"
                        this.debug.push ( itemDebug );
                    }
                    else  // ERROR
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "La operacion de comparacion '" + compLex.lexema +
                        "' NO es posible debido a que los operandos son incompatibles:\n" + 
                        "Operando 1 '" + operando1.lexema + "' devuelve un tipo de dato (" + operando1.tipoDato + ")\n" +
                        "Operando 2 '" + operando2.lexema + "' devuelve un tipo de dato (" + operando2.tipoDato + ")";

                        this.errorSem.sugerencia = "Para realizar una operacion de comparacion '" + compLex.lexema +
                        "' correcta, ambos operandos deben ser (Entero) o (Booleano). Comprueba tus expresiones";
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    break;


                // OPERANDO Entero ______________________________________________________
                case 'NUMERO':
                    compLex.tipoDato = "Entero";
                    pilaSem.push( compLex );
                    itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                    itemDebug.accionR = "Operando Entero agregado a la pila"
                    this.debug.push ( itemDebug );
                    break;


                // OPERANDO Booleano ______________________________________________________
                case 'PALABRA_RESERVADA':
                    switch( compLex.lexema )
                    {
                        case 'Verdadero':
                        case 'Falso':
                            compLex.tipoDato = "Booleano";
                            pilaSem.push( compLex );
                            itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                            itemDebug.accionR = "Operando Booleano agregado a la pila"
                            this.debug.push ( itemDebug );
                            break;
                    }
                    break;


                // OPERANDO ID ______________________________________________________
                case 'IDENTIFICADOR':
                    // VERIFICAR SI EXISTE LA VARIABLE EN LA TABLA DE PINES
                    //alert( "VERIFICAR ID: " + compLex.lexema )
                    let busqueda = listaPines.filter( sp => sp.nombre == compLex.lexema );
                    if( busqueda.length != 0 )   // si ID es PIN
                    {
                        compLex.tipoDato = "Pin";
                        pilaSem.push( compLex );
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "Operando ID agregado a la pila"
                        this.debug.push ( itemDebug );
                        break;
                    }

                    // VERIFICAR SI EXISTE EL ID EN LA TABLA DE CONSTANTES
                    let busqueda2 = listaConstantes.filter( sc => sc.nombre == compLex.lexema );
                    if( busqueda2.length != 0 )   // si ID es CONSTANTE
                    {
                        compLex.tipoDato = busqueda2[0].tipoDato;
                        pilaSem.push( compLex );
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "Operando ID agregado a la pila"
                        this.debug.push ( itemDebug );
                        break;
                    }

                    // BUSCAR EL ID EN LA TABLA DE VARIABLES EN AMBITO VALIDO
                    let vaEncontrada = false;
                    for( let i=listaAmbitos.length-1; i>=0; i-- )
                    {
                        let amb = listaAmbitos[i];
                        let busqueda = listaVariables.filter( simV => 
                            simV.nombre == compLex.lexema  &&  simV.getUltimoAmbito() == amb );
                        if( busqueda.length != 0 )  // Si es ID valido
                        {        
                            compLex.tipoDato = busqueda[0].tipoDato;
                            pilaSem.push( compLex );
                            itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                            itemDebug.accionR = "Operando ID agregado a la pila"
                            this.debug.push ( itemDebug );
                            vaEncontrada = true;
                            break;
                        }
                    }
                    if( vaEncontrada == false )
                    {
                        this.errorSem.numeroLinea = compLex.numeroLinea;
                        this.errorSem.descripcion = "El identificador '" + compLex.lexema + "' NO ha sido " +
                        "declarado o NO es posible acceder a el.";
                        this.errorSem.sugerencia = "Declare el identificador '" + compLex.lexema + "' previamente " +
                        "o mueva la variable a un bloque de codigo correcto en caso de que exista"; 
                        
                        itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                        itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                        this.debug.push ( itemDebug );
                        return;
                    }
                    break


                // OPERANDO Funcion ______________________________________________________
                case 'OPERANDO_FUNCION':
                    //compLex.tipoDato = "Entero";
                    pilaSem.push( compLex );
                    itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                    itemDebug.accionR = "Operando Funcion agregado a la pila"
                    this.debug.push ( itemDebug );
                    break;


                default:
                    this.errorSem.numeroLinea = compLex.numeroLinea;
                    this.errorSem.descripcion = "Esta secuencia '" + compLex.lexema + "' NO es " +
                    "valido en una expresion o condicion";
                    this.errorSem.sugerencia = "Elimine la secuencia '" + compLex.lexema + "' " +
                    "y coloque en su lugar un operando u operador correcto"; 
                        
                    itemDebug.pilaF = pilaSem.slice( 0 , pilaSem.length );
                    itemDebug.accionR = "(ERROR) " + this.errorSem.descripcion;
                    this.debug.push ( itemDebug );
                    return;
            }
        }

        // CUANDO LA EXPRESION ES CORRECTA
        this.tipoDatoExpresion = pilaSem[0].tipoDato;
    }


    //==============================================================================
    //  METODO QUE OBTIENE LA LA NOTACION POSFIJA DEL ARBOL   
    //==============================================================================
    recorridoPosfijo( nodoActual = new Nodo() )
    {
        // RECORRIDO (IZQUIERDA)
        if( nodoActual.nodoIzq != null )
        {
            this.recorridoPosfijo( nodoActual.nodoIzq );
        }
        // RECORRIDO (DERECHA)
        if( nodoActual.nodoDer != null )
        {
            this.recorridoPosfijo( nodoActual.nodoDer );
        }
        let cp = new ComponenteLexico();
        cp.id = nodoActual.dato.id;
        cp.numeroLinea = nodoActual.dato.numeroLinea
        cp.token = nodoActual.dato.token
        cp.lexema = nodoActual.dato.lexema
        cp.tipoToken = nodoActual.dato.tipoToken
        cp.tipoDato = nodoActual.dato.tipoDato
        this.notacionPosfija.push( cp );         // RECORRIDO (ROOT)
    }


    //==============================================================================
    //  METODO QUE SE ENCARGA DE GENERAR LA NOTACION PREFIJA DE LA EXPRESION
    //  Y POSTERIORMENTE GENERAR LA ESTRUCTURA DE ARBOL EQQUIVALENTE     
    //==============================================================================
    hacerArbol( )
    {
        /***************************************************************
            CODIGO PARA OBTENER LA NOTACION PREFIJA
        /****************************************************************/

        // RECORRER DE MANERA INVERSA LOS TOKENS DE LA EXPRESION 
        for( let i=this.expresionEntrada.length-1; i>=0; i-- )
        {
            let token = this.expresionEntrada[i];
            switch( token.token ) 
            {  
                case 'PARENTESIS_CERRADO': 
                case 'OPERADOR_SUMAR':
                case 'OPERADOR_RESTAR':
                case 'OPERADOR_MULTIPLICACION':
                case 'OPERADOR_DIVISION':
                case 'OPERADOR_MENOR_QUE':
                case 'OPERADOR_MAYOR_QUE':
                case 'OPERADOR_IGUAL_QUE':
                case 'OPERADOR_NO_ES_IGUAL_QUE':
                case 'OPERADOR_MENOR_IGUAL_QUE':
                case 'OPERADOR_MAYOR_IGUAL_QUE':
                case 'OPERADOR_AND':
                case 'OPERADOR_OR':
                    this.apilar( token ); 
                    break;
                    
                case 'NUMERO':
                case 'IDENTIFICADOR':
                case 'OPERANDO_FUNCION':
                    this.addNotacionPrefija( token );
                    break;

                case 'PALABRA_RESERVADA':
                    switch( token.lexema )
                    {
                        case 'Verdadero':
                        case 'Falso':
                            this.addNotacionPrefija( token );
                            break;
                    }
                    break;
                case 'PARENTESIS_ABIERTO':
                    // MOVER TODOS LOS OPERADORES QQUE ESTAN EN LA PILA HASTA ENCONTRAR UN ')'
                    this.moverOperadores();
                    break;
                
                default:
                    alert( "TOKEN LEIDO: " + token + "\nNO ES UN TOKEN VALIDO EN UNA EXPRESION");
                    return false;
            }
        }
        this.moverOperadores();   // AGREGA OPERADORES QUE HAYAN QUEDADO EN LA PILA

        let notacionPre = this.notacionPrefija.slice( 0 , this.notacionPrefija.length );


        /***************************************************************
            CODIGO PARA GENERAR EL ARBOL
        /****************************************************************/
        this.llenarArbol( this.raiz , notacionPre );
        return true;
    }




    
    llenarArbol( nodoActual = new Nodo() , notacion = [new ComponenteLexico() ] )
    {
        if( notacion.length == 0 ){ return; }
        let index = notacion.length - 1;
        let componenteLex = notacion[ index ];
        notacion.pop();

        // RECORRIDO (ROOT)
        nodoActual.dato = componenteLex;

        if( this.esOperador( componenteLex.token ) == true )  // AGREGAR NODOS IZQUIERDA Y DERECHA
        {
            nodoActual.nodoIzq = new Nodo();
            nodoActual.nodoDer = new Nodo();

            // RECORRIDO (IZQUIERDA)
            this.llenarArbol( nodoActual.nodoIzq , notacion );

            // RECORRIDO (DERECHA)
            this.llenarArbol( nodoActual.nodoDer , notacion );
        }
        return;
    }



    mostrarArbol( nodoActual = new Nodo() , contenedor = document.createElement('div') )
    {
        if( nodoActual.dato == null ){ return; }

        let item = document.createElement( 'div' );
        item.classList.add( 'title' );
        item.classList.add( 'txt_valor' );
        //let eti_Tvalor = document.createElement( 'label' );
        //eti_Tvalor.innerText = "Valor:  ";
        
        //let eti_valor = document.createElement( 'label' );
        //eti_valor.classList.add( 'txt_valor' );
        //eti_valor.innerText = nodoActual.dato.lexema;

        /*
        <div class="active title txt_valor">
            <i class="dropdown icon"></i>
            +
        </div> */

        if( this.esOperador( nodoActual.dato.token ) )
        {
            let icono = document.createElement( 'i' );
            icono.classList.add( 'dropdown' );
            icono.classList.add( 'icon' );
            item.appendChild( icono );
        }
        item.innerHTML = item.innerHTML +  nodoActual.dato.lexema
        //item.appendChild( eti_Tvalor );
        //item.appendChild( eti_valor );
        contenedor.appendChild( item );

        /*
        <div class="active content divArbol_contenido">
            <div class="accordion">
                <div class="title txt_valor">
                    Nivel 1A-A
                </div>
            </div>
        </div> */

        let div_contenido = document.createElement( 'div' );
        div_contenido.classList.add( 'content' );
        div_contenido.classList.add( 'divArbol_contenido' );
        contenedor.appendChild( div_contenido );

        let sub_contenedor = document.createElement( 'div' );
        sub_contenedor.classList.add( 'accordion' );

        if( nodoActual.nodoIzq != null )
        {
            this.mostrarArbol( nodoActual.nodoIzq , sub_contenedor );
        }

        if( nodoActual.nodoDer != null )
        {
            this.mostrarArbol( nodoActual.nodoDer , sub_contenedor );
        }

        if( sub_contenedor.childElementCount > 0 )
        {
            div_contenido.appendChild( sub_contenedor );
        }
    }



    esOperador( token = "" )
    {
        switch( token ) 
        {  
            case 'OPERADOR_SUMAR':
            case 'OPERADOR_RESTAR':
            case 'OPERADOR_MULTIPLICACION':
            case 'OPERADOR_DIVISION':
            case 'OPERADOR_MENOR_QUE':
            case 'OPERADOR_MAYOR_QUE':
            case 'OPERADOR_IGUAL_QUE':
            case 'OPERADOR_NO_ES_IGUAL_QUE':
            case 'OPERADOR_MENOR_IGUAL_QUE':
            case 'OPERADOR_MAYOR_IGUAL_QUE':
            case 'OPERADOR_AND':
            case 'OPERADOR_OR':
                return true;
        }
        return false;
    }


    apilar( token = new ComponenteLexico() ) 
    {  
        let tope = this.pila.length-1;
        if( tope == -1 ){ this.pila.push( token );  return; /* PILA VACIA */ }
        
        let ultimoToken = this.pila[ tope ];
        switch( token.token )
        {
            case 'OPERADOR_SUMAR':
            case 'OPERADOR_RESTAR':
                switch( ultimoToken.token )
                {
                    case 'OPERADOR_MULTIPLICACION':
                    case 'OPERADOR_DIVISION':
                        // SACAR EL OPERADOR DE MAYOR PRECEDENCIA * o /
                        this.addNotacionPrefija( ultimoToken );
                        this.desapilar();
                        break;
                }
                break;
            case 'OPERADOR_MENOR_QUE':
            case 'OPERADOR_MAYOR_QUE':
            case 'OPERADOR_IGUAL_QUE':
            case 'OPERADOR_NO_ES_IGUAL_QUE':
            case 'OPERADOR_MENOR_IGUAL_QUE':
            case 'OPERADOR_MAYOR_IGUAL_QUE':
            case 'OPERADOR_AND':
            case 'OPERADOR_OR':
                switch( ultimoToken.token )
                {
                    case 'OPERADOR_SUMAR':
                    case 'OPERADOR_RESTAR':
                    case 'OPERADOR_MULTIPLICACION':
                    case 'OPERADOR_DIVISION':
                        // DARLE MAYOR PRECEDENCIA A OP ARITMETICAS * 
                        this.addNotacionPrefija( ultimoToken );
                        this.desapilar();
                        break;
                }
                break;
        }
        this.pila.push( token );
    }



    desapilar( ) {  this.pila.pop(); }



    //==============================================================================
    //   METODO QUE PERMITE AGREGAR UN COMPONENTE LEXICO AL ARREGLO DE LA NOTACION
    //==============================================================================
    addNotacionPrefija( token = new ComponenteLexico() )  { this.notacionPrefija.push( token );  }



    //==============================================================================
    //   METODO QUE PASA LOS OPERADORES DE LA PILA AL ARREGLO DE LA NOTACION
    //==============================================================================
    moverOperadores()
    {
        let seguirQuitando = true;
        do
        {
            if( this.pila.length == 0 ){ seguirQuitando = false; }
            else
            {
                let tope = this.pila.length-1;
                let tokenTope = this.pila[ tope ];
                if( tokenTope.token == 'PARENTESIS_CERRADO' ) {   seguirQuitando = false;   }
                else{ this.addNotacionPrefija( tokenTope ); }
                this.desapilar();
            }
        }
        while( seguirQuitando == true );
    }




    //==============================================================================
    //   METODO QUE DEVUELVE UNA REPRESENTACION DE LA NOTACION PREFIJA OBTENIDA
    //==============================================================================
    getExpresion( expresion = [ new ComponenteLexico() ] , invertir = false )
    {
        let notacion = "";
        if( invertir == true )
        {
            for( let i=expresion.length-1;  i>=0;  i-- )
            {
                notacion = notacion + expresion[i].lexema + " ";
            }
            return notacion.substring( 0 , notacion.length-1 );   
        }
        else
        {
            for( let i=0;  i<expresion.length;  i++ )
            {
                notacion = notacion + expresion[i].lexema + " ";
            }
            return notacion.substring( 0 , notacion.length-1 );
        }
    }

}