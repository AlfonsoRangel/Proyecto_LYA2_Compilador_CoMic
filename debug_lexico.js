
export class DebugLexico
{
    constructor( entradaRestante = [""] , simboloActual = "" , lexemaInicial = "" ,
        estadoActual = 0 , sigEstado = 0 , lexemaFinal = "" , tokenEcontrado = "" , tipoToken = "" )
    {
        this.entradaRestante = entradaRestante
        this.simboloActual = simboloActual
        this.lexemaInicial = lexemaInicial
        this.estadoActual = estadoActual
        this.sigEstado = sigEstado
        this.lexemaFinal = lexemaFinal
        this.tokenEcontrado = tokenEcontrado
        this.tipoToken = tipoToken
    }


} 