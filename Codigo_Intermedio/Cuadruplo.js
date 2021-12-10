import { ComponenteLexico } from "../ComponenteLexico.js";
import { ResultadoCuadruplo } from "./ResultadoCuadruplo.js";

export class Cuadruplo
{
    static OMITIR = 1     // cuadruplo que NO se convierte a codigo arduino
    static OK = 2         // cuadruplo que SI se convierte a codigo arduino



    constructor( operador = new ComponenteLexico() , 
    operando1 = new ComponenteLexico() , operando2 = new ComponenteLexico() ,
    resultado = new ResultadoCuadruplo() )
    {
        this.operador = operador
        this.operando1 = operando1
        this.operando2 = operando2
        this.resultado = resultado
        this.estatus = Cuadruplo.OK
    }  


    clonar() {
        let c = new Cuadruplo()
        c.operador = this.operador.clonar()
        if( this.operando1 != null ){ c.operando1 = this.operando1.clonar() }
        else{ this.operando1 = null }
        
        if( this.operando2 != null ){ c.operando2 = this.operando2.clonar() }
        else{ c.operando2 = null }
        c.resultado = this.resultado.clonar()
        c.estatus = this.estatus
        return c
    }
}