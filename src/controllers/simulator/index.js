import User from "../../models/user";
const Simulator = require("../../models/simulator");
const Formulas = require("../../utils/simulator")

export const getResultsData = async (req, res) => {
    console.log("req.body", req.body)
    try {
        const {
            a,
            humedad_inicial,
            humedad_deseada,
            flujo_trigo,
            temperatura_inicial,
            temperatura_final,
            calor_especifico_trigo,
            entalpia_vaporizacion_agua
        } = req.body;

        var ResEcua = new Formulas(
            a,
            humedad_inicial,
            humedad_deseada,
            flujo_trigo,
            temperatura_inicial,
            temperatura_final,
            calor_especifico_trigo,
            entalpia_vaporizacion_agua
        )

    } catch (error) {
        res.status(500).json({
            mensage: error.mensage
        })
    } finally {

        if (ResEcua) {
            const send = {
                agua_en_trigo_humedo: ResEcua.agua_en_trigo_humedo,
                agua_en_trigo_seco: ResEcua.agua_en_trigo_seco,
                agua_a_evaporar: ResEcua.agua_a_evaporar,
                calor_sencible: ResEcua.calor_sencible,
                calor_latente: ResEcua.calor_latente,
                calor_total: ResEcua.calor_total,
                peso_neto_trigo: ResEcua.peso_neto_trigo
            }
            const report = await Simulator.create(ResEcua.RetornAll)

            res.status(500).json(
                {
                    send
                }
            )
        }
    }
}


export const getResults = async (req, res) => {
    const {
        user_id,
        humedad_inicial,
        humedad_deseada,
        flujo_trigo,
        temperatura_inicial,
        temperatura_final,
        calor_especifico_trigo,
        entalpia_vaporizacion_agua
    } = req.body;

    const agua_en_trigo_humedo = flujo_trigo * humedad_deseada

    const agua_en_trigo_seco = flujo_trigo * humedad_deseada

    const agua_a_evaporar = agua_en_trigo_humedo - agua_en_trigo_seco

    const calor_sencible = flujo_trigo * calor_especifico_trigo * (temperatura_final - temperatura_inicial)

    const calor_latente = agua_a_evaporar * entalpia_vaporizacion_agua

    const calor_total = calor_sencible + calor_latente

    const peso_neto_trigo = flujo_trigo - agua_a_evaporar

    const content = {
        user_id: user_id,
        humedad_inicial: String(humedad_inicial),
        humedad_deseada: humedad_deseada,
        flujo_trigo: flujo_trigo,
        temperatura_inicial: temperatura_inicial,
        temperatura_final: temperatura_final,
        calor_especifico_trigo: calor_especifico_trigo,
        entalpia_vaporizacion_agua: entalpia_vaporizacion_agua,
        agua_en_trigo_humedo: agua_en_trigo_humedo,
        agua_en_trigo_seco: agua_en_trigo_seco,
        agua_a_evaporar: agua_a_evaporar,
        calor_sencible: calor_sencible,
        calor_latente: calor_latente,
        calor_total: calor_total,
        peso_neto_trigo: peso_neto_trigo
    }
    // Create report and save it in DB
    const report = await Simulator.create(content)

    // Send the results as a response
    res.json({ message: "reporte guardado con exito", content: report });
}

export const getDataById = async (req, res) => {
    try {
        var { user_id } = req.body
        const user = await User.findbyPk(user_id);
        const report = await Simulator.findAll();
        res.json({ message: "", content: { user, report } })
    } catch (error) {
        console.error('Error data por ID:', error);
    }
}


export const getReportsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        // Asegura que id sea un número entero válido (opcional pero recomendado por seguridad)
        if (!id) {
            return res.json({ status: false, message: 'Formato de ID de usuario no válido' });
        }

        // Busca todos los informes asociados al ID de usuario
        const reports = await Simulator.findAll({ where: { user_id: id } });

        // Verifica si se encontraron informes
        if (!reports || reports.length == 0) {
            return res.json({ status: false, message: 'No se encontraron informes para este ID de usuario' });
        }

        // Envía una respuesta exitosa con los informes formateados
        res.status(200).json({ status: true, message: 'Informes cargados exitosamente', content: reports });
    } catch (error) {
        console.error('Error getReportsByUserId:', user_iderror);
        res.status(500).json({ status: false, message: 'Error interno del servidor', error: error.message });
    }
};
