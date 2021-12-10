import { ComponenteLexico } from './ComponenteLexico.js';
import { DebugLexico } from './debug_lexico.js';

export class AFD 
{
    constructor()
    {
        // PARA EL PROCESO DE ANALISIS LEXICO
        this.estadoActual = 0;
        this.lexema = "";
        this.numeroLinea = 1;
        this.lineaToken = 1;
        this.txt_entrada = [""];   this.txt_entrada.pop();
        this.debug = [ new DebugLexico() ];   this.debug.pop();
        this.listaErrores = [new ComponenteLexico()];   this.listaErrores.pop();
    

        // PARA EL PROCESO DE CREACION DE LA TABLA DE TRANSICIONES
        this.tabla_transiciones = [];
        this.estados_finales = [{estado: 0 , token: new ComponenteLexico()}];  this.estados_finales.pop();
        this.tokens = [new ComponenteLexico()];    this.tokens.pop();
        this.tokensFunciones = [new ComponenteLexico()];    this.tokensFunciones.pop();
        this.alfabeto = 
        [ 
            'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' ,
            'ñ' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z' ,
            
            'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' ,
            'Ñ' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z' ,

            '0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' ,

            '+' , '-' , '*' , '/' , 
            '<' , '>' , '=' , '!' , '@' ,
            '(' , ')' , '{' , '}' , 
            ';' , ' ' , '_' , ',' , '\t' , ':'
        ];    
    }

    inicializar()
    {
        this.nuevoEstado();

        this.addToken("+" , new ComponenteLexico("OPERADOR_SUMAR" , "OK") );
        this.addToken("-" , new ComponenteLexico("OPERADOR_RESTAR" , "OK") );
        this.addToken("*" , new ComponenteLexico("OPERADOR_MULTIPLICACION" , "OK") );
        this.addToken("/" , new ComponenteLexico("OPERADOR_DIVISION" , "OK") );
        

        this.addToken("<" , new ComponenteLexico("OPERADOR_MENOR_QUE" , "OK") );
        this.addToken(">" , new ComponenteLexico("OPERADOR_MAYOR_QUE" , "OK") );
        this.addToken("=" , new ComponenteLexico("OPERADOR_ASIGNACION" , "OK") );
        this.addToken("@" , new ComponenteLexico("OPERADOR_CONSTANTE" , "OK") );
        

        this.addToken("(" , new ComponenteLexico("PARENTESIS_ABIERTO" , "OK") );
        this.addToken(")" , new ComponenteLexico("PARENTESIS_CERRADO" , "OK") );

        //this.addToken("[" , new ComponenteLexico("CORCHETE_ABIERTO" , "OK") );
        //this.addToken("]" , new ComponenteLexico("CORCHETE_CERRADO" , "OK") );

        this.addToken("{" , new ComponenteLexico("LLAVE_ABIERTA" , "OK") );
        this.addToken("}" , new ComponenteLexico("LLAVE_CERRADO" , "OK") );
        this.addToken(";" , new ComponenteLexico("FIN_SENTENCIA" , "OK") );
        this.addToken("," , new ComponenteLexico("SEPARADOR" , "OK") );
        this.addToken(":" , new ComponenteLexico("ASIGNADOR_PIN" , "OK") );

        this.addToken(" " , new ComponenteLexico("ESPACIO" , "OMITIR") );
        this.addToken("\t" , new ComponenteLexico("ESPACIO" , "OMITIR") );

        this.addToken("==" , new ComponenteLexico("OPERADOR_IGUAL_QUE" , "OK") );
        this.addToken("!=" , new ComponenteLexico("OPERADOR_NO_ES_IGUAL_QUE" , "OK") );
        this.addToken("<=" , new ComponenteLexico("OPERADOR_MENOR_IGUAL_QUE" , "OK") );
        this.addToken(">=" , new ComponenteLexico("OPERADOR_MAYOR_IGUAL_QUE" , "OK") );
        this.addToken("Y" , new ComponenteLexico("OPERADOR_AND" , "OK"));
        this.addToken("O" , new ComponenteLexico("OPERADOR_OR" , "OK") );
        this.addToken("No" , new ComponenteLexico("OPERADOR_NOT" , "OK") );


        console.clear()
        console.log("============================")
        console.log("  COMIENZA ")
        console.log("============================")

        this.addToken("Entero" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Booleano" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //alert("")
        //this.addToken("Apagar" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("Avanzar" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Ciclo" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Configuracion" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Devuelve" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Devolver" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("Encender" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Entradas" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Falso" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") ); 
        this.addToken("Funciones" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") ); 
        //this.addToken("GirarIzquierda" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("GirarDerecha" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Hacer" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Iniciar" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("Leer" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Microcontrolador" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Nada" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Pin" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("PinEnt" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("PinSal" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        //this.addToken("Retroceder" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Romper" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Si" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Sino" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Salir" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") );
        this.addToken("Saltos" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") ); 
        this.addToken("Salidas" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") ); 
        this.addToken("Verdadero" , new ComponenteLexico("PALABRA_RESERVADA" , "OK") ); 

        let LETRA = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,Ñ,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        let DIGITO = "0,1,2,3,4,5,6,7,8,9";
        let ESPECIALES = "!";

        this.addToken("-{+}" + DIGITO + "{+}{*}" + DIGITO + "{*}" , new ComponenteLexico("NUMERO" , "OK") );
        this.addToken("{+}" + DIGITO + "{+}{*}" + DIGITO + "{*}" , new ComponenteLexico("NUMERO" , "OK") );
        
        // PATRON IDENTIFICADOR ICORRECTO QUE EMPIEZA CON NUMERO
        this.addToken("{+}" + DIGITO + "{+}{*}" + DIGITO + "{*}{+}" + LETRA + "," + ESPECIALES + ",_{+}{*}" + LETRA + "," + DIGITO + "," + ESPECIALES + ",_{*}" , new ComponenteLexico("IDENTIFICADOR_NO_INIT_NUM" , "ERROR") );
      
        // PATRON IDENTIFICADOR ICORRECTO QUE EMPIEZA CON CARACTER ESPECIAL O _
        this.addToken("{+}" + ESPECIALES + ",_{+}{*}" + LETRA + "," + DIGITO + "," + ESPECIALES + ",_{*}" , new ComponenteLexico("IDENTIFICADOR_NO_INIT_ESPECIAL" , "ERROR"));

        // PATRON IDENTIFICADOR
        console.clear()
        this.addToken("{+}" + LETRA + "{+}{*}" + LETRA + "," + DIGITO + ",_{*}" , new ComponenteLexico("IDENTIFICADOR" , "OK") );
        //alert("")

        console.clear()
        //console.log("\n====================================")
        //console.log("       AQUI COMIENZA")
        //console.log("====================================\n")

        // PATRON IDENTIFICADOR INCORRECTO QUE CONTIENE CARACTER ESPECIAL
        this.addToken("{+}" + LETRA + "{+}{*}" + LETRA + "," + DIGITO + ",_{*}{+}" + ESPECIALES + "{+}{*}"+ LETRA + "," + DIGITO + "," + ESPECIALES + ",_{*}" , new ComponenteLexico("IDENTIFICADOR_NO_CONT_ESPECIAL" , "ERROR"));
    

        // OBTENER LOS TOKENS DE LAS FUNCIONES PREDETERMINADAS
        this.obtenerCodigoFunciones( this.getCodigoFunciones() )
    }


    addToken( ER = "" , token = new ComponenteLexico() , estado_actual = 0 , estado_final = true ) // "S[KIOU]*bc|WE|*e" - "1{+} 2,4,6 {+} 3{+}4,5{+}"
    {
        while( ER.length != 0 )
        {
            console.log( "ER = " + ER);
            let simbolo = ER.charAt( 0 );
            console.log( "Simbolo = " + simbolo );
            console.log( "qInicial = " + estado_actual );
            //alert("ER: " + ER + "\nSIMBOLO: " + simbolo);
            //this.moverBucle(estado_actual);
            switch( simbolo )
            {
                //========================CASO LLAVE =======================================
                case '{':
                    //============================ OR =====================================
                    if( ER.substring(0 , 3) == "{+}" )
                    {
                        ER = ER.substring(3 , ER.length );
                        for(let i=0;  i<ER.length;  i++)
                        {
                            if( ER.charAt(i) == '{' && ER.substring(i , i+3) == "{+}" )
                            {
                                // EVALUACION DEL OR   {+} ... {+}
                                console.log("===========================");
                                console.log(" OR DETECTADO  {+} ... {+} ");
                                console.log("===========================");
                                
                                let items_OR = ER.substring(0, i).split(',');
                                ER = ER.substring(i , ER.length);
                                if( ER.length == 3 ){  ER = ""; }
                                else{ ER = ER.substring(3 , ER.length);  }

                                console.log("items_OR = " + items_OR);
                                console.log("ER PENDIENTE = " + ER);

                                this.nuevoEstado();
                                let nuevoEstado = this.tabla_transiciones.length-1;
                                let estadosOR = [0];   estadosOR.pop();

                                let estadoNuevo_vacio = true;
                                for(let j=0; j<items_OR.length; j++)
                                {
                                    let simboloOR = items_OR[j];
                                    let sigEstado = this.tabla_transiciones[estado_actual][this.getColumna(simboloOR)];
                                    if( sigEstado == 0)
                                    {
                                        estadoNuevo_vacio = false;
                                        this.tabla_transiciones[estado_actual][this.getColumna(simboloOR)] = nuevoEstado;
                                        console.log( "(q" + estado_actual + " , " + simboloOR + ") = " + nuevoEstado );
                                        // EVALUAR SI EL NUEVO ESTADO YA ESTA EN LA LISTA estadosOR
                                        let bandera = true;
                                        for(let k=0; k<estadosOR.length;  k++)
                                        {
                                            if( nuevoEstado == estadosOR[k] ){ bandera = false; }
                                        }
                                        if(bandera == true){ estadosOR.push(nuevoEstado); }
                                    }
                                    else{
                                        // EVALUAR SI EL SIGUIENTE ESTADO YA ESTA EN LA LISTA estadosOR
                                        let bandera = true;
                                        for(let k=0; k<estadosOR.length;  k++)
                                        {
                                            if( sigEstado == estadosOR[k] ){ bandera = false; }
                                        }
                                        if(bandera == true){ estadosOR.push(sigEstado); }
                                    }
                                }

                                if(estadoNuevo_vacio == true)
                                {
                                    this.tabla_transiciones.pop();
                                }
                                // SEGUIR LA ER EN CADA ESTADO DETECTADO
                                console.log("==================================");
                                console.log("FIN DE LA EVALUACION {+} ... {+}");
                                console.log("ESTADOS OR: " + estadosOR);
                                console.log("==================================");
                                for(let k=0; k<estadosOR.length;  k++)
                                {
                                    //alert("estadoOR = " + estadosOR[k] )
                                    this.addToken(ER , token , estadosOR[k] );
                                }
                                /*    let estadoOR = estado_actual;
                                    estado_actual = this.evaluarSigEstado( estado_actual , simboloOR );
                                    this.addToken( ER , token , estado_actual );
                                    estado_actual = estadoOR;
                                */
                                ER = ""; 
                                break;
                            }
                        }
                        estado_final = false;
                    }

                    //==================================================================
                    // SENTENCIA BUCLE DETECTADA
                    //==================================================================
                    else if( ER.substring(0 , 3) == "{*}" )
                    {
                        ER = ER.substring(3 , ER.length );
                        for(let i=0;  i<ER.length;  i++)
                        {
                            if( ER.charAt(i) == '{' && ER.substring(i , i+3) == "{*}" )
                            {
                                console.log("===========================");
                                console.log(" BUCLE DETECTADO  {*} ... {*} ");
                                console.log("===========================");
                                let items_BUCLE = ER.substring(0, i).split(',');
                                ER = ER.substring(i , ER.length);
                                if( ER.length == 3 ){  ER = ""; }
                                else{ ER = ER.substring(3 , ER.length);  }
                                
                                console.log("items_BUCLE = " + items_BUCLE);
                                console.log("ER PENDIENTE = " + ER);
                                // PROCESO DEL BUCLE
                                this.hacerBucle( estado_actual , items_BUCLE , token , ER );
                                ER = "";
                                break;
                            }
                        }
                        estado_final = false;
                    }
                    
                    else
                    {
                        estado_actual = this.evaluarSigEstado( estado_actual , simbolo );
                        if( ER.length != 1 ){ ER = ER.substring( 1 , ER.length ); }
                        else { ER = ""; }
                    }
                    break;
            
                default:
                    estado_actual = this.evaluarSigEstado( estado_actual , simbolo );
                    if( ER.length != 1 ){ ER = ER.substring( 1 , ER.length ); }
                    else { ER = ""; }
            }
        }

        if(estado_final == true)
        {
            this.addEstadoFinal( estado_actual , token );
        }
    }


    evaluarSigEstado( estado_actual = 0 , simbolo = "")
    {
        let celda = this.tabla_transiciones[estado_actual][this.getColumna(simbolo)];   // qX , simbolo -> celda
        if( celda == 0 ) // ningun prox estado
        {
            let estado_anterior = estado_actual;
            this.nuevoEstado();
            estado_actual = this.tabla_transiciones.length-1;
            this.tabla_transiciones[estado_anterior][this.getColumna(simbolo)] = estado_actual;
            console.log( "(q" + estado_anterior + " , " + simbolo + ") = " + estado_actual );
        }
        else if( celda == estado_actual )
        {
            console.log("CELDA = ESTADO_ACTUAL");
        }
        else
        {
            let estado_anterior = estado_actual;
            estado_actual = celda;
            console.log( "(q" + estado_anterior + " , " + simbolo + ") = " + estado_actual );
        }
        return estado_actual;
    }


    getColumna( simbolo = "" )
    {
        for( let i=0;  i<this.alfabeto.length;  i++ )
        {
            if( this.alfabeto[i] == simbolo ) { return i;  }
            if( this.alfabeto[i] == " " && simbolo.charCodeAt(0) == 160 ){ return i; }
        }
        return -1;
    }


    nuevoEstado()
    {
        let q = [0];
        q.pop();
        for( let i=0;  i<this.alfabeto.length;  i++ ) {  q.push(0); }
        this.tabla_transiciones.push( q );
    }


    esEstadoFinal( estado = 0 )
    {
        for(let i=0; i<this.estados_finales.length;  i++)
        {
            let estadoAlmacenado = this.estados_finales[i].estado;
            if( estado == estadoAlmacenado ){ return true; }
        }
        return false;
    }


    getToken( estado_final = 0 )
    {
        for(let i=0; i<this.estados_finales.length;  i++)
        {
            let compLexico = this.estados_finales[i];
            if( estado_final == compLexico.estado ){ return compLexico.token; }
        }
        return null;
    }


    getCelda( estado = 0 , simbolo = "" )
    {
        return this.tabla_transiciones[estado][this.getColumna(simbolo)];
    }


    hayTransiciones( estado = 0 )
    {
        for(let columna=0; columna<this.alfabeto.length;  columna++)
        {
            let celda = this.tabla_transiciones[estado][columna];
            if(celda != 0){ return true; }
        }
        return false;
    }



    //======================================================================================
    //  METODO QUE SE ENCARGA DE REALIZAR UN BUCLE DADO Y DESPUES CONTINUAR CON LA EXPRESION
    //  NOTA: UN BUCLE TIENE QUE QUEDAR EN UN ESTADO QUE NO TENGA TRANSICIONES
    //======================================================================================
    hacerBucle( estado_actual = 0 , simbolosBUCLE = [""] , token = new ComponenteLexico() , ER = "")
    {
        let esFinal = false;
        if( this.esEstadoFinal(estado_actual) == true){  esFinal = true;  }


        // CUANDO ES UN ESTADO NO FINAL Y LA ER FALTANTE ES VACIA -> SE CONVIENTE EN ESTADO FINAL
        if( this.esEstadoFinal( estado_actual ) == false && ER == "" ) 
        { 
            this.addEstadoFinal( estado_actual , token ); 
        }

        //CHECAR SI EL ESTADO ACTUAL TIENE TRANSICIONES
        if(this.hayTransiciones( estado_actual ) == true || esFinal == true)
        {
            //alert("...")
            // REAGRUPAR SIMBOLOS Y ESTADOS
            let simbolos_NOcomunes = [""];    simbolos_NOcomunes.pop();
            let simbolos_SIcomunes = [""];    simbolos_SIcomunes.pop();
            let simbolos_NEWbucle = [""];    simbolos_NEWbucle.pop();

            let otrosEstados = [0];  otrosEstados.pop();
            let otrosSimbolos = [""];  otrosEstados.pop();
            let estadosBUCLE = [0];   estadosBUCLE.pop();

            // ANALIZAR TODAS LAS TRANSICIONES
            for(let col=0; col<this.alfabeto.length; col++)
            {
                let sigEstado = this.tabla_transiciones[estado_actual][col];
                let simbolo = this.alfabeto[col];
                if( sigEstado == 0 )
                {
                    if(simbolosBUCLE.indexOf(simbolo) != -1) {  simbolos_NEWbucle.push(simbolo)  } 
                }
                else if( sigEstado == estado_actual )
                {
                    if(simbolosBUCLE.indexOf(simbolo) != -1) {  simbolos_SIcomunes.push(simbolo) }
                    else{   simbolos_NOcomunes.push(simbolo) }
                }
                else{
                    // CUANDO UN SIMBOLO LLEVE A OTRO ESTADO DIFERENTE
                    if(simbolosBUCLE.indexOf(simbolo) != -1) 
                    {
                        // SI ES SIMBOLO DEL BUCLE
                        let seDebeagregar = true;
                        for( let k=0; k<estadosBUCLE.length; k++ )
                        {
                            if( estadosBUCLE[k] == sigEstado ){ seDebeagregar = false; break; }
                        }
                        if( seDebeagregar == true ){  estadosBUCLE.push(sigEstado);  }
                    }
                    else{
                        // NO ES SIMBOLO DEL BUCLE
                        let seDebeagregar = true;
                        for( let k=0; k<otrosEstados.length; k++ )
                        {
                            if( otrosEstados[k] == sigEstado ){ seDebeagregar = false; break; }
                        }
                        if( seDebeagregar == true )
                        {  
                            otrosSimbolos.push(simbolo);
                            otrosEstados.push(sigEstado); 
                        }
                    }
                }
            } // FIN ANALIZAR TRANSICIONES


            console.log("========================================")
            console.log(" BUCLE (ESTADO CON TRANSICIONES")
            console.log("========================================")
            console.log("estadoActual: " + estado_actual)
            console.log("simbolos_SIcomunes: " + simbolos_SIcomunes)
            console.log("simbolos_NOcomunes: " + simbolos_NOcomunes)
            console.log("simbolos_NEW: " + simbolos_NEWbucle)
            console.log("estadosBUCLE: " + estadosBUCLE)
            console.log("otrosSimbolos: " + otrosSimbolos)
            console.log("otrosEstados: " + otrosEstados)
            //alert("SI: " + simbolos_SIcomunes + "\nNO: " + simbolos_NOcomunes + "\nNEW: " + simbolos_NEWbucle)
            let estadoNO = -1;
            let estadoSI = -1;
            let estadoNEW = -1;

            // EVALUAR SIMBOLOS NO COMUNES
            if( simbolos_NOcomunes.length != 0 )
            {
                console.log("================================")
                console.log(" AGREGANDO ESTADO (NOcomunes)")
                console.log("================================")
                this.nuevoEstado();
                estadoNO = this.tabla_transiciones.length-1;
                if(this.esEstadoFinal(estado_actual) == true)
                {
                    let tokenActual = this.getToken(estado_actual);
                    this.addEstadoFinal( estadoNO , tokenActual);
                }

                // TRANSICIONES HACIA EL ESTADO NO COMUN
                for(let s=0; s<simbolos_NOcomunes.length; s++)
                {
                    this.tabla_transiciones[estado_actual][this.getColumna(simbolos_NOcomunes[s])] = estadoNO;
                    this.tabla_transiciones[estadoNO][this.getColumna(simbolos_NOcomunes[s])] = estadoNO;
                    console.log( "(q" + estado_actual + " , " + simbolos_NOcomunes[s] + ") = " + estadoNO )
                    console.log( "(q" + estadoNO + " , " + simbolos_NOcomunes[s] + ") = " + estadoNO )
                }
                // REACER EL BUCLE QUE ESTABA EN EL ESTADO ACTUAL EN EL ESTADO NO COMUN
                for(let s=0; s<simbolos_SIcomunes.length; s++)
                {
                    this.tabla_transiciones[estadoNO][this.getColumna(simbolos_SIcomunes[s])] = estadoNO;
                    console.log( "(q" + estadoNO + " , " + simbolos_SIcomunes[s] + ") = " + estadoNO )
                }
                // REACER TRANSICIONES HACIA OTROS ESTADOS DEL BUCLE QUE ESTABA EN EL ESTADO ACTUAL
                for(let s=0; s<otrosSimbolos.length; s++)
                {
                    this.tabla_transiciones[estadoNO][this.getColumna(otrosSimbolos[s])] = otrosEstados[s];
                    console.log( "(q" + estadoNO + " , " + otrosSimbolos[s] + ") = " + otrosEstados[s] )
                }
            }
            
            // EVALUAR SIMBOLOS NUEVOS 
            if( simbolos_NEWbucle.length != 0 )
            {
                console.log("================================")
                console.log(" AGREGANDO ESTADO (NEW)")
                console.log("================================")
                this.nuevoEstado();
                estadoNEW = this.tabla_transiciones.length-1;
                // TRANSICIONES HACIA EL ESTADO SI COMUN
                for(let s=0; s<simbolos_NEWbucle.length; s++)
                {
                    this.tabla_transiciones[estado_actual][this.getColumna(simbolos_NEWbucle[s])] = estadoNEW;
                    console.log( "(q" + estado_actual + " , " + simbolos_NEWbucle[s] + ") = " + estadoNEW )
                }
                // COMPLETAR NUEVO BUCLE
                for(let s=0; s<simbolosBUCLE.length; s++)
                {
                    this.tabla_transiciones[estadoNEW][this.getColumna(simbolosBUCLE[s])] = estadoNEW;
                    console.log( "(q" + estadoNEW + " , " + simbolosBUCLE[s] + ") = " + estadoNEW )
                }
            }

            // EVALUAR SIMBOLOS SI COMUNES
            if( simbolos_SIcomunes.length != 0 )
            {
                console.log("================================")
                console.log(" AGREGANDO ESTADO (SIcomunes)")
                console.log("================================")
                this.nuevoEstado();
                estadoSI = this.tabla_transiciones.length-1;
                if(this.esEstadoFinal(estado_actual) == true)
                {
                    let tokenActual = this.getToken(estado_actual);
                    this.addEstadoFinal( estadoSI , tokenActual);
                }

                // TRANSICIONES HACIA EL ESTADO SI COMUN
                for(let s=0; s<simbolos_SIcomunes.length; s++)
                {
                    this.tabla_transiciones[estado_actual][this.getColumna(simbolos_SIcomunes[s])] = estadoSI;
                    this.tabla_transiciones[estadoSI][this.getColumna(simbolos_SIcomunes[s])] = estadoSI;
                    console.log( "(q" + estado_actual + " , " + simbolos_SIcomunes[s] + ") = " + estadoSI )
                    console.log( "(q" + estadoSI + " , " + simbolos_SIcomunes[s] + ") = " + estadoSI )
                }
                // TRANSICIONES DEL ESTADO SI AL ESTADO NO
                for(let s=0; s<simbolos_NOcomunes.length; s++)
                {
                    this.tabla_transiciones[estadoSI][this.getColumna(simbolos_NOcomunes[s])] = estadoNO;
                    console.log( "(q" + estadoSI + " , " + simbolos_NOcomunes[s] + ") = " + estadoNO )
                }
                // TRANSICIONES DEL ESTADO SI AL ESTADO NEWbucle
                for(let s=0; s<simbolos_NEWbucle.length; s++)
                {
                    this.tabla_transiciones[estadoSI][this.getColumna(simbolos_NEWbucle[s])] = estadoNEW;
                    console.log( "(q" + estadoSI + " , " + simbolos_NEWbucle[s] + ") = " + estadoNEW )
                }
            }

            // HACER BUCLES CON SIMBOLOS QUE LLEVAN A OTROS ESTADOS
            for(let s=0; s<estadosBUCLE.length; s++)
            {
                console.log("================================")
                console.log(" CONTINUAR HACER BUCLE")
                console.log("================================")
                console.log("estadoBUCLE: " + estadosBUCLE[s] )
                this.hacerBucle(estadosBUCLE[s] , simbolosBUCLE , token , ER );
            }

            // CONTINUAR EXPRESION 
            //alert("INICIA 1")
            this.addToken( ER , token , estado_actual)
            if(estadoSI != -1){ this.addToken( ER , token , estadoSI);  /*alert("FIN SI")*/ }
            if(estadoNEW != -1){ this.addToken( ER , token , estadoNEW);  /*alert("FIN NEW")*/ }

            console.log("==================================");
            console.log("FIN DE LA EVALUACION {*} ... {*}");
            console.log("==================================");
            
        } // FIN IF-HAY TRANSICIONES
        else   // CUANDO EL ESTADO NO TIENE TRANSICIONES
        {
            this.addToken( ER , token , estado_actual);
            console.log("==================================");
            console.log("REALIZANDO BUCLE");
            console.log("==================================");
            for(let s=0; s<simbolosBUCLE.length;  s++)
            {
                let simbolo = simbolosBUCLE[s];
                this.tabla_transiciones[estado_actual][this.getColumna(simbolo)] = estado_actual;
                console.log( "(q" + estado_actual + " , " + simbolo + ") = " + estado_actual );
            }
        }
    }


    addEstadoFinal( estado = 0 , token = new ComponenteLexico() )
    {
        for(let i=0;  i<this.estados_finales.length;  i++)
        {
            let estadoAlmacenado = this.estados_finales[i].estado;
            if( estado == estadoAlmacenado ){ return;  }
        }
        this.estados_finales.push(
            {
                estado: estado ,
                token: token
            }
        );
    }
































    
    //==============================================================================
    //          PARTE DEL ANALISIS Y OBTENCION DE TOKENS
    //==============================================================================
    inicializarLexico( txt_entrada = [""] )
    {
        // LIMPIAR TOKENS DE UN ANALISIS ANTERIOR
        while( this.tokens.length != 0) { this.tokens.pop();  }

        // VARIABLES DE INICIO
        this.estadoActual = 0;
        this.debug = [ new DebugLexico() ];    this.debug.pop();
        this.listaErrores = [ new ComponenteLexico() ];    this.listaErrores.pop();
        this.lexema = "";
        this.numeroLinea = 1;
        this.lineaToken = 1;
        this.txt_entrada = txt_entrada;

        // QUITAR COMENTARIOS      ->>    $ ...
        for( let row=0;  row<this.txt_entrada.length;  row++)
        {
            let linea = this.txt_entrada[row];
            //SE ANALIZA UNA LINEA
            for( let s=0;  s<linea.length;  s++)
            {
                let simbolo = linea.charAt(s);
                if(simbolo == '$')  // INICIO DE COMENTARIO
                {
                    let comentario = linea.substring( s , linea.length );
                    linea = linea.replace( comentario , "")
                    this.txt_entrada[row] = linea;
                    break;
                }
            } //FIN DE UNA LINEA
        }
    }



    next()
    {
        //================================================================
        //              LINEA VACIA
        //================================================================
        let linea = this.txt_entrada[this.numeroLinea-1];
        while( linea.length == 0 )
        {
            this.numeroLinea++;
            if( this.lexema != "" )
            {
                if( this.esEstadoFinal( this.estadoActual ) == true )
                {
                    let token = this.getToken( this.estadoActual );
                    let newToken = new ComponenteLexico( 
                        token.token , token.tipoToken , this.lexema , this.lineaToken )
                    this.tokens.push( newToken );
                    console.log("==============================")
                    console.log("        TOKEN AGREGADO ")
                    console.log(newToken)
                    console.log("==============================")
                    this.debug.push( new DebugLexico
                    ( 
                        this.txt_entrada[this.numeroLinea-1] ,
                        "/n" , this.lexema , this.estadoActual , 0 , "" , 
                        newToken.token + " -> " + this.lexema , newToken.tipoToken  
                    ));
                    this.estadoActual = 0;
                    this.lexema = "";
                    this.lineaToken = this.numeroLinea;
                }
                else
                {
                    let token = new ComponenteLexico
                        ( "SECUENCIA_INESPERADA" , "ERROR" , this.lexema , this.lineaToken );
                    this.tokens.push( token );
                    this.debug.push( new DebugLexico
                    ( 
                        this.txt_entrada[this.numeroLinea-1] ,
                        "/n" , this.lexema , this.estadoActual , 0 , "" , 
                        "SECUENCIA_INESPERADA" + " -> " + this.lexema , "ERROR"
                    ));
                    this.estadoActual = 0;
                    this.lexema = "";
                    this.lineaToken = this.numeroLinea;
                }
            } // FIN IF LEXEMA != ""
            else
            {  
                this.lineaToken = this.numeroLinea;
            }
            //================================================================
            //              LINEA VACIA
            //================================================================
            console.log( "Numero Linea Actual: " + this.numeroLinea )
            console.log( "Total Lineas: " + this.txt_entrada.length )
            if( this.numeroLinea > this.txt_entrada.length )  { return "FIN"; }
            return "TOKEN";
        }


        //================================================================
        //              EVALUAR UN SIMBOLO DE LA LINEA
        //================================================================
        let simboloEntrada = linea.charAt(0);

        if( linea.length == 1 ){ linea = ""; }
        else{ linea = linea.substring( 1 , linea.length ); }
        this.txt_entrada[this.numeroLinea-1] = linea;    // SE CONSUME SIMBOLO DE LA ENTRADA

        let columna = this.getColumna(simboloEntrada);
        console.log(
            "ENTRADA: '" + this.txt_entrada + 
            "'\nSIMBOLO:'" + simboloEntrada + 
            "'\nCOLUMNA: " + columna +
            "\nLEXEMA: '" + this.lexema + "'"
        );


        //================================================================
        //             SIMBOLO QUE NO ES DEL ALFABETO
        //================================================================
        if( columna == -1 )  
        {
            if( this.lexema == "" )
            {  
                this.tokens.push( new ComponenteLexico
                    ("SIMBOLO_INESPERADO" , "ERROR" , simboloEntrada , this.lineaToken ) );
                this.debug.push( new DebugLexico
                ( 
                    this.txt_entrada[this.numeroLinea-1] ,
                    simboloEntrada , this.lexema , this.estadoActual , 0 , "" , 
                    "SIMBOLO_INESPERADO" + " -> " + simboloEntrada , "ERROR"
                ));
                this.estadoActual = 0;
                this.lexema = "";
                this.lineaToken = this.numeroLinea;
                return "TOKEN";
            }
            else   // LEXEMA != VACIO
            {
                if( this.esEstadoFinal( this.estadoActual ) == true )
                {
                    let token = this.getToken( this.estadoActual );
                    let newToken = new ComponenteLexico( 
                        token.token , token.tipoToken , this.lexema , this.lineaToken )
                    this.tokens.push( newToken );
                    console.log("==============================")
                    console.log("        TOKEN AGREGADO ")
                    console.log(newToken)
                    console.log("==============================")
                    this.debug.push( new DebugLexico
                    ( 
                        this.txt_entrada[this.numeroLinea-1] ,
                        simboloEntrada , this.lexema , this.estadoActual , 0 , "" , 
                        newToken.token + " -> " + this.lexema , newToken.tipoToken
                    ));
                    this.estadoActual = 0;
                    this.lexema = "";
                    this.lineaToken = this.numeroLinea;
                    this.txt_entrada[this.numeroLinea-1] = simboloEntrada + this.txt_entrada[this.numeroLinea-1];
                    return "TOKEN";
                }
                else
                {
                    let token = new ComponenteLexico
                        ( "SECUENCIA_INESPERADA" , "ERROR" , this.lexema , this.lineaToken );
                    this.tokens.push( token );
                    this.debug.push( new DebugLexico
                    ( 
                        this.txt_entrada[this.numeroLinea-1] ,
                        simboloEntrada , this.lexema , this.estadoActual , 0 , "" , 
                        "SECUENCIA_INESPERADA" + " -> " + this.lexema , "ERROR"
                    ));
                    this.estadoActual = 0;
                    this.lexema = "";
                    this.lineaToken = this.numeroLinea;
                    this.txt_entrada[this.numeroLinea-1] = simboloEntrada + this.txt_entrada[this.numeroLinea-1];
                    return "TOKEN";
                }
            }
        }  // FIN IF COLUMNA == -1


        //================================================================
        //             EVALUAR SIGUIENTE ESTADO
        //================================================================
        let sigEstado = this.tabla_transiciones[this.estadoActual][columna];
        let avanceProceso = "(q" + this.estadoActual + " , " + simboloEntrada + " ) = " + sigEstado;
        console.log(avanceProceso)

        if( sigEstado == 0 )
        {
            if( this.lexema != "" )
            {
                if( this.esEstadoFinal( this.estadoActual ) == true )
                {
                    let token = this.getToken( this.estadoActual );
                    let newToken = new ComponenteLexico( 
                        token.token , token.tipoToken , this.lexema , this.lineaToken )
                    this.tokens.push( newToken );
                    console.log("==============================")
                    console.log("        TOKEN AGREGADO ")
                    console.log(newToken)
                    console.log("==============================")
                    this.debug.push( new DebugLexico
                    ( 
                        this.txt_entrada[this.numeroLinea-1] ,
                        simboloEntrada , this.lexema , this.estadoActual , 0 , "" , 
                        newToken.token + " -> " + this.lexema , newToken.tipoToken
                    ));
                    this.estadoActual = 0;
                    this.lexema = "";
                    this.lineaToken = this.numeroLinea;
                    this.txt_entrada[this.numeroLinea-1] = simboloEntrada + this.txt_entrada[this.numeroLinea-1];
                    return "TOKEN";
                }
                else
                {
                    let token = new ComponenteLexico
                        ( "SECUENCIA_INESPERADA" , "ERROR" , this.lexema , this.lineaToken );
                    this.tokens.push( token );
                    this.debug.push( new DebugLexico
                    ( 
                        this.txt_entrada[this.numeroLinea-1] ,
                        simboloEntrada , this.lexema , this.estadoActual , 0 , "" , 
                        "SECUENCIA_INESPERADA" + " -> " + this.lexema , "ERROR"
                    ));
                    this.estadoActual = 0;
                    this.lexema = "";
                    this.txt_entrada[this.numeroLinea-1] = simboloEntrada + this.txt_entrada[this.numeroLinea-1];
                    this.lineaToken = this.numeroLinea;
                    return "TOKEN";
                }
            } // FIN IF LEXEMA != ""
            else
            {  
                let token = new ComponenteLexico
                        ( "SECUENCIA_INESPERADA" , "ERROR" , simboloEntrada , this.lineaToken );
                this.tokens.push( token );
                this.debug.push( new DebugLexico
                ( 
                    this.txt_entrada[this.numeroLinea-1] ,
                    simboloEntrada , this.lexema , this.estadoActual , 0 , "" , 
                    "SECUENCIA_INESPERADA" + " -> " + simboloEntrada , "ERROR"
                ));
                this.estadoActual = 0;
                this.lexema = "";
                this.lineaToken = this.numeroLinea;
                return "TOKEN";
            }
        } // FIN IF SIGESTADO == 0
        else
        {
            this.debug.push( new DebugLexico
            ( 
                this.txt_entrada[this.numeroLinea-1] ,
                simboloEntrada , this.lexema , this.estadoActual , sigEstado , 
                this.lexema + simboloEntrada , "" , ""
            ));
            this.estadoActual = sigEstado;
            this.lexema = this.lexema + simboloEntrada
            return "CONTINUA";
        }
    }







    static FIN_ANALISIS = 1;
    static ERROR = 2;
    static ITERACION_OK = 3;

    //==============================================================================
    //          OBTENCION DE TOKENS DE FUNCIONES PREDEFINIDAS EN COMIC
    //==============================================================================
    getCodigoFunciones()
    {
        let codigo = 
        
        "velocidad( Entero vel , Pin cableIzquierdo , Pin cableDerecho ) Devuelve Nada\n" +
        "{\n" +
        "   Si( giro == 0 ) {" +
        "      establecerPinAnalogico( cableIzquierdo , 0 );\n" + 
        "      establecerPinAnalogico( cableDerecho , vel );\n" + 
        "   } Sino {\n" + 
        "      establecerPinAnalogico( cableIzquierdo , vel );\n" + 
        "      establecerPinAnalogico( cableDerecho , 0 );\n" + 
        "   }\n" +
        "}\n" +


        "girarIzquierda( Pin cableIzquierdo , Pin cableDerecho ) Devuelve Nada\n" +
        "{\n" +
        "   establecerPinAnalogico( cableIzquierdo , 120 );\n" + 
        "   establecerPinAnalogico( cableDerecho , 0 );\n" + 
        "   giro = 1;\n" + 
        "}\n" +


        "girarDerecha( Pin cableIzquierdo , Pin cableDerecho ) Devuelve Nada\n" +
        "{\n" +
        "   establecerPinAnalogico( cableIzquierdo , 0 );\n" + 
        "   establecerPinAnalogico( cableDerecho , 120 );\n" + 
        "   giro = 0;\n" + 
        "}";

/*
        "Retroceder( Pin IDpin ) Devuelve Nada\n" +
        "{\n" +
        "   Booleano pincel4 = 2==9;\n" + 
        "}"; */


        console.clear()
        return codigo.split('\n');
    }




    obtenerCodigoFunciones( txt_codigoFunciones = [""] )
    {
        let estadoActual = 0;
        let lexema = "";
        let numeroLinea = 1;
        let lineaToken = 0;

        // COMIENZA ANALISIS
        while( numeroLinea <= txt_codigoFunciones.length )
        {
            let linea = txt_codigoFunciones[numeroLinea-1];
            if( linea.length == 0 )   // LINEA VACIA
            {
                numeroLinea++;
                if( lexema != "" )
                {
                    if( this.esEstadoFinal( estadoActual ) == true )
                    {
                        let token = this.getToken( estadoActual );
                        let newToken = new ComponenteLexico( 
                            token.token , token.tipoToken , lexema , lineaToken )
                        this.tokensFunciones.push( newToken );
                        estadoActual = 0;
                        lexema = "";
                    }
                    else
                    {
                        alert( "SECUENCIA_INESPERADA ( " + lexema + " )" );
                        return false
                    }
                } // FIN IF LEXEMA != ""
            } // LINEA VACIA
            else
            {
                //=====================================================
                //  LINEA NO VACIA
                //=====================================================

                //  EVALUAR UN SIMBOLO DE LA LINEA
                let simboloEntrada = linea.charAt(0)
                if( linea.length == 1 ){ linea = "" }
                else{ linea = linea.substring( 1 , linea.length ) }
                txt_codigoFunciones[numeroLinea-1] = linea;  // SE CONSUME SIMBOLO DE LA ENTRADA


                //  SIMBOLO QUE NO ES DEL ALFABETO
                let columna = this.getColumna(simboloEntrada);
                if( columna == -1 )  
                {
                    if( lexema == "" )
                    {  
                        alert( "SIMBOLO_INESPERADO ( " + simboloEntrada + " )" );
                        return false
                    }
                    else   // LEXEMA != VACIO
                    {
                        if( this.esEstadoFinal( estadoActual ) == true )
                        {
                            let token = this.getToken( estadoActual );
                            let newToken = new ComponenteLexico( 
                                token.token , token.tipoToken , lexema , lineaToken )
                            this.tokensFunciones.push( newToken );
                            estadoActual = 0;
                            lexema = "";
                            txt_codigoFunciones[numeroLinea-1] = simboloEntrada + txt_codigoFunciones[numeroLinea-1];
                            continue
                        }
                        else
                        {
                            alert( "SECUENCIA_INESPERADA ( " + lexema + " )" );
                            return false
                        }
                    }
                }  // FIN IF COLUMNA == -1


                //  EVALUAR SIGUIENTE ESTADO
                let sigEstado = this.tabla_transiciones[estadoActual][columna];
                if( sigEstado == 0 )
                {
                    if( lexema != "" )
                    {
                        if( this.esEstadoFinal( estadoActual ) == true )
                        {
                            let token = this.getToken( estadoActual );
                            let newToken = new ComponenteLexico( 
                                token.token , token.tipoToken , lexema , lineaToken )
                            this.tokensFunciones.push( newToken );
                            estadoActual = 0;
                            lexema = "";
                            txt_codigoFunciones[numeroLinea-1] = simboloEntrada + txt_codigoFunciones[numeroLinea-1];
                            continue
                        }
                        else
                        {
                            alert( "SECUENCIA_INESPERADA ( " + lexema + " )" );
                            return false
                        }
                    } // FIN IF LEXEMA != ""
                    else
                    {   
                        alert( "SECUENCIA_INESPERADA ( " + simboloEntrada + " )" );
                        return false 
                    }
                } // FIN IF SIGESTADO == 0
                else
                {
                    // SIG ESTADO VALIDO
                    estadoActual = sigEstado;
                    lexema = lexema + simboloEntrada
                    continue
                }
            } // FIN LINEA NO VACIA
        } // FIN WHILE
        return true
    }












    //==============================================================================
    //          METODOS DE APOYO
    //==============================================================================
    filtrarTokens( tipoToken = "" )
    {
        let filtro = this.tokens.filter( compLexico => compLexico.tipoToken == tipoToken );
        return filtro;
    }


    filtrarTokensFunciones()
    {
        return this.tokensFunciones.filter( compLexico => compLexico.tipoToken == "OK" );
    }


    setListaErrores( listaE = [new ComponenteLexico()])
    {
        for( let i=0;  i<listaE.length;  i++ )
        {
            this.listaErrores.push( new ComponenteLexico(
                listaE[i].token , "ERROR" , listaE[i].lexema , listaE[i].numeroLinea , "Lex_"+(i+1)
            ));
        }
    }



/*
    addTokenCompleto(simbolo="" , lexema = "" , estado_actual = "" , linea_del_token = 0 , numero_linea = 0)
    {
        if(lexema != "")  // CUANDO HAY UNA SECUENCIA PREVIA DE ESTADOS
        {
            let token = this.getToken( estado_actual );
            console.log("TOKEN: "+token);
            if(token != "")  // CUANDO QUEDA EN UN ESTADO FINAL
            {
                let token_tipo = token.split('<');
                let componente_lexico =
                {
                    token: token_tipo[0] ,
                    lexema: lexema ,
                    tipo: token_tipo[1] ,   // OK , ERROR , OMITIR ...
                    linea: linea_del_token
                };
                this.tokens.push( componente_lexico );
                linea_del_token = numero_linea;
                lexema = "";
                estado_actual = 0;
            }
            else   // CUANDO QUEDO UNA SECUENCIA NO VALIDA
            {
                let componente_lexico =
                {
                    token: "LEXEMA_INCOMPLETO" ,
                    lexema: lexema ,
                    tipo: "ERROR" ,   // OK , ERROR , OMITIR ...
                    linea: linea_del_token
                };
                this.tokens.push( componente_lexico );
                linea_del_token = numero_linea;
                lexema = "";
                estado_actual = 0;
            }
        }
        else  // CUANDO LEXEMA ES VACIO
        {
            //alert("LEXEMA: " + lexema + "\nSIMBOLO: " + simbolo);
            if( simbolo != "&")
            {
                let componente_lexico =
                {
                    token: "SECUENCIA_NO_IDENTIFICADA" ,
                    lexema: lexema + simbolo ,
                    tipo: "ERROR" ,   // OK , ERROR , OMITIR ...
                    linea: linea_del_token
                };
                this.tokens.push( componente_lexico );
                linea_del_token = numero_linea;
                lexema = "";
                estado_actual = 0;
            }
        }
        let datos = 
        {
            lexema: lexema , 
            estado_actual: estado_actual , 
            linea_del_token: linea_del_token , 
            numero_linea: numero_linea
        };
        return datos;
    } */
}


