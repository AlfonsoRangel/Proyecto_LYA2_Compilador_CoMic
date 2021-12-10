
export class Fecha {
    constructor( fecha = new Date() )
    {
        this.fecha = fecha
    }


    getFecha()
    {
        return this.convertirA2Digitos( this.fecha.getDate() ) + "-" + 
        this.getNombreMesResumido() + "-" + this.fecha.getFullYear() +  "_" +
        this.convertirA2Digitos( this.fecha.getHours() ) + "-" +
        this.convertirA2Digitos(this.fecha.getMinutes() ) + "-" +
        this.convertirA2Digitos( this.fecha.getSeconds() ) 
    }


    convertirA2Digitos( num = 0)
    {
        if( num < 10 ){ return "0" + num }
        return num + ""
    }


    getNombreMesResumido()
    {
        switch( this.fecha.getMonth() + 1 )
        {
            case 1: return "Ene"
            case 2: return "Feb"
            case 3: return "Mar"
            case 4: return "Abr"
            case 5: return "May"
            case 6: return "Jun"
            case 7: return "Jul"
            case 8: return "Ago"
            case 9: return "Sep"
            case 10: return "Oct"
            case 11: return "Nov"
            case 12: return "Div"
            default: return (this.fecha.getMonth()+1) + ""
        }
    }
}