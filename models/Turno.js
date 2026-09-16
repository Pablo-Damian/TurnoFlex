class Turno {
    constructor(id, profesionalId, clienteNombre, fecha, hora, estado = 'reservado') {
        this.id = id;
        this.profesionalId = profesionalId;
        this.clienteNombre = clienteNombre;
        this.fecha = fecha; // Formato esperado: YYYY-MM-DD
        this.hora = hora;   // Formato esperado: HH:MM
        this.estado = estado; // Posibles estados: 'reservado', 'cancelado', 'atendido'
    }
}

module.exports = Turno;