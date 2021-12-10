
export class ItemArduino {
    
    // TIPOS DE ESTILO
    static NORMAL = 1
    static PALABRA_RESERVADA = 2
    static ESPECIAL = 3
    static LLAMADA_A_FUNCION = 4
    
    constructor( valor = "" , estilo = 1 )
    {
        this.valor = valor
        this.estilo = estilo
    }


    clonar() {
        let itemC = new ItemArduino()
        itemC.valor = this.valor
        itemC.estilo = this.estilo
        return itemC
    }
}