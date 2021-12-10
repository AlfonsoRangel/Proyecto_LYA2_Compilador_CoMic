import { ComponenteLexico } from "../ComponenteLexico.js"
import { SimboloFuncion } from "../Semantico/SimboloFuncion.js"
import { AccionCodigo } from "./AccionesCodigo.js"

export class ResultadoCuadruplo
{
    constructor( tipo = 0 , bloque = 0 , ambito = [0] , tipoDato = "N/A" , ID = "N/A" , 
        refGOTO = "N/A" , funcion = new SimboloFuncion(0,"N/A") , callFuncion = new SimboloFuncion(0,"N/A")
    ) 
    {
        this.tipo = tipo   // un tipo definido en esta clase
        this.bloque = bloque
        this.ambito = ambito
        this.tipoDato = tipoDato
        this.ID = ID   // se almacena el ID en caso de variable
        this.refGOTO = refGOTO  // clave de otro cuadruplo hacia donde se dirige el salto
        this.funcion = funcion   // Alamacena el nombre de una funcion
        this.callFuncion = callFuncion   // Almacena el retorno de una funcion
        this.clave = ""
        switch( this.tipo )
        {
            case ResultadoCuadruplo.TIPO_LLAMADA_FUNCION: 
                this.clave = "CALL" + ResultadoCuadruplo.contadorCALL++;   
                break;
            case ResultadoCuadruplo.TIPO_LLAMADA_RETORNO_FUNCION: 
                this.clave = "CALLRF" + ResultadoCuadruplo.contadorCALLRF++;   
                break;
            case ResultadoCuadruplo.TIPO_FIN_FUNCION: 
                this.clave = "RET" + ResultadoCuadruplo.contadorRET++;   
                break;
            case ResultadoCuadruplo.TIPO_NUEVA_VARIABLE:  
                this.clave = "NV" + ResultadoCuadruplo.contadorNV++;   
                break;
            case ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE:  
                this.clave = "NC" + ResultadoCuadruplo.contadorNC++;   
                break;
            case ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE:  
                this.clave = "RV" + ResultadoCuadruplo.contadorRV++;   
                break;
            case ResultadoCuadruplo.TIPO_DATO_TEMPORAL: 
                this.clave = "T" + ResultadoCuadruplo.contadorT++;   
                break;
            case ResultadoCuadruplo.TIPO_GOTO: 
                this.clave = "G" + ResultadoCuadruplo.contadorG++;   
                break;
            case ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA: 
                this.clave = "P" + ResultadoCuadruplo.contadorP++;   
                break;
            case ResultadoCuadruplo.FIN_PROGRAMA: 
                this.clave = "FIN";  
                break;
        }
    }


    clonar()
    {
        let rc = new ResultadoCuadruplo()
        rc.tipo = this.tipo
        rc.bloque = this.bloque
        rc.ambito = this.ambito
        rc.tipoDato = this.tipoDato
        rc.ID = this.ID
        rc.refGOTO = this.refGOTO
        rc.funcion = this.funcion
        rc.callFuncion = this.callFuncion
        rc.clave = this.clave
        return rc
    }


    getTipo()
    {
        switch( this.tipo )
        {
            case ResultadoCuadruplo.TIPO_LLAMADA_FUNCION: return "Llamada a una Funcion"
            case ResultadoCuadruplo.TIPO_LLAMADA_RETORNO_FUNCION: return "Llamada para obtener el dato retornado por una Funcion"
            case ResultadoCuadruplo.TIPO_FIN_FUNCION: return "Fin de una Funcion"
            case ResultadoCuadruplo.TIPO_NUEVA_VARIABLE:   return "Declaracion de Nueva Variable"
            case ResultadoCuadruplo.TIPO_NUEVA_CONSTANTE:   return "Declaracion de Nueva Constante"
            case ResultadoCuadruplo.TIPO_REASIGNAR_VARIABLE:   return "Reasignar el Valor de una Variable"
            case ResultadoCuadruplo.TIPO_DATO_TEMPORAL:  return "Nuevo dato Temporal en Registro"
            case ResultadoCuadruplo.TIPO_GOTO:  return "Saltar a una Instruccion"
            case ResultadoCuadruplo.TIPO_DATO_TEMPORAL_PILA:  return "Nuevo dato Temporal en Pila"
            case ResultadoCuadruplo.FIN_PROGRAMA:  return "Fin del Codigo"
        }
        return ""
    }

    getBloque()
    {
        switch( this.bloque )
        {
            case AccionCodigo.CONFIGURACION: return "Configuracion"
            case AccionCodigo.ENTRADAS: return "Entradas"
            case AccionCodigo.SALIDAS:   return "Salidas"
            case AccionCodigo.MAIN:   return "Principal"
            case AccionCodigo.SI:  return "Si"
            case AccionCodigo.CONDICION_SI:  return "Condicion Si"
            case AccionCodigo.SINO:  return "Sino"
            case AccionCodigo.DECLARACION_SINO:  return "Declaracion Sino"
            case AccionCodigo.CICLO:  return "Ciclo"
            case AccionCodigo.CONDICION_CICLO:  return "Condicion Ciclo"
            case AccionCodigo.FUNCION:  return "Funcion"
        }
        return ""
    } 

    getAmbito()
    {
        return this.ambito[ this.ambito.length - 1 ];
    }


    

    static TIPO_LLAMADA_FUNCION = 1;   // CALL
    static TIPO_FIN_FUNCION = 2;       // RET
    static TIPO_NUEVA_VARIABLE = 3;     // NV
    static TIPO_NUEVA_CONSTANTE = 4;     // NC
    static TIPO_REASIGNAR_VARIABLE = 5;     // RV
    static TIPO_DATO_TEMPORAL = 6;          // T
    static TIPO_GOTO = 7;   // G
    static TIPO_DATO_TEMPORAL_PILA = 8;    // P
    static FIN_PROGRAMA = 9;  // FIN
    static TIPO_LLAMADA_RETORNO_FUNCION = 10;  // CALLRF

    static contadorCALL = 1;
    static contadorRET = 1;
    static contadorNV = 1;
    static contadorNC = 1;
    static contadorRV = 1;
    static contadorT = 1;
    static contadorG = 1;
    static contadorP = 1;
    static contadorCALLRF = 1;

    static limpiarContadores() {
        ResultadoCuadruplo.contadorCALL = 1;
        ResultadoCuadruplo.contadorRET = 1;
        ResultadoCuadruplo.contadorNV = 1;
        ResultadoCuadruplo.contadorNC = 1;
        ResultadoCuadruplo.contadorRV = 1;
        ResultadoCuadruplo.contadorT = 1;
        ResultadoCuadruplo.contadorG = 1;
        ResultadoCuadruplo.contadorP = 1;
        ResultadoCuadruplo.contadorCALLRF = 1;
    }




}