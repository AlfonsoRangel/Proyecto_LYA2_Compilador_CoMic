export class ComponenteLexico
{
    constructor( token = "" , tipoToken = "" , lexema = "" , numeroLinea = 0 , id = "" )
    {
        this.id = id
        this.token = token
        this.lexema = lexema
        this.numeroLinea = numeroLinea
        this.tipoToken = tipoToken   // ERROR - OK - OMITIR
        this.tipoDato = "";
    }
 
    getID()
    {
        let idSplit = this.id.split('_');
        return Number(idSplit[1]);
    }

    clonar()
    {
        let comLex = new ComponenteLexico()
        comLex.id = this.id
        comLex.token = this.token
        comLex.lexema = this.lexema
        comLex.numeroLinea = this.numeroLinea
        comLex.tipoToken = this.tipoToken
        comLex.tipoDato = this.tipoDato
        return comLex
    }
}