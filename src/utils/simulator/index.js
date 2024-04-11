class Formulas {
    constructor(
        a,
        humedad_inicial,
        humedad_deseada,
        flujo_trigo,
        temperatura_inicial,
        temperatura_final,
        calor_especifico_trigo,
        entalpia_vaporizacion_agua
    )
    {
        this.a = a
        this.humedad_deseada = humedad_deseada
        this.humedad_inicial = humedad_inicial
        this.flujo_trigo = flujo_trigo
        this.temperatura_inicial = temperatura_inicial
        this.calor_especifico_trigo = calor_especifico_trigo
        this.entalpia_vaporizacion_agua = entalpia_vaporizacion_agua
        this.temperatura_final = temperatura_final
    }
    get agua_en_trigo_humedo(){
        return this.flujo_trigo * this.humedad_deseada
    }
    get agua_en_trigo_seco(){
        return this.flujo_trigo * this.humedad_deseada
    }
    get agua_a_evaporar (){
        return this.agua_en_trigo_humedo - this.agua_en_trigo_seco
    }
    get calor_sencible () {
        return this.flujo_trigo * this.calor_especifico_trigo * (this.temperatura_final - this.temperatura_inicial)
    }
    get calor_latente(){
        return this.agua_a_evaporar * this.entalpia_vaporizacion_agua
    }
    get calor_total () {
        return this.calor_sencible + this.calor_latente
    }
    get peso_neto_trigo () {
        return this.flujo_trigo - this.agua_a_evaporar
    }
    get RetornAll(){
        return {
            user_id : this.a,
            humedad_inicial : this.humedad_inicial,
            humedad_deseada : this.humedad_deseada,
            flujo_trigo : this.flujo_trigo,
            temperatura_inicial : this.temperatura_inicial,
            temperatura_final : this.temperatura_final,
            calor_especifico_trigo : this.calor_especifico_trigo,
            entalpia_vaporizacion_agua : this.entalpia_vaporizacion_agua,
            agua_en_trigo_humedo : this.agua_en_trigo_humedo,
            agua_en_trigo_seco: this.agua_en_trigo_seco,
            agua_a_evaporar : this.agua_a_evaporar,
            calor_sencible : this.calor_sencible,
            calor_latente : this.calor_latente,
            calor_total : this.calor_total,
            peso_neto_trigo : this.peso_neto_trigo
        }
    }
}
module.exports = Formulas