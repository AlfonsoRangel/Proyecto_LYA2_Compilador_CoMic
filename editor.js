
/*============================================================================
        SECCION DE ENLACE A LOS ELEMENTOS HTML
============================================================================== */
let modalLex_abierto = false
let modalSin_abierto = false
let modalSem_abierto = false
let modalCodOp_abierto = false
let modalCod_abierto = false
let modalCodObj_abierto = false
let codigoObjetoGenerado = false
let letraSize = 20
function getHTML( id = "" ) {  return document.getElementById(id);  }

let div_principal = getHTML("div_principal");
let menu_lateral_principal = getHTML("menu_lateral_principal");
let boton_menu = getHTML("boton_menu");
let link_inicio = getHTML("link_inicio");
let txt_enlaceInicio = getHTML("txt_enlaceInicio");



// CONTENIDO PRINCIPAL
let div_contenido = getHTML("div_contenido");
let boton_compilar = getHTML("boton_compilar");
let boton_tabla_tokens = getHTML("boton_tabla_tokens");
let boton_tabla_simbolos = getHTML("boton_tabla_simbolos");
let boton_consola_errores = getHTML("boton_consola_errores");
let boton_codigoObjeto = getHTML("boton_codigoObjeto");

let botonAumentarLetra = getHTML("botonAumentarLetra");
let botonDecrementarLetra = getHTML("botonDecrementarLetra");




// PANEL LATERAL TABLA-TOKENS
let menu_lateral_tablaTokens = getHTML("menu_lateral_tablaTokens");
let tabla_tokens = getHTML("tabla_tokens");

 
// PANEL LATERAL TABLA-SIMBOLOS
let menu_lateral_tablaSimbolos = getHTML("menu_lateral_tablaSimbolos");
let combo_TS = getHTML("combo_TS");
let TS_columnas = getHTML("TS_columnas");
let TS_renglones = getHTML("TS_renglones");
let boton_TS_cancelar = getHTML("boton_TS_cancelar");



// PANEL LATERAL CONSOLA-ERRORES
let menu_lateral_consolaErrores = getHTML("menu_lateral_consolaErrores");
let tabla_consolaErrores = getHTML("tabla_consolaErrores");
let boton_consolaE_cancelar = getHTML("boton_consolaE_cancelar");



// PANEL LATERAL ARBOL DE EXPRESION
let menu_lateral_arbol = getHTML("menu_lateral_arbol");
let boton_arbol_cancelar = getHTML("boton_arbol_cancelar");
let tabla_expresion_arbol = getHTML("tabla_expresion_arbol");
let tabla_prefijo_arbol = getHTML("tabla_prefijo_arbol");
let div_arbol = getHTML("div_arbol");
let tabla_posfijo_arbol = getHTML("tabla_posfijo_arbol");
let tabla_debugArbol = getHTML("tabla_debugArbol");
let tabla_pilaI_arbol = getHTML("tabla_pilaI_arbol");
let tabla_pilaF_arbol = getHTML("tabla_pilaF_arbol");



// MODAL LEXICO
let modal_lexico = getHTML("modal_lexico");
let boton_modalLex_cancelar = getHTML("boton_modalLex_cancelar");
let tabla_entradaLexico = getHTML("tabla_entradaLexico");
let tabla_debugLexico = getHTML("tabla_debugLexico");


// MODAL SINTACTICO
let modal_sintactico = getHTML("modal_sintactico");
let tabla_pilaF_sintactico = getHTML("tabla_pilaF_sintactico");
let tabla_pilaI_sintactico = getHTML("tabla_pilaI_sintactico");
let tabla_debugSintactico = getHTML("tabla_debugSintactico");
let tabla_entradaF_sintactico = getHTML("tabla_entradaF_sintactico");
let tabla_entradaI_sintactico = getHTML("tabla_entradaI_sintactico");
let boton_modalSin_cancelar = getHTML("boton_modalSin_cancelar");



// MODAL SEMANTICO
let modal_semantico = getHTML("modal_semantico");
let tabla_pilaF_semantico = getHTML("tabla_pilaF_semantico");
let tabla_pilaI_semantico = getHTML("tabla_pilaI_semantico");
let tabla_debugSemantico = getHTML("tabla_debugSemantico");
let tabla_entradaF_semantico = getHTML("tabla_entradaF_semantico");
let tabla_entradaI_semantico = getHTML("tabla_entradaI_semantico");
let boton_modalSem_cancelar = getHTML("boton_modalSem_cancelar");
let contenido_modal_semantico = getHTML("contenido_modal_semantico");



// MODAL CODIGO INTERMEDIO
let modal_codigoIntermedio = getHTML("modal_codIntermedio");
let boton_modalCod_cancelar = getHTML("boton_modalCod_cancelar");
let tablaInstruccion_codIntermedio = getHTML("codIntermedio_tablaInstruccion");
let tablaCuadruplos_codIntermedio = getHTML("codIntermedio_tablaCuadruplos");



// MODAL CODIGO INTERMEDIO OPTIMIZADO
let modal_codIntermedioOp = getHTML("modal_codIntermedioOp");
let boton_modalCodOp_cancelar = getHTML("boton_modalCodOp_cancelar");
let codIntermedioOp_tablaOriginal = getHTML("codIntermedioOp_tablaOriginal");
let codIntermedioOp_tablaOp = getHTML("codIntermedioOp_tablaOp");
let combo_InstruccionCodOp = getHTML("combo_InstruccionCodOp");




// MODAL CODIGO INTERMEDIO OPTIMIZADO
let modal_debugCodigoArduino = getHTML("modal_debugCodigoArduino");
let boton_modalCodObjeto_cancelar = getHTML("boton_modalCodObjeto_cancelar");
let codObjeto_tablaCodOptimizado = getHTML("codObjeto_tablaCodOptimizado");
let codObjeto_tablaArduino = getHTML("codObjeto_tablaArduino");
let combo_InstruccionCodObjeto = getHTML("combo_InstruccionCodObjeto");




// MODAL CODIGO OBJETO GENERADO
let modal_codigoArduino = getHTML("modal_codigoArduino");
let boton_modalCodAr_cancelar = getHTML("boton_modalCodAr_cancelar");
let boton_descargarCodigo = getHTML("boton_descargarCodigo");
let div_codigoCoMic = getHTML("div_codigoCoMic");
let div_codigoArduino = getHTML("div_codigoArduino");


// MODAL CARGANDO
let modal_cargando = getHTML("modal_cargando");


// MODAL COMPILACION OK
let modal_compilacionOK = getHTML("modal_compilacionOK");
let boton_modalCompOK_cancelar = getHTML("boton_modalCompOK_cancelar");
let botonLex_compilacionOK = getHTML("botonLex_compilacionOK");
let botonSin_compilacionOK = getHTML("botonSin_compilacionOK");
let botonSem_compilacionOK = getHTML("botonSem_compilacionOK");
let botonCod_compilacionOK = getHTML("botonCod_compilacionOK");
let botonCodOp_compilacionOK = getHTML("botonCodOp_compilacionOK");
let botonCodObj_compilacionOK = getHTML("botonCodObj_compilacionOK");


// POPUP LINEA
let popup_linea = getHTML("popup_linea");
let popupLinea_textoNum = getHTML("popupLinea_textoNum");



// POPUP RESULTADO CUADRUPLO
let popup_resultadoCuadruplo = getHTML("popup_resultadoCuadruplo");
let popupResultado_tipo = getHTML("popupResultado_tipo");
let popupResultado_bloque = getHTML("popupResultado_bloque");
let popupResultado_ambito = getHTML("popupResultado_ambito");
let popupResultado_tipoDato = getHTML("popupResultado_tipoDato");
let popupResultado_ID = getHTML("popupResultado_ID");
let popupResultado_GOTO = getHTML("popupResultado_GOTO");
let popupResultado_funcion = getHTML("popupResultado_funcion");
let popupResultado_callFuncion = getHTML("popupResultado_callFuncion");






let div_editor = getHTML("div_editor");
let div_lineas = getHTML("div_lineas");





















/*============================================================================
        INCIALIZACIONES DEL FRAMEWORK SEMANTIC-UI
============================================================================== */
$('.sidebar').sidebar('setting', 'transition', 'overlay').sidebar("hide");

$(menu_lateral_tablaTokens).sidebar({
    context: $(div_contenido) ,
    closable: false
});  

$(menu_lateral_tablaSimbolos).sidebar({
    context: $(div_contenido) ,
    closable: false
});

$(menu_lateral_arbol).sidebar({
    context: $(contenido_modal_semantico) ,
    closable: false
});


$(menu_lateral_consolaErrores).sidebar({
    context: $(div_contenido) ,
    closable: false
});

$(modal_lexico).modal({
    closable: false
});

$(modal_sintactico).modal({
    closable: false
});

$(modal_semantico).modal({
    closable: false
});

$(modal_codigoIntermedio).modal({
    closable: false
});

$(modal_codIntermedioOp).modal({
    closable: false
});

$(modal_debugCodigoArduino).modal({
    closable: false
});

$(modal_codigoArduino).modal({
    closable: false
});

$(modal_cargando).modal({
    closable: false
});

$(modal_compilacionOK).modal({
    closable: false
});

$('.boton_contenido').popup();
$('.botonEditor').popup();
$(txt_enlaceInicio).popup();
$(boton_descargarCodigo).popup();




$('.columna_resultado').popup({
    popup: popup_resultadoCuadruplo ,
    duration: 100 , 
    on: 'click' ,
    exclusive: true , 
    closable: false ,
    position: 'left center'
});

$('.ui.dropdown').dropdown();

$('.menu .item').tab();

$('.ui.accordion') .accordion({exclusive: false});














/*============================================================================
        SECCION DE IMPORTACIONES
============================================================================== */
import { AFD } from './AnalisisLexico.js';
import { AnalisisSintactico } from './AnalisisSintactico.js'
import { ArbolDeExpresion } from './ArbolDeExpresion.js';
import { ComponenteLexico } from './ComponenteLexico.js';
import { ItemProduccion } from './Sintactico/ItemProduccion.js';
import { AnalisisSemantico } from './Semantico/AnalisisSemantico.js';
import { ErrorSemantico } from './Semantico/ErrorSemantico.js';
import { SimboloFuncion } from './Semantico/SimboloFuncion.js';
import { SimboloPin } from './Semantico/SimboloPin.js';
import { SimboloVariable } from './Semantico/SimboloVariable.js';
import { ErrorSintactico } from './Sintactico/errorSintactico.js';
import { CodigoIntermedio } from './Codigo_Intermedio/CodigoIntermedio.js';
import { ResultadoCuadruplo } from './Codigo_Intermedio/ResultadoCuadruplo.js';
import { CodigoOptimizado } from './Cod_Intermedio_Optimizado/Cod_intermedio_op.js';
import { Cuadruplo } from './Codigo_Intermedio/Cuadruplo.js';
import { CodigoArduino } from './CodigoObjeto/CodigoArduino.js';
import { ItemArduino } from './CodigoObjeto/itemArduino.js';
import { Fecha } from './Fecha.js';
import { CodigoObjeto } from './CodigoObjeto/CodigoObjeto.js';

let afd = new AFD()
let ass = new AnalisisSintactico()
let sem = new AnalisisSemantico()
let codIntermedio = new CodigoIntermedio()
let codIntermedioOp = new CodigoOptimizado()
let codObjeto = new CodigoObjeto()
$(modal_cargando).modal('show');
setTimeout( () => {
    afd.inicializar();
    $(modal_cargando).modal('hide');
} , 1500 );
let TS_principal = true;
















/*============================================================================
        SECCION DE METODOS
============================================================================== */
function limpiarTabla( tabla = document.createElement('tbody') )
{
    while( tabla.childElementCount > 0 ){ tabla.removeChild( tabla.firstChild );  }
}


//_________________________________________________
// METODO QUE ESTABLECE UN ROW COMO SELECCIONADO
//_________________________________________________
function seleccionarColumna( tabla = document.createElement('div') , 
columna = document.createElement('div') )
{
    for( let k=0;  k<tabla.childElementCount;  k++ )
    {
        let row = tabla.children[k];
        for( let w=0; w<row.childElementCount;  w++ )
        {
            row.children[w].classList.remove('columnaSeleccionada');
        }
    }
    columna.classList.add('columnaSeleccionada')
}




//_________________________________________________
// METODO QUE QUITA LA REFERENCIA GOTO SELECCIONADA (codigo intermedio)
//_________________________________________________
function limpiarReferenciasGOTO( )
{
    // LIMPIAR TABLA INSTRUCCIONES
    for( let k=0;  k<tablaInstruccion_codIntermedio.childElementCount;  k++ ) // ROWS
    {
        let row = tablaInstruccion_codIntermedio.children[k];
        for( let w=0; w<row.childElementCount;  w++ )  // COLUMNAS
        {
            row.children[w].classList.remove('columnaGOTO');
        }
    }
    // LIMPIAR TABLA CUADRUPLOS
    for( let k=0;  k<tablaCuadruplos_codIntermedio.childElementCount;  k++ ) // ROWS
    {
        let row = tablaCuadruplos_codIntermedio.children[k];
        for( let w=0; w<row.childElementCount;  w++ )  // COLUMNAS
        {
            row.children[w].classList.remove('columnaGOTO');
        }
    }
}



//_________________________________________________
// METODO QUE SELECCIONA LA REFERENCIA GOTO INDICADA (codigo intermedio)
//_________________________________________________
function setReferenciaGOTO( clave = "" , celdaActual = document.createElement('div') )
{
    let row = -1
    let encontrado = false;
    for(let i=0;  i<codIntermedio.accion.debug.length;  i++)  // INSTRUCCION x INSTRUCCION
    {
        let itemDebug = codIntermedio.accion.debug[i]
        for(let k=0;  k<itemDebug.listaCuadruplos.length;  k++)  // CUADRUPLO x CUADRUPLO
        {
            let cuadruplo = itemDebug.listaCuadruplos[k]
            //alert( clave + "==" + cuadruplo.resultado.clave )
            if( clave == cuadruplo.resultado.clave ) 
            {  
                //alert("ENCONTRADO")
                row = i;  
                encontrado = true 
                break
            }
        }
        if( encontrado ){ break; }
    }

    // SELECCIONAR INSTRUCCION
    if( encontrado == true )
    {
        let rowT = tablaInstruccion_codIntermedio.children[row];
        for( let w=0; w<rowT.childElementCount;  w++ )  // COLUMNAS
        {
            rowT.children[w].classList.add('columnaGOTO');
        }
        celdaActual.classList.add('columnaGOTO')
    }
}




//_____________________
//  METODO QUE AGREGA UN 
//  ROW DE ERROR A LA CONSOLA
//_____________________
function addConsolaErrorLexico( tipoError = "" , compLexico = new ComponenteLexico() )
{
    let row = document.createElement('tr');
    row.classList.add('center');
    row.classList.add('aligned');

    let td1 = document.createElement('td');
    td1.innerText = tipoError;

    let td2 = document.createElement('td');
    td2.innerText = compLexico.numeroLinea;

    let td3 = document.createElement('td');
    let descripcion = "";
    let sugerencia = "";
    switch( compLexico.token )
    {
        case 'IDENTIFICADOR_NO_INIT_NUM':  // 12rt_h2
            descripcion = "La secuencia '" + compLexico.lexema + "' NO es un nombre de " +
                        "identificador correcto"; 
            sugerencia = "Un nombre de identificador NO debe empezar con digitos, " +
                        "debe comenzar con alguna letra";
            break;

        case 'IDENTIFICADOR_NO_INIT_ESPECIAL':
            descripcion = "La secuencia '" + compLexico.lexema + "' NO es un nombre de " +
                        "identificador correcto"; 
            sugerencia = "Un nombre de identificador NO debe empezar con caracteres especiales, " + 
                        "debe comenzar con alguna letra";
            break;
        
        case 'IDENTIFICADOR_NO_CONT_ESPECIAL':
            descripcion = "La secuencia '" + compLexico.lexema + "' NO es un nombre de " +
                        "identificador correcto"; 
            sugerencia = "Un nombre de identificador NO debe contener caracteres especiales, " + 
                        "solamente utiliza letras, digitos o _";
            break;
        
        case 'SECUENCIA_INESPERADA':
            descripcion = "La secuencia '" + compLexico.lexema + "' NO es valida en este lenguaje" 
            sugerencia = "Consulta nuestra documentacion para mas informacion sobre nombres de "
            + "identificadores o palabras reservadas";
            break;

        case 'SIMBOLO_INESPERADO':
            descripcion = "El simbolo '" + compLexico.lexema + "' NO esta permitido en el lenguaje"
            sugerencia = "Consulta nuestra documentacion para mas informacion sobre operadores validos";
            break;

        case '':
            descripcion = "Compilacion correcta ...";
            sugerencia = "";
            break;
    }
    td3.innerText = descripcion;

    let td4 = document.createElement('td');
    td4.innerText = sugerencia;

    let td5 = document.createElement('td');
    td5.classList.add('celda_icono');

    let i5 = document.createElement('i');
    i5.classList.add('fas');
    i5.classList.add('fa-eye');
    td5.append(i5);

    td5.onclick = () =>
    {
        cargarDebugLexico( compLexico.getID() );
        $(modal_lexico).modal('show');
    };

    row.append(td1);
    row.append(td2);
    row.append(td3);
    row.append(td4);
    row.append(td5);
    tabla_consolaErrores.append( row);
}


//_____________________
//  METODO QUE AGREGA UN 
//  ROW DE ERROR A LA CONSOLA
//_____________________
function addConsolaCorrecto( compLexico = new ComponenteLexico() )
{
    let row = document.createElement('tr');
    row.classList.add('center');
    row.classList.add('aligned');
    row.classList.add('rowVerde')

    let td1 = document.createElement('td');
    td1.innerText = "Ninguno";

    let td2 = document.createElement('td');
    td2.innerText = "";

    let td3 = document.createElement('td');
    td3.innerText = "Compilacion Correcta...";

    let td4 = document.createElement('td');
    td4.innerText = "";

    let td5 = document.createElement('td');
    td5.classList.add('celda_icono');

    let i5 = document.createElement('i');
    i5.classList.add('fas');
    i5.classList.add('fa-eye');
    td5.append(i5);

    td5.onclick = () =>
    {
        $(modal_compilacionOK).modal('show');
    };

    row.append(td1);
    row.append(td2);
    row.append(td3);
    row.append(td4);
    row.append(td5);
    tabla_consolaErrores.append(row);
}



//_____________________
//  METODO QUE AGREGA UN 
//  ROW DE ERROR A LA CONSOLA
//_____________________
function addConsolaErrorSintactico( errorSin = new ErrorSintactico() , numError = 0 )
{
    let row = document.createElement('tr');
    row.classList.add('center');
    row.classList.add('aligned');

    let td1 = document.createElement('td');
    td1.innerText = "Sintactico";

    let td2 = document.createElement('td');
    td2.innerText = errorSin.numeroLinea

    let td3 = document.createElement('td');
    td3.innerText = errorSin.descripcion

    let td4 = document.createElement('td');
    td4.innerText = errorSin.sugerencia;

    let td5 = document.createElement('td');
    td5.classList.add('celda_icono');

    let i5 = document.createElement('i');
    i5.classList.add('fas');
    i5.classList.add('fa-eye');
    td5.append(i5);

    td5.onclick = () =>
    {
        cargarDebugSintactico( numError );
        $(modal_sintactico).modal('show');
    };

    row.append(td1);
    row.append(td2);
    row.append(td3);
    row.append(td4);
    row.append(td5);
    tabla_consolaErrores.append(row);
}


//_____________________
//  METODO QUE AGREGA UN ROW DE
//  ERROR SEMANTICO A LA CONSOLA
//_____________________
function addConsolaErrorSemantico( errorSem = new ErrorSemantico() , numError = 0 )
{
    let row = document.createElement('tr');
    row.classList.add('center');
    row.classList.add('aligned');

    let td1 = document.createElement('td');
    td1.innerText = "Semantico";

    let td2 = document.createElement('td');
    td2.innerText = errorSem.numeroLinea

    let td3 = document.createElement('td');
    td3.innerText = errorSem.descripcion

    let td4 = document.createElement('td');
    td4.innerText = errorSem.sugerencia;

    let td5 = document.createElement('td');
    td5.classList.add('celda_icono');

    let i5 = document.createElement('i');
    i5.classList.add('fas');
    i5.classList.add('fa-eye');
    td5.append(i5);

    i5.onclick = () =>
    {
        cargarDebugSemantico( numError );
        //menu_lateral_tablaSimbolos.classList.remove( "right" );
        //menu_lateral_tablaSimbolos.classList.add( "left" );
        $(menu_lateral_tablaSimbolos).sidebar({
            context: $(contenido_modal_semantico)
        });
        $(modal_semantico).modal('show');
    };

    row.append(td1);
    row.append(td2);
    row.append(td3);
    row.append(td4);
    row.append(td5);
    tabla_consolaErrores.append(row);
}



function addTablaToken( compLexico = new ComponenteLexico() )
{
    let row = document.createElement('tr');
    row.classList.add('center');
    row.classList.add('aligned');

    let td1 = document.createElement('td');
    td1.innerText = compLexico.numeroLinea;

    let td2 = document.createElement('td');
    td2.innerText = compLexico.token;

    let td3 = document.createElement('td');
    td3.innerText = compLexico.lexema;

    row.append(td1);
    row.append(td2);
    row.append(td3);
    tabla_tokens.append( row);
}


//_____________________
//  METODO QUE AGREGA SIMBOLOS
//  A LA TABLA DE ENTRADA LEXICO
//_____________________
function addEntradaLexico( simbolos = "" )
{
    limpiarTabla( tabla_entradaLexico );
    for( let i=0;  i<simbolos.length;  i++ )
    {
        let columna = document.createElement('td');
        columna.innerText = simbolos.charAt(i);
        tabla_entradaLexico.append( columna );
    }
}

//_____________________
//  METODO QUE AGREGA TOKENS
//  A LA TABLA DE ENTRADA SINTACTICO
//  O SEMANTICO QUE SE INDIQUE
//_____________________
function setTablaEntradaSinSem(  tablaEntrada = document.createElement( "tr" )  ,
    tokens = [ new ComponenteLexico() ] , pintarCeldasIniciales = false )
{
    limpiarTabla( tablaEntrada );
    for( let i=0;  i<tokens.length;  i++ )
    {
        let columna = document.createElement('td');
        if( pintarCeldasIniciales == true && i<2 ) {  columna.classList.add('rowVerde');  }

        let div_celda = document.createElement('div');

        let label_token = document.createElement('label');
        label_token.classList.add('celda_token');
        label_token.innerText = tokens[i].token;

        let label_lexema = document.createElement('label');
        label_lexema.classList.add('celda_lexema');
        label_lexema.innerText = tokens[i].lexema;

        div_celda.append( label_token );
        div_celda.append( label_lexema );

        columna.append( div_celda );
        tablaEntrada.append( columna );
    }
}


//_____________________
//  METODO QUE AGREGA TOKENS
//  A LA TABLA DE COLUMNAS ARBOL
//_____________________
function setTablaHorizontalArbol(  tablaH = document.createElement( "tr" )  ,
    tokens = [ new ComponenteLexico() ] , pintarCeldaInicial = false )
{
    limpiarTabla( tablaH );
    for( let i=0;  i<tokens.length;  i++ )
    {
        let columna = document.createElement('td');
        if( pintarCeldaInicial == true && i<1 ) {  columna.classList.add('rowVerde');  }

        let div_celda = document.createElement('div');

        let label_token = document.createElement('label');
        label_token.classList.add('celda_token');
        label_token.innerText = tokens[i].token;

        let label_lexema = document.createElement('label');
        label_lexema.classList.add('celda_lexema');
        label_lexema.innerText = tokens[i].lexema;

        div_celda.append( label_token );
        div_celda.append( label_lexema );

        columna.append( div_celda );
        tablaH.append( columna );
    }
}


//_____________________
//  METODO QUE AGREGA ItemsProduccion
//  A LA TABLA PILA QUE SE INDIQUE
//_____________________
function setTablaPilaArbol(  tablaPila = document.createElement( "tbody" )  ,
    items = [ new ComponenteLexico() ] )
{
    limpiarTabla( tablaPila );
    for( let i=items.length-1;  i>=0;  i-- )
    {
        let renglon = document.createElement('tr');
        renglon.classList.add('center');
        renglon.classList.add('aligned');
        //if( items[i].tipo == ItemProduccion.NO_TERMINAL ) {  renglon.classList.add('rowVerde');  }

        let td = document.createElement('td');
        renglon.append(td);

        let div_celda = document.createElement('div');
        td.append( div_celda );

        let label_token = document.createElement('label');
        label_token.classList.add('celda_token');
        label_token.innerText = items[i].lexema;

        let label_lexema = document.createElement('label');
        label_lexema.classList.add('celda_lexema');
        label_lexema.innerText = items[i].tipoDato;

        div_celda.append( label_token );
        div_celda.append( label_lexema );
        tablaPila.append( renglon );
    }
}



//_____________________
//  METODO QUE AGREGA ItemsProduccion
//  A LA TABLA PILA QUE SE INDIQUE
//_____________________
function setTablaPilaSinSem(  tablaPila = document.createElement( "tr" )  ,
    items = [ new ItemProduccion() ] )
{
    limpiarTabla( tablaPila );
    for( let i=items.length-1;  i>=0;  i-- )
    {
        let renglon = document.createElement('tr');
        renglon.classList.add('center');
        renglon.classList.add('aligned');
        if( items[i].tipo == ItemProduccion.NO_TERMINAL ) {  renglon.classList.add('rowVerde');  }

        let td = document.createElement('td');
        renglon.append(td);

        let div_celda = document.createElement('div');
        td.append( div_celda );

        let label_token = document.createElement('label');
        label_token.classList.add('celda_token');
        label_token.innerText = items[i].token;

        let label_lexema = document.createElement('label');
        label_lexema.classList.add('celda_lexema');
        label_lexema.innerText = items[i].lexema;

        div_celda.append( label_token );
        div_celda.append( label_lexema );
        tablaPila.append( renglon );
    }
}


//_____________________
//  METODO QUE AGREGA LOS 
//  ROWS DEBUG LEXICO
//_____________________
function cargarDebugLexico( idError = 0 )
{
    limpiarTabla( tabla_debugLexico );
    addEntradaLexico( "" );
    let erroresEncontrados = 0;
    for( let i=0;  i<afd.debug.length;  i++ )
    {
        let itemDebug = afd.debug[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');
        row.onclick = () => 
        {
            addEntradaLexico( itemDebug.entradaRestante );
            // limpiar row anterior
            for( let i=0;  i<tabla_debugLexico.childElementCount;  i++ )
            {
                let renglon = tabla_debugLexico.children[i];
                for( let k=0; k<renglon.childElementCount;  k++ )
                {
                    renglon.children[k].classList.remove('bordeRojo');
                }
            }
            for( let i=0; i<row.childElementCount;  i++ )
            {
                row.children[i].classList.add('bordeRojo');
            }
        }

        let td1 = document.createElement('td');
        td1.innerText = itemDebug.simboloActual;

        let td2 = document.createElement('td');
        td2.innerText = itemDebug.lexemaInicial;

        let td3 = document.createElement('td');
        td3.innerText = itemDebug.estadoActual;

        let td4 = document.createElement('td');
        td4.innerText = itemDebug.sigEstado;

        let td5 = document.createElement('td');
        td5.innerText = itemDebug.lexemaFinal;

        let td6 = document.createElement('td');
        td6.innerText = itemDebug.tokenEcontrado;
        switch( itemDebug.tipoToken )
        {
            case 'ERROR':  td6.classList.add( "rowRojo" );
            case 'OK': td6.classList.add( "rowVerde" );
        }
        
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);
        row.append(td5);
        row.append(td6);
        tabla_debugLexico.append(row);

        if( itemDebug.tipoToken == 'ERROR' ){  erroresEncontrados++; }
        if( erroresEncontrados == idError ){ break; }
    }
}



//_____________________
//  METODO QUE AGREGA LOS 
//  ROWS DEBUG LEXICO
//_____________________
function cargarDebugSintactico( idError = 0 )
{
    limpiarTabla( tabla_debugSintactico );
    limpiarTabla( tabla_entradaI_sintactico );
    limpiarTabla( tabla_entradaF_sintactico );
    limpiarTabla( tabla_pilaI_sintactico );
    limpiarTabla( tabla_pilaF_sintactico );
    let erroresEncontrados = 0;
    for( let i=0;  i<ass.debug.length;  i++ )
    {
        let itemDebug = ass.debug[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');
        row.onclick = () => 
        {
            setTablaEntradaSinSem( tabla_entradaI_sintactico , itemDebug.entradaI , true );
            setTablaEntradaSinSem( tabla_entradaF_sintactico , itemDebug.entradaF , false );
            setTablaPilaSinSem( tabla_pilaI_sintactico , itemDebug.pilaI );
            setTablaPilaSinSem( tabla_pilaF_sintactico , itemDebug.pilaF );
            // limpiar row anterior
            for( let k=0;  k<tabla_debugSintactico.childElementCount;  k++ )
            {
                let renglon = tabla_debugSintactico.children[k];
                for( let w=0; w<renglon.childElementCount;  w++ )
                {
                    renglon.children[w].classList.remove('bordeRojo');
                }
            }
            for( let k=0; k<row.childElementCount;  k++ )
            {
                row.children[k].classList.add('bordeRojo');
            }
        }

        let td1 = document.createElement('td');
        td1.innerText = itemDebug.accion;

        let td2 = document.createElement('td');
        td2.innerText = itemDebug.mensajeError.descripcion;
        if( itemDebug.mensajeError.descripcion != "" ) {  td2.classList.add( "rowRojo" );  }
        
        row.append(td1);
        row.append(td2);
        tabla_debugSintactico.append(row);

        if( itemDebug.mensajeError.descripcion != "" ){  erroresEncontrados++; }
        if( erroresEncontrados == idError ){ break; }
    }
}



//_____________________
//  METODO QUE AGREGA LOS 
//  ROWS DEBUG LEXICO
//_____________________
function cargarDebugSemantico( idError = 0 )
{
    limpiarTabla( tabla_debugSemantico );
    limpiarTabla( tabla_entradaI_semantico );
    limpiarTabla( tabla_entradaF_semantico );
    limpiarTabla( tabla_pilaI_semantico );
    limpiarTabla( tabla_pilaF_semantico );
    let erroresEncontrados = 0;
    for( let i=0;  i<sem.accion.debug.length;  i++ )
    {
        let itemDebug = sem.accion.debug[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');
        row.onclick = () => 
        {
            setTablaEntradaSinSem( tabla_entradaI_semantico , itemDebug.entradaI , true );
            setTablaEntradaSinSem( tabla_entradaF_semantico , itemDebug.entradaF , false );
            setTablaPilaSinSem( tabla_pilaI_semantico , itemDebug.pilaI );
            setTablaPilaSinSem( tabla_pilaF_semantico , itemDebug.pilaF );
            // limpiar row anterior
            for( let k=0;  k<tabla_debugSemantico.childElementCount;  k++ )
            {
                let renglon = tabla_debugSemantico.children[k];
                for( let w=0; w<renglon.childElementCount;  w++ )
                {
                    renglon.children[w].classList.remove('bordeRojo');
                }
            }
            for( let k=0; k<row.childElementCount;  k++ )
            {
                row.children[k].classList.add('bordeRojo');
            }
        }

        let td1 = document.createElement('td');
        td1.innerText = itemDebug.movimiento

        let td2 = document.createElement('td');
        td2.innerText = itemDebug.accion

        let td3 = document.createElement('td');
        td3.innerText = itemDebug.mensajeError.descripcion;
        if( itemDebug.mensajeError.descripcion != "" ) {  td3.classList.add( "rowRojo" );  }

        // BOTON VER TABLAS
        let td4 = document.createElement('td');
        td4.classList.add('celda_icono');
        if( itemDebug.mostrarTS == true )
        {
            let i4 = document.createElement('i');
            i4.classList.add('fas');
            i4.classList.add('fa-clipboard-list');
            td4.append(i4);

            i4.onclick = () =>
            {
                limpiarTabla( combo_TS );
                let opcion1 = document.createElement('option');
                opcion1.value = "v";
                opcion1.innerText = "Variables";
                combo_TS.append( opcion1 );

                let opcion2 = document.createElement('option');
                opcion2.value = "f";
                opcion2.innerText = "Funciones";
                combo_TS.append( opcion2 );

                let opcion3 = document.createElement('option');
                opcion3.value = "p";
                opcion3.innerText = "Pines";
                combo_TS.append( opcion3 );

                cargarTablaVariablesTS( itemDebug.tablaV );
                $(menu_lateral_tablaSimbolos).sidebar("toggle");

                combo_TS.onchange = () =>
                {
                    switch( combo_TS.value )
                    {
                        case "p": cargarTablaPinesTS( itemDebug.tablaP ); break;
                        case "v": cargarTablaVariablesTS( itemDebug.tablaV );   break;
                        case "f": cargarTablaFuncionesTS( itemDebug.tablaF );  break;
                    }
                };
            };
        }

        // BOTON VER ARBOL
        let td5 = document.createElement('td');
        td5.classList.add('celda_icono');
        if( itemDebug.mostrarArbol == true )
        {
            let i5 = document.createElement('i');
            i5.classList.add('fas');
            i5.classList.add('fa-project-diagram');
            td5.append(i5);

            i5.onclick = () =>
            {
                cargarDebugArbol( itemDebug.arbol );
                $(menu_lateral_arbol).sidebar("show");
            };
        }
        
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);
        row.append(td5);
        tabla_debugSemantico.append(row);

        if( itemDebug.mensajeError.descripcion != "" ){  erroresEncontrados++; }
        if( erroresEncontrados == idError ){ break; }
    }
}



//_____________________
//  METODO QUE AGREGA LOS 
//  ROWS DEBUG ARBOL
//_____________________
function cargarDebugArbol( arbol = new ArbolDeExpresion() )
{
    limpiarTabla( div_arbol );
    limpiarTabla( tabla_posfijo_arbol );
    limpiarTabla( tabla_debugArbol );
    limpiarTabla( tabla_pilaI_arbol );
    limpiarTabla( tabla_pilaF_arbol );

    setTablaHorizontalArbol( tabla_expresion_arbol , arbol.expresionEntrada , false );
    setTablaHorizontalArbol( tabla_prefijo_arbol , arbol.notacionPrefija , false );
    arbol.mostrarArbol( arbol.raiz , div_arbol );

    for( let i=0;  i<arbol.debug.length;  i++ )
    {
        let itemDebug = arbol.debug[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');
        row.onclick = () => 
        {
            setTablaHorizontalArbol( tabla_posfijo_arbol , itemDebug.notacionPos , true );
            setTablaPilaArbol( tabla_pilaI_arbol , itemDebug.pilaI );
            setTablaPilaArbol( tabla_pilaF_arbol , itemDebug.pilaF );
            // limpiar row anterior
            for( let k=0;  k<tabla_debugArbol.childElementCount;  k++ )
            {
                let renglon = tabla_debugArbol.children[k];
                for( let w=0; w<renglon.childElementCount;  w++ )
                {
                    renglon.children[w].classList.remove('bordeRojo');
                }
            }
            for( let k=0; k<row.childElementCount;  k++ )
            {
                row.children[k].classList.add('bordeRojo');
            }
        }

        let td1 = document.createElement('td');
        td1.innerText = itemDebug.accionR
        
        row.append(td1);
        tabla_debugArbol.append(row);
    }
}



//_____________________
//  METODO QUE MUESTRA LA TABLA
//  DE PINES EN LA TABLA TS
//_____________________
function cargarTablaPinesTS( listaP = [ new SimboloPin() ] )
{
    limpiarTabla( TS_columnas );
    limpiarTabla( TS_renglones );
    let th1 = document.createElement('th');
    th1.innerText = "Numero de Linea";

    let th2 = document.createElement('th');
    th2.innerText = "Referencia";

    let th3 = document.createElement('th');
    th3.innerText = "Numero de pin";

    let th4 = document.createElement('th');
    th4.innerText = "Tipo";

    TS_columnas.append(th1);
    TS_columnas.append(th2);
    TS_columnas.append(th3);
    TS_columnas.append(th4);

    for( let i=0;  i<listaP.length;  i++ )
    {
        let pin = listaP[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');

        let td1 = document.createElement('td');
        td1.innerText = pin.numeroLinea;

        let td2 = document.createElement('td');
        td2.innerText = pin.nombre;

        let td3 = document.createElement('td');
        td3.innerText = pin.numeroPin;

        let td4 = document.createElement('td');
        if( pin.tipoPin == SimboloPin.ENTRADA ){ td4.innerText = "Entrada"; }
        else{ td4.innerText = "Salida"; }
        
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);
        TS_renglones.append(row);
    }
}



//_____________________
//  METODO QUE MUESTRA LA TABLA
//  DE VARIABLES EN LA TABLA TS
//_____________________
function cargarTablaVariablesTS( listaV = [ new SimboloVariable() ] )
{
    limpiarTabla( TS_columnas );
    limpiarTabla( TS_renglones );

    let th1 = document.createElement('th');
    th1.innerText = "Numero de Linea";

    let th2 = document.createElement('th');
    th2.innerText = "Ambito";

    let th3 = document.createElement('th');
    th3.innerText = "Nombre";

    let th4 = document.createElement('th');
    th4.innerText = "Tipo de Dato";

    let th5 = document.createElement('th');
    th5.innerText = "Valor";

    TS_columnas.append(th1);
    TS_columnas.append(th2);
    TS_columnas.append(th3);
    TS_columnas.append(th4);
    TS_columnas.append(th5);

    for( let i=0;  i<listaV.length;  i++ )
    {
        let variable = listaV[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');

        let td1 = document.createElement('td');
        td1.innerText = variable.numeroLinea;

        let td2 = document.createElement('td');
        td2.innerText = variable.getAmbito()

        let td3 = document.createElement('td');
        td3.innerText = variable.nombre

        let td4 = document.createElement('td');
        td4.innerText = variable.tipoDato;

        let td5 = document.createElement('td');
        td5.innerText = variable.getValor();
        
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);
        row.append(td5);
        TS_renglones.append(row);
    }
}


//_____________________
//  METODO QUE MUESTRA LA TABLA
//  DE VARIABLES EN LA TABLA TS
//_____________________
function cargarTablaFuncionesTS( listaF = [ new SimboloFuncion() ] )
{
    limpiarTabla( TS_columnas );
    limpiarTabla( TS_renglones );

    let th1 = document.createElement('th');
    th1.innerText = "Numero de Linea";

    let th2 = document.createElement('th');
    th2.innerText = "Nombre";

    let th3 = document.createElement('th');
    th3.innerText = "Tipo de Retorno";

    let th4 = document.createElement('th');
    th4.innerText = "Parametros";

    TS_columnas.append(th1);
    TS_columnas.append(th2);
    TS_columnas.append(th3);
    TS_columnas.append(th4);

    for( let i=0;  i<listaF.length;  i++ )
    {
        let funcion = listaF[i];
        let row = document.createElement('tr');
        row.classList.add('center');
        row.classList.add('aligned');

        let td1 = document.createElement('td');
        td1.innerText = funcion.numeroLinea

        let td2 = document.createElement('td');
        td2.innerText = funcion.nombre

        let td3 = document.createElement('td');
        td3.innerText = funcion.tipoRetorno

        let td4 = document.createElement('td');
        td4.innerText = funcion.getParametros();
        
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);
        TS_renglones.append(row);
    }
}



//_____________________
//  METODO QUE MUESTRA EL DEBUG EN LA 
//  GENERACION DE CODIGO INTERMEDIO
//_____________________
function mostrarDebugCodIntermedio()
{
    if( modalCod_abierto == true ) { return }
    modalCod_abierto = true
    limpiarTabla( tablaInstruccion_codIntermedio );
    limpiarTabla( tablaCuadruplos_codIntermedio );
    console.clear()
    for( let i=0;  i<codIntermedio.accion.debug.length;  i++ )
    {
        let itemDebug = codIntermedio.accion.debug[i];
        
        // AGREGAR A LA TABLA DE INSTRUCCIONES
        let rowI = document.createElement('div')
        rowI.classList.add('row_tabla')

        let datoI = document.createElement('div')
        datoI.classList.add('columna_completa')
        datoI.classList.add('dato_celda2')
        datoI.innerText = itemDebug.lineaCodigo

        rowI.appendChild( datoI )
        tablaInstruccion_codIntermedio.appendChild( rowI )

        // AGREGAR EVENTO CLICK
        datoI.onclick = () =>
        {
            seleccionarColumna( tablaInstruccion_codIntermedio , datoI )
            limpiarTabla( tablaCuadruplos_codIntermedio )
            limpiarReferenciasGOTO()
            for( let k=0;  k<itemDebug.listaCuadruplos.length;  k++)
            {
                let cuadruplo = itemDebug.listaCuadruplos[k]
                
                let rowC = document.createElement('div')
                rowC.classList.add('row_tabla')

                //___________
                // OPERADOR
                //___________
                let datoOperador = document.createElement('div')
                datoOperador.classList.add('columna_operador')
                datoOperador.classList.add('dato_celda')
                datoOperador.innerText = cuadruplo.operador.lexema
                rowC.appendChild( datoOperador )

                $(datoOperador).popup({
                    popup: popup_linea ,
                    duration: 100 , 
                    exclusive: true , 
                    closable: false ,
                    on: 'manual' ,
                    position: 'top center'
                });

                datoOperador.onclick = () => {
                    if( cuadruplo.operador.numeroLinea == 0 ){ popupLinea_textoNum.innerText = "N/A" }
                    else{ popupLinea_textoNum.innerText = cuadruplo.operador.numeroLinea }
                    $(datoOperador).popup('toggle'); 
                };

                datoOperador.onmouseout = () => {
                    $(datoOperador).popup('hide'); 
                }

                //___________
                // OPERANDO 1
                //___________
                let datoOperando1 = document.createElement('div')
                datoOperando1.classList.add('columna_operando1')
                datoOperando1.classList.add('dato_celda')
                try{ datoOperando1.innerText = cuadruplo.operando1.lexema }
                catch( ERROR ){ datoOperando1.innerText = "null" }
                rowC.appendChild( datoOperando1 )

                $(datoOperando1).popup({
                    popup: popup_linea ,
                    duration: 100 , 
                    exclusive: true , 
                    closable: false ,
                    on: 'manual' ,
                    position: 'top center'
                });

                datoOperando1.onclick = () => {
                    try{  
                        if( cuadruplo.operando1.numeroLinea == 0 ){ popupLinea_textoNum.innerText = "N/A" }
                        else{ popupLinea_textoNum.innerText = cuadruplo.operando1.numeroLinea  }
                        $(datoOperando1).popup('toggle');  
                        limpiarReferenciasGOTO()
                        setReferenciaGOTO( cuadruplo.operando1.lexema , datoOperando1 )
                    }
                    catch( ERROR ){ popupLinea_textoNum.innerText = "N/A" }
                };

                datoOperando1.onmouseout = () => {
                    $(datoOperando1).popup('hide'); 
                }

                //___________
                // OPERANDO 2
                //___________
                let datoOperando2 = document.createElement('div')
                datoOperando2.classList.add('columna_operando2')
                datoOperando2.classList.add('dato_celda')
                try{  datoOperando2.innerText = cuadruplo.operando2.lexema }
                catch( ERROR ){ datoOperando2.innerText = "null" }
                rowC.appendChild( datoOperando2 )

                $(datoOperando2).popup({
                    popup: popup_linea ,
                    duration: 100 , 
                    exclusive: true , 
                    closable: false ,
                    on: 'manual' ,
                    position: 'top center'
                });

                datoOperando2.onclick = () => {
                    try{  
                        if( cuadruplo.operando2.numeroLinea == 0 ){ popupLinea_textoNum.innerText = "N/A" }
                        else{ popupLinea_textoNum.innerText = cuadruplo.operando2.numeroLinea  } 
                        $(datoOperando2).popup('toggle'); 
                        limpiarReferenciasGOTO()
                        setReferenciaGOTO( cuadruplo.operando2.lexema , datoOperando2 )
                    }
                    catch( ERROR ){ popupLinea_textoNum.innerText = " " }
                };

                datoOperando2.onmouseout = () => {
                    $(datoOperando2).popup('hide'); 
                }

                //___________
                // RESULTADO
                //___________
                //console.log( cuadruplo.resultado )
                let datoResultado = document.createElement('div')
                datoResultado.classList.add('columna_resultado')
                datoResultado.classList.add('dato_celda')
                datoResultado.innerText = cuadruplo.resultado.clave
                rowC.appendChild( datoResultado )

                $(datoResultado).popup({
                    popup: popup_resultadoCuadruplo ,
                    duration: 100 , 
                    exclusive: true , 
                    closable: false ,
                    on: 'manual' ,
                    position: 'top center'
                });

                datoResultado.onclick = () => {
                    //console.log( cuadruplo.resultado.getTipo() )
                    popupResultado_tipo.innerText = cuadruplo.resultado.getTipo()
                    popupResultado_ambito.innerText = cuadruplo.resultado.getAmbito()
                    popupResultado_bloque.innerText = cuadruplo.resultado.getBloque()
                    popupResultado_tipoDato.innerText = cuadruplo.resultado.tipoDato
                    popupResultado_ID.innerText = cuadruplo.resultado.ID
                    popupResultado_GOTO.innerText = cuadruplo.resultado.refGOTO
                    popupResultado_funcion.innerText = 
                        cuadruplo.resultado.funcion.nombre + cuadruplo.resultado.funcion.getTiposParametros()
                    popupResultado_callFuncion.innerText = 
                    cuadruplo.resultado.callFuncion.nombre + cuadruplo.resultado.callFuncion.getTiposParametros()
                    $(datoResultado).popup('toggle'); 

                    // SI EL TIPO ES GOTO -> PINTAR LA REFERENCIA ENTRE TABLAS
                    limpiarReferenciasGOTO()
                    if( cuadruplo.resultado.tipo == ResultadoCuadruplo.TIPO_GOTO ||
                        cuadruplo.resultado.tipo == ResultadoCuadruplo.TIPO_LLAMADA_FUNCION )
                    {
                        setReferenciaGOTO( cuadruplo.resultado.refGOTO , datoResultado )
                    }
                };

                datoResultado.onmouseout = () => {
                    $(datoResultado).popup('hide'); 
                }

                tablaCuadruplos_codIntermedio.appendChild( rowC )
            }
        };
    }
}



//_____________________
//  METODO QUE MUESTRA EL DEBUG EN LA 
//  GENERACION DE CODIGO INTERMEDIO
//_____________________
function mostrarDebugCodIntermedioOp()
{
    if( modalCodOp_abierto == true ) { return }
    modalCodOp_abierto = true
    limpiarTabla( combo_InstruccionCodOp );
    console.clear()
    for( let i=0;  i<codIntermedioOp.listaInstruccionesOptimizado.length;  i++ )
    {
        let itemDebug = codIntermedioOp.listaInstruccionesOptimizado[i]
        // MANDAR INSTRUCCION AL COMBO
        let option = document.createElement('option')
        option.innerText = "(" + (i+1) + ")   " + itemDebug.lineaCodigo
        option.value = "i"+(i+1)
        combo_InstruccionCodOp.append( option )
    }
}


//_____________________
//  METODO QUE LLENA LAS TABLAS DEL DEBUG 
//  DE LA GENERACION DE CODIGO INTERMEDIO OPTIMIZADO
//_____________________
function llenarTablasCodIntermedioOp( posicion = -1)
{
    if( modalCodOp_abierto == true ) { return }
    limpiarTabla( codIntermedioOp_tablaOriginal );
    limpiarTabla( codIntermedioOp_tablaOp );
    console.clear()
    //__________________________________________
    // LLENAR TABLA DE CUADRUPLOS ORIGINAL
    //__________________________________________
    let listaC_original = codIntermedioOp.listaInstrucciones[posicion].listaCuadruplos 
    for( let k=0;  k<listaC_original.length;  k++)
    {
        let cuadruplo = listaC_original[k]

        let rowC = document.createElement('div')
        rowC.classList.add('row_tabla')

        //___________
        // OPERADOR
        //___________
        let datoOperador = document.createElement('div')
        datoOperador.classList.add('columna_operador')
        datoOperador.classList.add('dato_celda')
        datoOperador.innerText = cuadruplo.operador.lexema
        rowC.appendChild( datoOperador )

        //___________
        // OPERANDO 1
        //___________
        let datoOperando1 = document.createElement('div')
        datoOperando1.classList.add('columna_operando1')
        datoOperando1.classList.add('dato_celda')
        try{ datoOperando1.innerText = cuadruplo.operando1.lexema }
        catch( ERROR ){ datoOperando1.innerText = "null" }
        rowC.appendChild( datoOperando1 )

        //___________
        // OPERANDO 2
        //___________
        let datoOperando2 = document.createElement('div')
        datoOperando2.classList.add('columna_operando2')
        datoOperando2.classList.add('dato_celda')
        try{  datoOperando2.innerText = cuadruplo.operando2.lexema }
        catch( ERROR ){ datoOperando2.innerText = "null" }
        rowC.appendChild( datoOperando2 )

        //___________
        // RESULTADO
        //___________
        let datoResultado = document.createElement('div')
        datoResultado.classList.add('columna_resultado')
        datoResultado.classList.add('dato_celda')
        datoResultado.innerText = cuadruplo.resultado.clave
        rowC.appendChild( datoResultado )

        codIntermedioOp_tablaOriginal.appendChild( rowC )
    } // for


    //__________________________________________
    // LLENAR TABLA DE CUADRUPLOS OPTIMIZADO
    //__________________________________________
    let listaC_optimizada = codIntermedioOp.listaInstruccionesOptimizado[posicion].listaCuadruplos
    for( let k=0;  k<listaC_optimizada.length;  k++)
    {
        let cuadruplo = listaC_optimizada[k]

        let rowC = document.createElement('div')
        rowC.classList.add('row_tabla')

        //___________
        // OPERADOR
        //___________
        let datoOperador = document.createElement('div')
        datoOperador.classList.add('columna_operador')
        datoOperador.classList.add('dato_celda')
        datoOperador.innerText = cuadruplo.operador.lexema
        rowC.appendChild( datoOperador )

        $(datoOperador).popup({
            popup: popup_linea ,
            duration: 100 , 
            exclusive: true , 
            closable: false ,
            on: 'manual' ,
            position: 'top center'
        });

        datoOperador.onclick = () => {
            if( cuadruplo.operador.numeroLinea == 0 ){ popupLinea_textoNum.innerText = "N/A" }
            else{ popupLinea_textoNum.innerText = cuadruplo.operador.numeroLinea }
            $(datoOperador).popup('toggle'); 
        };

        datoOperador.onmouseout = () => {
            $(datoOperador).popup('hide'); 
        }

        //___________
        // OPERANDO 1
        //___________
        let datoOperando1 = document.createElement('div')
        datoOperando1.classList.add('columna_operando1')
        datoOperando1.classList.add('dato_celda')
        try{ datoOperando1.innerText = cuadruplo.operando1.lexema }
        catch( ERROR ){ datoOperando1.innerText = "null" }
        rowC.appendChild( datoOperando1 )

        $(datoOperando1).popup({
            popup: popup_linea ,
            duration: 100 , 
            exclusive: true , 
            closable: false ,
            on: 'manual' ,
            position: 'top center'
        });

        datoOperando1.onclick = () => {
            try{  
                if( cuadruplo.operando1.numeroLinea == 0 ){ popupLinea_textoNum.innerText = "N/A" }
                else{ popupLinea_textoNum.innerText = cuadruplo.operando1.numeroLinea  }
                $(datoOperando1).popup('toggle');  
                limpiarReferenciasGOTO()
                setReferenciaGOTO( cuadruplo.operando1.lexema , datoOperando1 )
            }
            catch( ERROR ){ popupLinea_textoNum.innerText = "N/A" }
        };

        datoOperando1.onmouseout = () => {
            $(datoOperando1).popup('hide'); 
        }

        //___________
        // OPERANDO 2
        //___________
        let datoOperando2 = document.createElement('div')
        datoOperando2.classList.add('columna_operando2')
        datoOperando2.classList.add('dato_celda')
        try{  datoOperando2.innerText = cuadruplo.operando2.lexema }
        catch( ERROR ){ datoOperando2.innerText = "null" }
        rowC.appendChild( datoOperando2 )

        $(datoOperando2).popup({
            popup: popup_linea ,
            duration: 100 , 
            exclusive: true , 
            closable: false ,
            on: 'manual' ,
            position: 'top center'
        });

        datoOperando2.onclick = () => {
            try{  
                if( cuadruplo.operando2.numeroLinea == 0 ){ popupLinea_textoNum.innerText = "N/A" }
                else{ popupLinea_textoNum.innerText = cuadruplo.operando2.numeroLinea  } 
                $(datoOperando2).popup('toggle'); 
                limpiarReferenciasGOTO()
                setReferenciaGOTO( cuadruplo.operando2.lexema , datoOperando2 )
            }
            catch( ERROR ){ popupLinea_textoNum.innerText = " " }
        };

        datoOperando2.onmouseout = () => {
            $(datoOperando2).popup('hide'); 
        }

        //___________
        // RESULTADO
        //___________
        //console.log( cuadruplo.resultado )
        let datoResultado = document.createElement('div')
        datoResultado.classList.add('columna_resultado')
        datoResultado.classList.add('dato_celda')
        datoResultado.innerText = cuadruplo.resultado.clave
        rowC.appendChild( datoResultado )

        $(datoResultado).popup({
            popup: popup_resultadoCuadruplo ,
            duration: 100 , 
            exclusive: true , 
            closable: false ,
            on: 'manual' ,
            position: 'top center'
        });

        datoResultado.onclick = () => {
            //console.log( cuadruplo.resultado.getTipo() )
            popupResultado_tipo.innerText = cuadruplo.resultado.getTipo()
            popupResultado_ambito.innerText = cuadruplo.resultado.getAmbito()
            popupResultado_bloque.innerText = cuadruplo.resultado.getBloque()
            popupResultado_tipoDato.innerText = cuadruplo.resultado.tipoDato
            popupResultado_ID.innerText = cuadruplo.resultado.ID
            popupResultado_GOTO.innerText = cuadruplo.resultado.refGOTO
            popupResultado_funcion.innerText = 
                cuadruplo.resultado.funcion.nombre + cuadruplo.resultado.funcion.getTiposParametros()
            popupResultado_callFuncion.innerText = 
                cuadruplo.resultado.callFuncion.nombre + cuadruplo.resultado.callFuncion.getTiposParametros()    
            $(datoResultado).popup('toggle'); 

            // SI EL TIPO ES GOTO -> PINTAR LA REFERENCIA ENTRE TABLAS
            /*limpiarReferenciasGOTO()
            if( cuadruplo.resultado.tipo == ResultadoCuadruplo.TIPO_GOTO ||
                cuadruplo.resultado.tipo == ResultadoCuadruplo.TIPO_LLAMADA_FUNCION )
            {
                setReferenciaGOTO( cuadruplo.resultado.refGOTO , datoResultado )
            }*/
        };

        datoResultado.onmouseout = () => {
            $(datoResultado).popup('hide'); 
        }

        if( cuadruplo.estatus == Cuadruplo.OMITIR )
        {
            datoOperador.classList.add('cuadruploEliminado')
            datoOperando1.classList.add('cuadruploEliminado')
            datoOperando2.classList.add('cuadruploEliminado')
            datoResultado.classList.add('cuadruploEliminado')
        }
        codIntermedioOp_tablaOp.appendChild( rowC )
    } // for
}


//_____________________
//  METODO QUE MUESTRA EL DEBUG EN LA 
//  GENERACION DE CODIGO OBJETO
//_____________________
function establecerComboCodObjeto()
{
    if( modalCodObj_abierto == true ) { return }
    modalCodObj_abierto = true
    limpiarTabla( combo_InstruccionCodObjeto );
    console.clear()

    for( let i=0;  i<codIntermedioOp.listaInstruccionesOptimizado.length;  i++ )
    {
        let itemDebug = codIntermedioOp.listaInstruccionesOptimizado[i]

        // MANDAR INSTRUCCION AL COMBO
        let option = document.createElement('option')
        option.innerText = "(" + (i+1) + ")   " + itemDebug.lineaCodigo
        option.value = "i"+(i+1)
        combo_InstruccionCodObjeto.append( option )
    }
}


//_____________________
//  METODO QUE LLENA LAS TABLAS DEL DEBUG 
//  DE LA GENERACION DE CODIGO INTERMEDIO OPTIMIZADO
//_____________________
function llenarTablasCodObjeto( posicion = -1 )
{
    if( modalCodObj_abierto == true ) { return }
    limpiarTabla( codObjeto_tablaCodOptimizado );
    limpiarTabla( codObjeto_tablaArduino );
    console.clear()

    //__________________________________________
    // LLENAR TABLA DE CUADRUPLOS OPTIMIZADO
    //__________________________________________
    let listaC_optimizada = codIntermedioOp.listaInstruccionesOptimizado[posicion].listaCuadruplos
    for( let k=0;  k<listaC_optimizada.length;  k++)
    {
        let cuadruplo = listaC_optimizada[k]
        if( cuadruplo.estatus == Cuadruplo.OMITIR ) {  continue  }

        let rowC = document.createElement('div')
        rowC.classList.add('row_tabla')

        //___________
        // OPERADOR
        //___________
        let datoOperador = document.createElement('div')
        datoOperador.classList.add('columna_operador')
        datoOperador.classList.add('dato_celda')
        datoOperador.innerText = cuadruplo.operador.lexema
        rowC.appendChild( datoOperador )

        //___________
        // OPERANDO 1
        //___________
        let datoOperando1 = document.createElement('div')
        datoOperando1.classList.add('columna_operando1')
        datoOperando1.classList.add('dato_celda')
        try{ datoOperando1.innerText = cuadruplo.operando1.lexema }
        catch( ERROR ){ datoOperando1.innerText = "null" }
        rowC.appendChild( datoOperando1 )

        //___________
        // OPERANDO 2
        //___________
        let datoOperando2 = document.createElement('div')
        datoOperando2.classList.add('columna_operando2')
        datoOperando2.classList.add('dato_celda')
        try{  datoOperando2.innerText = cuadruplo.operando2.lexema }
        catch( ERROR ){ datoOperando2.innerText = "null" }
        rowC.appendChild( datoOperando2 )

        //___________
        // RESULTADO
        //___________
        let datoResultado = document.createElement('div')
        datoResultado.classList.add('columna_resultado')
        datoResultado.classList.add('dato_celda')
        datoResultado.innerText = cuadruplo.resultado.clave
        rowC.appendChild( datoResultado )

        $(datoResultado).popup({
            popup: popup_resultadoCuadruplo ,
            duration: 100 , 
            exclusive: true , 
            closable: false ,
            on: 'manual' ,
            position: 'top center'
        });

        datoResultado.onclick = () => {
            //console.log( cuadruplo.resultado.getTipo() )
            popupResultado_tipo.innerText = cuadruplo.resultado.getTipo()
            popupResultado_ambito.innerText = cuadruplo.resultado.getAmbito()
            popupResultado_bloque.innerText = cuadruplo.resultado.getBloque()
            popupResultado_tipoDato.innerText = cuadruplo.resultado.tipoDato
            popupResultado_ID.innerText = cuadruplo.resultado.ID
            popupResultado_GOTO.innerText = cuadruplo.resultado.refGOTO
            popupResultado_funcion.innerText = 
                cuadruplo.resultado.funcion.nombre + cuadruplo.resultado.funcion.getTiposParametros()
            popupResultado_callFuncion.innerText = 
                cuadruplo.resultado.callFuncion.nombre + cuadruplo.resultado.callFuncion.getTiposParametros()
                    
            $(datoResultado).popup('toggle'); 
        };

        datoResultado.onmouseout = () => {
            $(datoResultado).popup('hide'); 
        }

        codObjeto_tablaCodOptimizado.appendChild( rowC )
    } // for


    //__________________________________________
    // LLENAR TABLA DE CODIGO ARDUINO
    //__________________________________________
    let listaCodigosA = codObjeto.listaCodigoObjeto[posicion]
    for( let k=0;  k<listaCodigosA.length;  k++)
    {
        let codA = listaCodigosA[k]

        let rowC = document.createElement('div')
        rowC.classList.add('row_tabla')

        //___________
        // CLAVE
        //___________
        let datoClave = document.createElement('div')
        datoClave.classList.add('columna_clave')
        datoClave.classList.add('dato_celda')
        datoClave.innerText = codA.clave
        rowC.appendChild( datoClave )

        if( codA.estatus == CodigoArduino.OMITIR ){
            datoClave.classList.add('cuadruploEliminado')
        }

        //___________
        // SECUENCIA
        //___________
        let datoSecuencia = document.createElement('div')
        datoSecuencia.classList.add('columna_codigo')
        datoSecuencia.classList.add('dato_celda')
        pintarItemArduino( codA , datoSecuencia )
        rowC.appendChild( datoSecuencia )

        codObjeto_tablaArduino.appendChild( rowC )
    } // for
}



function pintarItemArduino( codA = new CodigoArduino() , divLinea = document.createElement('div') )
{
    for(let i=0;  i<codA.secuencia.length;  i++)
    {
        let item = codA.secuencia[i]
        let label = document.createElement('label')
        label.classList.add('estiloCodigo')
        label.style.whiteSpace = 'pre'
        label.innerText = " " + item.valor
        switch( item.estilo )
        {
            case ItemArduino.PALABRA_RESERVADA: 
                label.classList.add('PR_arduino');   break;
            case ItemArduino.ESPECIAL: 
                label.classList.add('especial_arduino');   break;
            case ItemArduino.LLAMADA_A_FUNCION: 
                label.classList.add('CALLmetodo_arduino');   break; 
        }
        divLinea.append( label )
    }
}



function mostrarCodigoArduino( instruccionesArduino = [ [ new ItemArduino() ] ] )
{
    limpiarTabla( div_codigoArduino )
    //alert( itemsArduino.length )
    for(let i=0;  i<instruccionesArduino.length;  i++)
    {
        let instruccion = instruccionesArduino[i]
        let linea = document.createElement('div')
        
        for(let k=0;  k<instruccion.length;  k++ )
        {
            let item = instruccion[k]
            let label = document.createElement('label')
            label.classList.add('estiloCodigo')
            label.style.whiteSpace = 'pre'
            label.innerText = " " + item.valor
            switch( item.estilo )
            {
                case ItemArduino.PALABRA_RESERVADA: 
                    label.classList.add('PR_arduino');   break;
                case ItemArduino.ESPECIAL: 
                    label.classList.add('especial_arduino');   break;
                case ItemArduino.LLAMADA_A_FUNCION: 
                    label.classList.add('CALLmetodo_arduino');   break; 
            }
            linea.append( label )
        }
        div_codigoArduino.append( linea )
    }

    div_codigoCoMic.innerText = div_editor.innerText
}































/*============================================================================
        EVENTOS DE LOS ELEMENTOS HTML
============================================================================== */
limpiarTabla( tabla_consolaErrores );
limpiarTabla( tabla_tokens );
limpiarTabla( tabla_debugLexico );
addEntradaLexico( "" );


boton_compilar.onclick = () => 
{

    codigoObjetoGenerado = false
    limpiarTabla( tabla_consolaErrores );
    limpiarTabla( tabla_tokens );
    modalLex_abierto = false
    modalSem_abierto = false
    modalSin_abierto = false
    modalCod_abierto = false
    modalCodOp_abierto = false
    modalCodObj_abierto = false
    $(menu_lateral_consolaErrores).sidebar('show');
    $(modal_cargando).modal('show');
    setTimeout( () => 
    { 
        lexico();
        sintactico();
        semantico();
        if( tabla_consolaErrores.childElementCount == 0 )
        {
            codigoIntermedio()
            codigoIntermedioOptimizado()
            codigoObjeto()
            mostrarCodigoArduino( codObjeto.getCodigoArduino() )
            addConsolaCorrecto( new ComponenteLexico( "" , "" , "" , 0 ) );
        }
        $(modal_cargando).modal('hide');  
    } , 2500 );
}


combo_InstruccionCodOp.onchange = () =>
{
    modalCodOp_abierto = false
    let cadPosicion = combo_InstruccionCodOp.value + ""
    let posicion = Number(cadPosicion.substring( 1 , cadPosicion.length )) - 1
    llenarTablasCodIntermedioOp(posicion)
    modalCodOp_abierto = true
};


combo_InstruccionCodObjeto.onchange = () =>
{
    let cadPosicion = combo_InstruccionCodObjeto.value + ""
    let posicion = Number(cadPosicion.substring( 1 , cadPosicion.length )) - 1
    modalCodObj_abierto = false
    llenarTablasCodObjeto(posicion)
    modalCodObj_abierto = true
};


combo_TS.onchange = () =>
{
    switch( combo_TS.value )
    {
        case "p": cargarTablaPinesTS( sem.accion.listaPines ); break;
        case "v": cargarTablaVariablesTS( sem.accion.listaVariables );   break;
        case "f": cargarTablaFuncionesTS( sem.accion.listaFunciones );  break;
        case "c": cargarTablaVariablesTS( sem.accion.listaConstantes );   break;
    }
};


//==========================================
// BOTONES DE LA VENTANA COMPILACION OK
//==========================================
botonLex_compilacionOK.onclick = () => {
    cargarDebugLexico( -1 );
    $(modal_compilacionOK).modal('hide');
    $(modal_lexico).modal('show');
};


botonSin_compilacionOK.onclick = () => {
    cargarDebugSintactico( -1 );
    $(modal_compilacionOK).modal('hide');
    $(modal_sintactico).modal('show');
};


botonSem_compilacionOK.onclick = () => {
    cargarDebugSemantico( -1 );
    $(modal_compilacionOK).modal('hide');
    $(modal_semantico).modal('show');
};


botonCod_compilacionOK.onclick = () => {
    mostrarDebugCodIntermedio()
    $(modal_compilacionOK).modal('hide')
    $(modal_codigoIntermedio).modal('show')
};


botonCodOp_compilacionOK.onclick = () => {
    llenarTablasCodIntermedioOp(0)
    mostrarDebugCodIntermedioOp()
    $(modal_compilacionOK).modal('hide')
    $(modal_codIntermedioOp).modal('show')
};


botonCodObj_compilacionOK.onclick = () => {
    llenarTablasCodObjeto(0)
    establecerComboCodObjeto()
    $(modal_debugCodigoArduino).modal('show')
}





boton_modalLex_cancelar.onclick = () => {
    $(modal_lexico).modal('hide');
}


boton_modalSin_cancelar.onclick = () => {
    $(modal_sintactico).modal('hide');
}


boton_modalSem_cancelar.onclick = () => {
    $(menu_lateral_tablaSimbolos).sidebar({
        context: $(div_contenido)
    });
    combo_TS.onchange = () =>
    {
        switch( combo_TS.value )
        {
        case "p": cargarTablaPinesTS( sem.accion.listaPines ); break;
        case "v": cargarTablaVariablesTS( sem.accion.listaVariables );   break;
        case "f": cargarTablaFuncionesTS( sem.accion.listaFunciones );  break;
        }
    };
    $(modal_semantico).modal('hide');
}


// BOTON DESCARGAR CODIGO ARDUINO
boton_descargarCodigo.onclick = () => {
    let codigoA = ""
    for(let i=0;  i<div_codigoArduino.childElementCount;  i++)
    {
        codigoA += div_codigoArduino.children[i].innerText + "\n"
    }
    var blob = new Blob([codigoA] , {  type: "text/plain;charset=utf-8" });
    let fechaA = new Fecha()
    let nombreArchivo = sem.accion.nombreDelPrograma + "_" + fechaA.getFecha()
    saveAs( blob , nombreArchivo + ".ino" )
}



// BOTON PARA VER PREVIAMENTE EL DISEÑO
boton_codigoObjeto.onclick = () => {
    // SIMULAR EL CODIGO OBTENIDO
    $(modal_codigoArduino).modal('show')
}



boton_modalCod_cancelar.onclick = () => {
    $(modal_codigoIntermedio).modal('hide');
}


boton_modalCodOp_cancelar.onclick = () => {
    $(modal_codIntermedioOp).modal('hide');
}


boton_modalCodObjeto_cancelar.onclick = () => {
    $(modal_debugCodigoArduino).modal('hide');
}


boton_modalCodAr_cancelar.onclick = () => {
    $(modal_codigoArduino).modal('hide');
}


boton_modalCompOK_cancelar.onclick = () => {
    $(modal_compilacionOK).modal('hide');
}


boton_arbol_cancelar.onclick = () => {
    $(menu_lateral_arbol).sidebar("toggle");
}


boton_TS_cancelar.onclick = () => {
    $(menu_lateral_tablaTokens).sidebar("hide");
    $(menu_lateral_tablaSimbolos).sidebar("toggle");
}


boton_consolaE_cancelar.onclick = () => {
    $(menu_lateral_consolaErrores).sidebar("toggle");
}


boton_tabla_tokens.onclick = () => {
    $(menu_lateral_tablaSimbolos).sidebar("hide");
    $(menu_lateral_tablaTokens).sidebar("toggle");
};


boton_tabla_simbolos.onclick = () => {
    $(menu_lateral_tablaTokens).sidebar("hide");
    $(menu_lateral_tablaSimbolos).sidebar("toggle");
};


boton_menu.onclick = () => {
    $(menu_lateral_principal).sidebar("toggle");
};


boton_consola_errores.onclick = () => {
    $(menu_lateral_consolaErrores).sidebar("toggle");
};

botonAumentarLetra.onclick = () => {
    if( letraSize == 32 ) return
    letraSize++
    div_editor.style.fontSize = letraSize + "px"
    for(let i=0;  i<div_lineas.childElementCount;  i++)
    {
        div_lineas.children[i].style.fontSize = letraSize + "px"
    }
    div_lineas.style.fontSize = letraSize + "px"
}

botonDecrementarLetra.onclick = () => {
    if( letraSize == 14 ) return
    letraSize--
    div_editor.style.fontSize = letraSize + "px"
    div_lineas.style.fontSize = letraSize + "px"
    for(let i=0;  i<div_lineas.childElementCount;  i++)
    {
        div_lineas.children[i].style.fontSize = letraSize + "px"
    }
}

txt_enlaceInicio.onclick = () => {
    link_inicio.click()
}

























//=================================================================================
//                      PROCESO DE ANALISI LEXICO
//=================================================================================
function lexico()
{
    let lineas = getLineasEditor();
    if( lineas.length == 1 && lineas[0] == " " )
    { 
        $(modal_cargando).modal('hide');
        alert( "EL EDITOR ESTA VACIO" );   
        return; 
    } 
    afd.inicializarLexico( lineas );
    console.clear()
    console.log("======= LEXICO EN EJECUCION ======");
    let fin = false;
    do
    {
        switch( afd.next() )
        {
            case "FIN": fin = true; break;
        }
        //alert("next() exitoso");
    }
    while( fin == false );
    //console.log(afd.txt_entrada);
    console.log( afd.tokens );
    let tokensErroneos = afd.filtrarTokens( "ERROR" );
    afd.setListaErrores( tokensErroneos );
    console.log("LISTA DE ERRORES")
    console.log(afd.listaErrores);
    console.log("DEBUG");
    console.log( afd.debug )
    for( let i=0;  i<afd.listaErrores.length;  i++ )
    {
        addConsolaErrorLexico( "Lexico" , afd.listaErrores[i] );
    }
    let tokensCorrectos = afd.filtrarTokens( "OK" );
    for( let i=0;  i<tokensCorrectos.length;  i++ )
    {
        addTablaToken( tokensCorrectos[i] );
    }
}


function getLineasEditor()
{
    //console.clear()
    let rows = div_editor.innerText.split('\n');
    //console.log(rows)
    //let contador = 0;
    /*for(let i=0; i<rows.length; i++)
    {
        let linea_codigo = rows[i];
        if( linea_codigo != "" ) 
        {
            contador = 0;  
            lineas.push( linea_codigo );
        }
        else
        {
            contador++;
            if( contador == 2)
            { 
                lineas.push(""); 
                contador=0;  
            }
        }
    }*/
    return rows;
}






function sintactico()
{
    let tokens = afd.tokens.filter( clex => clex.tipoToken == 'OK' );
    ass.inicializarSintactico( tokens );
    console.clear();
    //console.log( tokens );
    console.log("======= SINTACTICO EN EJECUCION ======");
    //alert("...");
    let fin = false;
    do { fin = ass.nextSintactico(); }
    while( fin == true );
    console.log( "LISTA DE ERRORES SINTACTICOS" )
    console.log( ass.listaErrores )
    console.log( "DEBUG SINTACTICO" )
    console.log( ass.debug )
    for( let i=0; i<ass.listaErrores.length;  i++ )
    {
        addConsolaErrorSintactico( ass.listaErrores[i] , i+1 );
    }
};


function semantico()
{
    let tokens = afd.tokens.filter( clex => clex.tipoToken == 'OK' );
    sem.inicializarSemantico( tokens , afd.filtrarTokensFunciones() )
    console.clear();
    console.log( tokens );
    console.log("======= SEMANTICO EN EJECUCION ======");
    let fin = false;
    do { fin = sem.nextSemantico() }
    while( fin == true )
    console.log( "LISTA DE ERRORES SEMANTICOS " )
    console.log( sem.accion.listaErrores )
    console.log( "DEBUG SEMANTICO" )
    console.log( sem.accion.debug )
    for( let i=0; i<sem.accion.listaErrores.length;  i++ )
    {
        addConsolaErrorSemantico( sem.accion.listaErrores[i] , i+1 );
    }
    // COMBO DE LA TABLA DE SIMBOLOS
    limpiarTabla( combo_TS );
    let opcion1 = document.createElement('option');
    opcion1.value = "v";
    opcion1.innerText = "Variables";
    combo_TS.append( opcion1 );

    let opcion2 = document.createElement('option');
    opcion2.value = "f";
    opcion2.innerText = "Funciones";
    combo_TS.append( opcion2 );

    let opcion3 = document.createElement('option');
    opcion3.value = "p";
    opcion3.innerText = "Pines";
    combo_TS.append( opcion3 );

    let opcion4 = document.createElement('option');
    opcion4.value = "c";
    opcion4.innerText = "Constantes";
    combo_TS.append( opcion4 );
    
    cargarTablaVariablesTS( sem.accion.listaVariables ); 
};



function codigoIntermedio()
{
    codIntermedio.inicializar( afd.filtrarTokens( "OK" ) , afd.filtrarTokensFunciones() , 
    sem.accion.listaFunciones , sem.accion.listaVariables , sem.accion.listaConstantes , sem.accion.listaPines )
    let retorno = 0;
    do { retorno = codIntermedio.generarCodigo() }
    while( retorno == CodigoIntermedio.ITERACION_OK )
}


function codigoIntermedioOptimizado()
{
    codIntermedioOp.inicializar( codIntermedio.accion.debug , codIntermedio.accion.getCuadruplos() )
    codIntermedioOp.generarCodigoOptimizado()
}


function codigoObjeto()
{
        codObjeto.generarCodigoObjeto( codIntermedioOp.listaInstruccionesOptimizado )
}














//===========================================================================================
//                      EVENTO TECLADO EN EL DIV EDITOR
//===========================================================================================
function corregirEditor()
{
    let ER_lineas = /<div>/g
    let totalLineas = Array.from(div_editor.innerHTML.matchAll(ER_lineas)).length
    //alert( totalLineas )
    if( totalLineas == 0 )
    {
        div_editor.innerHTML = "<div> </div>";
    }
}


function getLineaCursor() {
    let sel = document.getSelection()
    //sel.modify("extend", "backward", "paragraphboundary");
    //let pos = sel.toString().length
    //console.log( sel.anchorNode.parentElement )
    //if(sel.anchorNode != undefined) sel.collapseToEnd()
    //return pos
    let nodo = sel.anchorNode.parentElement
    //console.log( sel.anchorNode.parentElement )
    for(let i=0;  i<div_editor.childElementCount;  i++)
    {
        if( div_editor.children[i] == nodo ) return i
    }
    return -1
}

function getColumnaCursor() {
    let sel = document.getSelection()
    sel.modify("extend", "backward", "paragraphboundary");
    let pos = sel.toString().length
    //console.log( sel.anchorNode.parentElement )
    if(sel.anchorNode != undefined) sel.collapseToEnd()
    return pos
}


function corregirLineasVacias()
{
    for(let i=0;  i<div_editor.childElementCount;  i++)
    {
        if( div_editor.children[i].innerText == "\n" ) {  // LINEA VACIA
            div_editor.children[i].innerText = " " 
        }
    }
}


function moverCursorAlInicio()
{
    let cursor = document.getSelection()
    let nodo = cursor.anchorNode.parentElement
    //alert( nodo.innerText.length == 1 + " Y " + nodo.innerText == " " )
    if( nodo.innerText.length == 1 && nodo.innerText == " " )
    {
        let punto = document.createRange()
        punto.setStart( cursor.anchorNode , 0)
        punto.collapse(true)
        cursor.removeAllRanges()
        cursor.addRange(punto)
    }
}



function actualizarContadorDeLineas()
{
    let totalLineas_editor = div_editor.childElementCount
    let totalLineas_contador = div_lineas.childElementCount
        //texto.innerText = total_lineas + " <> " + lineas_actuales; 
        //texto.innerText = div_editor.innerHTML;
    //alert( totalLineas_editor + "<>" + totalLineas_contador )
    if( totalLineas_editor > totalLineas_contador )
    {
        // CUANDO EL EDITOR TIENES MAS LINEAS
        for(let linea=totalLineas_contador+1;  linea<=totalLineas_editor;  linea++ )
        {
            let label = document.createElement("label")
            label.innerText = linea
            label.classList.add("estiloEditor")
            div_lineas.appendChild(label)
        }
    }
    else if( totalLineas_editor < totalLineas_contador)
    {
        // CUANDO EL EDITOR TIENES MAS MENOS LINEAS
        for( totalLineas_contador;  totalLineas_contador > totalLineas_editor;  totalLineas_contador-- )
        {
            div_lineas.removeChild( div_lineas.lastElementChild );
        }
    }
}




div_editor.onkeydown = ( evento ) =>
{
    console.log( "===" )
    console.log( getLineaCursor() )
    //console.log( getPosicion() )
    if( evento.keyCode == 9 ) // tab
    {
        evento.preventDefault()
        document.execCommand('insertHTML', false, '&#009');
        return
    }
};

div_editor.onkeyup = ( evento ) =>
{
    corregirEditor()
    corregirLineasVacias()
    moverCursorAlInicio()
    //console.log( getLineaCursor() )
    //console.log( "===" )
    if( evento.keyCode == 13 || evento.keyCode == 8 ) // ENTER o RETROCESO
    {
        actualizarContadorDeLineas()
    }
}

div_editor.onclick = () => {
    moverCursorAlInicio()
    actualizarContadorDeLineas()
}

div_editor.onpaste = ( evento ) => {
    let pos = getLineaCursor() + 1
    let cursor = document.getSelection()
    let divLineaActual = cursor.anchorNode.parentElement
    let lineasTXT = [""]
    lineasTXT = evento.clipboardData.getData('text/plain').split('\n')
    evento.preventDefault()
    //_____________________
    // ADD TEXTO AL EDITOR LINEA x LINEA
    //______________________
    let ultimaLinea = document.createElement('div')
    let restoTXT = ""
    for( let i=0;  i<lineasTXT.length;  i++ )
    {
        if( lineasTXT[i] == "" )  lineasTXT[i] = " "
        if( i == 0 ) {
            restoTXT = divLineaActual.innerText.substring( getColumnaCursor() , divLineaActual.innerText.length )
            divLineaActual.innerText = 
            divLineaActual.innerText.substring( 0 , getColumnaCursor() ) +  lineasTXT[i]
            ultimaLinea = divLineaActual
        }
        else{
            let div = document.createElement('div')
            div.innerText = lineasTXT[i]
            ultimaLinea = div
            //console.log( "pos: " + pos )
            div_editor.insertBefore( div , div_editor.children[ pos ] )
            pos++
        }
    }
    ultimaLinea.innerText += restoTXT 
    //_____________________
    // MOVER CURSOR A LA ULTIMA LINEA COPIADA
    //______________________
    let punto = document.createRange()
    //alert( ultimaLinea.innerText.length )
    punto.setStart( ultimaLinea.firstChild , ultimaLinea.innerText.length - restoTXT.length )
    punto.collapse(true)
    cursor.removeAllRanges()
    cursor.addRange(punto)
    if( ultimaLinea.innerText.length == 1 && ultimaLinea.innerText == " " ) {
        //alert( "aqui" )
        moverCursorAlInicio()
    }
    actualizarContadorDeLineas()
    
}









//=================================================================================
//         FUNCION PARA MOSTRAR LOS TOKENS OBTENIDOS POR EL ANALIZADOR LEXICO
//=================================================================================
function mostrarTablaTokens()
{
    // LIMPIAR TABLA
    while( tabla_tokens.childElementCount > 1 )
    {
        tabla_tokens.removeChild( tabla_tokens.lastElementChild );
    }
    for( let i=0;  i<afd.tokens.length;  i++ )
    {
        let token = afd.tokens[i];
        let TOKEN = token.token;
        let LEXEMA = token.lexema;
        let TIPO = token.tipoToken;
        let LINEA = token.numeroLinea;

        // GENERAR NUEVO ROW
        let row = document.createElement("div");
        row.classList.add("div_row");

        // GENERAR LAS CELDAS
        let label_linea = document.createElement("label");
        label_linea.classList.add("columna1");
        label_linea.classList.add("labelItem");
        label_linea.innerText = LINEA;

        let label_token = document.createElement("label");
        label_token.classList.add("columna2");
        label_token.classList.add("labelItem");
        label_token.innerText = TOKEN;

        let label_lexema = document.createElement("label");
        label_lexema.classList.add("columna3");
        label_lexema.classList.add("labelItem");
        label_lexema.innerText = LEXEMA;

        // AGREGAR ROW A LA TABLA
        row.appendChild( label_linea );
        row.appendChild( label_token );
        row.appendChild( label_lexema );

        tabla_tokens.appendChild(row);
    }


    
}




limpiarTabla( tablaInstruccion_codIntermedio )
limpiarTabla( tablaCuadruplos_codIntermedio )

limpiarTabla( codIntermedioOp_tablaOriginal )
limpiarTabla( codIntermedioOp_tablaOp )
limpiarTabla( combo_InstruccionCodOp )

limpiarTabla( codObjeto_tablaCodOptimizado )
limpiarTabla( codObjeto_tablaArduino )
limpiarTabla( combo_InstruccionCodObjeto )

$(combo_InstruccionCodOp).dropdown("clear")
$(combo_InstruccionCodObjeto).dropdown("clear")
corregirEditor()
while( div_lineas.childElementCount > 0 )  div_lineas.removeChild( div_lineas.firstChild )
