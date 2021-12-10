import { Cuadruplo } from "./Cuadruplo.js";

export class DebugCodigoIntermedio
{
    constructor( lineaCodigo = "" , listaCuadruplos = [ new Cuadruplo() ] ) 
    {
        this.lineaCodigo = lineaCodigo
        this.listaCuadruplos = listaCuadruplos    
    }
}