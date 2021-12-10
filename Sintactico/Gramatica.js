import { ItemProduccion } from "./ItemProduccion.js";
import { Produccion } from "./Produccion.js";
import { AccionSemantica } from "../Semantico/Acciones.js";
import { AccionCodigo } from "../Codigo_Intermedio/AccionesCodigo.js";

export class Gramatica
{
    static G = 
    [
        //_____________________________________________
        // NO TERMINAL -> s
        // PROD:: Microcontrolador ID { <configuracion> <funciones> <sentencia> } 
        //_____________________________________________
        new Produccion(
            "s" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Microcontrolador" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.SET_NOMBRE_PROGRAMA , AccionCodigo.AUMENTAR_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "configuracion" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "funciones" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.FIN_CODIGO )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Estructura Principal del Codigo"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> configuracion
        // PROD:: Configuracion { <conf> }
        //_____________________________________________
        new Produccion(
            "configuracion" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Configuracion" , 0 , 0 , AccionCodigo.ADD_BLOQUE_CONFIGURACION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO , AccionCodigo.AUMENTAR_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "conf" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.ADD_BLOQUE_MAIN ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Bloque de Configuraciones"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> conf
        // PROD::  Entradas { <pines> } Salidas { <pines> } <datosGlobales>
        //_____________________________________________
        new Produccion(
            "conf" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Entradas" , 0 , 0 , AccionCodigo.ADD_BLOQUE_ENTRADAS ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO , AccionCodigo.AUMENTAR_AMBITO ) , 
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "pines" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.FIN_BLOQUE ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Salidas" , 0 , 0 , AccionCodigo.ADD_BLOQUE_SALIDAS ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO , AccionCodigo.AUMENTAR_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "pines" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.FIN_BLOQUE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "datosGlobales" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Estructura del bloque de configuraciones"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> pines
        // PROD:: Pin ID @ num ; <pines> 
        //_____________________________________________
        new Produccion( 
            "pines" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Pin" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_CONSTANTE" , "@" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_PIN , AccionCodigo.DECLARACION_PIN ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "pines" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Pin"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> datosGlobales
        // PROD:: Entero ID <constanteOvariableEntero>
        //_____________________________________________
        new Produccion(
            "datosGlobales" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Entero" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "constanteOvariableEntero" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de una Constante o Variable Global Entero"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> datosGlobales
        // PROD:: Booleano ID <constanteOvariableBooleana>
        //_____________________________________________
        new Produccion(
            "datosGlobales" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Booleano" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "constanteOvariableBooleana" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de una Constante o Variable Global Booleana"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> constanteOvariableEntero
        // PROD:: @ <exp> ; <datosGlobales> 
        //_____________________________________________
        new Produccion(
            "constanteOvariableEntero" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_CONSTANTE" , "@" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_CONSTANTE , AccionCodigo.DECLARACION_CONSTANTE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "datosGlobales" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de una Constante Numero Entero" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> constanteOvariableBooleana
        // PROD:: @ <exp> ; <datosGlobales> 
        //_____________________________________________
        new Produccion(
            "constanteOvariableBooleana" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_CONSTANTE" , "@" , 0, 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_CONSTANTE , AccionCodigo.DECLARACION_CONSTANTE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "datosGlobales" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de una Constante Booleana" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> constanteOvariableEntero
        // PROD:: = <exp> ; <datosGlobales> 
        //_____________________________________________
        new Produccion(
            "constanteOvariableEntero" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_ASIGNACION" , "=" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_VARIABLE , AccionCodigo.DECLARACION_VARIABLE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "datosGlobales" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de una Variable Global Numero Entero" ,
            false
        ) ,        

        //_____________________________________________
        // NO TERMINAL -> constanteOvariableBooleana
        // PROD:: = <exp> ; <datosGlobales>
        //_____________________________________________
        new Produccion(
            "constanteOvariableBooleana" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_ASIGNACION" , "=" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_VARIABLE , AccionCodigo.DECLARACION_VARIABLE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "datosGlobales" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de Variable Global Booleana" , 
            false
        ) ,

        
        //_____________________________________________
        // NO TERMINAL -> funciones
        // PROD:: Funciones { <funcion> }
        //_____________________________________________
        new Produccion(
            "funciones" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Funciones" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO , AccionCodigo.AUMENTAR_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "funcion" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.REGRESAR_AL_AMBITO_ANTERIOR ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Bloque de Funciones"
        ) ,

 
        //_____________________________________________
        // NO TERMINAL -> funcion
        // PROD:: ID ( <parametros> ) Devuelve <retorno> { <sentencia> } <funcion>
        //_____________________________________________
        new Produccion(
            "funcion" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_NOMBRE_FUNCION , AccionCodigo.ADD_BLOQUE_FUNCION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_ABIERTO" , "(" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "parametros" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_CERRADO" , ")" , 0 , AccionSemantica.ADD_PARAMETRO , AccionCodigo.ADD_PARAMETRO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Devuelve" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "retorno" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.ADD_FUNCION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.FIN_FUNCION , AccionCodigo.FIN_BLOQUE_FUNCION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "funcion" , "" ) 
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de una Funcion"
        ) ,


        //_____________________________________________
        // NO TERMINAL -> parametros
        // PROD:: Entero ID <masParametros>
        //_____________________________________________
        new Produccion(
            "parametros" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Entero" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masParametros" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Parametro Entero"
        ) ,


        //_____________________________________________
        // NO TERMINAL -> parametros
        // PROD:: Booleano ID <masParametros>
        //_____________________________________________
        new Produccion(
            "parametros" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Booleano" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masParametros" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Parametro Booleano"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> parametros
        // PROD:: Pin ID <masParametros>
        //_____________________________________________
        new Produccion(
            "parametros" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Pin" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masParametros" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Parametro Pin"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> masParametros
        // PROD:: , Entero ID <masParametros>
        //_____________________________________________
        new Produccion(
            "masParametros" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "SEPARADOR" , "," , 0 , AccionSemantica.ADD_PARAMETRO , AccionCodigo.ADD_PARAMETRO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Entero" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masParametros" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de un Parametro Entero" ,
            false
        ) ,


        //_____________________________________________
        // NO TERMINAL -> masParametros
        // PROD:: , Booleano ID <masParametros>
        //_____________________________________________
        new Produccion(
            "masParametros" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "SEPARADOR" , "," , 0 , AccionSemantica.ADD_PARAMETRO , AccionCodigo.ADD_PARAMETRO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Booleano" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masParametros" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de un Parametro Booleano" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> masParametros
        // PROD:: , Pin ID <masParametros>
        //_____________________________________________
        new Produccion(
            "masParametros" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "SEPARADOR" , "," , 0 , AccionSemantica.ADD_PARAMETRO , AccionCodigo.ADD_PARAMETRO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Pin" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masParametros" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Declaracion de un Parametro Pin" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> retorno
        // PROD:: Entero
        //_____________________________________________
        new Produccion(
            "retorno" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Entero" , 0 , AccionSemantica.SET_RETORNO_FUNCION , AccionCodigo.SET_RETORNO_FUNCION )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Retorno de una Funcion" ,
            false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> retorno
        // PROD:: Booleano
        //_____________________________________________
        new Produccion(
            "retorno" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Booleano" , 0 , AccionSemantica.SET_RETORNO_FUNCION , AccionCodigo.SET_RETORNO_FUNCION )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Retorno de una Funcion" ,
            false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> retorno
        // PROD:: Nada
        //_____________________________________________
        new Produccion(
            "retorno" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Nada" , 0 , AccionSemantica.SET_RETORNO_FUNCION , AccionCodigo.SET_RETORNO_FUNCION )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Retorno de una Funcion" ,
            false
        ) ,
        




        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Entero ID = <exp> ; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Entero" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_ASIGNACION" , "=" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_VARIABLE , AccionCodigo.DECLARACION_VARIABLE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de Variable Numero Entero"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Booleano ID = <exp> ; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Booleano" , 0 , AccionSemantica.SET_TIPO_DATO , AccionCodigo.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_ASIGNACION" , "=" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_VARIABLE , AccionCodigo.DECLARACION_VARIABLE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de Variable Booleana"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: ID = <exp> ; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_ASIGNACION" , "=" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.CAMBIAR_VALOR_DE_VARIABLE , AccionCodigo.REASIGNACION_VARIABLE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Reasignacion de Variable"
        ) ,


        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: ID ( <argumentos> )  ; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_NOMBRE_FUNCION_CALL , AccionCodigo.SET_NOMBRE_FUNCION_A_LLAMAR ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_ABIERTO" , "(" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "argumentos" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_CERRADO" , ")" , 0 , AccionSemantica.ADD_ARGUMENTO , AccionCodigo.ADD_ARGUMENTO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.LLAMAR_A_FUNCION , AccionCodigo.FIN_FUNCION_A_LLAMAR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Llamada a una Funcion"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> argumentos
        // PROD:: <exp> <masArgumentos>
        //_____________________________________________
        new Produccion(
            "argumentos" ,
            [ 
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masArgumentos" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Argumento de Funcion"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> masArgumentos
        // PROD:: , <exp> <masArgumentos>
        //_____________________________________________
        new Produccion(
            "masArgumentos" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "SEPARADOR" , "," , 0 , AccionSemantica.ADD_ARGUMENTO , AccionCodigo.ADD_ARGUMENTO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masArgumentos" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Argumento de Funcion" ,
            false
        ) ,


 
        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Si ( <EXP> ) {  <SENTENCIA> }  <SINO>  <SENTENCIA>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Si" , 0 , 0 , AccionCodigo.ADD_BLOQUE_CONDICION_SI ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_ABIERTO" , "(" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_CERRADO" , ")" , 0 , AccionSemantica.VERIFICAR_EXPRESION_BOOLEANO , AccionCodigo.EVALUAR_CONDICION_SI ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO , AccionCodigo.AUMENTAR_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.FIN_BLOQUE_SI ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sino" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Estructura de Control Condicional Si"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Ciclo ( Iniciar ID = <EXP> ; Salir <operadorComp> <exp> ; Saltos num ) { <SENTENCIA> } <SENTENCIA>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Ciclo" , 0 , 0 , AccionCodigo.ADD_BLOQUE_CICLO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_ABIERTO" , "(" , 0 , AccionSemantica.NUEVO_AMBITO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Iniciar" , 0 , AccionSemantica.SET_TIPO_DATO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_ID , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_ASIGNACION" , "=" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.AGREGAR_VARIABLE , AccionCodigo.DECLARACION_ITERADOR_CICLO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Salir" , 0 , 0 , AccionCodigo.SET_OPERADOR_SECUNDARIO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "operadorComp" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.VERIFICAR_EXPRESION_ENTERO , AccionCodigo.DECLARACION_CONDICION_CICLO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Saltos" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , 0 , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_CERRADO" , ")" , 0 , 0 , AccionCodigo.DECLARACION_SALTOS_CICLO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.ACTIVAR_ROMPER_BUCLE ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.DESACTIVAR_ROMPER_BUCLE , AccionCodigo.FIN_BLOQUE_CICLO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Estructura de Control Repetitiva Ciclo"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Hacer { <SENTENCIA> } <SENTENCIA>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Hacer" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Estructura de Control Repetitiva Hacer"
        ) ,


        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Romper ; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Romper" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.ROMPER_BUCLE , AccionCodigo.DECLARACION_ROMPER ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Terminador de una Estructura Repetitiva Ciclo"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Devolver Nada; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Devolver" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Nada" , 0 , 0 , AccionCodigo.SET_ID ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.RETORNAR_NADA , AccionCodigo.DECLARACION_DEVOLVER_NADA ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Terminador de una Funcion"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> sentencia
        // PROD:: Devolver <exp> ; <sentencia>
        //_____________________________________________
        new Produccion(
            "sentencia" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Devolver" , 0 , 0 , AccionCodigo.SET_OPERADOR ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "FIN_SENTENCIA" , ";" , 0 , AccionSemantica.RETORNAR_VALOR , AccionCodigo.DECLARACION_DEVOLVER ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Terminador de una Funcion"
        ) ,


        //_____________________________________________
        // NO TERMINAL -> sino
        // PROD:: Sino { <SENTENCIA> } 
        //_____________________________________________
        new Produccion(
            "sino" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Sino" , 0 , 0 , AccionCodigo.ADD_BLOQUE_SINO ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_ABIERTA" , "{" , 0 , AccionSemantica.NUEVO_AMBITO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "sentencia" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "LLAVE_CERRADO" , "}" , 0 , AccionSemantica.REGRESAR_AMBITO_ANTERIOR , AccionCodigo.FIN_BLOQUE_SINO ) ,
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Estructura de control Condicional Si-Sino"
        ) ,


        //_____________________________________________
        // NO TERMINAL -> operadorComp
        // PROD:: <
        //_____________________________________________
        new Produccion(
            "operadorComp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_QUE" , "<" , 0 , 0 , AccionCodigo.SET_OPERADOR )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Operador de Comparacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> operadorComp
        // PROD:: <=
        //_____________________________________________
        new Produccion(
            "operadorComp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_IGUAL_QUE" , "<=" , 0 , 0 , AccionCodigo.SET_OPERADOR )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Operador de Comparacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> operadorComp
        // PROD:: >
        //_____________________________________________
        new Produccion(
            "operadorComp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_QUE" , ">" , 0 , 0 , AccionCodigo.SET_OPERADOR )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Operador de Comparacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> operadorComp
        // PROD:: >=
        //_____________________________________________
        new Produccion(
            "operadorComp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_IGUAL_QUE" , ">=" , 0 , 0 , AccionCodigo.SET_OPERADOR )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Operador de Comparacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> operadorComp
        // PROD:: ==
        //_____________________________________________
        new Produccion(
            "operadorComp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , 0 , AccionCodigo.SET_OPERADOR )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Operador de Comparacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> operadorComp
        // PROD:: !=
        //_____________________________________________
        new Produccion(
            "operadorComp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , 0 , AccionCodigo.SET_OPERADOR )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Operador de Comparacion" ,
            false
        ) ,










        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION  )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Variable" ,
            false
        ) ,



        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID ( <argumentos> ) <operador>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.SET_NOMBRE_FUNCION_CALL , AccionCodigo.SET_NOMBRE_FUNCION_A_LLAMAR ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_ABIERTO" , "(" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "argumentos" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_CERRADO" , ")" , 0 , AccionSemantica.ADD_FUNCION_A_EXPRESION , AccionCodigo.ADD_FUNCION_A_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "operador" , "" ) 
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Llamada a una Funcion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: + <exp>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_SUMAR" , "+" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO ,"Operacion Suma" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: - <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_RESTAR" , "-" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Resta" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: * <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MULTIPLICACION" , "*" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Multiplicacion" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: / <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_DIVISION" , "/" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Division" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: == <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Comparar si son iguales" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: != <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Comparar si son diferentes" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: < <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_QUE" , "<" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Comparar si es menor" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: > <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_QUE" , ">" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Comparar si es mayor" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: >= <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_IGUAL_QUE" , ">=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Comparar si es mayor o igual" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: <= <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_IGUAL_QUE" , "<=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion Comparar si es menor o igual" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: Y <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_AND" , "Y" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion logica AND" , false
        ) ,
        //_____________________________________________
        // NO TERMINAL -> operador
        // PROD:: O <EXP>
        //_____________________________________________
        new Produccion(
            "operador" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_OR" , "O" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , Produccion.VACIO , "Operacion logica OR" , false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> argumentos
        // PROD:: <exp> <masArgumentos>
        //_____________________________________________
        /*new Produccion(
            "argumentos" ,
            [ 
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masArgumentos" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Argumento de Funcion"
        ) ,

        //_____________________________________________
        // NO TERMINAL -> masArgumentos
        // PROD:: , <exp> <masArgumentos>
        //_____________________________________________
        new Produccion(
            "masArgumentos" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "SEPARADOR" , "," , 0 , 0 , AccionCodigo.ADD_PARAMETRO ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "masArgumentos" , "" )
            ] ,
            Produccion.OK , 
            Produccion.PERMANECER ,
            "Declaracion de un Argumento de Funcion" ,
            false
        ) ,  */




        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Numero Entero" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Verdadero
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Verdadero" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Booleano Verdadero" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Falso
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Falso" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR , 
            "Booleano Falso" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID + <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_SUMAR" , "+" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Suma" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID - <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_RESTAR" , "-" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Resta" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID * <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MULTIPLICACION" , "*" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Multiplicacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID / <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_DIVISION" , "/" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Division" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID == <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son iguales" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID != <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son diferentes" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID < <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_QUE" , "<" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es menor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID > <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_QUE" , ">" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es mayor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID >= <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_IGUAL_QUE" , ">=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es mayor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID <= <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_IGUAL_QUE" , "<=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es menor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID Y <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_AND" , "Y" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica AND" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ID O <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_OR" , "O" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica OR" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num + <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_SUMAR" , "+" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Suma" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num - <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_RESTAR" , "-" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Resta" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num * <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MULTIPLICACION" , "*" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Multiplicacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num / <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_DIVISION" , "/" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Division" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num == <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son iguales" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num != <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son diferentes" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num < <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_QUE" , "<" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es menor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num > <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_QUE" , ">" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es mayor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num >= <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_IGUAL_QUE" , ">=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es mayor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num <= <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_IGUAL_QUE" , "<=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es menor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num Y <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_AND" , "Y" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica AND" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num O <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "NUMERO" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_OR" , "O" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica OR" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Verdadero Y <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Verdadero" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_AND" , "Y" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica AND" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Verdadero O <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Verdadero" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_OR" , "O" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica OR" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Verdadero == <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Verdadero" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son iguales" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Verdadero != <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Verdadero" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son diferentes" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Falso Y <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Falso" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_AND" , "Y" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica AND" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Falso O <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Falso" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_OR" , "O" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion logica OR" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Falso == <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Falso" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son iguales" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: Falso != <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PALABRA_RESERVADA" , "Falso" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son diferentes" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: No <EXP>
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NOT" , "No" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion de Negacion" ,
            false
        ) ,
        
        

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: ( <EXP> )
        //_____________________________________________
        new Produccion(
            "exp" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_ABIERTO" , "(" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "PARENTESIS_CERRADO" , ")" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp3" , "" ) ,
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Agrupada" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp2
        // PROD:: ID == <EXP>
        //_____________________________________________
        new Produccion(
            "exp2" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son iguales" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp2
        // PROD:: ID != <EXP>
        //_____________________________________________
        new Produccion(
            "exp2" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si son diferentes" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp2
        // PROD:: ID < <EXP>
        //_____________________________________________
        new Produccion(
            "exp2" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_QUE" , "<" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es menor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp2
        // PROD:: ID > <EXP>
        //_____________________________________________
        new Produccion(
            "exp2" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_QUE" , ">" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es mayor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp2
        // PROD:: ID >= <EXP>
        //_____________________________________________
        new Produccion(
            "exp2" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_IGUAL_QUE" , ">=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es mayor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp2
        // PROD:: ID <= <EXP>
        //_____________________________________________
        new Produccion(
            "exp2" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "IDENTIFICADOR" , "" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_IGUAL_QUE" , "<=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.QUITAR ,
            "Operacion Comparar si es menor o igual" ,
            false
        ) ,


        //_____________________________________________
        // NO TERMINAL -> exp3
        // PROD::  + <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_SUMAR" , "+" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Suma" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num - <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_RESTAR" , "-" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Resta" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num * <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MULTIPLICACION" , "*" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Multiplicacion" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num / <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_DIVISION" , "/" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Division" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num == <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_IGUAL_QUE" , "==" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Comparar si son iguales" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num != <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_NO_ES_IGUAL_QUE" , "!=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Comparar si son diferentes" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num < <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_QUE" , "<" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Comparar si es menor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: num > <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_QUE" , ">" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Comparar si es mayor" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: >= <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MAYOR_IGUAL_QUE" , ">=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Comparar si es mayor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp
        // PROD:: <= <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_MENOR_IGUAL_QUE" , "<=" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion Comparar si es menor o igual" ,
            false
        ) ,

        //_____________________________________________
        // NO TERMINAL -> exp3
        // PROD:: Y <EXP>
        //_____________________________________________
        new Produccion(
            "exp3" ,
            [ 
                new ItemProduccion( ItemProduccion.TERMINAL , "OPERADOR_AND" , "Y" , 0 , AccionSemantica.ADD_EXPRESION , AccionCodigo.ADD_EXPRESION ) ,
                new ItemProduccion( ItemProduccion.NO_TERMINAL , "exp" , "" )
            ] ,
            Produccion.OK , 
            Produccion.VACIO ,
            "Operacion logica AND" ,
            false
        )
    ];
}